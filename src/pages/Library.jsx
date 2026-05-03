import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Library as LibraryIcon, Search, Filter, Book, FileText, 
  ExternalLink, Download, Clock, Star, ArrowRight,
  Sparkles, Layers, BookOpen, ChevronRight, Bookmark
} from 'lucide-react';
import { useToast } from '../App';

const Library = () => {
  const { showToast } = useToast();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const resources = [
    { id: 1, title: 'Advanced Grammar Matrix', type: 'PDF', level: 'C1', category: 'Grammar', rating: 4.9 },
    { id: 2, title: 'Business Communication Pro', type: 'E-Book', level: 'B2', category: 'Corporate', rating: 4.8 },
    { id: 3, title: 'Academic Vocabulary Vault', type: 'PDF', level: 'B1', category: 'Vocabulary', rating: 4.7 },
    { id: 4, title: 'IELTS Strategic Blueprint', type: 'PDF', level: 'C1', category: 'Exam Prep', rating: 5.0 },
    { id: 5, title: 'Modern English Phrasal Verbs', type: 'Interactive', level: 'A2', category: 'Phrases', rating: 4.6 },
    { id: 6, title: 'Phonetic Mastery Guide', type: 'Audio', level: 'A1', category: 'Speaking', rating: 4.5 },
  ];

  const filtered = resources.filter(r => 
    (filter === 'All' || r.category === filter) &&
    (r.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="animate-fade-up">
      <div className="flex-between flex-stack-mobile" style={{ marginBottom: '48px' }}>
         <div>
            <span className="label-small" style={{ color: 'var(--primary)' }}>Academic Repository</span>
            <h1 className="display-text" style={{ fontSize: 'var(--f-h1)', marginTop: '8px' }}>Resource Library</h1>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', marginTop: '4px' }}>A curated collection of strategic assets for intensive language study.</p>
         </div>
         <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
            <input 
               className="auth-input" 
               style={{ paddingLeft: '48px', height: '52px' }}
               placeholder="Filter resources..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
            />
         </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '40px', overflowX: 'auto', paddingBottom: '8px' }}>
         {['All', 'Grammar', 'Corporate', 'Vocabulary', 'Exam Prep', 'Phrases', 'Speaking'].map(cat => (
           <button
             key={cat}
             onClick={() => setFilter(cat)}
             style={{
               whiteSpace: 'nowrap',
               padding: '10px 20px',
               borderRadius: '100px',
               border: '1px solid',
               borderColor: filter === cat ? 'var(--primary)' : 'var(--border)',
               background: filter === cat ? 'var(--primary)' : 'var(--bg-card)',
               color: filter === cat ? 'white' : 'var(--text-secondary)',
               fontSize: '13px',
               fontWeight: '800',
               cursor: 'pointer',
               transition: '0.2s'
             }}
           >
             {cat}
           </button>
         ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '24px' }}>
        {filtered.map((res, i) => (
          <motion.div
            key={res.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -8 }}
            className="card-premium"
            style={{ padding: 'var(--p-card)', display: 'flex', flexDirection: 'column', position: 'relative' }}
          >
             <button style={{ position: 'absolute', top: '24px', right: '24px', background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                <Bookmark size={20} />
             </button>

             <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   {res.type === 'PDF' ? <FileText size={24} /> : <BookOpen size={24} />}
                </div>
                <div>
                   <div style={{ fontSize: '10px', fontWeight: '900', color: 'var(--primary)' }}>{res.category.toUpperCase()}</div>
                   <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-tertiary)' }}>{res.type} FORMAT</div>
                </div>
             </div>

             <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '12px', lineHeight: '1.4' }}>{res.title}</h3>
             
             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '900' }}>
                   <Star size={12} fill="#f59e0b" /> {res.rating}
                </div>
                <div style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-tertiary)' }}>TARGET LEVEL: {res.level}</div>
             </div>

             <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
                <button onClick={() => showToast('Initiating secure download circuit...')} className="btn-secondary" style={{ flex: 1, height: '48px', fontSize: '13px' }}>
                   <Download size={16} /> ACCESS
                </button>
                <button onClick={() => showToast('Synchronizing with local viewer...')} className="btn-premium" style={{ width: '48px', height: '48px', padding: 0 }}>
                   <ExternalLink size={18} />
                </button>
             </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Library;
