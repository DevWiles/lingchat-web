import { apiClient } from './auth';

// 获取好友列表
export const getFriendList = async () => {
    return apiClient.get('/friend/list');
};

// 搜索用户
export const searchUser = async (userId: number) => {
    return apiClient.get(`/user/profile/${userId}`);
};

// 发送好友请求
export const sendFriendRequest = async (targetUserId: number) => {
    return apiClient.post(`/friend/request/${targetUserId}`, {});
};

// 获取好友请求列表
export const getFriendRequests = async () => {
    return apiClient.get('/friends/requests');
};

// 处理好友请求 (接受/拒绝)
export const handleFriendRequest = async (requestId: number, accept: boolean) => {
    return apiClient.post(`/friend/request/${requestId}/${accept ? 'accept' : 'reject'}`, {});
};

// 删除好友
export const removeFriend = async (friendId: number) => {
    return apiClient.delete(`/friend/${friendId}`);
};
