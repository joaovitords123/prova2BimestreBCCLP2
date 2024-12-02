import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setMessages, addMessage } from '../redux/chatSlice';

const ChatRoom = () => {
  const [message, setMessage] = useState('');
  const messages = useSelector((state) => state.chat.messages);
  const currentUser = useSelector((state) => state.user.currentUser);  // Certifique-se que currentUser está sendo carregado corretamente
  const dispatch = useDispatch();

  useEffect(() => {
    if (!currentUser) {
      console.error('Usuário não está logado.');
      return; // Opcional: pode redirecionar para a página de login
    }

    axios.get('https://backend-bcc-2-b.vercel.app/mensagem')
      .then((response) => {
        console.log('Mensagens recebidas:', response.data);  // Log para verificar a estrutura
        dispatch(setMessages(response.data));
      })
      .catch((error) => {
        console.error('Erro ao buscar mensagens:', error);
        alert('Erro ao carregar mensagens. Tente novamente mais tarde.');
      });
  }, [dispatch, currentUser]);

  const handleSendMessage = () => {
    if (message.trim()) {
      axios.post('https://backend-bcc-2-b.vercel.app/mensagem', {
        content: message,
        userId: currentUser.id,  // Verifique se currentUser possui a propriedade 'id'
      }).then((response) => {
        console.log('Mensagem enviada:', response.data);  // Log de envio
        dispatch(addMessage(response.data));
        setMessage('');
      }).catch((error) => {
        console.error('Erro ao enviar mensagem:', error);
        alert('Erro ao enviar mensagem. Tente novamente mais tarde.');
      });
    }
  };

  return (
    <div>
      <h2>Sala de Bate-papo</h2>
      <div>
        {messages.length > 0 ? (
          messages.map((msg) => (
            <p key={msg.id}>
              <strong>{msg.nickname}:</strong> {msg.content}  {/* Ajuste para o nome correto do campo */}
            </p>
          ))
        ) : (
          <p>Não há mensagens ainda.</p>
        )}
      </div>
      <input
        type="text"
        placeholder="Digite sua mensagem"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={handleSendMessage}>Enviar</button>
    </div>
  );
};

export default ChatRoom;
