import React from 'react';
import { Leaf, Rocket, Globe, ShieldCheck } from 'lucide-react';

export default function LandingPage({ onEnter }) {
  return (
    <div className="bg-white text-gray-900 font-sans">
      {/* Hero Section */}
      <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2 text-2xl font-bold text-green-600">
          <Leaf /> <span>EnvoX</span>
        </div>
        <button onClick={onEnter} className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-green-700 transition">
          Launch App
        </button>
      </nav>

      <section className="text-center py-20 px-6 bg-gradient-to-b from-green-50 to-white">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
          Innovating Tech for <br />
          <span className="text-green-600">Environmental Impact</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Join the Coding Ninjas CUIET 24-hour hackathon. Turn your passion for the planet into powerful, real-world solutions.
        </p>
        <div className="flex justify-center gap-4">
          <button onClick={onEnter} className="bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:transform hover:-translate-y-1 transition">
            Start Tracking Impact
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto py-20 px-6 grid md:grid-cols-3 gap-12">
        <FeatureCard icon={<Rocket className="text-blue-500" />} title="24-Hour Sprint" desc="Intensive collaboration to build MVPs that solve real-world problems." />
        <FeatureCard icon={<Globe className="text-green-500" />} title="Global Mission" desc="Addressing environmental challenges through clean code and smart logic." />
        <FeatureCard icon={<ShieldCheck className="text-purple-500" />} title="NSS Backed" desc="A collaboration between NSS Chitkara and Coding Ninjas CUIET." />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="p-8 border border-gray-100 rounded-2xl hover:shadow-xl transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500">{desc}</p>
    </div>
  );
}