import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Book, Sparkles, Volume2, 
  ArrowRight, History, Star, Bookmark,
  TrendingUp, Globe, ChevronRight, X,
  Command, Languages
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../App';

const Dictionary = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState(['Abyss', 'Luminous', 'Serendipity', 'Eloquent']);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query) return;

    setLoading(true);
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${query}`);
      const data = await res.json();
      
      if (Array.isArray(data)) {
        setResult(data[0]);
        if (!recent.includes(query)) {
          setRecent([query, ...recent.slice(0, 5)]);
        }
      } else {
        showToast(t('library.no_books'), 'error');
        setResult(null);
      }
    } catch (err) {
      showToast('Lexical engine error.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    const audioUrl = result?.phonetics?.find(p => p.audio)?.audio;
    if (audioUrl) {
      new Audio(audioUrl).play();
    } else {
      showToast(t('dictionary.listen_btn'), 'error');
    }
  };

  return (
    <div className="dict-layout">
      
      {/* Main Column: Lexical Engine */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Search Bar - Centerpiece */}
        <div className="card-premium" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', background: 'var(--bg-card)', position: 'relative' }}>
           <div style={{ color: 'var(--primary)', opacity: 0.5 }}><Command size={24} /></div>
           <form onSubmit={handleSearch} style={{ flex: 1 }}>
              <input 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t('dictionary.desc')}
                style={{
                  width: '100%',
                  border: 'none',
                  background: 'transparent',
                  fontSize: '24px',
                  fontWeight: '700',
                  color: 'var(--text-primary)',
                  outline: 'none',
                  fontFamily: 'Urbanist'
                }}
              />
           </form>
           <button 
             onClick={handleSearch}
             className="btn-premium" 
             style={{ height: '56px', width: '56px', borderRadius: '16px', padding: 0 }}
           >
              <Search size={24} />
           </button>
        </div>

        {/* Results Area */}
        <div className="card-premium" style={{ flex: 1, padding: 'var(--p-modal)', position: 'relative', overflow: 'hidden' }}>
           <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}
                >
                  <div style={{ position: 'relative', width: '64px', height: '64px' }}>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{ position: 'absolute', inset: 0, border: '3px solid var(--primary-soft)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}
                    />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                     <div className="display-text" style={{ fontSize: '16px' }}>{t('dictionary.consulting')}</div>
                     <div style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '4px' }}>{t('dictionary.sync')}</div>
                  </div>
                </motion.div>
              ) : result ? (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ height: '100%' }}
                >
                  <div className="flex-between flex-stack-mobile" style={{ marginBottom: '48px' }}>
                     <div>
                        <h1 className="display-text" style={{ fontSize: 'var(--f-h1)', marginBottom: '8px', color: 'var(--primary)' }}>{result.word}</h1>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                           <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-tertiary)' }}>{result.phonetic}</span>
                           <button onClick={playAudio} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-soft)', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Volume2 size={20} />
                           </button>
                        </div>
                     </div>
                     <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn-secondary btn-small" style={{ borderRadius: '100px' }}><Bookmark size={14} /> {t('dictionary.save_btn')}</button>
                        <button className="btn-secondary btn-small" style={{ borderRadius: '100px' }}><Languages size={14} /> {t('dictionary.translate')}</button>
                     </div>
                  </div>

                  <div className="grid-2">
                     <div>
                        <h4 className="label-small" style={{ color: 'var(--primary)' }}>{t('dictionary.definition')}</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px' }}>
                           {result.meanings.slice(0, 2).map((m, idx) => (
                             <div key={idx}>
                                <div style={{ fontSize: '12px', fontWeight: '900', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '8px' }}>{m.partOfSpeech}</div>
                                <div style={{ fontSize: '18px', lineHeight: '1.6', fontWeight: '600' }}>
                                   {m.definitions[0].definition}
                                </div>
                                {m.definitions[0].example && (
                                  <div style={{ marginTop: '12px', padding: '12px 20px', background: 'var(--bg-app)', borderRadius: '12px', fontSize: '14px', color: 'var(--text-secondary)', borderLeft: '4px solid var(--accent)' }}>
                                     "{m.definitions[0].example}"
                                  </div>
                                )}
                             </div>
                           ))}
                        </div>
                     </div>

                     <div>
                        <h4 className="label-small" style={{ color: 'var(--primary)' }}>{t('dictionary.uz_meaning')}</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '16px' }}>
                           {(result.meanings[0]?.synonyms || ['Universal', 'Modular', 'Dynamic', 'Ecosystem']).slice(0, 10).map((s, idx) => (
                             <div key={idx} style={{ padding: '8px 16px', background: 'var(--primary-soft)', color: 'var(--primary)', borderRadius: '100px', fontSize: '13px', fontWeight: '800' }}>
                                {s}
                             </div>
                           ))}
                        </div>
                        
                        <div style={{ marginTop: '40px' }}>
                           <h4 className="label-small" style={{ color: 'var(--primary)' }}>{t('dictionary.usage')}</h4>
                           <div style={{ padding: '24px', background: 'var(--bg-active)', borderRadius: '20px', marginTop: '16px', border: '1px solid var(--accent)' }}>
                              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                                 <Sparkles size={18} color="var(--primary)" />
                                 <span style={{ fontSize: '14px', fontWeight: '800' }}>{t('dictionary.ai_context')}</span>
                              </div>
                              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                                 {t('dictionary.ai_desc', { word: result.word })}
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}
                >
                  <Globe size={120} strokeWidth={0.5} style={{ marginBottom: '32px' }} />
                  <div className="display-text" style={{ fontSize: '24px' }}>{t('dictionary.empty_history')}</div>
                </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>

      {/* Right Column: Intelligence Hub */}
      <div className="dict-sidebar">
        <div className="card-premium" style={{ padding: '24px' }}>
           <h4 className="label-small" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <History size={14} /> {t('dictionary.history')}
           </h4>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {recent.map((word, i) => (
                <button
                  key={i}
                  onClick={() => { setQuery(word); setTimeout(() => handleSearch(), 50); }}
                  style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-soft)',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: '0.2s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-soft)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  {word}
                  <ChevronRight size={14} opacity={0.3} />
                </button>
              ))}
           </div>
        </div>

        <div className="card-premium" style={{ padding: '24px', background: 'var(--primary)', color: 'white', border: 'none' }}>
           <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
              <TrendingUp size={18} />
           </div>
           <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '8px', fontFamily: 'Space Grotesk' }}>{t('dictionary.tip_title')}</h3>
           <p style={{ fontSize: '13px', opacity: 0.8, lineHeight: '1.5', marginBottom: '20px' }}>
              {t('dictionary.tip_desc')}
           </p>
           <button className="btn-secondary btn-small" style={{ background: 'var(--bg-card)', color: 'var(--primary)', border: 'none', width: '100%', fontWeight: '800' }}>
              {t('dictionary.view_lessons')}
           </button>
        </div>
      </div>
    </div>
  );
};

export default Dictionary;
