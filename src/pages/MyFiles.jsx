import { useEffect, useState, useCallback } from 'react';
import { Copy, Share2, Trash2, Eye, EyeOff, Search, Link, FileText } from 'lucide-react';
import { useApiClient, fileApi } from '../services/api';

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

const APP_BASE_URL = window.location.origin;

const MyFiles = () => {
    const authApi = useApiClient();
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const [sharingId, setSharingId] = useState(null);
    const [copiedId, setCopiedId] = useState(null);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    const fetchFiles = useCallback(() => {
        setLoading(true);
        fileApi.list(authApi)
            .then(res => setFiles(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchFiles(); }, []);

    const handleShare = async (file) => {
        setSharingId(file.id);
        try {
            const res = await fileApi.share(authApi, file.id);
            setFiles(prev => prev.map(f => f.id === file.id ? res.data : f));
        } catch (err) {
            console.error(err);
        } finally {
            setSharingId(null);
        }
    };

    const handleUnshare = async (file) => {
        setSharingId(file.id);
        try {
            const res = await fileApi.unshare(authApi, file.id);
            setFiles(prev => prev.map(f => f.id === file.id ? res.data : f));
        } catch (err) {
            console.error(err);
        } finally {
            setSharingId(null);
        }
    };

    const handleDelete = async (fileId) => {
        setDeletingId(fileId);
        try {
            await fileApi.delete(authApi, fileId);
            setFiles(prev => prev.filter(f => f.id !== fileId));
            setConfirmDeleteId(null);
        } catch (err) {
            console.error(err);
        } finally {
            setDeletingId(null);
        }
    };

    const copyLink = (token) => {
        const url = `${APP_BASE_URL}/share/${token}`;
        navigator.clipboard.writeText(url);
        setCopiedId(token);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filtered = files.filter(f =>
        f.originalFileName?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Files</h1>
                <p className="text-gray-500 mt-1">Manage, share, and delete your uploaded files.</p>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                    type="text"
                    placeholder="Search files..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                />
            </div>

            {/* File List */}
            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <FileText size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="font-medium">{search ? 'No files match your search.' : 'No files yet.'}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(file => (
                        <div key={file.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <span className="text-3xl">{fileTypeIcon(file.fileType)}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-800 truncate">{file.originalFileName}</p>
                                    <div className="flex items-center gap-3 mt-1 flex-wrap">
                                        <span className="text-xs text-gray-400">{formatBytes(file.fileSize)}</span>
                                        <span className="text-xs text-gray-400">·</span>
                                        <span className="text-xs text-gray-400">{new Date(file.createdAt).toLocaleDateString()}</span>
                                        {file.publiclyShared && (
                                            <>
                                                <span className="text-xs text-gray-400">·</span>
                                                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                                                    <Eye size={10} /> Shared · {file.downloadCount} views
                                                </span>
                                            </>
                                        )}
                                    </div>
                                    {/* Share link display */}
                                    {file.publiclyShared && file.shareToken && (
                                        <div className="mt-2 flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-1.5">
                                            <Link size={12} className="text-purple-500 shrink-0" />
                                            <span className="text-xs text-gray-500 truncate">
                                                {`${APP_BASE_URL}/share/${file.shareToken}`}
                                            </span>
                                            <button
                                                onClick={() => copyLink(file.shareToken)}
                                                className="shrink-0 text-xs text-purple-600 hover:text-purple-800"
                                            >
                                                {copiedId === file.shareToken ? '✓ Copied!' : <Copy size={12} />}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    {/* Share / Unshare */}
                                    {file.publiclyShared ? (
                                        <button
                                            onClick={() => handleUnshare(file)}
                                            disabled={sharingId === file.id}
                                            title="Make private"
                                            className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
                                        >
                                            {sharingId === file.id ? (
                                                <span className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin block" />
                                            ) : <EyeOff size={17} />}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleShare(file)}
                                            disabled={sharingId === file.id}
                                            title="Generate share link"
                                            className="p-2 rounded-lg text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-colors disabled:opacity-50"
                                        >
                                            {sharingId === file.id ? (
                                                <span className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin block" />
                                            ) : <Share2 size={17} />}
                                        </button>
                                    )}

                                    {/* Copy link (only if shared) */}
                                    {file.publiclyShared && file.shareToken && (
                                        <button
                                            onClick={() => copyLink(file.shareToken)}
                                            title="Copy link"
                                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                                        >
                                            <Copy size={17} />
                                        </button>
                                    )}

                                    {/* Delete */}
                                    {confirmDeleteId === file.id ? (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleDelete(file.id)}
                                                disabled={deletingId === file.id}
                                                className="text-xs bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600 disabled:opacity-50"
                                            >
                                                {deletingId === file.id ? '...' : 'Confirm'}
                                            </button>
                                            <button
                                                onClick={() => setConfirmDeleteId(null)}
                                                className="text-xs text-gray-500 hover:text-gray-700"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setConfirmDeleteId(file.id)}
                                            title="Delete file"
                                            className="p-2 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 size={17} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyFiles;