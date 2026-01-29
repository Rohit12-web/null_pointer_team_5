import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const BadgeStore = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [userBadges, setUserBadges] = useState(5); // User's available badges for exchange

  // Brand advertisement slides
  const brandSlides = [
    {
      id: 1,
      brand: 'EcoMart',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=300&fit=crop&q=80',
      tagline: 'Shop Sustainably, Live Responsibly',
      discount: '20% OFF',
    },
    {
      id: 2,
      brand: 'GreenRide',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=300&fit=crop&q=80',
      tagline: 'Eco-Friendly Transportation',
      discount: 'Free Trial',
    },
    {
      id: 3,
      brand: 'OrganicBite',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=300&fit=crop&q=80',
      tagline: 'Fresh, Organic, Delivered',
      discount: '15% OFF',
    },
    {
      id: 4,
      brand: 'SolarTech',
      image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=300&fit=crop&q=80',
      tagline: 'Power Your Home with Sunshine',
      discount: '₹8000 Credit',
    },
    {
      id: 5,
      brand: 'EcoFashion',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&h=300&fit=crop&q=80',
      tagline: 'Sustainable Style, Ethical Fashion',
      discount: '25% OFF',
    },
  ];

  // Available coupons for badge exchange
  const coupons = [
    {
      id: 1,
      brand: 'EcoMart',
      title: '20% Off Your Next Purchase',
      description: 'Valid on all eco-friendly products',
      badgeCost: 2,
      originalValue: '₹1200',
      expiresIn: '30 days',
      category: 'Shopping',
      color: 'from-[#44a08d] to-[#093637]',
    },
    {
      id: 2,
      brand: 'GreenRide',
      title: 'Free 1-Week Bike Rental',
      description: 'Explore the city sustainably',
      badgeCost: 3,
      originalValue: '₹4000',
      expiresIn: '60 days',
      category: 'Transport',
      color: 'from-[#44a08d] to-[#093637]',
    },
    {
      id: 3,
      brand: 'OrganicBite',
      title: '15% Off Meal Plan',
      description: 'First month of organic meal delivery',
      badgeCost: 2,
      originalValue: '₹1600',
      expiresIn: '14 days',
      category: 'Food',
      color: 'from-[#44a08d] to-[#093637]',
    },
    {
      id: 4,
      brand: 'SolarTech',
      title: '₹8000 Installation Credit',
      description: 'Towards solar panel installation',
      badgeCost: 5,
      originalValue: '₹8000',
      expiresIn: '90 days',
      category: 'Energy',
      color: 'from-[#44a08d] to-[#093637]',
    },
    {
      id: 5,
      brand: 'EcoFashion',
      title: '25% Off Sustainable Clothing',
      description: 'On any item from the eco collection',
      badgeCost: 2,
      originalValue: '₹2000',
      expiresIn: '45 days',
      category: 'Fashion',
      color: 'from-[#44a08d] to-[#093637]',
    },
    {
      id: 6,
      brand: 'PlantBox',
      title: 'Free Plant Starter Kit',
      description: 'Includes seeds, soil, and pot',
      badgeCost: 1,
      originalValue: '₹1200',
      expiresIn: '30 days',
      category: 'Garden',
      color: 'from-[#44a08d] to-[#093637]',
    },
    {
      id: 7,
      brand: 'WaterSave',
      title: 'Smart Water Meter Discount',
      description: '30% off smart water monitoring',
      badgeCost: 3,
      originalValue: '₹3600',
      expiresIn: '60 days',
      category: 'Home',
      color: 'from-[#44a08d] to-[#093637]',
    },
    {
      id: 8,
      brand: 'RecycleHub',
      title: 'Premium Recycling Bins Set',
      description: 'Color-coded sorting bins',
      badgeCost: 2,
      originalValue: '₹2400',
      expiresIn: '45 days',
      category: 'Home',
      color: 'from-[#44a08d] to-[#093637]',
    },
  ];

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/log-activity', label: 'Log Activity', icon: '➕' },
    { path: '/impact', label: 'My Impact', icon: '🌍' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { path: '/badge-store', label: 'Badge Store', icon: '🏪' },
    { path: '/profile', label: 'Profile', icon: '👤' },
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % brandSlides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % brandSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + brandSlides.length) % brandSlides.length);
  };

  const handleRedeem = (coupon) => {
    if (userBadges >= coupon.badgeCost) {
      setSelectedBadge(coupon);
      setShowRedeemModal(true);
    }
  };

  const confirmRedeem = () => {
    if (selectedBadge && userBadges >= selectedBadge.badgeCost) {
      setUserBadges(prev => prev - selectedBadge.badgeCost);
      setShowRedeemModal(false);
      setSelectedBadge(null);
      // Show success message or notification
    }
  };

  // Theme-aware colors
  const colors = {
    bg: {
      primary: isDark ? '#1a1f1c' : '#f5faf7',
      secondary: isDark ? '#162019' : '#e8f5ec',
      card: isDark ? '#1f2d24' : '#ffffff',
    },
    text: {
      primary: isDark ? 'text-emerald-100' : 'text-[#1a2f1a]',
      secondary: isDark ? 'text-[#6b8f7a]' : 'text-[#3d5c47]',
      muted: isDark ? 'text-[#4a6b5c]' : 'text-[#6b8f7a]',
    },
    border: isDark ? 'border-emerald-900/50' : 'border-emerald-200',
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
            <span className="text-2xl">🌿</span>
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
              <p className={`text-xs ${colors.text.secondary}`}>Eco Warrior</p>
            </div>
          </div>
          
          {/* Badge Balance */}
          <div className={`mt-4 p-3 rounded-lg ${isDark ? 'bg-[#1f2d24]' : 'bg-white'} border ${colors.border}`}>
            <div className="flex items-center justify-between">
              <span className={`text-xs ${colors.text.secondary}`}>Your Badges</span>
              <div className="flex items-center gap-1">
                <span className="text-lg">🏅</span>
                <span className={`text-lg font-bold ${colors.text.primary}`}>{userBadges}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
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
                    <span className="text-lg">{item.icon}</span>
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
              <span className="text-lg">{isDark ? '🌙' : '☀️'}</span>
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
            <span className="text-lg">🚪</span>
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
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className={`text-lg font-semibold ${colors.text.primary}`}>Badge Store</h1>
              <p className={`text-xs ${colors.text.secondary}`}>Exchange badges for exclusive rewards</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 ${isDark ? 'bg-[#1f2d24]' : 'bg-white'} border ${colors.border} rounded-lg`}>
              <span className="text-lg">🏅</span>
              <span className={`font-semibold ${colors.text.primary}`}>{userBadges} Badges</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 lg:p-8 space-y-8">
          
          {/* Brand Slider */}
          <section className="relative">
            <div className="overflow-hidden rounded-2xl shadow-xl">
              <div 
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {brandSlides.map((slide) => (
                  <div 
                    key={slide.id}
                    className="min-w-full relative h-48 md:h-64"
                  >
                    <img 
                      src={slide.image} 
                      alt={slide.brand}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                    <div className="absolute inset-0 flex items-end justify-between px-8 md:px-16 pb-6">
                      <div className="text-white">
                        <span className="text-2xl md:text-3xl font-bold">{slide.brand}</span>
                        <p className="text-base md:text-lg opacity-90 mt-1">{slide.tagline}</p>
                      </div>
                      <div className="text-right">
                        <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl">
                          <p className="text-white text-2xl md:text-3xl font-bold">{slide.discount}</p>
                          <p className="text-white/80 text-sm">With Badges</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Slider Controls */}
              <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {brandSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentSlide === index ? 'bg-white w-6' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className={`p-6 rounded-xl ${isDark ? 'bg-[#1f2d24]' : 'bg-white'} border ${colors.border}`}>
            <h2 className={`text-xl font-semibold ${colors.text.primary} mb-4`}>How Badge Exchange Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xl font-bold shrink-0">1</div>
                <div>
                  <h3 className={`font-semibold ${colors.text.primary}`}>Earn Badges</h3>
                  <p className={`text-sm ${colors.text.secondary}`}>Complete eco-friendly activities to earn badges and rewards</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xl font-bold shrink-0">2</div>
                <div>
                  <h3 className={`font-semibold ${colors.text.primary}`}>Choose Coupon</h3>
                  <p className={`text-sm ${colors.text.secondary}`}>Browse exclusive coupons from our partner brands</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xl font-bold shrink-0">3</div>
                <div>
                  <h3 className={`font-semibold ${colors.text.primary}`}>Redeem & Save</h3>
                  <p className={`text-sm ${colors.text.secondary}`}>Exchange badges for coupons and enjoy your savings</p>
                </div>
              </div>
            </div>
          </section>

          {/* Available Coupons */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-semibold ${colors.text.primary}`}>Available Coupons</h2>
              <div className={`text-sm ${colors.text.secondary}`}>
                You have <span className={`font-semibold ${colors.text.primary}`}>{userBadges} badges</span> to spend
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {coupons.map((coupon) => {
                const canAfford = userBadges >= coupon.badgeCost;
                return (
                  <div 
                    key={coupon.id}
                    className={`rounded-xl overflow-hidden ${isDark ? 'bg-[#1f2d24]' : 'bg-white'} border ${colors.border} transition-all hover:shadow-xl hover:scale-[1.02] ${!canAfford ? 'opacity-60' : ''}`}
                  >
                    {/* Coupon Header */}
                    <div className={`bg-gradient-to-r ${coupon.color} p-4`}>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-lg">{coupon.brand}</span>
                        <div className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-medium">
                          {coupon.category}
                        </div>
                      </div>
                    </div>
                    
                    {/* Coupon Body */}
                    <div className="p-4">
                      <h3 className={`font-semibold ${colors.text.primary} mb-1`}>{coupon.title}</h3>
                      <p className={`text-sm ${colors.text.secondary} mb-4`}>{coupon.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className={`text-xs ${colors.text.muted}`}>Value</p>
                          <p className={`font-semibold ${colors.text.primary}`}>{coupon.originalValue}</p>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs ${colors.text.muted}`}>Expires in</p>
                          <p className={`text-sm ${colors.text.secondary}`}>{coupon.expiresIn}</p>
                        </div>
                      </div>
                      
                      {/* Cost & Redeem */}
                      <div className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-[#162019]' : 'bg-[#f5faf7]'}`}>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${colors.text.primary}`}>{coupon.badgeCost}</span>
                          <span className={`text-sm ${colors.text.secondary}`}>badges</span>
                        </div>
                        <button
                          onClick={() => handleRedeem(coupon)}
                          disabled={!canAfford}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            canAfford 
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-900/30' 
                              : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                          }`}
                        >
                          {canAfford ? 'Redeem' : 'Not Enough'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Partner Brands */}
          <section className={`p-6 rounded-xl ${isDark ? 'bg-[#1f2d24]' : 'bg-white'} border ${colors.border}`}>
            <h2 className={`text-xl font-semibold ${colors.text.primary} mb-4`}>Our Partner Brands</h2>
            <div className="flex flex-wrap items-center justify-center gap-8">
              {brandSlides.map((brand) => (
                <div 
                  key={brand.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDark ? 'bg-[#162019]' : 'bg-[#f5faf7]'} border ${colors.border} hover:border-emerald-500 transition-all cursor-pointer`}
                >
                  <span className={`font-medium ${colors.text.primary}`}>{brand.brand}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Redeem Modal */}
      {showRedeemModal && selectedBadge && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`w-full max-w-md rounded-2xl ${isDark ? 'bg-[#1f2d24]' : 'bg-white'} p-6 shadow-2xl`}>
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-3xl font-bold text-white mb-4">
                {selectedBadge.brand.charAt(0)}
              </div>
              <h3 className={`text-xl font-bold ${colors.text.primary}`}>Confirm Redemption</h3>
              <p className={`text-sm ${colors.text.secondary} mt-2`}>
                You are about to redeem <strong>{selectedBadge.badgeCost} badges</strong> for:
              </p>
            </div>
            
            <div className={`p-4 rounded-lg ${isDark ? 'bg-[#162019]' : 'bg-[#f5faf7]'} mb-6`}>
              <h4 className={`font-semibold ${colors.text.primary}`}>{selectedBadge.title}</h4>
              <p className={`text-sm ${colors.text.secondary}`}>{selectedBadge.brand}</p>
              <p className={`text-sm ${colors.text.muted} mt-2`}>Value: {selectedBadge.originalValue}</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowRedeemModal(false)}
                className={`flex-1 px-4 py-3 rounded-lg font-medium ${isDark ? 'bg-[#162019] text-emerald-100' : 'bg-gray-100 text-gray-700'} hover:opacity-80 transition-all`}
              >
                Cancel
              </button>
              <button
                onClick={confirmRedeem}
                className="flex-1 px-4 py-3 rounded-lg font-medium bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 transition-all shadow-lg shadow-emerald-900/30"
              >
                Confirm Redeem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeStore;
