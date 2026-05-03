import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Award, Settings, Home, Ghost, Command, Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={18} /> },
    { name: 'Lessons', path: '/lessons', icon: <BookOpen size={18} /> },
    { name: 'Tests', path: '/tests', icon: <Award size={18} /> },
    { name: 'Admin', path: '/admin', icon: <Settings size={18} /> },
  ];

  return (
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 px-6 ${scrolled ? 'py-4' : 'py-8'}`}>
      <div className={`max-w-7xl mx-auto flex justify-between items-center px-8 py-4 rounded-[2rem] border transition-all duration-500 shadow-2xl shadow-black/40 ${scrolled ? 'bg-slate-950/80 backdrop-blur-2xl border-white/10' : 'bg-transparent border-transparent'}`}>
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-indigo-600 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-[0_0_20px_rgba(99,102,241,0.3)]">
             <Sparkles className="text-white" size={20} />
          </div>
          <span className="text-xl font-black tracking-tight outfit text-white uppercase tracking-[0.1em]">
            Miss <span className="text-indigo-500">Madina</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-2 items-center">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                location.pathname === item.path
                  ? 'text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {location.pathname === item.path && (
                <motion.div 
                  layoutId="nav-bg"
                  className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-xl border border-white/5"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{item.name}</span>
            </Link>
          ))}
        </div>

        {/* Desktop Join Button (Premium Accent) */}
        <div className="hidden md:block">
           <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-6 py-2.5 rounded-xl border border-indigo-400/30 transition-all active:scale-95 shadow-lg shadow-indigo-600/20">
              Get Started
           </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-3 rounded-2xl bg-white/5 border border-white/10 text-white active:scale-95 transition-all"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
             initial={{ opacity: 0, y: -20, scale: 0.95 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0, y: -20, scale: 0.95 }}
             className="absolute top-28 inset-x-6 bg-slate-950/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-3xl z-[101] md:hidden"
          >
             <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-4 p-4 rounded-2xl text-lg font-bold transition-all ${
                      location.pathname === item.path
                        ? 'bg-white/10 text-white border border-white/5'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
