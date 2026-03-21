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
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [hasSearched, setHasSearched] = useState(false); // 是否已执行搜索

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
            setSelectedUser(null); // 清空已选中的用户
            const response = await searchUser(userId);
            // 只显示搜索结果，不自动展开
            setSearchResults(response.data ? [response.data] : []);
            setHasSearched(true); // 标记已执行搜索
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
        setSelectedUser(null);
        setError('');
        setSuccessMessage('');
        setHasSearched(false); // 重置搜索状态
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
                <div className="p-6">
                    <div className="flex gap-2 mb-4">
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
                    
                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center p-4">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
                            <span className="ml-2 text-gray-600">正在搜索...</span>
                        </div>
                    )}
                    
                    {/* Search Results - User Info Bar (仅显示基本信息) */}
                    {!loading && searchResults.length > 0 && !selectedUser && (
                        <div className="space-y-2">
                            {searchResults.map((user) => (
                                <div
                                    key={user.id}
                                    onClick={() => setSelectedUser(user)}
                                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl cursor-pointer hover:shadow-md transition-all border border-purple-100"
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        {user.username[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800 text-base">{user.username}</p>
                                        <p className="text-xs text-gray-500">ID: {user.id}</p>
                                    </div>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {/* Expanded User Details (点击信息条后才显示) */}
                    {!loading && selectedUser && (
                        <div className="mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-purple-100">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                        {selectedUser.username[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800 text-lg">{selectedUser.username}</p>
                                        <p className="text-sm text-gray-500">ID: {selectedUser.id}</p>
                                        {selectedUser.email && <p className="text-xs text-gray-400 mt-1">{selectedUser.email}</p>}
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedUser(null)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                                    title="收起"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <button
                                onClick={() => handleAddFriend(selectedUser.id, selectedUser.username)}
                                disabled={sendingRequests.includes(selectedUser.id)}
                                className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl text-base font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {sendingRequests.includes(selectedUser.id) ? '发送好友请求中...' : '添加好友'}
                            </button>
                        </div>
                    )}
                    
                    {/* No Results */}
                    {!loading && hasSearched && searchResults.length === 0 && searchQuery.trim() !== '' && (
                        <div className="text-center text-gray-400 py-8">
                            <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <p className="text-sm">暂无搜索结果</p>
                        </div>
                    )}
                </div>



                {/* Error & Success Messages */}
                {(error || successMessage) && (
                    <div className="px-6 pb-4">
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
    );
}
