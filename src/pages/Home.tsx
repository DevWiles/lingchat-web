import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFriendList, getFriendRequests, handleFriendRequest, removeFriend } from '../api/friend';
import { getUserIdFromToken } from '../api/auth';
import AddFriendModal from '../components/AddFriendModal';

interface Friend {
    userId: number;
    username: string;
    nickname?: string;
    avatar?: string;
    remark?: string;
    signature?: string;
}

interface FriendRequest {
    id: number;
    senderId: number;
    senderNickname: string;
    message?: string;
}

export default function Home() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'contacts' | 'me'

    // 联系人相关状态
    const [friends, setFriends] = useState<Friend[]>([]);
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [friendsTab, setFriendsTab] = useState<'friends' | 'requests'>('friends');

    useEffect(() => {
        if (activeTab === 'contacts') {
            loadData();
        }
    }, [activeTab]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const loadData = async () => {
        try {
            setLoading(true);
            setError('');
            const [friendsRes, requestsRes] = await Promise.all([
                getFriendList(),
                getFriendRequests()
            ]);
            setFriends(friendsRes.data?.data || []);
            setRequests(requestsRes.data?.data || []);
        } catch (e: any) {
            setError(e.response?.data?.message || '加载失败，请稍后重试');
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptRequest = async (requestId: number) => {
        try {
            await handleFriendRequest(requestId, true);
            setRequests(requests.filter(r => r.id !== requestId));
            loadData();
        } catch (e: any) {
            setError(e.response?.data?.message || '操作失败');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleRejectRequest = async (requestId: number) => {
        try {
            await handleFriendRequest(requestId, false);
            setRequests(requests.filter(r => r.id !== requestId));
        } catch (e: any) {
            setError(e.response?.data?.message || '操作失败');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleRemoveFriend = async (friendId: number) => {
        if (!confirm('确定要删除该好友吗？')) return;
        try {
            await removeFriend(friendId);
            setFriends(friends.filter(f => f.userId !== friendId));
        } catch (e: any) {
            setError(e.response?.data?.message || '删除失败');
            setTimeout(() => setError(''), 3000);
        }
    };

    const getDisplayName = (friend: Friend) => friend.remark || friend.nickname || friend.username || '未知用户';

    return (
        <div className="flex h-screen bg-gray-100">
            {/* 左侧边栏 */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                {/* 头部 */}
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-500">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-white">LingChat</h1>
                        <button
                            onClick={handleLogout}
                            className="text-white/80 hover:text-white transition-colors"
                            title="退出登录"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* 聊天 tab */}
                {activeTab === 'chat' && (
                    <div className="flex-1 flex items-center justify-center p-4">
                        <div className="text-center text-gray-400">
                            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p className="text-sm">暂无聊天会话</p>
                        </div>
                    </div>
                )}

                {/* 联系人 tab */}
                {activeTab === 'contacts' && (
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-lg font-bold text-gray-800">联系人</h2>
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="text-indigo-600 hover:text-indigo-700 transition-colors"
                                    title="添加好友"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="flex bg-gray-100 rounded-lg p-1">
                                <button
                                    onClick={() => setFriendsTab('friends')}
                                    className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                        friendsTab === 'friends'
                                            ? 'bg-white text-indigo-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-700'
                                    }`}
                                >
                                    好友 ({friends.length})
                                </button>
                                <button
                                    onClick={() => setFriendsTab('requests')}
                                    className={`flex-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors relative ${
                                        friendsTab === 'requests'
                                            ? 'bg-white text-indigo-600 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-700'
                                    }`}
                                >
                                    请求
                                    {requests.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                            {requests.length}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="mx-4 mt-3 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto p-4">
                            {loading && (
                                <div className="flex items-center justify-center p-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                                </div>
                            )}

                            {!loading && friendsTab === 'friends' && (
                                <div>
                                    {friends.length === 0 ? (
                                        <div className="text-center text-gray-400 py-8">
                                            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <p className="text-sm">暂无好友</p>
                                            <button
                                                onClick={() => setIsAddModalOpen(true)}
                                                className="mt-3 text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                                            >
                                                添加好友
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {friends.map((friend) => (
                                                <div
                                                    key={friend.userId}
                                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                                            {getDisplayName(friend)[0]?.toUpperCase() || 'F'}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-800">{getDisplayName(friend)}</p>
                                                            {friend.signature && <p className="text-xs text-gray-500">{friend.signature}</p>}
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => handleRemoveFriend(friend.userId)}
                                                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 transition-opacity p-2"
                                                        title="删除好友"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {!loading && friendsTab === 'requests' && (
                                <div>
                                    {requests.length === 0 ? (
                                        <div className="text-center text-gray-400 py-8">
                                            <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <p className="text-sm">暂无好友请求</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {requests.map((request) => (
                                                <div key={request.id} className="p-3 bg-gray-50 rounded-xl">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                                            {(request.senderNickname || '?')[0]?.toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-800">{request.senderNickname}</p>
                                                            <p className="text-xs text-gray-500">
                                                                {request.message || '想添加你为好友'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleAcceptRequest(request.id)}
                                                            className="flex-1 px-3 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
                                                        >
                                                            接受
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectRequest(request.id)}
                                                            className="flex-1 px-3 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400 transition-colors"
                                                        >
                                                            拒绝
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* 个人中心 tab */}
                {activeTab === 'me' && (
                    <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
                        <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                            {getUserIdFromToken() || 'U'}
                        </div>
                        <p className="text-gray-600 text-sm">点击下方按钮查看/编辑个人信息</p>
                        <button
                            onClick={() => navigate('/profile')}
                            className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
                        >
                            个人信息
                        </button>
                        <button
                            onClick={handleLogout}
                            className="w-full px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                        >
                            退出登录
                        </button>
                    </div>
                )}

                {/* 底部导航栏 */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`flex-1 transition-colors flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg ${
                                activeTab === 'chat'
                                    ? 'text-indigo-600 bg-indigo-50'
                                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span className="text-xs font-medium">聊天</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('contacts')}
                            className={`flex-1 transition-colors flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg ${
                                activeTab === 'contacts'
                                    ? 'text-indigo-600 bg-indigo-50'
                                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="text-xs font-medium">联系人</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('me')}
                            className={`flex-1 transition-colors flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg ${
                                activeTab === 'me'
                                    ? 'text-indigo-600 bg-indigo-50'
                                    : 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50'
                            }`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-xs font-medium">我</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* 右侧主内容区 */}
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-400">
                    <svg className="w-24 h-24 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-lg">欢迎使用 LingChat</p>
                    <p className="text-sm mt-2">功能开发中...</p>
                </div>
            </div>

            {/* 添加好友模态框 */}
            <AddFriendModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={loadData}
            />
        </div>
    );
}
