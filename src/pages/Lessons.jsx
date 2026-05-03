import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, Clock, ChevronRight, Search, 
  Sparkles, Layers, BookMarked, ArrowLeft,
  Loader2, CheckCircle2, Play, ChevronLeft,
  Book as BookIcon, Layout
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { useToast } from '../App';

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
if (API_BASE_URL && !API_BASE_URL.endsWith('/api')) {
  API_BASE_URL = API_BASE_URL.replace(/\/$/, '') + '/api';
}

const Lessons = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/lessons`);
      setLessons(data);
    } catch (err) {
      console.error(err);
      showToast('Repository access failure.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredLessons = lessons.filter(l => 
    l.title.toLowerCase().includes(search.toLowerCase()) ||
    l.category?.toLowerCase().includes(search.toLowerCase())
  );

  const stripMarkdown = (text) => {
    if (!text) return '';
    return text
      .replace(/^#{1,6}\s+/gm, '')
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      .replace(/^---+$/gm, '')
      .replace(/\n+/g, ' ')
      .trim();
  };

  // Split content into pages based on horizontal rules --- or custom logic
  const getPages = (content) => {
    if (!content) return [];
    // Try splitting by horizontal rules first
    let pages = content.split(/\n---\n/);
    if (pages.length === 1) {
      // If no horizontal rules, try splitting by double newlines or headers if content is long
      // For now, let's look for headers # or ## as natural page breaks
      pages = content.split(/\n(?=#{1,3} )/);
    }
    return pages;
  };

  const pages = selectedLesson ? getPages(selectedLesson.content) : [];

  const handleNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      showToast('Academic unit completed.');
      setSelectedLesson(null);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo(0, 0);
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
             <BookIcon className="animate-pulse" size={32} color="var(--primary)" />
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 className="display-text" style={{ fontSize: '18px', marginBottom: '4px' }}>{t('lessons.loading')}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: '600' }}>{t('lessons.loading_desc')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <AnimatePresence mode="wait">
        {!selectedLesson ? (
          <motion.div 
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="flex-between flex-stack-mobile" style={{ marginBottom: '48px' }}>
               <div>
                  <span className="label-small" style={{ color: 'var(--primary)' }}>{t('lessons.badge')}</span>
                  <h1 className="display-text" style={{ fontSize: 'var(--f-h1)', marginTop: '8px' }}>{t('lessons.header_title')}</h1>
                  <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '4px' }}>{t('lessons.header_desc')}</p>
               </div>
               <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                  <input 
                    className="auth-input" 
                    style={{ paddingLeft: '48px', height: '48px' }}
                    placeholder={t('lessons.header_title') + '...'} 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {filteredLessons.map((lesson, i) => (
                <motion.div
                  key={lesson._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -8 }}
                  onClick={() => {
                    setSelectedLesson(lesson);
                    setCurrentPage(0);
                  }}
                  className="card-premium"
                  style={{ padding: 'var(--p-card)', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                     <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BookOpen size={24} />
                     </div>
                     <div style={{ fontSize: '10px', fontWeight: '900', color: 'var(--primary)', background: 'var(--primary-soft)', padding: '4px 8px', borderRadius: '6px' }}>{lesson.level || 'B1'}</div>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px', lineHeight: '1.4' }}>{lesson.title}</h3>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '32px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {lesson.content ? stripMarkdown(lesson.content).substring(0, 100) + '...' : t('lessons.no_lessons')}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid var(--border-soft)' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '700', color: 'var(--text-tertiary)' }}>
                        <Clock size={14} /> {t('lessons.read_time', { count: lesson.duration || '20' })}
                     </div>
                     <div style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: '800' }}>
                        {t('lessons.start_reading').toUpperCase()} <Play size={12} fill="currentColor" />
                     </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="content"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid-2"
            style={{ alignItems: 'start' }}
          >
            {/* Left: Content Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
               <button 
                 onClick={() => setSelectedLesson(null)}
                 className="btn-secondary"
                 style={{ border: 'none', padding: '0', background: 'transparent', width: 'fit-content' }}
               >
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '800', color: 'var(--text-tertiary)' }}>
                    <ArrowLeft size={16} /> {t('lessons.back_list')}
                 </div>
               </button>

               <div className="card-premium" style={{ padding: 'var(--p-modal)', overflow: 'hidden', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: '48px' }}>
                     <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--primary-soft)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '100px', fontSize: '11px', fontWeight: '900', marginBottom: '24px' }}>
                        <Sparkles size={14} /> {t('lessons.page_info', { current: currentPage + 1, total: pages.length })}
                     </div>
                     <h1 className="display-text" style={{ fontSize: 'var(--f-h1)', marginBottom: '8px' }}>{selectedLesson.title}</h1>
                     <p style={{ color: 'var(--text-tertiary)', fontSize: '14px' }}>{selectedLesson.level || 'C1'} Proficiency Level</p>
                  </div>

                  <motion.div 
                    key={currentPage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="markdown-pro" 
                    style={{ 
                      fontSize: '18px', 
                      lineHeight: '1.8', 
                      color: 'var(--text-primary)',
                      flex: 1
                    }}
                  >
                    <ReactMarkdown>{pages[currentPage]}</ReactMarkdown>
                  </motion.div>

                  <div style={{ marginTop: '60px', display: 'flex', justifyContent: 'space-between', paddingTop: '32px', borderTop: '1px solid var(--border-soft)' }}>
                     <button 
                       onClick={handlePrevPage}
                       disabled={currentPage === 0}
                       className="btn-secondary" 
                       style={{ opacity: currentPage === 0 ? 0.3 : 1 }}
                     >
                        <ChevronLeft size={20} /> {t('admin.cancel')}
                     </button>
                     <button 
                       onClick={handleNextPage}
                       className="btn-premium" 
                     >
                        {currentPage === pages.length - 1 ? t('lessons.finish') : t('lessons.next_lesson')} <ChevronRight size={20} />
                     </button>
                  </div>
               </div>
            </div>

            {/* Right: Progress Sidebar */}
            <div className="card-premium" style={{ padding: '32px', position: 'sticky', top: '24px' }}>
               <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Layout size={20} color="var(--primary)" /> {t('lessons.roadmap')}
               </h4>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {pages.map((page, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx)}
                      style={{
                        textAlign: 'left',
                        padding: '16px 20px',
                        borderRadius: '12px',
                        border: '1px solid',
                        borderColor: currentPage === idx ? 'var(--primary)' : 
                                    currentPage > idx ? 'var(--success)' : 'var(--border)',
                        background: currentPage === idx ? 'var(--primary-soft)' : 
                                   currentPage > idx ? 'var(--success-soft)' : 'var(--bg-app)',
                        color: currentPage === idx ? 'var(--primary)' : 
                               currentPage > idx ? 'var(--success)' : 'var(--text-secondary)',
                        fontSize: '14px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: '0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                         <span style={{ opacity: 0.5 }}>{String(idx + 1).padStart(2, '0')}</span>
                         <span>Section {idx + 1}</span>
                      </div>
                      {currentPage > idx && <CheckCircle2 size={16} />}
                      {currentPage === idx && <Play size={14} fill="currentColor" />}
                    </button>
                  ))}
               </div>

               <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-soft)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                     <span className="label-small" style={{ marginBottom: 0 }}>{t('lessons.progress')}</span>
                     <span style={{ fontSize: '12px', fontWeight: '900' }}>{Math.round(((currentPage + 1) / pages.length) * 100)}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--border-soft)', borderRadius: '10px', overflow: 'hidden' }}>
                     <motion.div 
                       animate={{ width: `${((currentPage + 1) / pages.length) * 100}%` }}
                       style={{ height: '100%', background: 'var(--primary)' }}
                     />
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Lessons;
