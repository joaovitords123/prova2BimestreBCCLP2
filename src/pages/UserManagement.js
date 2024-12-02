import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUsers } from '../redux/userSlice';

const UserManagement = () => {
  const [nickname, setNickname] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [password, setPassword] = useState('');
  const [selectedUser, setSelectedUser] = useState(null); // Para armazenar o usuário selecionado para edição
  const [confirmPassword, setConfirmPassword] = useState(''); // Para a senha de confirmação ao excluir
  const users = useSelector((state) => state.user.users);
  const dispatch = useDispatch();

  useEffect(() => {
    // Buscar usuários ao montar o componente
    fetch('https://backend-bcc-2-b.vercel.app/usuario')
      .then((response) => response.json())
      .then((data) => {
        dispatch(setUsers(data.listaUsuarios || []));
      })
      .catch((error) => {
        console.error('Erro ao buscar usuários:', error);
        alert('Não foi possível carregar os usuários. Tente novamente.');
      });
  }, [dispatch]);

  const handleRegister = () => {
    if (!nickname || !avatarUrl || !password) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    // Enviar dados para o backend
    fetch('https://backend-bcc-2-b.vercel.app/usuario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nickname,
        urlAvatar: avatarUrl,
        senha: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Resposta da API:', data);
        alert('Usuário cadastrado com sucesso!');
        setNickname('');
        setAvatarUrl('');
        setPassword('');
        return fetch('https://backend-bcc-2-b.vercel.app/usuario');
      })
      .then((response) => response.json())
      .then((data) => {
        console.log('Usuários atualizados:', data.listaUsuarios);
        dispatch(setUsers(data.listaUsuarios || []));
      })
      .catch((error) => {
        console.error('Erro ao cadastrar usuário:', error);
        alert('Erro desconhecido. Tente novamente.');
      });
  };

  const handleUpdate = () => {
    if (!nickname || !avatarUrl || !password || !selectedUser) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    // Enviar dados para atualizar o usuário
    fetch('https://backend-bcc-2-b.vercel.app/usuario', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: selectedUser.id,
        nickname,
        urlAvatar: avatarUrl,
        senha: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Resposta da API:', data);
        alert('Usuário alterado com sucesso!');
        setNickname('');
        setAvatarUrl('');
        setPassword('');
        setSelectedUser(null);
        return fetch('https://backend-bcc-2-b.vercel.app/usuario');
      })
      .then((response) => response.json())
      .then((data) => {
        console.log('Usuários atualizados:', data.listaUsuarios);
        dispatch(setUsers(data.listaUsuarios || []));
      })
      .catch((error) => {
        console.error('Erro ao alterar usuário:', error);
        alert('Erro desconhecido. Tente novamente.');
      });
  };

  const handleEdit = (user) => {
    // Preenche os campos com os dados do usuário para edição
    setNickname(user.nickname);
    setAvatarUrl(user.urlAvatar);
    setPassword(''); // Não mostrar a senha por questões de segurança
    setSelectedUser(user); // Define o usuário a ser alterado
  };

  const handleDelete = (userId) => {
    // Confirmar exclusão antes de enviar a requisição DELETE
    if (!confirmPassword) {
      alert('Por favor, informe a senha para confirmar a exclusão!');
      return;
    }

    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      fetch('https://backend-bcc-2-b.vercel.app/usuario', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId, senha: confirmPassword }), // Envia a senha junto com o ID
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Resposta da API:', data);
          alert('Usuário excluído com sucesso!');
          setConfirmPassword('');
          return fetch('https://backend-bcc-2-b.vercel.app/usuario');
        })
        .then((response) => response.json())
        .then((data) => {
          console.log('Usuários atualizados:', data.listaUsuarios);
          dispatch(setUsers(data.listaUsuarios || []));
        })
        .catch((error) => {
          console.error('Erro ao excluir usuário:', error);
          alert('Erro ao excluir usuário. Tente novamente.');
        });
    }
  };

  return (
    <div>
      <h2>Gerenciamento de Usuários</h2>
      <input
        type="text"
        placeholder="Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />
      <input
        type="text"
        placeholder="URL do Avatar"
        value={avatarUrl}
        onChange={(e) => setAvatarUrl(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={selectedUser ? handleUpdate : handleRegister}>
        {selectedUser ? 'Alterar' : 'Cadastrar'}
      </button>

      <h3>Usuários Cadastrados:</h3>
      <ul>
        {users && users.length > 0 ? (
          users.map((user) => (
            <li key={user.id}>
              {user.nickname} -{' '}
              <img src={user.urlAvatar} alt={user.nickname} width={50} />
              <button onClick={() => handleEdit(user)}>Alterar</button>
              <button onClick={() => handleDelete(user.id)}>Excluir</button>
            </li>
          ))
        ) : (
          <p>Nenhum usuário cadastrado.</p>
        )}
      </ul>

      {selectedUser && (
        <div>
          <h3>Confirmar Exclusão</h3>
          <input
            type="password"
            placeholder="Digite a senha para excluir"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
      )}
    </div>
  );
};

export default UserManagement;
