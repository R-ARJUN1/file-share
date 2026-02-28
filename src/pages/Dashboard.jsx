import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Upload, Files, Coins, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { fileApi, profileApi } from '../services/api';

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
            <Icon size={22} className="text-white" />
        </div>
        <div>
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);

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

const Dashboard = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [files, setFiles] = useState([]);
    const [credits, setCredits] = useState('...');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        Promise.all([
            fileApi.list(user.id),
            profileApi.get(user.id),
        ]).then(([fileList, profile]) => {
            setFiles(fileList);
            setCredits(profile?.credits ?? 0);
        }).catch(console.error)
          .finally(() => setLoading(false));
    }, [user]);

    const totalDownloads = files.reduce((sum, f) => sum + (f.download_count || 0), 0);
    const sharedCount = files.filter(f => f.publicly_shared).length;
    const recentFiles = [...files]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5);

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user?.firstName || 'there'} 👋
                </h1>
                <p className="text-gray-500 mt-1">Here's what's happening with your files.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon={Files} label="Total Files" value={files.length} color="bg-purple-500" />
                <StatCard icon={Coins} label="Credits Left" value={credits} color="bg-blue-500" />
                <StatCard icon={TrendingUp} label="Total Downloads" value={totalDownloads} color="bg-green-500" />
                <StatCard icon={Clock} label="Files Shared" value={sharedCount} color="bg-orange-500" />
            </div>

            {/* Recent Files + Quick Upload */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Files */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Files</h2>
                        <button
                            onClick={() => navigate('/my-files')}
                            className="text-sm text-purple-600 hover:text-purple-800 flex items-center gap-1"
                        >
                            View all <ArrowRight size={14} />
                        </button>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                            ))}
                        </div>
                    ) : recentFiles.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">
                            <Files size={40} className="mx-auto mb-2 opacity-30" />
                            <p>No files yet. Upload your first file!</p>
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {recentFiles.map(file => (
                                <li key={file.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                                    <span className="text-2xl">{fileTypeIcon(file.file_type)}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate">{file.original_file_name}</p>
                                        <p className="text-xs text-gray-400">{formatBytes(file.file_size)}</p>
                                    </div>
                                    {file.publicly_shared && (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Shared</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 text-white flex flex-col justify-between">
                    <div>
                        <h2 className="text-lg font-semibold mb-2">Quick Upload</h2>
                        <p className="text-purple-200 text-sm">Upload and share your files in seconds.</p>
                    </div>
                    <button
                        onClick={() => navigate('/upload')}
                        className="mt-6 w-full flex items-center justify-center gap-2 bg-white text-purple-700 font-semibold py-3 rounded-xl hover:bg-purple-50 transition-colors"
                    >
                        <Upload size={18} /> Upload a File
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;