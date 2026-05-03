import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookText, Search, ArrowLeft, Loader2, 
  ChevronRight, BookOpen, Layers, Target,
  FileText, Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
if (API_BASE_URL && !API_BASE_URL.endsWith('/api')) {
  API_BASE_URL = API_BASE_URL.replace(/\/$/, '') + '/api';
}

const GrammarRules = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRule, setActiveRule] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/resources?type=grammar`);
      setRules(data);
    } catch (error) {
      console.error('Fetch rules failed:', error);
      setRules([
        { _id: '1', title: 'Present Simple', level: 'A1', description: 'Odatiy harakatlar uchun qo\'llaniladi.', content: '### Present Simple Structure\n- Positive: I play soccer.\n- Negative: I do not play soccer.\n- Question: Do you play soccer?' },
        { _id: '2', title: 'Present Continuous', level: 'A1', description: 'Hozir sodir bo\'layotgan harakatlar.', content: '### Structure\n**Subject + am/is/are + verb-ing**\n\nExample: I am studying English now.' },
        { _id: '3', title: 'Passive Voice', level: 'B1', description: 'Harakat bajaruvchisi noma\'lum bo\'lganda.', content: '### Usage\nWhen the focus is on the action rather than the doer.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-44 pb-20 overflow-hidden bg-[var(--bg-main)]">
      <div className="container-max">
        <AnimatePresence mode="wait">
          {!activeRule ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <header className="mb-20">
                <button 
                  onClick={() => navigate('/')}
                  className="flex items-center gap-3 text-[var(--text-dim)] hover:text-[var(--primary)] transition-all text-xs font-black uppercase tracking-widest mb-8 bg-[var(--bg-card)] px-6 py-3 rounded-2xl border border-[var(--border)] w-fit shadow-sm"
                >
                  <ArrowLeft size={16} /> Bosh sahifaga
                </button>
                
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--primary-light)] text-[var(--primary)] rounded-full text-xs font-bold mb-4">
                  <BookText size={14} />
                  <span>Interactive Grammar Guide</span>
                </div>
                <h1 className="text-[var(--text-main)] font-black tracking-tighter text-5xl md:text-6xl">Grammar <span className="text-amber-500">Mastery</span></h1>
                <p className="text-[var(--text-dim)] font-medium max-w-xl mt-4 leading-relaxed">Ingliz tili grammatikasini eng sodda usulda, misollar bilan o'rganing.</p>
              </header>

              {loading ? (
                <div className="py-20 text-center"><Loader2 className="animate-spin text-amber-500 mx-auto" size={48} /></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {rules.map((rule, i) => (
                    <motion.div 
                      whileHover={{ y: -10 }}
                      key={rule._id}
                      onClick={() => setActiveRule(rule)}
                      className="premium-card p-10 flex flex-col group cursor-pointer border-t-4 border-amber-500/20 hover:border-amber-500 transition-all"
                    >
                      <div className="flex justify-between items-start mb-10">
                         <div className="w-16 h-16 bg-[var(--bg-main)] rounded-2xl flex items-center justify-center border border-[var(--border)] group-hover:bg-amber-600 transition-all duration-500 shadow-inner">
                            <BookOpen className="text-[var(--text-dim)] group-hover:text-white" size={28} />
                         </div>
                         <div className="inline-flex items-center px-4 py-1.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">{rule.level}</div>
                      </div>

                      <h3 className="text-2xl font-black text-[var(--text-main)] mb-4 tracking-tight group-hover:text-amber-600 transition-colors uppercase leading-tight">
                        {rule.title}
                      </h3>
                      
                      <p className="text-[var(--text-dim)] text-sm font-medium leading-relaxed mb-10 line-clamp-3">
                        {rule.description}
                      </p>
                      
                      <div className="mt-auto pt-8 border-t border-[var(--border)] flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity">
                         <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)] group-hover:text-[var(--text-main)]">Qoidani o'qish</span>
                         <ChevronRight className="text-[var(--text-dim)] group-hover:text-[var(--text-main)] group-hover:translate-x-1" size={20} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="active"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-4xl mx-auto"
            >
              <header className="flex justify-between items-center mb-16 px-4">
                 <button 
                   onClick={() => setActiveRule(null)}
                   className="flex items-center gap-3 text-[var(--text-dim)] hover:text-[var(--text-main)] transition-all text-xs font-black uppercase tracking-widest bg-[var(--bg-card)] px-6 py-3 rounded-2xl border border-[var(--border)] shadow-sm"
                 >
                    <ArrowLeft size={16} /> Mavzular ro'yxatiga
                 </button>
                 <div className="px-5 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-600 font-black rounded-full text-xs">{activeRule.level} Level</div>
              </header>

              <div className="premium-card p-12 md:p-20 bg-[var(--bg-card)]">
                 <div className="mb-16">
                    <div className="flex items-center gap-4 mb-6">
                       <FileText className="text-amber-500" size={24} />
                       <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-dim)]">Grammar Lesson</span>
                    </div>
                    <h1 className="text-[var(--text-main)] text-5xl font-black tracking-tighter mb-8 uppercase leading-tight">{activeRule.title}</h1>
                    <p className="text-xl text-[var(--text-dim)] font-medium leading-relaxed italic border-l-4 border-amber-500 pl-8 bg-amber-500/5 py-4 rounded-r-3xl">
                       {activeRule.description}
                    </p>
                 </div>

                 <div className="markdown-content prose dark:prose-invert max-w-none text-[var(--text-main)]">
                    <ReactMarkdown>{activeRule.content}</ReactMarkdown>
                 </div>

                 <div className="mt-20 pt-16 border-t border-[var(--border)] text-center">
                    <div className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500/10 border border-amber-500/20 rounded-3xl text-amber-600">
                       <Sparkles size={18} />
                       <span className="text-sm font-black uppercase tracking-widest">Mavzu muvaffaqiyatli yakunlandi!</span>
                    </div>
                 </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GrammarRules;
