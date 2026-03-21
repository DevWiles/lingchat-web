import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, updateMyProfile } from '../api/friend';
import { getUserIdFromToken } from '../api/auth';

interface UserProfile {
    userId: number;
    username: string;
    nickname?: string;
    avatar?: string;
    signature?: string;
}

export default function Profile() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // 编辑表单状态
    const [formNickname, setFormNickname] = useState('');
    const [formSignature, setFormSignature] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        const userId = getUserIdFromToken();
        if (!userId) {
            navigate('/login');
            return;
        }
        try {
            setLoading(true);
            const res = await getMyProfile(userId);
            const data: UserProfile = res.data?.data;
            setProfile(data);
            setFormNickname(data?.nickname || '');
            setFormSignature(data?.signature || '');
        } catch (e: any) {
            setError(e.response?.data?.message || '加载个人信息失败');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError('');
            const res = await updateMyProfile({
                nickname: formNickname.trim() || undefined,
                signature: formSignature.trim() || undefined,
            });
            const updated: UserProfile = res.data?.data;
            setProfile(updated);
            setIsEditing(false);
            setSuccessMessage('个人信息已更新');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (e: any) {
            setError(e.response?.data?.message || '保存失败，请稍后重试');
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setFormNickname(profile?.nickname || '');
        setFormSignature(profile?.signature || '');
        setIsEditing(false);
        setError('');
    };

    const displayName = profile ? (profile.nickname || profile.username) : '加载中...';

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col">
            {/* 顶部导航栏 */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4 flex items-center gap-4 shadow-md">
                <button
                    onClick={() => navigate(-1)}
                    className="text-white/80 hover:text-white transition-colors"
                    title="返回"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-xl font-bold text-white">个人信息</h1>
            </div>

            <div className="flex-1 flex flex-col items-center py-10 px-4">
                {loading ? (
                    <div className="flex items-center justify-center mt-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
                    </div>
                ) : (
                    <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
                        {/* 头像区域 */}
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 pt-10 pb-8 flex flex-col items-center">
                            <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center text-white font-bold text-4xl shadow-lg mb-3">
                                {displayName[0]?.toUpperCase() || 'U'}
                            </div>
                            <h2 className="text-2xl font-bold text-white">{displayName}</h2>
                            <p className="text-white/70 text-sm mt-1">@{profile?.username}</p>
                        </div>

                        {/* 信息区域 */}
                        <div className="p-6 space-y-5">
                            {/* 成功 / 错误提示 */}
                            {successMessage && (
                                <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm">
                                    {successMessage}
                                </div>
                            )}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                                    {error}
                                </div>
                            )}

                            {/* 用户名（不可编辑） */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                    用户名
                                </label>
                                <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-700 font-medium">
                                    {profile?.username}
                                </div>
                            </div>

                            {/* 昵称 */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                    昵称
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        value={formNickname}
                                        onChange={(e) => setFormNickname(e.target.value)}
                                        placeholder="请输入昵称"
                                        className="w-full px-4 py-3 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-700"
                                    />
                                ) : (
                                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-700">
                                        {profile?.nickname || <span className="text-gray-400">未设置</span>}
                                    </div>
                                )}
                            </div>

                            {/* 个性签名 */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                    个性签名
                                </label>
                                {isEditing ? (
                                    <textarea
                                        value={formSignature}
                                        onChange={(e) => setFormSignature(e.target.value)}
                                        placeholder="写下你的个性签名..."
                                        rows={3}
                                        className="w-full px-4 py-3 border border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-700 resize-none"
                                    />
                                ) : (
                                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-700 min-h-[60px]">
                                        {profile?.signature || <span className="text-gray-400">未设置</span>}
                                    </div>
                                )}
                            </div>

                            {/* 操作按钮 */}
                            {isEditing ? (
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={handleCancelEdit}
                                        className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                                    >
                                        取消
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                                    >
                                        {saving ? '保存中...' : '保存'}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity mt-2"
                                >
                                    编辑信息
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
