import { useState } from 'react';
import { searchUserByUsername, sendFriendRequest } from '../api/friend';

interface User {
    userId: number;
    username: string;
    nickname?: string;
    avatar?: string;
    signature?: string;
}

interface AddFriendModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddFriendModal({ isOpen, onClose, onSuccess }: AddFriendModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setError('请输入用户名');
            return;
        }

        try {
            setLoading(true);
            setError('');
            setSearchResult(null);
            const response = await searchUserByUsername(searchQuery.trim());
            setSearchResult(response.data?.data || null);
            setHasSearched(true);
        } catch (e: any) {
            setError(e.response?.data?.message || '搜索失败，请稍后重试');
            setHasSearched(true);
        } finally {
            setLoading(false);
        }
    };

    const handleAddFriend = async () => {
        if (!searchResult || sending) return;

        try {
            setSending(true);
            await sendFriendRequest(searchResult.userId);
            setSuccessMessage(`已向 ${searchResult.nickname || searchResult.username} 发送好友请求`);
            setTimeout(() => setSuccessMessage(''), 3000);
            onSuccess?.();
        } catch (e: any) {
            setError(e.response?.data?.message || '发送请求失败');
            setTimeout(() => setError(''), 3000);
        } finally {
            setSending(false);
        }
    };

    const handleClose = () => {
        setSearchQuery('');
        setSearchResult(null);
        setError('');
        setSuccessMessage('');
        setHasSearched(false);
        onClose();
    };

    if (!isOpen) return null;

    const displayName = searchResult ? (searchResult.nickname || searchResult.username) : '';

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">添加好友</h2>
                        <button onClick={handleClose} className="text-white/80 hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Search Box */}
                <div className="p-6">
                    <div className="flex gap-2 mb-4">
                        <input
                            type="text"
                            placeholder="输入用户名搜索..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {loading ? '搜索中...' : '搜索'}
                        </button>
                    </div>

                    {loading && (
                        <div className="flex items-center justify-center p-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                            <span className="ml-2 text-gray-600">正在搜索...</span>
                        </div>
                    )}

                    {!loading && searchResult && (
                        <div className="mt-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-purple-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                    {displayName[0]?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-lg">{displayName}</p>
                                    <p className="text-sm text-gray-500">@{searchResult.username}</p>
                                    {searchResult.signature && (
                                        <p className="text-xs text-gray-400 mt-0.5">{searchResult.signature}</p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={handleAddFriend}
                                disabled={sending}
                                className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-base font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {sending ? '发送中...' : '发送好友请求'}
                            </button>
                        </div>
                    )}

                    {!loading && hasSearched && !searchResult && searchQuery.trim() !== '' && (
                        <div className="text-center text-gray-400 py-8">
                            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <p className="text-sm">未找到该用户</p>
                        </div>
                    )}

                    {(error || successMessage) && (
                        <div className="mt-3">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}
                            {successMessage && (
                                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
                                    {successMessage}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
