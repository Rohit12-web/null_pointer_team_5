import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup(formData.name, formData.email, formData.password, formData.confirmPassword);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-[#050505] flex items-center justify-center p-8 overflow-hidden">
      <div className="w-full max-w-5xl h-[90vh] bg-[#0a0a0a]/90 backdrop-blur-sm rounded-3xl border border-white/5 shadow-2xl flex overflow-hidden">
        {/* Left Side - Dark Form */}
        <div className="w-full lg:w-1/2 bg-[#111111]/80 flex flex-col justify-center px-10 lg:px-14 py-6 overflow-y-auto">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center space-x-2 mb-2">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold text-emerald-400">LeafIt</span>
          </Link>

          {/* Header */}
          <h1 className="text-3xl font-bold text-emerald-400 mb-1">Eco Signup</h1>
          <p className="text-gray-400 text-sm mb-6">Join our eco-friendly community today</p>

          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg text-sm max-w-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3 max-w-sm">
            {/* Name */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                placeholder="Enter your email"
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
                className="w-full pl-10 pr-10 py-2.5 bg-gray-800/50 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                placeholder="Create password"
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

            {/* Confirm Password */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-800/50 border border-gray-700 rounded-full text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm"
                placeholder="Confirm password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showConfirmPassword ? (
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

            {/* Terms & Conditions */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 mt-0.5"
              />
              <span className="text-gray-400 text-xs leading-relaxed">
                I agree to the{' '}
                <Link to="/terms" className="text-emerald-400 hover:text-emerald-300">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-emerald-400 hover:text-emerald-300">
                  Privacy Policy
                </Link>
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2.5 rounded-full font-semibold transition-all ${
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
                  <span>Creating account...</span>
                </span>
              ) : (
                'CREATE ACCOUNT'
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-4 text-gray-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
              Sign in
            </Link>
          </p>
        </div>

        {/* Right Side - Dark Theme with Earth Image */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-[#0d1f1a] via-[#0a1612] to-[#050505] flex-col items-center justify-center p-8 relative overflow-hidden rounded-r-3xl">
          {/* Decorative glowing circles */}
          <div className="absolute top-20 right-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-32 left-16 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-400/5 rounded-full blur-3xl" />
          
          {/* Welcome Text */}
          <h2 className="text-4xl font-serif italic text-emerald-400 mb-1 z-10">Join Us</h2>
          <h3 className="text-2xl font-semibold text-white mb-6 z-10">Start Your Journey</h3>
          
          {/* Earth Recycle Image */}
          <div className="relative z-10 mb-6">
            <div className="w-48 h-48 relative">
              {/* Glowing ring behind earth */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-emerald-400/20 rounded-full blur-xl animate-pulse" />
              
              {/* Earth SVG */}
              <svg viewBox="0 0 512 512" className="w-full h-full drop-shadow-2xl">
                {/* Background circle */}
                <circle cx="256" cy="256" r="200" fill="#87CEEB" stroke="#4A90D9" strokeWidth="8"/>
                
                {/* Continents */}
                <path d="M180 120 Q200 100 240 110 Q280 120 300 150 Q310 180 290 200 Q260 210 230 190 Q200 170 180 140 Q170 120 180 120" fill="#7EC850"/>
                <path d="M320 180 Q360 170 380 200 Q400 240 380 280 Q350 300 320 280 Q300 250 310 220 Q315 190 320 180" fill="#7EC850"/>
                <path d="M140 220 Q160 200 200 210 Q230 230 220 270 Q200 300 160 290 Q130 270 140 220" fill="#7EC850"/>
                <path d="M250 280 Q290 270 320 300 Q340 340 310 370 Q270 390 240 360 Q220 320 250 280" fill="#7EC850"/>
                <path d="M160 340 Q190 320 220 340 Q240 370 210 400 Q170 410 150 380 Q145 355 160 340" fill="#7EC850"/>
                
                {/* Recycling arrows */}
                <g transform="translate(256, 256)">
                  {/* Arrow 1 - Top */}
                  <path d="M-20 -160 L0 -190 L20 -160 L5 -160 L5 -120 L-5 -120 L-5 -160 Z" fill="#4A90D9" transform="rotate(0)">
                    <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="8s" repeatCount="indefinite"/>
                  </path>
                  {/* Arrow 2 - Bottom Right */}
                  <path d="M-20 -160 L0 -190 L20 -160 L5 -160 L5 -120 L-5 -120 L-5 -160 Z" fill="#4A90D9" transform="rotate(120)">
                    <animateTransform attributeName="transform" type="rotate" from="120" to="480" dur="8s" repeatCount="indefinite"/>
                  </path>
                  {/* Arrow 3 - Bottom Left */}
                  <path d="M-20 -160 L0 -190 L20 -160 L5 -160 L5 -120 L-5 -120 L-5 -160 Z" fill="#4A90D9" transform="rotate(240)">
                    <animateTransform attributeName="transform" type="rotate" from="240" to="600" dur="8s" repeatCount="indefinite"/>
                  </path>
                </g>
                
                {/* Curved arrows around earth */}
                <path d="M80 256 Q80 150 180 100" fill="none" stroke="#4A90D9" strokeWidth="12" strokeLinecap="round"/>
                <path d="M180 100 L165 130 M180 100 L150 105" stroke="#4A90D9" strokeWidth="12" strokeLinecap="round"/>
                
                <path d="M432 256 Q432 362 332 412" fill="none" stroke="#4A90D9" strokeWidth="12" strokeLinecap="round"/>
                <path d="M332 412 L347 382 M332 412 L362 407" stroke="#4A90D9" strokeWidth="12" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          
          {/* Description */}
          <p className="text-gray-400 text-center max-w-xs leading-relaxed text-sm z-10">
            Be part of the change! Create your account to start tracking your eco-friendly activities.
          </p>

          {/* Dots indicator */}
          <div className="flex items-center space-x-2 mt-8 z-10">
            <div className="w-2 h-2 bg-emerald-400/30 rounded-full" />
            <div className="w-3 h-3 bg-emerald-400 rounded-full" />
            <div className="w-2 h-2 bg-emerald-400/30 rounded-full" />
            <div className="w-2 h-2 bg-emerald-400/30 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;