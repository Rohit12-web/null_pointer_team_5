import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      login({ name: formData.name, email: formData.email });
      navigate('/dashboard');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: '🌍', title: 'Track Impact', description: 'Monitor your CO₂ savings' },
    { icon: '🏆', title: 'Earn Rewards', description: 'Get points for eco actions' },
    { icon: '📊', title: 'See Progress', description: 'Visualize your journey' },
    { icon: '🌱', title: 'Join Community', description: 'Connect with eco warriors' },
  ];

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
    <div className={`min-h-screen ${colors.bg} flex relative overflow-hidden`}>
      {/* Background decorations */}
      <div className={`absolute top-20 left-20 w-72 h-72 ${isDark ? 'bg-emerald-500/10' : 'bg-emerald-200/50'} rounded-full blur-3xl`}></div>
      <div className={`absolute bottom-20 right-20 w-96 h-96 ${isDark ? 'bg-teal-500/10' : 'bg-teal-200/50'} rounded-full blur-3xl`}></div>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`absolute top-4 right-4 z-20 p-3 rounded-full ${isDark ? 'bg-[#1f2d24]' : 'bg-white'} border ${colors.border} shadow-lg transition-all hover:scale-110`}
      >
        <span className="text-xl">{isDark ? '☀️' : '🌙'}</span>
      </button>

      {/* Left Side - Features */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative">
        <div className="max-w-md">
          <Link to="/" className="inline-flex items-center gap-2 mb-8">
            <span className="text-5xl">🌿</span>
            <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">LeafIt</span>
          </Link>
          
          <h2 className={`text-3xl font-bold ${colors.text.primary} mb-4`}>
            Start Your Eco Journey Today
          </h2>
          <p className={`${colors.text.secondary} mb-8`}>
            Join thousands of eco-warriors making a real difference for our planet.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <div key={i} className={`${colors.card} border ${colors.border} rounded-xl p-4 ${isDark ? '' : 'shadow-sm'}`}>
                <span className="text-2xl mb-2 block">{feature.icon}</span>
                <h3 className={`font-semibold ${colors.text.primary}`}>{feature.title}</h3>
                <p className={`text-sm ${colors.text.secondary}`}>{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-8 flex gap-8">
            <div>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">50K+</div>
              <div className={`text-sm ${colors.text.secondary}`}>Active Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">2.5M</div>
              <div className={`text-sm ${colors.text.secondary}`}>kg CO₂ Saved</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">100+</div>
              <div className={`text-sm ${colors.text.secondary}`}>Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-12">
        <div className={`w-full max-w-md ${colors.card} rounded-2xl shadow-2xl ${isDark ? 'shadow-emerald-900/20' : 'shadow-emerald-200/50'} p-8 border ${colors.border}`}>
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-6">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="text-3xl">🌿</span>
              <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">LeafIt</span>
            </Link>
          </div>

          <h1 className={`text-2xl font-bold ${colors.text.primary} text-center`}>Create Account</h1>
          <p className={`${colors.text.secondary} text-center mt-2 mb-6`}>Join the eco-friendly community</p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 ${colors.input} border ${colors.border} rounded-xl ${colors.text.primary} placeholder-[#6b8f7a] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all`}
                placeholder="John Doe"
                required
              />
            </div>

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

            <div>
              <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className={`w-full px-4 py-3 ${colors.input} border ${colors.border} rounded-xl ${colors.text.primary} placeholder-[#6b8f7a] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all`}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" className="mt-1 w-4 h-4 rounded border-emerald-500 text-emerald-500 focus:ring-emerald-500" required />
              <span className={`text-sm ${colors.text.secondary}`}>
                I agree to the{' '}
                <Link to="/terms" className="text-emerald-500 hover:text-emerald-400">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-emerald-500 hover:text-emerald-400">Privacy Policy</Link>
              </span>
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
                  <span>Creating account...</span>
                </span>
              ) : (
                'Create Account 🌱'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className={`flex-1 h-px ${isDark ? 'bg-emerald-800/50' : 'bg-emerald-200'}`}></div>
            <span className={`text-sm ${colors.text.secondary}`}>or</span>
            <div className={`flex-1 h-px ${isDark ? 'bg-emerald-800/50' : 'bg-emerald-200'}`}></div>
          </div>

          {/* Social Signup */}
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

          {/* Login Link */}
          <p className={`text-center mt-6 ${colors.text.secondary}`}>
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-500 hover:text-emerald-400 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
