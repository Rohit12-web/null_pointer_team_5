import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, error: authError, clearError } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear auth errors when component unmounts
  useEffect(() => {
    return () => {
      if (clearError) clearError();
    };
  }, [clearError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Store remember me preference
        if (rememberMe) {
          localStorage.setItem('leafit_remember_email', formData.email);
        } else {
          localStorage.removeItem('leafit_remember_email');
        }
        navigate('/dashboard');
      } else {
        setError(result.error || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load remembered email on mount
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('leafit_remember_email');
    if (rememberedEmail) {
      setFormData(prev => ({ ...prev, email: rememberedEmail }));
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="h-screen bg-[#050505] flex items-center justify-center p-8 overflow-hidden">
      <div className="w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl flex overflow-hidden">
        {/* Left Side - Dark Form */}
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#0d1117] via-[#161b22] to-[#0d1117] flex flex-col justify-center px-10 lg:px-14 py-8 border border-white/10 rounded-l-3xl relative">
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-emerald-900/10 via-transparent to-transparent rounded-l-3xl pointer-events-none"></div>
          <div className="relative z-10">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center space-x-2 mb-3">
          <span className="text-2xl">🌿</span>
          <span className="text-xl font-bold text-emerald-400">LeafIt</span>
        </Link>

        {/* Header */}
        <h1 className="text-3xl font-bold text-emerald-400 mb-1">Eco Login</h1>
        <p className="text-gray-400 text-sm mb-8">Hey enter your details to sign into your account</p>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm max-w-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
          {/* Email */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
              placeholder="Enter your username/email"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full pl-10 pr-10 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
              />
              <span className="text-gray-400 text-sm">Remember</span>
            </label>
            <Link to="/forgot-password" className="text-emerald-400 text-sm hover:text-emerald-300 transition-colors">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-full font-semibold transition-all ${
              isLoading
                ? 'bg-emerald-700 cursor-not-allowed text-emerald-300'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white transform hover:scale-[1.02] shadow-lg shadow-emerald-500/25'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Signing in...</span>
              </span>
            ) : (
              'LOGIN'
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <p className="mt-4 text-gray-400 text-sm">
          Not registered yet?{' '}
          <Link to="/signup" className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
            Create an account
          </Link>
        </p>
          </div>
      </div>

      {/* Right Side - Green Gradient with Earth/Nature Theme */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-emerald-300 via-green-400 to-teal-500 flex-col items-center justify-center p-8 relative overflow-hidden rounded-r-3xl shadow-[-10px_0_30px_rgba(0,0,0,0.3)]">
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-32 left-16 w-24 h-24 bg-white/10 rounded-full blur-xl" />
        
        {/* Welcome Text */}
        <h2 className="text-4xl font-serif italic text-gray-800 mb-1">Welcome</h2>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">to LeafIt</h3>
        
        {/* Description */}
        <p className="text-gray-700 text-center max-w-sm mb-6 leading-relaxed text-sm">
          Discover where sustainability begins. Our dedicated platform helps you track eco-friendly actions and reduce your carbon footprint. Join us for an inspiring green journey!
        </p>

        {/* Earth and Nature Illustration */}
        <div className="relative">
          {/* Main Earth */}
          <div className="text-[100px]">🌍</div>
          
          {/* Surrounding elements */}
          <div className="absolute -top-2 -left-6 text-3xl">🌱</div>
          <div className="absolute -top-1 -right-4 text-2xl">🌿</div>
          <div className="absolute -bottom-1 -left-8 text-2xl">🍃</div>
          <div className="absolute -bottom-2 -right-6 text-3xl">☘️</div>
          <div className="absolute top-1/2 -left-10 text-xl">🌳</div>
          <div className="absolute top-1/2 -right-8 text-xl">🌲</div>
        </div>

        {/* Dots indicator */}
        <div className="flex items-center space-x-2 mt-8">
          <div className="w-3 h-3 bg-white rounded-full" />
          <div className="w-2 h-2 bg-white/50 rounded-full" />
          <div className="w-2 h-2 bg-white/50 rounded-full" />
          <div className="w-2 h-2 bg-white/50 rounded-full" />
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;