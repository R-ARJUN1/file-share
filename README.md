# File Share - Serverless File Sharing Application

A premium, serverless file-sharing application built with **React**, **Vite**, **Tailwind CSS**, and **Supabase**. Securely upload, manage, and share your files with ease.

## 🚀 Features

- **Secure Authentication**: Integration with [Clerk](https://clerk.com/) for seamless user sign-in.
- **Serverless Architecture**: Communicates directly with Supabase, no custom backend required.
- **Fast Uploads**: Direct-to-storage uploads using Supabase Storage.
- **Credit System**: Users start with 7 free credits; each upload consumes 1 credit.
- **Public Sharing & Link Generation**: Each user can generate unique, secure share tokens for any file and share the link publicly with others. Link sharing can be toggled on or off at any time.
- **Download Tracking & Analytics**: Automatically track and display the download count for every publicly shared file.
- **Subscription Plans**: Simulated UPI payment flow to upgrade to Premium or Ultra plans.
- **Modern UI**: Clean, responsive layout with dark-mode elements and Lucide icons.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Authentication**: Clerk
- **Backend/Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Deployment**: Netlify 

---

## ⚙️ Supabase Setup (SQL Schema)

To get started, create a new project on [Supabase](https://supabase.com/) and run the following script in the **SQL Editor**:

```sql
-- 1. Create Tables
CREATE TABLE profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  img_url TEXT,
  credits INTEGER DEFAULT 7,
  plan TEXT DEFAULT 'basic',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT NOT NULL,
  original_file_name TEXT NOT NULL,
  file_type TEXT,
  file_size BIGINT,
  storage_path TEXT NOT NULL,
  public_url TEXT,
  publicly_shared BOOLEAN DEFAULT false,
  share_token TEXT UNIQUE,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT NOT NULL,
  plan TEXT NOT NULL,
  credits INTEGER NOT NULL,
  amount TEXT NOT NULL,
  upi_id TEXT,
  status TEXT DEFAULT 'success',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- 3. Profiles Policies
CREATE POLICY "profiles_select" ON profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "profiles_update" ON profiles FOR UPDATE USING (true);

-- 4. Files Policies
CREATE POLICY "files_select" ON files FOR SELECT USING (true);
CREATE POLICY "files_insert" ON files FOR INSERT WITH CHECK (true);
CREATE POLICY "files_update" ON files FOR UPDATE USING (true);
CREATE POLICY "files_delete" ON files FOR DELETE USING (true);

-- 5. Transaction Policies
CREATE POLICY "tx_select" ON transactions FOR SELECT USING (true);
CREATE POLICY "tx_insert" ON transactions FOR INSERT WITH CHECK (true);

-- 6. Indexes for Performance
CREATE INDEX idx_files_share_token ON files(share_token);
CREATE INDEX idx_files_clerk_id ON files(clerk_id);
CREATE INDEX idx_profiles_clerk_id ON profiles(clerk_id);

-- 7. Storage Bucket
-- IMPORTANT: Create a  public bucket named 'fileshare' in the Supabase Dashboard before running storage policies.
CREATE POLICY "Allow public uploads" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'fileshare');

CREATE POLICY "Allow public reads" ON storage.objects
  FOR SELECT USING (bucket_id = 'fileshare');

CREATE POLICY "Allow public updates" ON storage.objects
  FOR UPDATE USING (bucket_id = 'fileshare');

CREATE POLICY "Allow public deletes" ON storage.objects
  FOR DELETE USING (bucket_id = 'fileshare');
```

---

## 💻 Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/R-ARJUN1/file-share.git
   cd file_share
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add your keys:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_pub_key
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

---

## 🌐 Deployment (Netlify)

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Connect your GitHub repository to Netlify.
   - **Build Command**: `npm run build`
   - **Publish Directory**: `dist`
   - **Environment Variables**: Add your `.env` keys in the Netlify Dashboard (Site Settings > Environment variables).


---

## 📄 License

Feel free to use and modify for your own projects!
