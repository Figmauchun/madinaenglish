import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home as HomeIcon, 
  BookOpen, 
  Trophy, 
  Settings, 
  Search, 
  User, 
  Library as LibraryIcon,
  BookMarked,
  FileText,
  BarChart3,
  LogOut,
  Moon,
  Sun,
  Globe,
  MoreVertical,
  ChevronRight,
  Download,
  Shield,
  Bell,
  CheckCircle2,
  AlertCircle,
  X,
  Languages,
  ChevronDown,
  Menu
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Pages
import Lessons from './pages/Lessons';
import Tests from './pages/Tests';
import Admin from './pages/Admin';
import Landing from './pages/Landing';
import Certificates from './pages/Certificates';
import Dictionary from './pages/Dictionary';
import Library from './pages/Library';
import RoleSelection from './components/RoleSelection';

// Toast Context for global notifications
const ToastContext = createContext();
export const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div style={{ position: 'fixed', bottom: '40px', right: '40px', zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              style={{
                background: toast.type === 'success' ? 'var(--success)' : 'var(--error)',
                color: 'white',
                padding: '16px 24px',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-lg)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: '300px',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{toast.message}</span>
              <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <motion.div
        animate={{ x: mousePos.x - 4, y: mousePos.y - 4 }}
        transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.1 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          backgroundColor: 'var(--primary)',
          borderRadius: '50%',
          zIndex: 9999,
          pointerEvents: 'none',
        }}
      />
      <motion.div
        animate={{ x: mousePos.x - 16, y: mousePos.y - 16 }}
        transition={{ type: 'spring', damping: 25, stiffness: 250, mass: 0.5 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '32px',
          height: '32px',
          border: '1px solid var(--primary)',
          borderRadius: '50%',
          zIndex: 9998,
          pointerEvents: 'none',
          opacity: 0.2,
        }}
      />
    </>
  );
};

const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const role = localStorage.getItem('role');
  const { showToast } = useToast();
  
  const studentNav = [
    { path: '/lessons', label: t('nav.lessons'), icon: <BookOpen size={20} /> },
    { path: '/tests', label: t('nav.tests'), icon: <FileText size={20} /> },
    { path: '/dictionary', label: t('nav.dictionary'), icon: <Search size={20} /> },
    { path: '/library', label: t('nav.library'), icon: <LibraryIcon size={20} /> },
    { path: '/certificates', label: t('nav.certificates'), icon: <Trophy size={20} /> },
  ];

  const adminNav = [
    { path: '/admin', label: t('nav.admin'), icon: <Shield size={20} /> },
    { path: '/lessons', label: t('nav.view'), icon: <HomeIcon size={20} /> },
  ];

  const navItems = role === 'admin' ? adminNav : studentNav;

  const handleLogout = () => {
    showToast(t('nav.logout') + '...');
    setTimeout(() => {
      localStorage.clear();
      window.location.href = '/';
    }, 1000);
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px', padding: '0 8px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img src="/assets/newlogo.png" alt="Miss Madina" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
              <div>
                 <div style={{ fontSize: '14px', fontWeight: '900', letterSpacing: '0.1em', color: 'var(--text-primary)' }}>MADINA V2.0</div>
                 <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>{t('landing.badge')}</div>
              </div>
           </div>
           <button onClick={onClose} style={{ border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer' }} className="mobile-only">
              <X size={24} />
           </button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div className="label-small" style={{ padding: '0 12px', marginBottom: '12px' }}>{t('nav.main')}</div>
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                onClick={() => window.innerWidth < 768 && onClose()}
                style={{ 
                  textDecoration: 'none', 
                  position: 'relative',
                  color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                  background: isActive ? 'var(--bg-active)' : 'transparent',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    style={{ position: 'absolute', left: '-24px', width: '4px', height: '24px', background: 'var(--primary)', borderRadius: '0 4px 4px 0' }}
                  />
                )}
                <span style={{ color: isActive ? 'var(--primary)' : 'var(--text-tertiary)' }}>{item.icon}</span>
                <span>{item.label}</span>
                {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
              </Link>
            );
          })}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
          <button 
            onClick={handleLogout}
            className="sidebar-link-pro"
            style={{ 
              width: '100%',
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-secondary)', 
              cursor: 'pointer',
              marginTop: '8px',
              justifyContent: 'center',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            <LogOut size={18} /> <span>{t('nav.logout')}</span>
          </button>
        </div>
      </div>
      <div className={`sidebar-overlay ${isOpen ? 'active' : ''}`} onClick={onClose} />
    </>
  );
};

const Header = ({ darkMode, setDarkMode, onMenuOpen }) => {
  const { t, i18n } = useTranslation();
  const role = localStorage.getItem('role');
  const username = localStorage.getItem('username') || 'Guest';
  const [showLangs, setShowLangs] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      alert("Ilovani yuklash uchun brauzer menyusidan 'Add to Home screen' yoki 'Install' tugmasini bosing.");
    }
  };

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'uz', label: 'Oʻzbek', flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' }
  ];

  return (
    <>
      <header className="header-desktop" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
         <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.02em' }}>
               {t('header.greeting', { name: username.split(' ')[0] })}
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
               {t('header.subtitle')}
            </p>
         </div>

         <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
               onClick={handleInstallClick}
               style={{ height: '44px', padding: '0 16px', borderRadius: '14px', background: 'var(--primary-soft)', border: '1px solid var(--primary-soft)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', cursor: 'pointer', fontSize: '14px', fontWeight: '800', transition: '0.2s' }}
            >
               <Download size={18} />
               <span className="hide-tablet">Ilovani yuklash</span>
            </button>

            <div style={{ display: 'flex', background: 'var(--bg-card)', padding: '4px', borderRadius: '14px', border: '1px solid var(--border)' }}>
               <button 
                  onClick={() => setDarkMode(false)}
                  style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: !darkMode ? 'var(--bg-app)' : 'transparent', color: !darkMode ? 'var(--primary)' : 'var(--text-tertiary)', cursor: 'pointer', transition: '0.2s' }}
               >
                  <Sun size={18} />
               </button>
               <button 
                  onClick={() => setDarkMode(true)}
                  style={{ width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: darkMode ? 'var(--bg-app)' : 'transparent', color: darkMode ? 'var(--primary)' : 'var(--text-tertiary)', cursor: 'pointer', transition: '0.2s' }}
               >
                  <Moon size={18} />
               </button>
            </div>

            <div style={{ position: 'relative' }}>
               <button 
                 onClick={() => setShowLangs(!showLangs)}
                 style={{ height: '44px', padding: '0 16px', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '14px', fontWeight: '700' }}
               >
                  <Languages size={18} color="var(--primary)" />
                  <span className="hide-tablet">{languages.find(l => l.code === i18n.language.split('-')[0])?.label || 'English'}</span>
                  <ChevronDown size={14} opacity={0.5} />
               </button>
               
               <AnimatePresence>
                  {showLangs && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      style={{ position: 'absolute', top: '100%', right: 0, marginTop: '8px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '8px', zIndex: 1001, boxShadow: 'var(--shadow-lg)', minWidth: '160px' }}
                    >
                       {languages.map(lang => (
                         <button
                           key={lang.code}
                           onClick={() => {
                             i18n.changeLanguage(lang.code);
                             setShowLangs(false);
                           }}
                           style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '12px', border: 'none', background: i18n.language.startsWith(lang.code) ? 'var(--primary-soft)' : 'transparent', color: i18n.language.startsWith(lang.code) ? 'var(--primary)' : 'var(--text-primary)', cursor: 'pointer', textAlign: 'left', fontWeight: '700', fontSize: '14px' }}
                         >
                           <span>{lang.flag}</span> {lang.label}
                         </button>
                       ))}
                    </motion.div>
                  )}
               </AnimatePresence>
            </div>

            <div style={{ width: '1px', height: '24px', background: 'var(--border)' }} className="hide-tablet" />

            <button className="hide-tablet" style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'var(--bg-card)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer' }}>
               <Bell size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingLeft: '8px' }}>
               <div style={{ textAlign: 'right' }} className="hide-tablet">
                  <div style={{ fontSize: '13px', fontWeight: '800' }}>{username}</div>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase' }}>{role} Profile</div>
               </div>
               <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '16px' }}>
                  {username[0]}
               </div>
            </div>
         </div>
      </header>

      <header className="header-mobile">
         <button onClick={onMenuOpen} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', cursor: 'pointer' }}>
            <Menu size={24} />
         </button>
         <img src="/assets/newlogo.png" alt="Logo" style={{ width: '40px' }} />
         <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>
            {username[0]}
         </div>
      </header>
    </>
  );
};

const Layout = ({ children, darkMode, setDarkMode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <div className="app-container">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="main-content">
        <Header darkMode={darkMode} setDarkMode={setDarkMode} onMenuOpen={() => setIsSidebarOpen(true)} />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

function App() {
  const [role, setRole] = useState(localStorage.getItem('role'));
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const selectRole = (selectedRole) => {
    localStorage.setItem('role', selectedRole);
    setRole(selectedRole);
  };

  if (!role) {
    return (
      <ToastProvider>
        <CustomCursor />
        <RoleSelection onSelect={selectRole} />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <CustomCursor />
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/lessons" element={<Layout darkMode={darkMode} setDarkMode={setDarkMode}><Lessons /></Layout>} />
          <Route path="/tests" element={<Layout darkMode={darkMode} setDarkMode={setDarkMode}><Tests /></Layout>} />
          <Route path="/dictionary" element={<Layout darkMode={darkMode} setDarkMode={setDarkMode}><Dictionary /></Layout>} />
          <Route path="/library" element={<Layout darkMode={darkMode} setDarkMode={setDarkMode}><Library /></Layout>} />
          <Route path="/certificates" element={<Layout darkMode={darkMode} setDarkMode={setDarkMode}><Certificates /></Layout>} />
          <Route path="/admin" element={role === 'admin' ? <Layout darkMode={darkMode} setDarkMode={setDarkMode}><Admin /></Layout> : <Navigate to="/lessons" />} />
          <Route path="*" element={<Navigate to={role === 'admin' ? "/admin" : "/lessons"} />} />
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
