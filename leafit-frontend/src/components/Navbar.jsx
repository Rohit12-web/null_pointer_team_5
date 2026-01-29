import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-neutral-900 border-b border-neutral-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl">🌿</span>
            <span className="text-emerald-500 text-2xl font-bold">LeafIt</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-neutral-300 hover:text-emerald-400 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/log-activity"
                  className="text-neutral-300 hover:text-emerald-400 transition-colors font-medium"
                >
                  Log Activity
                </Link>
                <Link
                  to="/impact"
                  className="text-neutral-300 hover:text-emerald-400 transition-colors font-medium"
                >
                  My Impact
                </Link>
                <Link
                  to="/leaderboard"
                  className="text-neutral-300 hover:text-emerald-400 transition-colors font-medium"
                >
                  Leaderboard
                </Link>
                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-neutral-300 hover:text-emerald-400"
                  >
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-black">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="font-medium">{user?.name || 'User'}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors border border-red-500/30"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-neutral-300 hover:text-emerald-400 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-emerald-500 text-black hover:bg-emerald-400 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-neutral-300 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-neutral-800 mt-2 pt-4">
            {isAuthenticated ? (
              <div className="flex flex-col space-y-3">
                <Link
                  to="/dashboard"
                  className="text-neutral-300 hover:text-emerald-400 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/log-activity"
                  className="text-neutral-300 hover:text-emerald-400 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log Activity
                </Link>
                <Link
                  to="/impact"
                  className="text-neutral-300 hover:text-emerald-400 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Impact
                </Link>
                <Link
                  to="/leaderboard"
                  className="text-neutral-300 hover:text-emerald-400 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Leaderboard
                </Link>
                <Link
                  to="/profile"
                  className="text-neutral-300 hover:text-emerald-400 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg text-left border border-red-500/30"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link
                  to="/login"
                  className="text-neutral-300 hover:text-emerald-400 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-emerald-500 text-black px-4 py-2 rounded-lg text-center font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
