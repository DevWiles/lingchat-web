import { apiClient } from './auth';

// 获取好友列表
export const getFriendList = async () => {
    return apiClient.get('/friend/list');
};

// 按用户名搜索用户
export const searchUserByUsername = async (username: string) => {
    return apiClient.get(`/user/search`, { params: { username } });
};

// 按 userId 获取用户信息
export const getUserProfile = async (userId: number) => {
    return apiClient.get(`/user/profile/${userId}`);
};

// 发送好友请求（后端期望：POST /api/friend/request，body: { friendId, message }）
export const sendFriendRequest = async (targetUserId: number, message?: string) => {
    return apiClient.post('/friend/request', { friendId: targetUserId, message: message || '' });
};

// 获取待处理的好友请求列表（后端路径：GET /api/friend/requests/pending）
export const getFriendRequests = async () => {
    return apiClient.get('/friend/requests/pending');
};

// 处理好友请求（后端期望：POST /api/friend/request/handle?requestId=...&agree=...）
export const handleFriendRequest = async (requestId: number, accept: boolean) => {
    return apiClient.post('/friend/request/handle', null, {
        params: { requestId, agree: accept },
    });
};

// 删除好友
export const removeFriend = async (friendId: number) => {
    return apiClient.delete(`/friend/${friendId}`);
};

// 获取当前用户个人信息（从 token 中 decode userId，或由调用方传入）
export const getMyProfile = async (userId: number) => {
    return apiClient.get(`/user/profile/${userId}`);
};

// 更新个人信息
export const updateMyProfile = async (data: { nickname?: string; avatar?: string; signature?: string }) => {
    return apiClient.put('/user/profile', data);
};
