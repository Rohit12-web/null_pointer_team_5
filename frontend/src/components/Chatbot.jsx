import React, { useState } from 'react';
import axios from 'axios';
// Added Trash2 icon from lucide-react
import { MessageSquare, Send, X, Bot, Trash2 } from 'lucide-react';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { text: "Hi! I'm EnvoX AI. Need help with a green solution?", sender: 'ai' }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Function to clear the chat history
  const clearChat = () => {
    setMessages([{ text: "Conversation cleared. How else can I help?", sender: 'ai' }]);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/chat/`, { message: input });
      setMessages(prev => [...prev, { text: res.data.reply, sender: 'ai' }]);
    } catch (err) {
      setMessages(prev => [...prev, { text: "Connection error. Is the backend running?", sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)} 
          className="bg-green-600 text-white p-4 rounded-full shadow-xl hover:scale-110 transition"
        >
          <MessageSquare size={28} />
        </button>
      ) : (
        <div className="bg-white w-80 h-[480px] rounded-2xl shadow-2xl border flex flex-col overflow-hidden">
          {/* Header with Clear Button */}
          <div className="bg-green-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold">
              <Bot size={20} /> EnvoX AI
            </div>
            <div className="flex items-center gap-3">
              {/* The Clear Chat Button */}
              <button 
                onClick={clearChat} 
                className="hover:bg-green-700 p-1 rounded transition" 
                title="Clear Chat"
              >
                <Trash2 size={18} />
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:bg-green-700 p-1 rounded">
                <X size={20}/>
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2 rounded-xl max-w-[85%] ${
                  m.sender === 'user' ? 'bg-green-600 text-white' : 'bg-white border'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && <p className="text-xs text-gray-400 animate-pulse">Thinking...</p>}
          </div>

          <form onSubmit={sendMessage} className="p-3 border-t flex gap-2 bg-white">
            <input 
              className="flex-1 border p-2 rounded-lg text-sm outline-none focus:ring-1 focus:ring-green-500"
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder="Type here..."
            />
            <button type="submit" className="text-green-600 p-1 hover:scale-110 transition">
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}