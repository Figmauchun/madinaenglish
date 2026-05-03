import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Search, Copy, Check, 
  ArrowLeft, Loader2, Sparkles, Languages,
  ChevronDown, BookOpen
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
if (API_BASE_URL && !API_BASE_URL.endsWith('/api')) {
  API_BASE_URL = API_BASE_URL.replace(/\/$/, '') + '/api';
}

const Phrases = () => {
  const [phrases, setPhrases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPhrases();
  }, []);

  const fetchPhrases = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/resources?type=phrase`);
      setPhrases(data);
    } catch (error) {
      console.error('Fetch phrases failed:', error);
      setPhrases([
        { _id: '1', phrase: 'Break the ice', meaning: 'To start a conversation', translation: {uz: 'Suhbatni boshlamoq', ru: 'Начать разговор', en: 'Start chatting'}, example: 'He told a joke to break the ice.' },
        { _id: '2', phrase: 'Piece of cake', meaning: 'Something very easy', translation: {uz: 'Juda oson', ru: 'Очень просто', en: 'Very easy'}, example: 'The exam was a piece of cake.' },
        { _id: '3', phrase: 'Once in a blue moon', meaning: 'Very rarely', translation: {uz: 'Kamdan-kam hollarda', ru: 'Очень редко', en: 'Rarely'}, example: 'I go to the gym once in a blue moon.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPhrases = phrases.filter(p => 
    p.phrase.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.translation.uz.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="phrases-container"
    >
      <header className="page-header" style={{ marginBottom: '40px' }}>
        <h1 className="section-title" style={{ marginBottom: '8px' }}>Useful Phrases</h1>
        <p className="text-dim" style={{ fontWeight: '500' }}>Kundalik suhbatlarda ko'p ishlatiladigan iboralar va idiomalarni o'rganing.</p>
      </header>

      <div className="search-section" style={{ marginBottom: '40px' }}>
        <div className="premium-card" style={{ 
          padding: '16px 24px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          borderRadius: '16px'
        }}>
          <Search size={20} className="text-dim" />
          <input 
            type="text"
            placeholder="Search phrases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              flex: 1, 
              border: 'none', 
              outline: 'none', 
              background: 'transparent',
              fontSize: '18px',
              fontWeight: '600'
            }}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <Loader2 className="animate-spin text-primary mx-auto" size={40} />
        </div>
      ) : (
        <div className="course-grid">
          <AnimatePresence>
            {filteredPhrases.map((p, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={p._id}
                className="premium-card phrase-card"
                style={{ cursor: 'default' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <div style={{ color: 'var(--primary)', background: 'var(--primary-light)', padding: '12px', borderRadius: '12px' }}>
                    <Sparkles size={20} />
                  </div>
                  <button 
                    onClick={() => copyToClipboard(p.phrase, p._id)}
                    style={{ background: 'var(--bg-main)', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-dim)' }}
                  >
                    {copiedId === p._id ? <Check size={18} className="text-success" /> : <Copy size={18} />}
                  </button>
                </div>

                <h3 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '16px' }}>"{p.phrase}"</h3>
                
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Meaning</span>
                  <p style={{ fontWeight: '600', color: 'var(--text-main)' }}>{p.meaning}</p>
                </div>

                <div style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '900', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '4px' }}>Translation</div>
                  <p style={{ fontWeight: '800', fontSize: '18px' }}>{p.translation.uz}</p>
                </div>

                {p.example && (
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                     <span style={{ fontSize: '11px', fontWeight: '900', color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Example</span>
                     <p style={{ fontStyle: 'italic', fontWeight: '500' }}>"{p.example}"</p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default Phrases;
