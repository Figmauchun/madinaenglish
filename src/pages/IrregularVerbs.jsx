import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Hash, Search, Volume2, ArrowLeft, 
  Loader2, Filter, Info, Sparkles 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
if (API_BASE_URL && !API_BASE_URL.endsWith('/api')) {
  API_BASE_URL = API_BASE_URL.replace(/\/$/, '') + '/api';
}

const IrregularVerbs = () => {
  const [verbs, setVerbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchVerbs();
  }, []);

  const fetchVerbs = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/resources?type=verb`);
      setVerbs(data);
    } catch (error) {
      console.error('Fetch verbs failed:', error);
      // Fallback data for preview if API is not populated yet
      setVerbs([
        { v1: 'be', v2: 'was/were', v3: 'been', translation: {uz: 'bo\'lmoq', ru: 'быть', en: 'to exist'}, meaning: 'Exist, occur' },
        { v1: 'begin', v2: 'began', v3: 'begun', translation: {uz: 'boshlamoq', ru: 'начинать', en: 'to start'}, meaning: 'Start something' },
        { v1: 'break', v2: 'broke', v3: 'broken', translation: {uz: 'sindirmoq', ru: 'ломать', en: 'to shatter'}, meaning: 'Separate into pieces' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredVerbs = verbs.filter(v => 
    v.v1.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.translation.uz.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative min-h-screen pt-44 pb-20 overflow-hidden bg-[var(--bg-main)]">
      <div className="container-max">
        <header className="mb-16">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-3 text-[var(--text-dim)] hover:text-[var(--primary)] transition-all text-xs font-black uppercase tracking-widest mb-8 bg-[var(--bg-card)] px-6 py-3 rounded-2xl border border-[var(--border)] w-fit shadow-sm"
          >
            <ArrowLeft size={16} /> Bosh sahifaga
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary-light)] text-[var(--primary)] rounded-full text-xs font-bold mb-4">
                <Hash size={14} />
                <span>Dictionary & Grammar</span>
              </div>
              <h1 className="text-[var(--text-main)] font-black tracking-tighter text-5xl md:text-6xl">Noto'g'ri <span className="text-indigo-500">Fe'llar</span></h1>
              <p className="text-[var(--text-dim)] font-medium max-w-xl mt-4 leading-relaxed">Irregular verbs - ingliz tilini o'rganishda eng muhim poydevor. Ularni yodlash endi ancha oson.</p>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" size={20} />
              <input 
                type="text"
                placeholder="Fe'lni qidirish..."
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl py-5 pl-16 pr-8 text-[var(--text-main)] focus:outline-none focus:border-[var(--primary)] transition-all font-medium shadow-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        {loading ? (
          <div className="py-40 text-center">
            <Loader2 className="animate-spin text-indigo-500 mx-auto" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {/* Table Header - Desktop */}
            <div className="hidden md:grid grid-cols-5 gap-6 px-10 py-6 bg-[var(--bg-card)] rounded-3xl border border-[var(--border)] text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-dim)] shadow-sm">
               <div>Base Form (V1)</div>
               <div>Past Simple (V2)</div>
               <div>Past Participle (V3)</div>
               <div>Tarjima</div>
               <div className="text-right">Ma'nosi</div>
            </div>

            <AnimatePresence>
              {filteredVerbs.map((verb, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={i}
                  className="premium-card p-10 grid grid-cols-1 md:grid-cols-5 gap-8 items-center group transition-all"
                >
                  <div className="flex flex-col gap-1">
                    <span className="md:hidden text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)] mb-2">V1</span>
                    <span className="text-2xl font-black text-indigo-500 group-hover:text-[var(--text-main)] transition-colors">{verb.v1}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="md:hidden text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)] mb-2">V2</span>
                    <span className="text-xl font-black text-[var(--text-main)]">{verb.v2}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="md:hidden text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)] mb-2">V3</span>
                    <span className="text-xl font-black text-[var(--text-main)] opacity-70">{verb.v3}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="md:hidden text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)] mb-2">Tarjima</span>
                    <span className="text-lg font-bold text-[var(--text-dim)]">{verb.translation.uz}</span>
                  </div>
                  <div className="text-right flex items-center justify-end gap-4">
                     <span className="hidden lg:block text-sm text-[var(--text-dim)] font-medium">{verb.meaning}</span>
                     <button className="w-12 h-12 bg-[var(--primary-light)] rounded-2xl flex items-center justify-center text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all shadow-sm">
                        <Volume2 size={20} />
                     </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredVerbs.length === 0 && (
              <div className="py-40 text-center glass-morphism rounded-[4rem] border-2 border-dashed border-white/5">
                <Info className="mx-auto text-slate-700 mb-6" size={48} />
                <p className="text-slate-600 font-black uppercase tracking-widest">Hech narsa topilmadi.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Decorative Glows */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 blur-[100px] rounded-full -z-10 pointer-events-none"></div>
    </div>
  );
};

export default IrregularVerbs;
