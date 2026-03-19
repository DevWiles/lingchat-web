import { useState } from 'react';
import { searchUser, sendFriendRequest } from '../api/friend';

interface User {
    id: number;
    username: string;
    email?: string;
}

interface AddFriendModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AddFriendModal({ isOpen, onClose }: AddFriendModalProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [sendingRequests, setSendingRequests] = useState<number[]>([]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) {
            setError('请输入用户 ID');
            return;
        }

        const userId = parseInt(searchQuery, 10);
        if (isNaN(userId)) {
            setError('请输入有效的用户 ID');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const response = await searchUser(userId);
            setSearchResults(response.data ? [response.data] : []);
        } catch (e: any) {
            setError(e.response?.data?.message || '搜索失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    const handleAddFriend = async (userId: number, username: string) => {
        if (sendingRequests.includes(userId)) return;

        try {
            setSendingRequests([...sendingRequests, userId]);
            await sendFriendRequest(userId);
            setSuccessMessage(`已向 ${username} 发送好友请求`);
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (e: any) {
            setError(e.response?.data?.message || '发送请求失败');
            setTimeout(() => setError(''), 3000);
        } finally {
            setSendingRequests(sendingRequests.filter(id => id !== userId));
        }
    };

    const handleClose = () => {
        setSearchQuery('');
        setSearchResults([]);
        setError('');
        setSuccessMessage('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">添加好友</h2>
                        <button
                            onClick={handleClose}
                            className="text-white/80 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Search Box */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="输入用户 ID 搜索..."
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
                </div>

                {/* Messages */}
                {error && (
                    <div className="mx-6 mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="mx-6 mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
                        {successMessage}
                    </div>
                )}

                {/* Search Results */}
                <div className="max-h-80 overflow-y-auto p-6">
                    {searchResults.length === 0 && !loading && (
                        <p className="text-center text-gray-400 py-8">暂无搜索结果</p>
                    )}
                    {searchResults.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-2 hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {user.username[0]?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{user.username}</p>
                                    {user.email && <p className="text-xs text-gray-500">{user.email}</p>}
                                </div>
                            </div>
                            <button
                                onClick={() => handleAddFriend(user.id, user.username)}
                                disabled={sendingRequests.includes(user.id)}
                                className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {sendingRequests.includes(user.id) ? '发送中...' : '添加好友'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
