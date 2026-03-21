import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Welcome from './pages/Welcome';
import Friends from './pages/Friends';
import AuthGuard from "./components/AuthGuardProps.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<AuthGuard><Home /></AuthGuard>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
