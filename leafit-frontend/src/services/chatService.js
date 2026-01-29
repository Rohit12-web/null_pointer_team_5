import api from './api';

export const chatService = {
  sendMessage: async (message) => {
    try {
      const response = await api.post('/chat/', { message });
      return response;
    } catch (error) {
      console.error('Chat service error:', error);
      throw error;
    }
  },
};

export default chatService;
