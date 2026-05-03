import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('isAdmin', 'true');
        navigate('/admin');
      } else {
        setError(t('login.error'));
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-app)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <button 
        onClick={() => navigate('/')}
        className="btn-secondary"
        style={{ position: 'fixed', top: '40px', left: '40px', padding: '10px' }}
      >
        <ArrowLeft size={18} />
      </button>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="premium-card"
        style={{ width: '100%', maxWidth: '400px', padding: '48px', border: 'none', background: 'transparent' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ width: '48px', height: '48px', background: 'var(--accent)', borderRadius: '8px', margin: '0 auto 24px' }}></div>
          <h2 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '8px' }}>{t('landing.admin')}</h2>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>{t('login.desc')}</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="search-bar" style={{ width: '100%' }}>
            <User size={16} />
            <input 
              type="text" 
              placeholder={t('login.username')} 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="search-bar" style={{ width: '100%' }}>
            <Lock size={16} />
            <input 
              type="password" 
              placeholder={t('login.password')} 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center', fontWeight: '600' }}>{error}</div>}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary"
            style={{ padding: '16px', fontSize: '14px', marginTop: '12px' }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} style={{ margin: '0 auto' }} /> : t('login.button')}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
