import { supabase } from '../lib/supabase';

// ===================== PROFILE API =====================
export const profileApi = {
    /** Upsert user profile (called on every login) */
    async upsert(clerkId, data) {
        const { data: existing } = await supabase
            .from('profiles')
            .select('*')
            .eq('clerk_id', clerkId)
            .single();

        if (existing) {
            // Update non-credit fields only
            const { data: updated, error } = await supabase
                .from('profiles')
                .update({
                    email: data.email,
                    first_name: data.firstName,
                    last_name: data.lastName,
                    img_url: data.imgURL,
                })
                .eq('clerk_id', clerkId)
                .select()
                .single();
            if (error) throw error;
            return updated;
        } else {
            // First time: insert with 7 free credits
            const { data: created, error } = await supabase
                .from('profiles')
                .insert({
                    clerk_id: clerkId,
                    email: data.email,
                    first_name: data.firstName,
                    last_name: data.lastName,
                    img_url: data.imgURL,
                    credits: 7,
                    plan: 'basic',
                })
                .select()
                .single();
            if (error) throw error;
            return created;
        }
    },

    /** Get profile by clerk ID */
    async get(clerkId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('clerk_id', clerkId)
            .single();
        if (error) throw error;
        return data;
    },
};

// ===================== FILE API =====================
export const fileApi = {
    /** Upload file to Supabase Storage + insert metadata row */
    async upload(file, clerkId) {
        // 1. Check credits
        const profile = await profileApi.get(clerkId);
        if (!profile || profile.credits <= 0) {
            throw new Error('Insufficient credits. Please upgrade your plan.');
        }

        // 2. Generate unique storage path
        const ext = file.name.includes('.') ? file.name.substring(file.name.lastIndexOf('.')) : '';
        const storagePath = `${clerkId}/${crypto.randomUUID()}${ext}`;

        // 3. Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('fileshare')
            .upload(storagePath, file, {
                contentType: file.type || 'application/octet-stream',
            });
        if (uploadError) throw new Error('Upload failed: ' + uploadError.message);

        // 4. Get public URL
        const { data: urlData } = supabase.storage
            .from('fileshare')
            .getPublicUrl(storagePath);

        // 5. Insert file metadata into DB
        const { data: fileRow, error: insertError } = await supabase
            .from('files')
            .insert({
                clerk_id: clerkId,
                original_file_name: file.name,
                file_type: file.type,
                file_size: file.size,
                storage_path: storagePath,
                public_url: urlData.publicUrl,
                publicly_shared: false,
                share_token: null,
                download_count: 0,
            })
            .select()
            .single();
        if (insertError) throw insertError;

        // 6. Deduct 1 credit
        await supabase
            .from('profiles')
            .update({ credits: profile.credits - 1 })
            .eq('clerk_id', clerkId);

        return fileRow;
    },

    /** List all files for a user */
    async list(clerkId) {
        const { data, error } = await supabase
            .from('files')
            .select('*')
            .eq('clerk_id', clerkId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    /** Generate a share token for a file */
    async share(fileId) {
        const shareToken = crypto.randomUUID().replace(/-/g, '').substring(0, 12);
        const { data, error } = await supabase
            .from('files')
            .update({ publicly_shared: true, share_token: shareToken })
            .eq('id', fileId)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    /** Remove share token (make private) */
    async unshare(fileId) {
        const { data, error } = await supabase
            .from('files')
            .update({ publicly_shared: false, share_token: null })
            .eq('id', fileId)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    /** Delete file from storage + database */
    async deleteFile(fileId) {
        // Get file metadata first
        const { data: file, error: fetchErr } = await supabase
            .from('files')
            .select('storage_path')
            .eq('id', fileId)
            .single();
        if (fetchErr) throw fetchErr;

        // Delete from storage
        if (file?.storage_path) {
            await supabase.storage.from('fileshare').remove([file.storage_path]);
        }

        // Delete from database
        const { error: deleteErr } = await supabase
            .from('files')
            .delete()
            .eq('id', fileId);
        if (deleteErr) throw deleteErr;
    },
};

// ===================== PUBLIC API =====================
export const publicApi = {
    /** Get shared file by share token (no auth needed) */
    async getSharedFile(shareToken) {
        const { data, error } = await supabase
            .from('files')
            .select('*')
            .eq('share_token', shareToken)
            .eq('publicly_shared', true)
            .single();
        if (error || !data) throw new Error('File not found or link expired.');

        // Increment download count
        await supabase
            .from('files')
            .update({ download_count: (data.download_count || 0) + 1 })
            .eq('id', data.id);

        return data;
    },
};

// ===================== PAYMENT API (FAKE) =====================
export const paymentApi = {
    /** Process fake UPI payment and add credits */
    async processPayment(clerkId, plan, upiId) {
        const creditMap = { premium: 500, ultra: 6000 };
        const priceMap = { premium: '₹499', ultra: '₹1,999' };
        const credits = creditMap[plan];
        if (!credits) throw new Error('Invalid plan');

        // Get current profile
        const profile = await profileApi.get(clerkId);
        if (!profile) throw new Error('Profile not found');

        // Add credits
        const { error: updateErr } = await supabase
            .from('profiles')
            .update({
                credits: (profile.credits || 0) + credits,
                plan: plan,
            })
            .eq('clerk_id', clerkId);
        if (updateErr) throw updateErr;

        // Record transaction
        const { data: tx, error: txErr } = await supabase
            .from('transactions')
            .insert({
                clerk_id: clerkId,
                plan: plan,
                credits: credits,
                amount: priceMap[plan],
                upi_id: upiId,
                status: 'success',
            })
            .select()
            .single();
        if (txErr) throw txErr;

        return tx;
    },
};

// ===================== TRANSACTION API =====================
export const transactionApi = {
    /** List all transactions for a user */
    async list(clerkId) {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('clerk_id', clerkId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },
};
