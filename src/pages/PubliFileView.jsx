import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, FileText, Shield, AlertTriangle, Share2 } from 'lucide-react';
import { publicApi } from '../services/api';

const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const fileTypeIcon = (type) => {
    if (!type) return '📄';
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎬';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📕';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    return '📄';
};

const PublicFileView = () => {
    const { shareToken } = useParams();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        publicApi.getSharedFile(shareToken)
            .then(data => setFile(data))
            .catch(() => setNotFound(true))
            .finally(() => setLoading(false));
    }, [shareToken]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50 flex flex-col">
            {/* Minimal header */}
            <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-2 shadow-sm">
                <Share2 className="text-purple-600" size={22} />
                <Link to="/" className="font-bold text-gray-900 text-lg">FileShare</Link>
                <span className="ml-auto text-sm text-gray-400">Secure file sharing</span>
            </header>

            <main className="flex-1 flex items-center justify-center p-6">
                {loading ? (
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                        <div className="w-10 h-10 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
                        <p>Loading file...</p>
                    </div>
                ) : notFound ? (
                    <div className="text-center max-w-md">
                        <AlertTriangle size={56} className="mx-auto mb-4 text-red-400" />
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Link Not Found</h1>
                        <p className="text-gray-500 mb-6">
                            This shared link may have expired or been removed by the owner.
                        </p>
                        <Link to="/" className="text-purple-600 font-medium hover:underline">← Go to FileShare</Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 max-w-lg w-full p-8">
                        {/* File icon & name */}
                        <div className="text-center mb-6">
                            <div className="text-6xl mb-3">{fileTypeIcon(file.file_type)}</div>
                            <h1 className="text-xl font-bold text-gray-900 break-all">{file.original_file_name}</h1>
                            <div className="flex items-center justify-center gap-4 mt-2">
                                <span className="text-sm text-gray-400">{formatBytes(file.file_size)}</span>
                                <span className="text-gray-300">·</span>
                                <span className="text-sm text-gray-400">{file.download_count} downloads</span>
                            </div>
                        </div>

                        {/* Image preview */}
                        {file.file_type?.startsWith('image/') && file.public_url && (
                            <div className="mb-6 rounded-2xl overflow-hidden border border-gray-100">
                                <img
                                    src={file.public_url}
                                    alt={file.original_file_name}
                                    className="w-full max-h-72 object-contain bg-gray-50"
                                />
                            </div>
                        )}

                        {/* PDF preview link */}
                        {file.file_type?.includes('pdf') && file.public_url && (
                            <div className="mb-6 bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                                <p className="text-sm text-red-600 mb-2">PDF preview available after download.</p>
                            </div>
                        )}

                        {/* Download Button */}
                        <a
                            href={file.public_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={file.original_file_name}
                            className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white py-3.5
                rounded-xl font-semibold hover:bg-purple-700 transition-colors duration-200"
                        >
                            <Download size={20} /> Download File
                        </a>

                        {/* Security note */}
                        <div className="flex items-center justify-center gap-2 mt-5 text-gray-400 text-xs">
                            <Shield size={13} />
                            <span>Shared securely via FileShare. Hosted on Supabase.</span>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default PublicFileView;