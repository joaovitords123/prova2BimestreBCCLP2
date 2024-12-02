import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages(state, action) {
      state.messages = action.payload;  // Armazena as mensagens na store
    },
    addMessage(state, action) {
      state.messages.push(action.payload);  // Adiciona uma nova mensagem na store
    },
  },
});

export const { setMessages, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
