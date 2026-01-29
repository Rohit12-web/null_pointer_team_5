import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  const features = [
    {
      icon: '🚌',
      title: 'Track Activities',
      description: 'Log eco-friendly actions like using public transport, saving electricity, and reducing plastic.',
    },
    {
      icon: '📊',
      title: 'Measure Impact',
      description: 'See your carbon footprint reduction, energy savings, and waste reduction in real-time.',
    },
    {
      icon: '🏆',
      title: 'Earn Rewards',
      description: 'Collect points, unlock badges, and compete on leaderboards with friends and community.',
    },
    {
      icon: '🌍',
      title: 'Global Impact',
      description: 'Join a worldwide community making measurable environmental change together.',
    },
  ];

  const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '2.5M', label: 'kg CO₂ Saved' },
    { value: '100K+', label: 'Activities Logged' },
    { value: '500+', label: 'Organizations' },
  ];

  const activities = [
    { icon: '🚌', name: 'Public Transport', impact: 'Save 2.6 kg CO₂ per trip' },
    { icon: '💡', name: 'Save Electricity', impact: 'Reduce 0.5 kg CO₂ per kWh' },
    { icon: '♻️', name: 'Recycle Waste', impact: 'Divert 2 kg from landfill' },
    { icon: '🚴', name: 'Cycle to Work', impact: 'Zero emissions commute' },
    { icon: '🥗', name: 'Plant-based Meal', impact: 'Save 3 kg CO₂ per meal' },
    { icon: '💧', name: 'Save Water', impact: 'Conserve 50 liters daily' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-500 to-emerald-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="absolute top-20 left-10 text-8xl opacity-20 animate-bounce">🌿</div>
        <div className="absolute bottom-20 right-10 text-8xl opacity-20 animate-pulse">🌍</div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Small Actions.
              <span className="block text-yellow-300">Global Impact.</span>
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              LeafIt transforms your eco-friendly habits into measurable environmental change. 
              Track, visualize, and celebrate your contribution to a sustainable future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Start Your Journey 🌱
              </Link>
              <Link
                to="/login"
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 rounded-full font-bold text-lg transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="white">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-600">{stat.value}</div>
                <div className="text-gray-600 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How LeafIt Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Turn your daily sustainable choices into visible, rewarding achievements
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1 duration-300"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Track Your Green Actions
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every action counts. Log activities and see their real environmental impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
              >
                <span className="text-4xl mr-4">{activity.icon}</span>
                <div>
                  <h4 className="font-semibold text-gray-800">{activity.name}</h4>
                  <p className="text-sm text-green-600">{activity.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of individuals, organizations, and communities 
            tracking their environmental impact with LeafIt.
          </p>
          <Link
            to="/signup"
            className="inline-block bg-white text-green-600 hover:bg-green-50 px-10 py-4 rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <span className="text-3xl">🌿</span>
              <span className="text-2xl font-bold">LeafIt</span>
            </div>
            <p className="text-gray-400">
              © 2026 LeafIt. Making sustainability visible and rewarding.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
