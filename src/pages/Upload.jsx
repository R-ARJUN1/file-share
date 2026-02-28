import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload as UploadIcon, X, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { useApiClient, fileApi } from '../services/api';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const Upload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragging, setDragging] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState(null); // 'success' | 'error'
    const [errorMsg, setErrorMsg] = useState('');
    const inputRef = useRef();
    const authApi = useApiClient();
    const navigate = useNavigate();

    const handleFile = (file) => {
        if (!file) return;
        if (file.size > MAX_FILE_SIZE) {
            setStatus('error');
            setErrorMsg('File exceeds the 50MB limit.');
            return;
        }
        setSelectedFile(file);
        setStatus(null);
        setProgress(0);
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    }, []);

    const handleUpload = async () => {
        if (!selectedFile) return;
        setUploading(true);
        setProgress(10);

        // Simulate progress
        const interval = setInterval(() => {
            setProgress(p => Math.min(p + 15, 85));
        }, 400);

        try {
            await fileApi.upload(authApi, selectedFile);
            clearInterval(interval);
            setProgress(100);
            setStatus('success');
            setSelectedFile(null);
        } catch (err) {
            clearInterval(interval);
            setStatus('error');
            console.error('Upload error:', err);
            setErrorMsg(err.response?.data?.error || err.message || 'Upload failed. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Upload File</h1>
                <p className="text-gray-500 mt-1">Upload a file to your account. Each upload costs 1 credit.</p>
            </div>

            {/* Drop Zone */}
            <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => inputRef.current.click()}
                className={`cursor-pointer border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200
          ${dragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-white hover:border-purple-400 hover:bg-gray-50'}`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    onChange={e => handleFile(e.target.files[0])}
                />
                <UploadIcon size={48} className={`mx-auto mb-4 ${dragging ? 'text-purple-500' : 'text-gray-300'}`} />
                <p className="text-gray-600 font-medium">
                    {dragging ? 'Drop your file here' : 'Drag & drop a file here, or click to browse'}
                </p>
                <p className="text-sm text-gray-400 mt-2">Any file type supported · Max 50MB</p>
            </div>

            {/* Selected File Preview */}
            {selectedFile && (
                <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 shadow-sm">
                    <FileText size={32} className="text-purple-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{selectedFile.name}</p>
                        <p className="text-sm text-gray-400">{formatBytes(selectedFile.size)}</p>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                        className="text-gray-400 hover:text-red-500"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* Progress Bar */}
            {uploading && (
                <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>Uploading...</span>
                        <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-purple-600 h-2.5 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Status Messages */}
            {status === 'success' && (
                <div className="mt-4 flex items-center gap-3 bg-green-50 text-green-700 p-4 rounded-xl border border-green-200">
                    <CheckCircle size={20} />
                    <div>
                        <p className="font-medium">Upload successful!</p>
                        <p className="text-sm">Your file is now in your account.</p>
                    </div>
                    <button
                        onClick={() => navigate('/my-files')}
                        className="ml-auto text-sm font-medium underline"
                    >
                        View files
                    </button>
                </div>
            )}
            {status === 'error' && (
                <div className="mt-4 flex items-center gap-3 bg-red-50 text-red-700 p-4 rounded-xl border border-red-200">
                    <AlertTriangle size={20} />
                    <p className="font-medium">{errorMsg}</p>
                </div>
            )}

            {/* Upload Button */}
            <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="mt-6 w-full py-3.5 bg-purple-600 text-white font-semibold rounded-xl
          hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200 flex items-center justify-center gap-2"
            >
                {uploading ? (
                    <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Uploading...
                    </>
                ) : (
                    <>
                        <UploadIcon size={18} />
                        Upload File
                    </>
                )}
            </button>
        </div>
    );
};

export default Upload;