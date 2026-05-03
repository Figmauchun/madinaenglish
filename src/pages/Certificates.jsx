import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Trophy, Download, Award, ShieldCheck, Star, Calendar, FileText, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../App';

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
if (API_BASE_URL && !API_BASE_URL.endsWith('/api')) {
  API_BASE_URL = API_BASE_URL.replace(/\/$/, '') + '/api';
}

const Certificates = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/results`);
      // Filter for current student and only high scores (80+)
      const myHighScores = data.filter(r => 
        r.studentName === username && r.score >= 80
      );
      setResults(myHighScores);
    } catch (err) {
      console.error(err);
      showToast('Credential verification failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '24px' }}>
        <div style={{ position: 'relative', width: '80px', height: '80px' }}>
          <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '24px', border: '3px solid var(--primary-soft)' }}
          />
          <motion.div 
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '24px', border: '3px solid transparent', borderTopColor: 'var(--primary)', borderRightColor: 'var(--primary)' }}
          />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Trophy className="animate-pulse" size={32} color="var(--primary)" />
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 className="display-text" style={{ fontSize: '18px', marginBottom: '4px' }}>{t('certificates.loading')}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: '600' }}>{t('certificates.loading_desc')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <div style={{ marginBottom: '48px' }}>
         <span className="label-small" style={{ color: 'var(--primary)', letterSpacing: '0.1em' }}>{t('certificates.badge')}</span>
         <h1 className="display-text" style={{ fontSize: 'var(--f-h1)', marginTop: '8px' }}>{t('certificates.title')}</h1>
         <p style={{ color: 'var(--text-secondary)', fontWeight: '500', marginTop: '4px' }}>{t('certificates.desc')}</p>
      </div>

      {results.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {results.map((res, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="card-premium"
              style={{ padding: 'var(--p-card)', position: 'relative', overflow: 'hidden' }}
            >
               <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: 'var(--primary-soft)', borderRadius: '50%', opacity: 0.5 }} />
               
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', position: 'relative' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--bg-app)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                     <Award size={28} />
                  </div>
                  <div style={{ textAlign: 'right' }}>
                     <div style={{ fontSize: '10px', fontWeight: '900', color: 'var(--text-tertiary)' }}>{t('certificates.score')}</div>
                     <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--success)' }}>{res.score}%</div>
                  </div>
               </div>

               <h3 style={{ fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>{t('certificates.mastery', { name: res.testName })}</h3>
               <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: '1.6' }}>
                  {t('certificates.confirm_msg', { user: username, test: res.testName })}
               </p>

               <div className="flex-between flex-stack-mobile" style={{ paddingTop: '24px', borderTop: '1px solid var(--border-soft)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700', color: 'var(--text-tertiary)' }}>
                     <Calendar size={14} /> {new Date(res.date).toLocaleDateString()}
                  </div>
                  <button onClick={() => showToast('Redirecting to Admin for official PDF issuance.')} className="btn-secondary btn-small">
                     <Download size={14} /> {t('certificates.download')}
                  </button>
               </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card-premium" style={{ padding: '80px 24px', textAlign: 'center', background: 'var(--bg-app)', border: '1px dashed var(--border)' }}>
           <div style={{ opacity: 0.1, marginBottom: '24px' }}><Trophy size={64} /></div>
           <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px' }}>{t('certificates.no_certs')}</h3>
           <p style={{ fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>
              {t('certificates.no_certs_desc')}
           </p>
           <button onClick={() => window.location.href = '/tests'} className="btn-premium" style={{ marginTop: '32px' }}>
              {t('certificates.take_test')}
           </button>
        </div>
      )}
    </div>
  );
};

export default Certificates;
