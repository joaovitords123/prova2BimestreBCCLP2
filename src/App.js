import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import UserManagement from './pages/UserManagement';
import ChatRoom from './pages/ChatRoom';
import Login from './pages/Login';
import './styles/App.css';

function App() {
  const currentUser = useSelector((state) => state.user.currentUser);

  return (
    <Router>
      <div className="app-container">
        <h1 className="app-title">Bate-papo Web</h1>
        <nav className="app-nav">
          <ul>
            <li><Link to="/">Cadastro de Usuários</Link></li>
            {currentUser && <li><Link to="/chat">Bate-papo</Link></li>}
            {!currentUser && <li><Link to="/login">Login</Link></li>} {/* Oculta Login se estiver logado */}
          </ul>
        </nav>
        <div className="app-content">
          <Routes>
            <Route path="/" element={<UserManagement />} />
            {/* Redireciona para login se não estiver autenticado */}
            <Route path="/chat" element={currentUser ? <ChatRoom /> : <Navigate to="/login" />} />
            <Route path="/login" element={currentUser ? <Navigate to="/chat" /> : <Login />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
