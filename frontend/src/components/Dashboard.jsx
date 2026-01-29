import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Leaf, PlusCircle, Trophy, ArrowLeft } from 'lucide-react';
import Chatbot from './Chatbot'; //

export default function Dashboard({ onBack }) {
  const [actions, setActions] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', points: 10, category: 'General' });

  useEffect(() => {
    fetchActions();
  }, []);

  const fetchActions = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/actions/');
      setActions(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/api/actions/', formData);
      setFormData({ title: '', description: '', points: 10, category: 'General' });
      fetchActions();
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const totalPoints = actions.reduce((sum, action) => sum + action.points, 0);

  return (
    <div className="min-h-screen bg-green-50 p-4 md:p-8 font-sans">
      <button onClick={onBack} className="flex items-center gap-2 text-green-700 mb-6 hover:underline">
        <ArrowLeft size={20} /> Back to Landing Page
      </button>

      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 bg-white p-6 rounded-2xl shadow-sm">
          <div className="flex items-center gap-3">
            <Leaf className="text-green-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">Impact Dashboard</h1>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0 bg-yellow-100 px-4 py-2 rounded-full border border-yellow-200">
            <Trophy className="text-yellow-600" size={20} />
            <span className="font-bold text-yellow-800">{totalPoints} Points Earned</span>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-md h-fit">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <PlusCircle size={18} className="text-green-600" /> Log Action
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none" 
                placeholder="Action Title" 
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
              <textarea 
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none" 
                placeholder="Description" 
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition">
                Submit Action
              </button>
            </form>
          </div>

          {/* List */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-bold mb-4 text-gray-700">Community Feed</h2>
            <div className="grid gap-4">
              {actions.map(action => (
                <div key={action.id} className="bg-white p-5 rounded-2xl shadow-sm border-l-8 border-green-500 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-gray-800">{action.title}</h4>
                    <p className="text-gray-500 text-sm">{action.description}</p>
                  </div>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg font-bold">
                    +{action.points}
                  </span>
                </div>
              ))}
              {actions.length === 0 && <p className="text-gray-400 italic">No actions logged yet. Be the first!</p>}
            </div>
          </div>
        </div>
      </div>

      {/* --- ADDED THE CHATBOT HERE --- */}
      <Chatbot />
    </div>
  );
}