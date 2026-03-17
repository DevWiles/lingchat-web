import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 模拟的聊天数据
const mockChats = [
    { id: 1, name: '张三', lastMessage: '你好，在吗？', time: '10:30', avatar: '👨', unread: 2 },
    { id: 2, name: '李四', lastMessage: '明天开会记得参加', time: '09:15', avatar: '👩', unread: 0 },
    { id: 3, name: '工作群', lastMessage: '王五：项目进度怎么样了？', time: '昨天', avatar: '👥', unread: 5 },
    { id: 4, name: '赵六', lastMessage: '[图片]', time: '昨天', avatar: '🧑', unread: 0 },
    { id: 5, name: '家庭群', lastMessage: '妈妈：晚上回来吃饭吗？', time: '星期一', avatar: '👪', unread: 1 },
];

export default function Home() {
    const navigate = useNavigate();
    const [selectedChat, setSelectedChat] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const filteredChats = mockChats.filter(chat =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-100">
            {/* 左侧聊天列表 */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
                {/* 头部 */}
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-purple-500">
                    <div className="flex items-center justify-between mb-3">
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
                    
                    {/* 搜索框 */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="搜索聊天"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 pl-10 rounded-full bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border-none focus:ring-2 focus:ring-white/50 outline-none"
                        />
                        <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                {/* 聊天列表 */}
                <div className="flex-1 overflow-y-auto">
                    {filteredChats.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setSelectedChat(chat.id)}
                            className={`flex items-center p-4 cursor-pointer transition-all hover:bg-gray-50 ${
                                selectedChat === chat.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
                            }`}
                        >
                            {/* 头像 */}
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-2xl mr-3 flex-shrink-0 shadow-md">
                                {chat.avatar}
                            </div>
                            
                            {/* 消息内容 */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-semibold text-gray-800 truncate">{chat.name}</h3>
                                    <span className="text-xs text-gray-400 ml-2">{chat.time}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                                    {chat.unread > 0 && (
                                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                                            {chat.unread}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 底部功能栏 */}
                <div className="p-3 border-t border-gray-200 bg-gray-50 flex justify-around">
                    <button className="p-2 text-gray-600 hover:text-indigo-600 transition-colors" title="通讯录">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </button>
                    <button className="p-2 text-gray-600 hover:text-indigo-600 transition-colors" title="收藏">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </button>
                    <button className="p-2 text-gray-600 hover:text-indigo-600 transition-colors" title="设置">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* 右侧聊天窗口 */}
            <div className="flex-1 flex flex-col">
                {selectedChat ? (
                    <>
                        {/* 聊天头部 */}
                        <div className="p-4 border-b border-gray-200 bg-white flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 flex items-center justify-center text-xl mr-3">
                                {mockChats.find(c => c.id === selectedChat)?.avatar}
                            </div>
                            <h2 className="text-lg font-semibold text-gray-800">
                                {mockChats.find(c => c.id === selectedChat)?.name}
                            </h2>
                        </div>

                        {/* 消息区域 */}
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                            <div className="text-center text-gray-400 py-10">
                                这是聊天内容区域
                                <p className="text-sm mt-2">开始和 {mockChats.find(c => c.id === selectedChat)?.name} 聊天吧！</p>
                            </div>
                        </div>

                        {/* 输入框 */}
                        <div className="p-4 bg-white border-t border-gray-200">
                            <div className="flex items-start space-x-2 mb-3">
                                <button className="p-2 text-gray-600 hover:text-indigo-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>
                                <button className="p-2 text-gray-600 hover:text-indigo-600 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                </button>
                            </div>
                            <textarea
                                placeholder="输入消息... (Ctrl+Enter 发送)"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none outline-none"
                                rows={3}
                            />
                            <div className="flex justify-end mt-3">
                                <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg">
                                    发送
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <div className="text-center text-gray-400">
                            <svg className="w-24 h-24 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <p className="text-lg">选择一个聊天开始对话</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
