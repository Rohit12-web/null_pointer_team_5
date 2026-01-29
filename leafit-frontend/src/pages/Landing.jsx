import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Landing = () => {
  // Refs for scroll animations
  const zoomSectionRef = useRef(null);
  const zoomTextRef = useRef(null);
  const plantPotRef = useRef(null);
  const cylinderSectionRef = useRef(null);
  const cylinderRef = useRef(null);
  const textRevealRef = useRef(null);
  const parallaxSectionRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      
      // ========== EFFECT 1: ZOOM INTO TEXT ==========
      // Rotating plant pot in Why LeafIt section
      gsap.to(plantPotRef.current, {
        rotation: 360,
        scale: 1.2,
        ease: 'none',
        scrollTrigger: {
          trigger: parallaxSectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
      });

      gsap.to(zoomTextRef.current, {
        scale: 15,
        opacity: 0,
        ease: 'power2.in',
        scrollTrigger: {
          trigger: zoomSectionRef.current,
          start: 'top top',
          end: '+=150%',
          scrub: 0.5,
          pin: true,
        },
      });

      // ========== EFFECT 2: ENHANCED 3D CYLINDER CAROUSEL ==========
      gsap.to(cylinderRef.current, {
        rotateY: -360,
        ease: 'none',
        scrollTrigger: {
          trigger: cylinderSectionRef.current,
          start: 'top top',
          end: '+=200%',
          scrub: 0.8,
          pin: true,
        },
      });

      // Animate floating particles in cylinder section
      gsap.utils.toArray('.floating-particle').forEach((particle, i) => {
        gsap.to(particle, {
          y: -30 + (i * 10),
          x: Math.sin(i) * 20,
          rotation: 360,
          ease: 'none',
          scrollTrigger: {
            trigger: cylinderSectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1 + (i * 0.2),
          },
        });
      });

      // Pulsing center glow
      gsap.to('.center-glow', {
        scale: 1.3,
        opacity: 0.15,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        duration: 2,
      });

      // ========== EFFECT 3: TEXT SPLIT REVEAL ==========
      const words = gsap.utils.toArray('.reveal-word');
      gsap.from(words, {
        opacity: 0.1,
        stagger: 0.1,
        ease: 'none',
        scrollTrigger: {
          trigger: textRevealRef.current,
          start: 'top 80%',
          end: 'top 20%',
          scrub: true,
        },
      });

      // ========== EFFECT 4: PARALLAX LAYERS ==========
      gsap.to('.parallax-slow', {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: parallaxSectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      gsap.to('.parallax-fast', {
        yPercent: -60,
        ease: 'none',
        scrollTrigger: {
          trigger: parallaxSectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Reveal sections
      gsap.utils.toArray('.reveal-up').forEach((el) => {
        gsap.from(el, {
          y: 80,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
        });
      });

    });

    return () => {
      ctx.revert();
    };
  }, []);

  const features = [
    { icon: '🚌', title: 'Track Transport', desc: 'Log your eco-friendly commutes and travel choices', color: 'from-blue-500 to-cyan-500', shadowColor: 'shadow-blue-500/50' },
    { icon: '💡', title: 'Save Energy', desc: 'Monitor electricity savings and reduce your footprint', color: 'from-yellow-500 to-orange-500', shadowColor: 'shadow-yellow-500/50' },
    { icon: '♻️', title: 'Reduce Waste', desc: 'Track recycling efforts and waste reduction', color: 'from-green-500 to-emerald-500', shadowColor: 'shadow-green-500/50' },
    { icon: '🌱', title: 'Plant Based', desc: 'Log sustainable food choices and their impact', color: 'from-emerald-500 to-teal-500', shadowColor: 'shadow-emerald-500/50' },
    { icon: '💧', title: 'Save Water', desc: 'Monitor water conservation in daily activities', color: 'from-cyan-500 to-blue-500', shadowColor: 'shadow-cyan-500/50' },
  ];

  const stats = [
    { label: 'Active Users', icon: '👥' },
    { label: 'CO₂ Saved', icon: '🌿' },
    { label: 'Activities Logged', icon: '📊' },
    { label: 'Organizations', icon: '🏢' },
  ];

  const revealWords = ['Transform', 'your', 'eco-friendly', 'habits', 'into', 'measurable', 'environmental', 'impact'];

  // Marquee nodes (duplicated for seamless looping)
  const marqueeNodes = [...Array(3)].map((_, i) => (
    <div key={`m-${i}`} className="flex items-center gap-8 px-4 marquee-item">
      <span className="text-4xl md:text-6xl font-bold text-emerald-900/60 whitespace-nowrap">SMALL ACTIONS</span>
      <span className="text-emerald-600 text-2xl">●</span>
      <span className="text-4xl md:text-6xl font-bold text-emerald-900/60 whitespace-nowrap">GLOBAL IMPACT</span>
      <span className="text-emerald-600 text-2xl">●</span>
    </div>
  ));

  return (
    <div className="bg-[#1a1f1c] text-white">
      
      {/* ========== SECTION 1: ZOOM INTO TEXT ========== */}
      <section 
        ref={zoomSectionRef}
        className="h-screen flex items-center justify-center overflow-hidden relative bg-gradient-to-b from-[#0d1210] via-[#1a2a1f] to-[#1a1f1c]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.08),transparent_70%)]" />
        
        <div ref={zoomTextRef} className="text-center z-10" style={{ willChange: 'transform, opacity' }}>
          <p className="text-emerald-400/80 text-xs md:text-sm tracking-[0.4em] uppercase mb-8">
            Scroll to Enter
          </p>
          <h1 className="text-[12vw] md:text-[10vw] font-black leading-none tracking-tighter">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-emerald-100 to-slate-200">LEAF</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-400">IT</span>
          </h1>
          <p className="text-[#6b8f7a] text-sm md:text-base mt-8 tracking-widest uppercase">
            Sustainability Tracker
          </p>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 border-2 border-emerald-700/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ========== SECTION 2: INTRO & STATS ========== */}
      <section className="min-h-screen flex flex-col justify-center py-32 relative bg-[#1a1f1c]">
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Text Split Reveal */}
          <div ref={textRevealRef} className="mb-32">
            <p className="text-emerald-400 text-sm tracking-[0.3em] uppercase mb-6 reveal-up">Our Mission</p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-emerald-100 to-slate-100">
              {revealWords.map((word, i) => (
                <span key={i} className="reveal-word inline-block" style={{ marginRight: '0.3em' }}>{word}</span>
              ))}
            </h2>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 reveal-up">
            {stats.map((stat, i) => (
              <div key={i} className="text-center p-6 border border-emerald-900/50 bg-gradient-to-b from-[#1f2d24] to-[#1a1f1c] rounded-2xl hover:border-emerald-600/50 transition-all hover:shadow-lg hover:shadow-emerald-900/20">
                <span className="text-4xl mb-4 block">{stat.icon}</span>
                <div className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 tracking-wider uppercase">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTION 3: ENHANCED 3D CYLINDER CAROUSEL ========== */}
      <section ref={cylinderSectionRef} className="h-screen overflow-hidden relative bg-gradient-to-b from-[#1a1f1c] via-[#0f1612] to-[#1a1f1c]">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(52,211,153,0.12),transparent_60%)]" />
        
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="floating-particle absolute text-emerald-500/20"
              style={{
                left: `${10 + (i * 7)}%`,
                top: `${20 + (i * 5)}%`,
                fontSize: `${20 + (i % 3) * 15}px`,
              }}
            >
              {['🌿', '🍃', '✨', '💚'][i % 4]}
            </div>
          ))}
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `
            linear-gradient(rgba(52,211,153,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(52,211,153,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Section Header with enhanced styling */}
          <div className="text-center mb-16 z-20 px-4">
            <div className="inline-block mb-4">
              <p className="text-emerald-400 text-xs md:text-sm tracking-[0.3em] uppercase relative">
                <span className="absolute -left-8 top-1/2 -translate-y-1/2 w-6 h-[1px] bg-gradient-to-r from-transparent to-emerald-400"></span>
                Features
                <span className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-[1px] bg-gradient-to-l from-transparent to-emerald-400"></span>
              </p>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-emerald-100 to-slate-100 mb-3">
              Track Every Green Action
            </h2>
            <p className="text-[#6b8f7a] text-sm md:text-base max-w-xl mx-auto">
              Scroll to explore our sustainability tracking features
            </p>
          </div>
          
          {/* 3D Cylinder Container */}
          <div className="relative w-full h-[400px] md:h-[450px]" style={{ perspective: '1400px' }}>
            
            {/* Multi-layer center glow effect */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl center-glow z-0" />
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-teal-500/15 rounded-full blur-2xl z-0" />
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-emerald-400/10 rounded-full blur-xl z-0" />
            
            {/* Rotating ring decorations */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-emerald-500/5 rounded-full z-0" />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-emerald-500/10 rounded-full z-0" />
            
            {/* Rotating Cards Cylinder */}
            <div 
              ref={cylinderRef}
              className="absolute left-1/2 top-1/2 w-[180px] h-[220px] md:w-[200px] md:h-[240px] z-20"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: 'translateX(-50%) translateY(-50%)',
                willChange: 'transform'
              }}
            >
              {features.map((feature, i) => {
                const angle = (360 / features.length) * i;
                const radius = 320;
                const isHovered = hoveredCard === i;
                
                return (
                  <div 
                    key={i}
                    className="absolute w-[180px] h-[220px] md:w-[200px] md:h-[240px] transition-all duration-300"
                    style={{
                      transform: `rotateY(${angle}deg) translateZ(${radius}px) ${isHovered ? 'scale(1.05)' : 'scale(1)'}`,
                      backfaceVisibility: 'hidden',
                    }}
                    onMouseEnter={() => setHoveredCard(i)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className={`
                      w-full h-full rounded-2xl
                      bg-gradient-to-b from-[#1f2d24]/95 to-[#162019]/95 
                      backdrop-blur-sm p-6 
                      flex flex-col items-center justify-center text-center 
                      border border-emerald-600/30 
                      shadow-2xl shadow-black/40
                      hover:border-emerald-400/60
                      hover:shadow-emerald-500/20
                      transition-all duration-300
                      relative overflow-hidden
                      group
                    `}>
                      {/* Shine effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      {/* Top accent line */}
                      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${feature.color} opacity-50`} />
                      
                      {/* Icon container with enhanced effects */}
                      <div className={`
                        relative w-16 h-16 md:w-18 md:h-18 rounded-xl 
                        bg-gradient-to-br ${feature.color} 
                        flex items-center justify-center mb-4 
                        shadow-lg ${feature.shadowColor}
                        group-hover:shadow-xl
                        transition-all duration-300
                        group-hover:scale-110
                      `}>
                        <span className="text-3xl md:text-4xl filter drop-shadow-lg">{feature.icon}</span>
                        {/* Icon glow */}
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.color} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
                      </div>
                      
                      <h3 className="text-base md:text-lg font-bold mb-2 text-emerald-100 group-hover:text-emerald-50 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-[#6b8f7a] text-xs md:text-sm leading-relaxed group-hover:text-[#7fa08c] transition-colors">
                        {feature.desc}
                      </p>
                      
                      {/* Bottom decorative element */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent rounded-full" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Enhanced scroll hint with animation */}
          <div className="text-center mt-12 z-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-900/20 border border-emerald-700/30">
              <span className="text-emerald-400/60 text-xs animate-pulse">↓</span>
              <p className="text-[#6b8f7a] text-xs tracking-wider">Scroll to rotate</p>
              <span className="text-emerald-400/60 text-xs animate-pulse">↓</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SECTION 4: PARALLAX SECTION ========== */}
      <section ref={parallaxSectionRef} className="min-h-screen relative overflow-hidden py-32 bg-gradient-to-b from-[#1a1f1c] via-[#162019] to-[#1a1f1c]">
        {/* Parallax Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="parallax-slow absolute top-20 left-[10%] text-[200px] opacity-5">🌿</div>
          <div className="parallax-fast absolute top-40 right-[15%] text-[150px] opacity-5">🌍</div>
          <div className="parallax-slow absolute bottom-20 left-[20%] text-[180px] opacity-5">🍃</div>
          <div className="parallax-fast absolute bottom-40 right-[25%] text-[120px] opacity-5">♻️</div>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="reveal-up relative">
              {/* Revolving Plant Pot */}
              <div 
                ref={plantPotRef}
                className="absolute -right-20 top-1/2 -translate-y-1/2 text-[180px] md:text-[220px] opacity-20 select-none pointer-events-none z-0"
                style={{ willChange: 'transform' }}
              >
                🪴
              </div>
              
              <p className="text-emerald-400 text-sm tracking-[0.3em] uppercase mb-4 relative z-10">Why LeafIt?</p>
              <h2 className="text-4xl md:text-6xl font-bold mb-8 relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-emerald-100 to-slate-100">
                Making sustainability
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400"> visible</span>
              </h2>
              <p className="text-[#8aa896] text-lg leading-relaxed mb-8 relative z-10">
                LeafIt transforms your daily eco-friendly choices into quantifiable impact metrics. 
                Watch your contribution grow, compete with friends, and celebrate every sustainable win.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-[#1f2d24] border border-emerald-800/50 px-4 py-2 rounded-full">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  <span className="text-sm text-emerald-100">Carbon Tracking</span>
                </div>
                <div className="flex items-center gap-2 bg-[#1f2d24] border border-emerald-800/50 px-4 py-2 rounded-full">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  <span className="text-sm text-emerald-100">Gamification</span>
                </div>
                <div className="flex items-center gap-2 bg-[#1f2d24] border border-emerald-800/50 px-4 py-2 rounded-full">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                  <span className="text-sm text-emerald-100">Leaderboards</span>
                </div>
              </div>
            </div>
            <div className="reveal-up">
              <div className="aspect-square bg-gradient-to-br from-[#1f2d24] to-[#162019] border border-emerald-700/30 rounded-3xl flex items-center justify-center relative overflow-hidden shadow-2xl shadow-black/30">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(52,211,153,0.15),transparent_70%)]"></div>
                <span className="text-[140px] md:text-[180px] relative z-10">🌍</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SECTION 5: CTA ========== */}
      <section className="py-32 relative overflow-hidden bg-gradient-to-b from-[#1a2f24] via-[#1f3429] to-[#162019]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(52,211,153,0.15),transparent_50%)]" />
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 reveal-up">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-emerald-100 to-slate-100">
            Start your journey
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400"> today</span>
          </h2>
          <p className="text-[#8aa896] text-xl mb-12 max-w-2xl mx-auto">
            Join thousands of people making a measurable difference for our planet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white px-10 py-5 text-sm tracking-wider uppercase font-semibold transition-all duration-300 rounded-full shadow-lg shadow-emerald-900/40"
            >
              Get Started Free
              <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/login"
              className="border-2 border-emerald-600/50 hover:border-emerald-400 hover:bg-emerald-900/30 text-emerald-100 px-10 py-5 text-sm tracking-wider uppercase font-medium transition-all duration-300 rounded-full"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="py-6 border-y border-emerald-900/50 overflow-hidden bg-[#0d1210]">
        <div className="marquee-container">
          <div className="marquee-content" aria-hidden="false">
            {marqueeNodes}
            {marqueeNodes.map((node, i) => (
              <div key={`m-dup-${i}`} className="flex items-center gap-8 px-4 marquee-item">
                <span className="text-4xl md:text-6xl font-bold text-emerald-900/60 whitespace-nowrap">SMALL ACTIONS</span>
                <span className="text-emerald-600 text-2xl">●</span>
                <span className="text-4xl md:text-6xl font-bold text-emerald-900/60 whitespace-nowrap">GLOBAL IMPACT</span>
                <span className="text-emerald-600 text-2xl">●</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-emerald-900/50 bg-[#0d1210]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌿</span>
              <span className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">LeafIt</span>
            </div>
            <div className="flex gap-8 text-[#6b8f7a] text-sm">
              <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</Link>
              <Link to="/leaderboard" className="hover:text-emerald-400 transition-colors">Leaderboard</Link>
              <Link to="/impact" className="hover:text-emerald-400 transition-colors">Impact</Link>
              <Link to="/profile" className="hover:text-emerald-400 transition-colors">Profile</Link>
            </div>
            <p className="text-[#4a6b5c] text-sm">© 2026 LeafIt</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
