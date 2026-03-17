import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import planetImage from '../assets/planet.jpg';
import lingchatLogo from '../assets/lingchat-logo.png';

export default function Welcome() {
    const navigate = useNavigate();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // 页面加载后显示动画
        setVisible(true);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${planetImage})` }}>
            {/* 背景遮罩 - 让内容更清晰 */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Logo 和标题区域 */}
            <div className="text-center mb-16 z-10">
                <div className="mx-auto mb-6 ml-16">
                    <img src={lingchatLogo} alt="LingChat Logo" className="w-32 h-32 object-contain drop-shadow-2xl" />
                </div>
                <h1 className="text-5xl font-bold text-white mb-4 tracking-wide">
                    LingChat
                </h1>
                <p className="text-white/80 text-xl font-light">
                    灵信轻聊 — 开启您的聊天之旅
                </p>
            </div>

            {/* 按钮容器 - 从底部上升 */}
            <div className="flex flex-col sm:flex-row gap-6 mb-20 z-10">
                {/* 登录按钮 */}
                <button
                    onClick={() => navigate('/login')}
                    className={`px-16 py-4 bg-white/90 backdrop-blur-sm text-indigo-600 font-semibold rounded-full shadow-2xl hover:shadow-3xl transform transition-all duration-700 ease-out hover:scale-105 hover:bg-white ${
                        visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                    }`}
                    style={{ transitionDelay: '0.2s' }}
                >
                    <div className="flex items-center space-x-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <span>登录</span>
                    </div>
                </button>

                {/* 注册按钮 */}
                <button
                    onClick={() => navigate('/register')}
                    className={`px-16 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full shadow-2xl hover:shadow-3xl transform transition-all duration-700 ease-out hover:scale-105 hover:from-indigo-700 hover:to-purple-700 ${
                        visible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                    }`}
                    style={{ transitionDelay: '0.4s' }}
                >
                    <div className="flex items-center space-x-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <span>注册</span>
                    </div>
                </button>
            </div>

            {/* 底部版权信息 */}
            <div className="absolute bottom-4 text-white/60 text-sm z-10">
                © 2026 LingChat. All rights reserved.
            </div>
        </div>
    );
}
