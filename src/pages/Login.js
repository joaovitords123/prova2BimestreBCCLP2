import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../redux/userSlice';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);  // Estado de carregamento
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!nickname || !password) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    setLoading(true);  // Inicia o estado de carregamento
    axios
      .post('https://backend-bcc-2-b.vercel.app/usuario/verificarSenha', {
        nickname,
        password,
      })
      .then((response) => {
        setLoading(false);  // Finaliza o estado de carregamento

        if (response.data.success) {
          dispatch(setCurrentUser(response.data.user));  // Armazena o usuário no Redux
          alert('Login bem-sucedido!');
          navigate('/chat');  // Redireciona para a página de chat
        } else {
          alert('Credenciais inválidas.');
        }
      })
      .catch((error) => {
        setLoading(false);  // Finaliza o estado de carregamento
        console.error('Erro no login:', error);
        alert('Erro ao tentar fazer login. Tente novamente.');
      });
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </div>
  );
};

export default Login;
