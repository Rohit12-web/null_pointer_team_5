import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      login({ name: 'Eco Warrior', email: formData.email });
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const colors = {
    bg: isDark ? 'bg-[#1a1f1c]' : 'bg-[#f5faf7]',
    card: isDark ? 'bg-[#162019]' : 'bg-white',
    input: isDark ? 'bg-[#1f2d24]' : 'bg-[#f5faf7]',
    text: {
      primary: isDark ? 'text-emerald-100' : 'text-[#1a2f1a]',
      secondary: isDark ? 'text-[#6b8f7a]' : 'text-[#3d5c47]',
    },
    border: isDark ? 'border-emerald-800/50' : 'border-emerald-200',
  };

  return (
    <div className={`min-h-screen ${colors.bg} flex items-center justify-center p-4 relative overflow-hidden`}>
      {/* Background decorations */}
      <div className={`absolute top-20 left-20 w-72 h-72 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-200/50'} rounded-full blur-3xl`}></div>
      <div className={`absolute bottom-20 right-20 w-96 h-96 ${isDark ? 'bg-teal-500/10' : 'bg-teal-200/50'} rounded-full blur-3xl`}></div>
      
      {/* Floating leaves */}
      <div className="absolute top-10 left-10 text-4xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>🍃</div>
      <div className="absolute top-1/4 right-20 text-3xl opacity-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>🌿</div>
      <div className="absolute bottom-1/4 left-1/4 text-5xl opacity-20 animate-bounce" style={{ animationDuration: '5s', animationDelay: '2s' }}>🌱</div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 p-3 rounded-full ${isDark ? 'bg-[#1f2d24]' : 'bg-white'} border ${colors.border} shadow-lg transition-all hover:scale-110`}
      >
        <span className="text-xl">{isDark ? '☀️' : '🌙'}</span>
      </button>

      <div className={`w-full max-w-md ${colors.card} rounded-2xl shadow-2xl ${isDark ? 'shadow-emerald-900/20' : 'shadow-emerald-200/50'} p-8 relative z-10 border ${colors.border}`}>
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <span className="text-4xl">🌿</span>
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">LeafIt</span>
          </Link>
          <h1 className={`text-2xl font-bold ${colors.text.primary}`}>Welcome Back</h1>
          <p className={`${colors.text.secondary} mt-2`}>Sign in to continue your eco journey</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-4 py-3 ${colors.input} border ${colors.border} rounded-xl ${colors.text.primary} placeholder-[#6b8f7a] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all`}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full px-4 py-3 ${colors.input} border ${colors.border} rounded-xl ${colors.text.primary} placeholder-[#6b8f7a] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all`}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-emerald-500 text-emerald-500 focus:ring-emerald-500" />
              <span className={`text-sm ${colors.text.secondary}`}>Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-xl font-semibold text-white transition-all ${
              isLoading
                ? 'bg-emerald-800/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-900/30 transform hover:scale-[1.02]'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Signing in...</span>
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className={`flex-1 h-px ${isDark ? 'bg-emerald-800/50' : 'bg-emerald-200'}`}></div>
          <span className={`text-sm ${colors.text.secondary}`}>or continue with</span>
          <div className={`flex-1 h-px ${isDark ? 'bg-emerald-800/50' : 'bg-emerald-200'}`}></div>
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4">
          <button className={`flex items-center justify-center gap-2 py-3 ${colors.input} border ${colors.border} rounded-xl ${colors.text.primary} hover:border-emerald-500/50 transition-all`}>
            <span>🔵</span>
            <span className="text-sm font-medium">Google</span>
          </button>
          <button className={`flex items-center justify-center gap-2 py-3 ${colors.input} border ${colors.border} rounded-xl ${colors.text.primary} hover:border-emerald-500/50 transition-all`}>
            <span>⚫</span>
            <span className="text-sm font-medium">GitHub</span>
          </button>
        </div>

        {/* Sign Up Link */}
        <p className={`text-center mt-6 ${colors.text.secondary}`}>
          Don't have an account?{' '}
          <Link to="/signup" className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
