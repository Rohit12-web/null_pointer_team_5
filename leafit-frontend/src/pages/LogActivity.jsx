import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import activityService from '../services/activityService';
import {
  LayoutDashboard,
  PlusCircle,
  Globe,
  Trophy,
  Store,
  Recycle,
  User,
  Leaf,
  Moon,
  Sun,
  LogOut,
  Menu,
  Bus,
  Lightbulb,
  Droplets,
  Salad,
  XCircle,
  CheckCircle
} from 'lucide-react';

const LogActivity = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, refreshUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [searchParams] = useSearchParams();
  const initialType = searchParams.get('type') || '';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [formData, setFormData] = useState({
    type: initialType,
    subType: '',
    description: '',
    quantity: '',
    unit: '',
    date: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [lastImpact, setLastImpact] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/log-activity', label: 'Log Activity', icon: PlusCircle },
    { path: '/impact', label: 'My Impact', icon: Globe },
    { path: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { path: '/badge-store', label: 'Badge Store', icon: Store },
    { path: '/carbon-footprint', label: 'Carbon Footprint', icon: Leaf },
    { path: '/waste-classifier', label: 'Waste Classifier', icon: Recycle },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const activityTypes = [
    {
      id: 'transport',
      icon: <Bus className="w-8 h-8 dark:text-white" />,
      name: 'Transportation',
      description: 'Public transport, cycling, walking, carpooling',
      color: 'bg-blue-500/10 border-blue-500/30 hover:border-blue-500/50',
      activeColor: 'border-blue-500 bg-blue-500/20',
      subTypes: [
        { id: 'public_transport', name: 'Public Transport', unit: 'km', impact: '0.14 kg CO₂/km saved' },
        { id: 'cycling', name: 'Cycling', unit: 'km', impact: '0.21 kg CO₂/km saved' },
        { id: 'walking', name: 'Walking', unit: 'km', impact: '0.21 kg CO₂/km saved' },
        { id: 'carpooling', name: 'Carpooling', unit: 'km', impact: '0.08 kg CO₂/km saved' },
        { id: 'electric_vehicle', name: 'Electric Vehicle', unit: 'km', impact: '0.10 kg CO₂/km saved' },
      ],
    },
    {
      id: 'electricity',
      icon: <Lightbulb className="w-8 h-8 dark:text-white" />,
      name: 'Energy Saving',
      description: 'Reduce electricity consumption',
      color: 'bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500/50',
      activeColor: 'border-yellow-500 bg-yellow-500/20',
      subTypes: [
        { id: 'led_lights', name: 'Used LED Lights', unit: 'hours', impact: '0.04 kg CO₂/hour saved' },
        { id: 'unplug_devices', name: 'Unplugged Devices', unit: 'hours', impact: '0.02 kg CO₂/hour saved' },
        { id: 'ac_reduction', name: 'Reduced AC Usage', unit: 'hours', impact: '0.15 kg CO₂/hour saved' },
        { id: 'solar_energy', name: 'Used Solar Energy', unit: 'kWh', impact: '0.5 kg CO₂/kWh saved' },
        { id: 'natural_light', name: 'Used Natural Light', unit: 'hours', impact: '0.06 kg CO₂/hour saved' },
      ],
    },
    {
      id: 'recycling',
      icon: <Recycle className="w-8 h-8 dark:text-white" />,
      name: 'Recycling & Waste',
      description: 'Reduce, reuse, and recycle waste',
      color: 'bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50',
      activeColor: 'border-emerald-500 bg-emerald-500/20',
      subTypes: [
        { id: 'plastic_recycling', name: 'Recycled Plastic', unit: 'items', impact: '0.5 kg CO₂/item saved' },
        { id: 'paper_recycling', name: 'Recycled Paper', unit: 'kg', impact: '1.0 kg CO₂/kg saved' },
        { id: 'composting', name: 'Composted Waste', unit: 'kg', impact: '0.3 kg CO₂/kg saved' },
        { id: 'reusable_bags', name: 'Used Reusable Bags', unit: 'times', impact: '0.1 kg CO₂ saved' },
        { id: 'reduced_packaging', name: 'Avoided Packaging', unit: 'items', impact: '0.2 kg CO₂/item saved' },
      ],
    },
    {
      id: 'water',
      icon: <Droplets className="w-8 h-8 dark:text-white" />,
      name: 'Water Conservation',
      description: 'Save and conserve water',
      color: 'bg-cyan-500/10 border-cyan-500/30 hover:border-cyan-500/50',
      activeColor: 'border-cyan-500 bg-cyan-500/20',
      subTypes: [
        { id: 'shorter_shower', name: 'Shorter Shower', unit: 'minutes saved', impact: '10 liters/minute saved' },
        { id: 'fix_leaks', name: 'Fixed Leaks', unit: 'times', impact: '20 liters/day saved' },
        { id: 'rainwater', name: 'Collected Rainwater', unit: 'liters', impact: 'Direct water saved' },
        { id: 'efficient_washing', name: 'Full Load Washing', unit: 'loads', impact: '50 liters/load saved' },
        { id: 'turned_off_tap', name: 'Turned Off Tap', unit: 'times', impact: '12 liters saved' },
      ],
    },
    {
      id: 'food',
      icon: <Salad className="w-8 h-8 dark:text-white" />,
      name: 'Sustainable Food',
      description: 'Plant-based and local food choices',
      color: 'bg-orange-500/10 border-orange-500/30 hover:border-orange-500/50',
      activeColor: 'border-orange-500 bg-orange-500/20',
      subTypes: [
        { id: 'plant_based_meal', name: 'Plant-Based Meal', unit: 'meals', impact: '2.5 kg CO₂/meal saved' },
        { id: 'local_food', name: 'Bought Local Food', unit: 'items', impact: '0.5 kg CO₂/item saved' },
        { id: 'no_food_waste', name: 'Zero Food Waste', unit: 'meals', impact: '0.7 kg CO₂/meal saved' },
        { id: 'homegrown', name: 'Ate Homegrown Food', unit: 'meals', impact: '1.0 kg CO₂/meal saved' },
        { id: 'seasonal_food', name: 'Ate Seasonal Food', unit: 'meals', impact: '0.3 kg CO₂/meal saved' },
      ],
    },
    {
      id: 'other',
      icon: '🌳',
      name: 'Other Activities',
      description: 'Tree planting, eco drives, and more',
      color: 'bg-purple-500/10 border-purple-500/30 hover:border-purple-500/50',
      activeColor: 'border-purple-500 bg-purple-500/20',
      subTypes: [
        { id: 'tree_planting', name: 'Planted a Tree', unit: 'trees', impact: '22 kg CO₂/year absorbed' },
        { id: 'eco_drive', name: 'Joined Eco Drive', unit: 'hours', impact: 'Community impact' },
        { id: 'awareness', name: 'Spread Awareness', unit: 'people', impact: 'Multiplied impact' },
        { id: 'cleanup', name: 'Cleanup Activity', unit: 'hours', impact: 'Environmental cleanup' },
        { id: 'donation', name: 'Eco Donation', unit: 'amount', impact: 'Supporting green causes' },
      ],
    },
  ];

  const selectedType = activityTypes.find((t) => t.id === formData.type);
  const selectedSubType = selectedType?.subTypes.find((s) => s.id === formData.subType);

  const handleTypeSelect = (typeId) => {
    setFormData({ ...formData, type: typeId, subType: '', unit: '' });
  };

  const handleSubTypeSelect = (subTypeId) => {
    const subType = selectedType?.subTypes.find((s) => s.id === subTypeId);
    setFormData({ ...formData, subType: subTypeId, unit: subType?.unit || '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const activityData = {
        type: formData.type,
        subType: formData.subType,
        name: selectedSubType?.name || formData.subType,
        quantity: formData.quantity,
        unit: formData.unit,
        notes: formData.description,
        date: formData.date,  // Include the selected date
      };
      
      const response = await activityService.logActivity(activityData);
      
      // Store the impact from the response (API returns data directly, not wrapped in .data)
      setLastImpact({
        co2_saved: response.activity.co2_saved,
        water_saved: response.activity.water_saved,
        points_earned: response.activity.points_earned,
      });
      
      setShowSuccess(true);
      
      // Dispatch custom event to notify other components (Dashboard) to refresh
      window.dispatchEvent(new CustomEvent('activityLogged', { 
        detail: { 
          activity: response.activity,
          user_stats: response.user_stats 
        } 
      }));
      
      // Refresh user data in AuthContext so all components get updated stats
      if (refreshUser) {
        refreshUser();
      }
      
      // Refresh recent activities
      fetchRecentActivities();
      
      setTimeout(() => {
        setShowSuccess(false);
        setLastImpact(null);
        setFormData({ type: '', subType: '', description: '', quantity: '', unit: '', date: new Date().toISOString().split('T')[0] });
      }, 3000);
    } catch (err) {
      console.error('Error logging activity:', err);
      setError(err.error || err.errors?.non_field_errors?.[0] || 'Failed to log activity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const response = await activityService.getActivities();
      setRecentActivities(response.activities?.slice(0, 5) || []);
    } catch (err) {
      console.error('Error fetching activities:', err);
    }
  };

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  const calculateImpact = () => {
    if (!formData.subType || !formData.quantity) return null;
    const preview = activityService.calculateImpactPreview(
      formData.type,
      formData.subType,
      formData.quantity
    );
    return preview;
  };

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
        transition-transform duration-200 ease-in-out flex flex-col
      `}>
        <div className={`h-16 flex items-center px-6 border-b ${colors.border}`}>
          <Link to="/" className="flex items-center gap-2">
            <Leaf className="w-6 h-6 text-emerald-500 dark:text-white" />
            <span className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">LeafIt</span>
          </Link>
        </div>

        <div className={`p-4 border-b ${colors.border}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white font-medium">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${colors.text.primary} truncate`}>{user?.name || 'User'}</p>
              <p className={`text-xs ${colors.text.secondary}`}>Log your activities</p>
            </div>
          </div>
        </div>

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
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                      ${isActive ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg' : `${colors.text.secondary} ${isDark ? 'hover:bg-[#1f2d24]' : 'hover:bg-emerald-100'}`}
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

        <div className={`p-4 border-t ${colors.border}`}>
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }} 
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${colors.text.secondary} hover:text-red-500 transition-all`}
          >
            <LogOut className="w-5 h-5 dark:text-white" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className="flex-1 min-w-0">
        <header className={`h-16 ${isDark ? 'bg-[#162019]' : 'bg-[#e8f5ec]'} border-b ${colors.border} flex items-center justify-between px-4 lg:px-8`}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className={`lg:hidden p-2 ${colors.text.secondary}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className={`text-lg font-semibold ${colors.text.primary}`}>Log Activity</h1>
              <p className={`text-xs ${colors.text.secondary}`}>Record your eco-friendly actions</p>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 max-w-4xl mx-auto">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-500/20 border border-red-500/30 text-red-500 px-6 py-4 rounded-xl flex items-center gap-2">
              <XCircle className="w-6 h-6 dark:text-white" />
              <span className="font-medium">{error}</span>
              <button onClick={() => setError('')} className="ml-auto hover:text-red-300">✕</button>
            </div>
          )}

          {/* Success Message */}
          {showSuccess && lastImpact && (
            <div className="mb-6 bg-emerald-500/20 border border-emerald-500/30 text-emerald-500 px-6 py-4 rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-6 h-6 dark:text-white" />
                <span className="font-medium text-lg">Activity logged successfully!</span>
              </div>
              <div className="flex items-center justify-center gap-6 text-sm">
                <span>+{lastImpact.points_earned} points</span>
                <span className="flex items-center gap-1"><Globe className="w-4 h-4 dark:text-white" /> {lastImpact.co2_saved.toFixed(2)} kg CO₂ saved</span>
                {lastImpact.water_saved > 0 && <span className="flex items-center gap-1"><Droplets className="w-4 h-4 dark:text-white" /> {lastImpact.water_saved.toFixed(1)}L water saved</span>}
              </div>
            </div>
          )}

          {/* Activity Type Selection */}
          <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-2xl p-6 mb-6 ${isDark ? '' : 'shadow-sm'}`}>
            <h2 className={`text-xl font-semibold ${colors.text.primary} mb-4`}>1. Select Activity Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {activityTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeSelect(type.id)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    formData.type === type.id
                      ? type.activeColor + ' ring-2 ring-emerald-500/30'
                      : type.color
                  }`}
                >
                  <span className="text-3xl block mb-2">{type.icon}</span>
                  <h3 className={`font-semibold ${colors.text.primary}`}>{type.name}</h3>
                  <p className={`text-xs ${colors.text.secondary} mt-1`}>{type.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Sub-type Selection */}
          {formData.type && (
            <div className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-2xl p-6 mb-6 ${isDark ? '' : 'shadow-sm'}`}>
              <h2 className={`text-xl font-semibold ${colors.text.primary} mb-4`}>2. What did you do?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedType?.subTypes.map((subType) => (
                  <button
                    key={subType.id}
                    onClick={() => handleSubTypeSelect(subType.id)}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      formData.subType === subType.id
                        ? 'border-emerald-500 bg-emerald-500/10'
                        : `${isDark ? 'border-emerald-800/30 bg-[#162019]' : 'border-emerald-200 bg-white'} hover:border-emerald-500/50`
                    }`}
                  >
                    <h3 className={`font-medium ${colors.text.primary}`}>{subType.name}</h3>
                    <p className="text-sm text-emerald-500 mt-1">{subType.impact}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Activity Details Form */}
          {formData.subType && (
            <form onSubmit={handleSubmit} className={`bg-gradient-to-b ${colors.bg.cardGradient} border ${colors.border} rounded-2xl p-6 ${isDark ? '' : 'shadow-sm'}`}>
              <h2 className={`text-xl font-semibold ${colors.text.primary} mb-4`}>3. Activity Details</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>
                    Quantity ({selectedSubType?.unit})
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className={`w-full px-4 py-3 ${isDark ? 'bg-[#162019]' : 'bg-white'} border ${isDark ? 'border-emerald-800/50' : 'border-emerald-200'} rounded-xl ${colors.text.primary} placeholder-[#6b8f7a] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all`}
                    placeholder={`Enter ${selectedSubType?.unit}`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    max={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0]}
                    className={`w-full px-4 py-3 ${isDark ? 'bg-[#162019]' : 'bg-white'} border ${isDark ? 'border-emerald-800/50' : 'border-emerald-200'} rounded-xl ${colors.text.primary} focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all`}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium ${colors.text.primary} mb-2`}>Notes (Optional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className={`w-full px-4 py-3 ${isDark ? 'bg-[#162019]' : 'bg-white'} border ${isDark ? 'border-emerald-800/50' : 'border-emerald-200'} rounded-xl ${colors.text.primary} placeholder-[#6b8f7a] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all`}
                    placeholder="Add any notes about this activity..."
                  />
                </div>
              </div>

              {/* Impact Preview */}
              {formData.quantity && calculateImpact() && (
                <div className="mt-6 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <h3 className="font-medium text-emerald-500 mb-2">Estimated Impact</h3>
                  <div className="flex flex-wrap items-center gap-6">
                    <div>
                      <span className={`text-2xl font-bold ${colors.text.primary}`}>{calculateImpact().co2_saved}</span>
                      <span className={`${colors.text.secondary} ml-1`}>kg CO₂ saved</span>
                    </div>
                    {calculateImpact().water_saved > 0 && (
                      <div>
                        <span className={`text-2xl font-bold ${colors.text.primary}`}>{calculateImpact().water_saved}</span>
                        <span className={`${colors.text.secondary} ml-1`}>L water saved</span>
                      </div>
                    )}
                    <div>
                      <span className={`text-2xl font-bold ${colors.text.primary}`}>+{calculateImpact().points}</span>
                      <span className={`${colors.text.secondary} ml-1`}>points</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`mt-6 w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                  isSubmitting
                    ? 'bg-emerald-800/50 text-emerald-300/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-900/30 transform hover:scale-[1.02]'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Logging Activity...</span>
                  </span>
                ) : (
                  'Log Activity 🌿'
                )}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default LogActivity;
