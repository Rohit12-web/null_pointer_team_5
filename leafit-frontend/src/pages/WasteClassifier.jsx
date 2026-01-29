import React, { useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  Recycle, 
  Upload, 
  Camera, 
  X, 
  Search, 
  Leaf, 
  Droplets, 
  AlertTriangle,
  Package,
  Lightbulb,
  Trash2,
  LayoutDashboard,
  PlusCircle,
  Globe,
  Trophy,
  Store,
  User,
  Moon,
  Sun,
  LogOut,
  Menu,
  Loader2
} from 'lucide-react';

export default function WasteClassifier() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/log-activity', label: 'Log Activity', icon: PlusCircle },
    { path: '/impact', label: 'My Impact', icon: Globe },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/badge-store', label: 'Badge Store', icon: Store },
    { path: '/waste-classifier', label: 'Waste Classifier', icon: Recycle },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  // Theme-aware colors
  const colors = {
    bg: {
      primary: isDark ? '#1a1f1c' : '#f5faf7',
      secondary: isDark ? '#162019' : '#e8f5ec',
      card: isDark ? '#1f2d24' : '#ffffff',
      cardGradient: isDark ? 'from-[#1f2d24] to-[#1a1f1c]' : 'from-white to-[#f5faf7]',
    },
    text: {
      primary: isDark ? 'text-emerald-100' : 'text-[#1a2f1a]',
      secondary: isDark ? 'text-[#6b8f7a]' : 'text-[#3d5c47]',
      muted: isDark ? 'text-[#4a6b5c]' : 'text-[#6b8f7a]',
    },
    border: isDark ? 'border-emerald-900/50' : 'border-emerald-200',
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processFile(file);
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      setError("Please upload a valid image file");
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const classifyImage = async () => {
    if (!image) {
      setError("Please upload an image first");
      return;
    }

    if (!API_URL) {
      setError("API URL not configured");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch(`${API_URL}/classify-image/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error (${response.status})`);
      }

      const data = await response.json();

      if (!data.result) {
        throw new Error("Invalid response from server");
      }

      setResult(data.result);
    } catch (err) {
      console.error("Image classification failed:", err);
      setError(err.message || "Failed to classify image");
    } finally {
      setLoading(false);
    }
  };

  const resetClassifier = () => {
    setImage(null);
    setPreview(null);
    setResult(null);
    setError(null);
  };

  const getCategoryColor = (category) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('biodegradable') || cat.includes('organic')) {
      return 'from-green-500 to-emerald-600';
    } else if (cat.includes('recyclable')) {
      return 'from-blue-500 to-cyan-600';
    } else if (cat.includes('non-renewable') || cat.includes('hazardous')) {
      return 'from-red-500 to-orange-600';
    }
    return 'from-gray-500 to-gray-600';
  };

  const getCategoryIcon = (category) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('biodegradable') || cat.includes('organic')) {
      return <Leaf className="w-10 h-10 dark:text-white" />;
    } else if (cat.includes('recyclable')) {
      return <Recycle className="w-10 h-10 dark:text-white" />;
    } else if (cat.includes('non-renewable') || cat.includes('hazardous')) {
      return <AlertTriangle className="w-10 h-10 dark:text-white" />;
    }
    return <Package className="w-10 h-10 dark:text-white" />;
  };

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-[#1a1f1c]' : 'bg-[#f5faf7]'}`}>
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 ${isDark ? 'bg-[#162019]' : 'bg-[#e8f5ec]'} border-r ${colors.border}
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        transition-transform duration-200 ease-in-out
        flex flex-col
      `}>
        {/* Logo */}
        <div className={`h-16 flex items-center px-6 border-b ${colors.border}`}>
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-500 dark:text-white" />
            <span className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">LeafIt</span>
          </Link>
        </div>

        {/* User Info */}
        <div className={`p-4 border-b ${colors.border}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-medium shadow-lg shadow-emerald-900/30">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${colors.text.primary} truncate`}>{user?.name || 'User'}</p>
              <p className={`text-xs ${colors.text.secondary} flex items-center gap-1`}>
                <Leaf className="w-3 h-3 dark:text-white" /> {user?.total_points || 0} pts
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const IconComponent = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                      ${isActive 
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30' 
                        : `${colors.text.secondary} ${isDark ? 'hover:text-emerald-100 hover:bg-[#1f2d24]' : 'hover:text-emerald-700 hover:bg-emerald-100'}`
                      }
                    `}
                  >
                    <IconComponent className="w-5 h-5 dark:text-white" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Theme Toggle */}
        <div className={`p-4 border-t ${colors.border}`}>
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${colors.text.secondary} ${isDark ? 'hover:bg-[#1f2d24]' : 'hover:bg-emerald-100'} transition-all`}
          >
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="w-5 h-5 dark:text-white" /> : <Sun className="w-5 h-5 dark:text-white" />}
              <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
            <div className={`w-10 h-5 rounded-full ${isDark ? 'bg-emerald-600' : 'bg-emerald-300'} relative transition-colors`}>
              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${isDark ? 'left-5' : 'left-0.5'}`}></div>
            </div>
          </button>
        </div>

        {/* Logout */}
        <div className={`p-4 border-t ${colors.border}`}>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${colors.text.secondary} hover:text-red-500 ${isDark ? 'hover:bg-[#1f2d24]' : 'hover:bg-red-50'} transition-all`}
          >
            <LogOut className="w-5 h-5 dark:text-white" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className={`h-16 ${isDark ? 'bg-[#162019]' : 'bg-[#e8f5ec]'} border-b ${colors.border} flex items-center justify-between px-4 lg:px-8`}>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`lg:hidden p-2 ${colors.text.secondary} ${isDark ? 'hover:text-emerald-100' : 'hover:text-emerald-700'}`}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className={`text-lg font-semibold ${colors.text.primary}`}>Waste Classifier</h1>
              <p className={`text-xs ${colors.text.secondary}`}>AI-powered waste identification</p>
            </div>
          </div>
        </header>

        {/* Classifier Content */}
        <div className="p-4 lg:p-8 max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-2xl mb-8 bg-gradient-to-r from-emerald-600 to-teal-600 p-8 shadow-xl">
            <div className="absolute inset-0 opacity-10">
              <Recycle className="absolute top-4 right-4 w-24 h-24 dark:text-white" />
              <Leaf className="absolute bottom-4 left-4 w-16 h-16 dark:text-white" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <Recycle className="w-8 h-8 text-white" />
                <h2 className="text-3xl font-bold text-white">Waste Image Classifier</h2>
              </div>
              <p className="text-emerald-100 text-lg max-w-xl">
                Upload an image to identify whether it is biodegradable, recyclable, or non-renewable. 
                Our AI will help you dispose of waste responsibly!
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-xl p-6 ${isDark ? '' : 'shadow-sm'}`}>
              <h3 className={`text-lg font-semibold ${colors.text.primary} mb-4 flex items-center gap-2`}>
                <Upload className="w-5 h-5" /> Upload Image
              </h3>

              {/* Drag & Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                  ${dragActive 
                    ? 'border-emerald-500 bg-emerald-500/10' 
                    : `${isDark ? 'border-emerald-800/50 hover:border-emerald-600/50' : 'border-emerald-300 hover:border-emerald-400'}`
                  }
                  ${preview ? 'p-4' : 'p-8'}
                `}
                onClick={() => document.getElementById('file-input').click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full max-h-64 object-contain rounded-lg"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resetClassifier();
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Camera className={`w-12 h-12 mx-auto mb-4 ${colors.text.secondary}`} />
                    <p className={`${colors.text.primary} font-medium mb-2`}>
                      Drag & drop an image here
                    </p>
                    <p className={`${colors.text.secondary} text-sm`}>
                      or click to browse files
                    </p>
                  </>
                )}
              </div>

              {/* Classify Button */}
              <button
                onClick={classifyImage}
                disabled={loading || !image}
                className={`
                  w-full mt-6 py-3 px-6 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2
                  ${loading || !image
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-900/30 hover:shadow-xl'
                  }
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" /> Classify Image
                  </>
                )}
              </button>

              {/* Error Message */}
              {error && (
                <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-red-900/30 border border-red-800/50' : 'bg-red-50 border border-red-200'}`}>
                  <p className="text-red-500 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> {error}
                  </p>
                </div>
              )}
            </div>

            {/* Result Section */}
            <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-xl p-6 ${isDark ? '' : 'shadow-sm'}`}>
              <h3 className={`text-lg font-semibold ${colors.text.primary} mb-4 flex items-center gap-2`}>
                <Package className="w-5 h-5" /> Classification Result
              </h3>

              {result ? (
                <div className="space-y-4">
                  {/* Category Badge */}
                  <div className={`bg-gradient-to-r ${getCategoryColor(result.category)} rounded-xl p-6 text-white shadow-lg`}>
                    <div className="flex items-center gap-4">
                      {getCategoryIcon(result.category)}
                      <div>
                        <p className="text-sm opacity-80">Category</p>
                        <p className="text-2xl font-bold">{result.category}</p>
                      </div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-[#162019]' : 'bg-emerald-50'} border ${isDark ? 'border-emerald-800/30' : 'border-emerald-200'}`}>
                    <p className={`text-sm font-medium ${colors.text.secondary} mb-2 flex items-center gap-2`}>
                      <Lightbulb className="w-4 h-4" /> Explanation
                    </p>
                    <p className={`${colors.text.primary}`}>{result.explanation}</p>
                  </div>

                  {/* Disposal Tip */}
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-[#162019]' : 'bg-teal-50'} border ${isDark ? 'border-teal-800/30' : 'border-teal-200'}`}>
                    <p className={`text-sm font-medium ${colors.text.secondary} mb-2 flex items-center gap-2`}>
                      <Trash2 className="w-4 h-4" /> Disposal Tip
                    </p>
                    <p className={`${colors.text.primary}`}>{result.disposal_tip}</p>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={resetClassifier}
                    className={`w-full py-3 px-6 rounded-xl font-medium border ${isDark ? 'border-emerald-700 text-emerald-400 hover:bg-emerald-900/30' : 'border-emerald-300 text-emerald-600 hover:bg-emerald-50'} transition-all`}
                  >
                    Classify Another Image
                  </button>
                </div>
              ) : (
                <div className={`h-64 flex flex-col items-center justify-center ${colors.text.secondary}`}>
                  <Search className="w-16 h-16 mb-4 opacity-50" />
                  <p className="text-center">
                    Upload an image and click "Classify" to see the results here
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {[
              {
                icon: Leaf,
                title: 'Biodegradable',
                desc: 'Organic waste that decomposes naturally',
                color: isDark ? 'from-green-900/50 to-emerald-900/50 border-green-700' : 'from-green-50 to-emerald-50 border-green-300',
                iconColor: 'text-green-500',
              },
              {
                icon: Recycle,
                title: 'Recyclable',
                desc: 'Materials that can be processed and reused',
                color: isDark ? 'from-blue-900/50 to-cyan-900/50 border-blue-700' : 'from-blue-50 to-cyan-50 border-blue-300',
                iconColor: 'text-blue-500',
              },
              {
                icon: AlertTriangle,
                title: 'Non-Renewable',
                desc: 'Waste requiring special disposal methods',
                color: isDark ? 'from-red-900/50 to-orange-900/50 border-red-700' : 'from-red-50 to-orange-50 border-red-300',
                iconColor: 'text-red-500',
              },
            ].map((item, i) => {
              const IconComponent = item.icon;
              return (
                <div key={i} className={`bg-gradient-to-br ${item.color} border-2 rounded-xl p-5 hover:shadow-lg transition-all`}>
                  <div className="flex items-center gap-3 mb-2">
                    <IconComponent className={`w-8 h-8 ${item.iconColor} dark:text-white`} />
                    <h4 className={`font-semibold ${colors.text.primary}`}>{item.title}</h4>
                  </div>
                  <p className={`text-sm ${colors.text.secondary}`}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
