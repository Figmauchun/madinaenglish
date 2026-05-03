import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Shield, ArrowRight, Lock, 
  Key, LogIn, ChevronRight, Sparkles,
  Info, Globe, X
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../App';

const RoleSelection = ({ onSelect }) => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [view, setView] = useState('choice'); // choice, login
  const [role, setRole] = useState(null); // student, admin
  const [formData, setFormData] = useState({ username: '', password: '', accessKey: '' });
  const [error, setError] = useState('');

  const handleAction = (e) => {
    e.preventDefault();
    if (role === 'admin') {
      if (formData.username === 'admin' && formData.password === '1111') {
        showToast('Administrative access granted.');
        onSelect('admin');
        localStorage.setItem('username', 'Administrator');
      } else {
        showToast('Invalid administrative credentials.', 'error');
        setError('Invalid administrative credentials.');
      }
    } else {
      if (formData.username) {
        showToast(`Welcome back, ${formData.username}!`);
        onSelect('student');
        localStorage.setItem('username', formData.username);
      } else {
        showToast('Identification required.', 'error');
        setError('Identification required.');
      }
    }
  };

  return (
    <div style={{ 
      background: 'var(--bg-app)', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: 'var(--p-page)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative Background Elements */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, var(--primary-soft) 0%, transparent 70%)', opacity: 0.5, zInter: 0 }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'radial-gradient(circle, var(--primary-soft) 0%, transparent 70%)', opacity: 0.5, zInter: 0 }} />

      <AnimatePresence mode="wait">
        {view === 'choice' && (
          <motion.div 
            key="choice" 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 1.05 }} 
            style={{ maxWidth: '900px', width: '100%', textAlign: 'center', zIndex: 1 }}
          >
            {/* Center Logo */}
            <div style={{ marginBottom: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
               <img src="/assets/newlogo.png" alt="Miss Madina" style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '24px' }} />
               <h1 style={{ fontSize: '12px', fontWeight: '900', letterSpacing: '0.4em', color: 'var(--text-primary)', textTransform: 'uppercase' }}>Miss Madina Academy</h1>
            </div>

            <div style={{ marginBottom: '64px' }}>
               <h2 className="display-text" style={{ fontSize: 'var(--f-h1)', marginBottom: '20px', letterSpacing: '-0.02em' }}>Professional English Ecosystem</h2>
               <p style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: '500', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
                  A high-fidelity academic portal designed for modular learning, standardized assessment, and verified certification in the modern era.
               </p>
            </div>

            <div className="grid-2">
               <motion.div 
                 whileHover={{ y: -8 }}
                 onClick={() => { setRole('student'); setView('login'); }} 
                 className="card-premium" 
                 style={{ cursor: 'pointer', textAlign: 'left', padding: 'var(--p-card)', position: 'relative', border: '1px solid var(--border)' }}
               >
                  <div style={{ width: '56px', height: '56px', background: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', color: 'var(--text-primary)' }}>
                     <User size={24} />
                  </div>
                  <h3 style={{ fontSize: 'var(--f-h2)', fontWeight: '800', marginBottom: '12px' }}>Student Profile</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', lineHeight: '1.6', marginBottom: '32px' }}>Access your personalized curriculum, take proficiency tests, and track your academic progress.</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '800', fontSize: '13px' }}>
                     ENTER PORTAL <ArrowRight size={16} />
                  </div>
               </motion.div>

               <motion.div 
                 whileHover={{ y: -8 }}
                 onClick={() => { setRole('admin'); setView('login'); }} 
                 className="card-premium" 
                 style={{ cursor: 'pointer', textAlign: 'left', padding: 'var(--p-card)', position: 'relative', border: '1px solid var(--border)' }}
               >
                  <div style={{ width: '56px', height: '56px', background: 'var(--bg-app)', border: '1px solid var(--border)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '32px', color: 'var(--text-primary)' }}>
                     <Shield size={24} />
                  </div>
                  <h3 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '12px' }}>Control Unit</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', lineHeight: '1.6', marginBottom: '32px' }}>Manage academic modules, audit student results, and issue verified digital certifications.</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: '800', fontSize: '13px' }}>
                     AUTHENTICATE <ArrowRight size={16} />
                  </div>
               </motion.div>
            </div>
            
            <div style={{ marginTop: '80px', display: 'flex', justifyContent: 'center', gap: '40px', opacity: 0.4 }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '800' }}><Globe size={14} /> MULTI-LANGUAGE</div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '800' }}><Sparkles size={14} /> AI-POWERED</div>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: '800' }}><Info size={14} /> VERIFIED ACADEMY</div>
            </div>
          </motion.div>
        )}

        {view === 'login' && (
          <motion.div 
            key="login" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            className="card-premium" 
            style={{ maxWidth: '480px', width: '100%', padding: 'var(--p-modal)', zIndex: 1 }}
          >
             <button onClick={() => { setView('choice'); setError(''); }} style={{ background: 'transparent', border: 'none', padding: '0', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '800', color: 'var(--text-tertiary)', cursor: 'pointer', marginBottom: '40px' }}>
                <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> BACK
             </button>

             <div style={{ textAlign: 'center', marginBottom: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src="/assets/newlogo.png" alt="Logo" style={{ width: '80px', height: '80px', objectFit: 'contain', marginBottom: '24px' }} />
                <h2 className="display-text" style={{ fontSize: '28px' }}>{role === 'admin' ? 'Staff Authentication' : 'Student Access'}</h2>
                <p style={{ fontSize: '14px', color: 'var(--text-tertiary)', marginTop: '8px' }}>Identify yourself to continue</p>
             </div>

             <form onSubmit={handleAction} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   <label className="label-small">USERNAME / IDENTITY</label>
                   <div style={{ position: 'relative' }}>
                      <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                      <input className="auth-input" style={{ paddingLeft: '48px' }} placeholder="Your name or ID..." value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
                   </div>
                </div>

                {role === 'admin' && (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                       <label className="label-small">PASSWORD</label>
                       <div style={{ position: 'relative' }}>
                          <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                          <input type="password" className="auth-input" style={{ paddingLeft: '48px' }} placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                       </div>
                    </div>
                  </>
                )}

                {error && (
                  <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--error-soft)', color: 'var(--error)', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                     <X size={18} /> {error}
                  </div>
                )}

                <button type="submit" className="btn-premium" style={{ height: '60px', marginTop: '12px', fontSize: '15px' }}>
                   Confirm Access <ArrowRight size={18} />
                </button>
             </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoleSelection;
