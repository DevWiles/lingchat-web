# LingChat Client

一个基于 React 19 + TypeScript + Vite 构建的现代化聊天应用客户端。

## ✨ 技术栈

- **框架**: React 19.2.4
- **语言**: TypeScript 5.9.3
- **构建工具**: Vite 8.0.0
- **路由**: React Router DOM 7.13.1
- **HTTP 客户端**: Axios 1.13.6
- **样式**: Tailwind CSS 4.2.1
- **代码质量**: ESLint 9.39.4

## 🚀 快速开始

### 环境要求

- Node.js >= 18.x
- npm >= 9.x

### 安装依赖

```bash
npm install
```

### 开发模式

启动开发服务器，支持热模块替换（HMR）：

```bash
npm run dev
```

应用将在 `http://localhost:5173` 启动。

### 生产构建

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 预览生产构建

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

## 📁 项目结构

```
lingchat-client/
├── public/              # 静态资源
│   ├── favicon.svg     # 网站图标
│   └── icons.svg       # SVG 图标集合
├── src/
│   ├── api/            # API 接口层
│   │   └── auth.ts     # 认证相关接口（登录/注册）
│   ├── assets/         # 资源文件
│   │   ├── hero.png    # 主页图片
│   │   └── vite.svg    # Vite 图标
│   ├── pages/          # 页面组件
│   │   ├── Home.tsx    # 主页
│   │   ├── Login.tsx   # 登录页
│   │   └── Register.tsx # 注册页
│   ├── App.css         # 应用样式
│   ├── App.tsx         # 根组件（路由配置）
│   ├── index.css       # 全局样式（含 Tailwind）
│   └── main.tsx        # 应用入口
├── index.html          # HTML 模板
├── package.json        # 项目依赖配置
├── tsconfig.json       # TypeScript 配置
└── vite.config.ts      # Vite 构建配置
```

## 🔧 功能特性

- ⚛️ **React 19** - 使用最新的 React 版本，享受更好的性能优化
- 📘 **TypeScript** - 完整的类型定义，提升开发体验
- ⚡ **Vite** - 极速冷启动和热更新
- 🎨 **Tailwind CSS 4** - 原子化 CSS，快速构建响应式 UI
- 🔐 **认证系统** - 完整的登录、注册功能
- 🛣️ **路由管理** - 基于 React Router 的单页应用路由
- 🌐 **API 集成** - Axios HTTP 客户端封装

## 📝 API 配置

默认的 API 网关地址为：`http://localhost:8080/api`

如需修改，请编辑 [`src/api/auth.ts`](src/api/auth.ts) 中的 `API_BASE` 常量。

### 认证接口

- **注册**: `POST /api/auth/register`
- **登录**: `POST /api/auth/login`

## 🎯 路由配置

| 路径 | 组件 | 描述 |
|------|------|------|
| `/` | Login | 默认跳转至登录页 |
| `/login` | Login | 登录页面 |
| `/register` | Register | 注册页面 |
| `/home` | Home | 主页（聊天主界面） |

## 🛠️ 开发建议

### 添加新页面

1. 在 `src/pages/` 目录下创建新的 `.tsx` 文件
2. 在 `App.tsx` 中添加路由配置

### 添加新 API

1. 在 `src/api/` 目录下创建对应的 API 模块
2. 使用 Axios 封装请求方法
3. 统一处理错误和响应

### 样式开发

项目使用 Tailwind CSS，推荐直接在组件中使用 utility classes：

```tsx
<div className="flex items-center justify-center p-4">
  <h1 className="text-2xl font-bold text-gray-900">Hello World</h1>
</div>
```

## 📦 构建部署

### 本地构建测试

```bash
npm run build
npm run preview
```

### 生产环境部署

构建完成后，将 `dist` 目录部署到静态资源服务器或 CDN。

#### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API 代理
    location /api {
        proxy_pass http://backend-server:8080;
    }
}
```

## 🔒 环境变量（可选）

可以创建 `.env` 或 `.env.production` 文件来管理不同环境的配置：

```env
VITE_API_BASE_URL=http://your-api.com/api
```

然后在代码中通过 `import.meta.env.VITE_API_BASE_URL` 访问。

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

**注意**: 本项目使用 React 19，部分 API 可能与旧版本不兼容。
