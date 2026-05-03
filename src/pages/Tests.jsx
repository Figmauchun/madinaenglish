import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Clock, CheckCircle2, 
  ChevronRight, Timer, ArrowLeft,
  Loader2, HelpCircle, ChevronLeft,
  FileText, Send, AlertCircle, Sparkles
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { useToast } from '../App';

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
if (API_BASE_URL && !API_BASE_URL.endsWith('/api')) {
  API_BASE_URL = API_BASE_URL.replace(/\/$/, '') + '/api';
}

const Tests = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, []);

  useEffect(() => {
    let timer;
    if (selectedTest && !isFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && selectedTest && !isFinished) {
      handleFinish();
    }
    return () => clearInterval(timer);
  }, [selectedTest, isFinished, timeLeft]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (selectedTest && !isFinished) {
        e.preventDefault();
        e.returnValue = 'Test davom etmoqda. Chiqib ketsangiz natija saqlanmaydi.';
      }
    };

    const handleVisibilityChange = () => {
      if (selectedTest && !isFinished && document.visibilityState === 'hidden') {
        showToast('Ogohlantirish! Test paytida boshqa oynaga o\'tish mumkin emas.', 'error');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [selectedTest, isFinished]);

  const fetchTests = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/tests`);
      setTests(data);
    } catch (err) {
      console.error(err);
      showToast('Assessment repository inaccessible.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStart = (test) => {
    if (!test.questions || test.questions.length === 0) {
      return showToast('Test is empty.', 'error');
    }
    setSelectedTest(test);
    setTimeLeft((test.timeLimit || 30) * 60);
    setCurrentQuestion(0);
    setAnswers({});
    setIsFinished(false);
  };

  const handleAnswer = (optionIdx) => {
    setAnswers({ ...answers, [currentQuestion]: optionIdx });
  };

  const handleFinish = async () => {
    // Confirm before finishing if there are unanswered questions
    const answeredCount = Object.keys(answers).length;
    if (answeredCount < selectedTest.questions.length && timeLeft > 0) {
      if (!window.confirm(t('tests.confirm_exit'))) {
        return;
      }
    }

    setIsFinished(true);
    let correctCount = 0;
    const itemAudit = selectedTest.questions.map((q, idx) => {
      const isCorrect = answers[idx] === q.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        question: q.question,
        selected: q.options[answers[idx]] || 'None',
        correct: q.options[q.correctAnswer],
        isCorrect
      };
    });

    const finalScore = Math.round((correctCount / selectedTest.questions.length) * 100);
    setScore(finalScore);

    try {
      await axios.post(`${API_BASE_URL}/results`, {
        studentName: localStorage.getItem('username') || 'Anonymous',
        testName: selectedTest.title,
        score: finalScore,
        answers: itemAudit
      });
      showToast('Natija muvaffaqiyatli saqlandi.');
    } catch (err) {
      console.error(err);
      showToast('Natijani saqlashda xatolik.', 'error');
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
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
             <Sparkles className="animate-pulse" size={32} color="var(--primary)" />
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3 className="display-text" style={{ fontSize: '18px', marginBottom: '4px' }}>{t('tests.loading')}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: '600' }}>{t('tests.sync_desc')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      <AnimatePresence mode="wait">
        {!selectedTest ? (
          <motion.div 
            key="list" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
          >
            <div style={{ marginBottom: '40px' }}>
               <h1 className="display-text" style={{ fontSize: 'var(--f-h1)', marginBottom: '8px' }}>{t('tests.center_title')}</h1>
               <p style={{ color: 'var(--text-secondary)' }}>{t('tests.center_desc')}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {tests.map((test) => (
                <div
                  key={test._id}
                  onClick={() => handleStart(test)}
                  className="card-premium"
                  style={{ 
                    padding: '32px', 
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px'
                  }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <FileText size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px' }}>{test.title}</h3>
                    <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-tertiary)', fontWeight: '600' }}>
                       <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><HelpCircle size={14} /> {test.questions?.length || 0} {t('tests.questions_count', { count: '' }).replace('{{count}}', '').trim() || 'Q'}</span>
                       <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {test.timeLimit || 30} min</span>
                    </div>
                  </div>
                  <button className="btn-secondary" style={{ marginTop: 'auto', width: '100%', border: '1px solid var(--border)' }}>
                    {t('tests.start')} <ChevronRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        ) : isFinished ? (
          <motion.div 
            key="result" 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="card-premium"
            style={{ maxWidth: '600px', margin: '40px auto', padding: '64px', textAlign: 'center' }}
          >
            <div style={{ 
              width: '100px', 
              height: '100px', 
              borderRadius: '50%', 
              background: 'var(--primary-soft)', 
              color: 'var(--primary)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 32px' 
            }}>
               <Trophy size={48} />
            </div>
            <h2 className="display-text" style={{ fontSize: '28px', marginBottom: '12px' }}>{t('tests.completed')}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>{t('tests.result_desc')}</p>
            
            <div style={{ background: 'var(--bg-app)', borderRadius: '24px', padding: '40px', marginBottom: '40px', border: '1px solid var(--border)' }}>
               <div style={{ fontSize: '64px', fontWeight: '900', color: 'var(--primary)' }}>{score}%</div>
               <div className="label-small" style={{ marginTop: '8px' }}>Muvaffaqiyat ko'rsatkichi</div>
            </div>
            
            <button onClick={() => setSelectedTest(null)} className="btn-premium" style={{ width: '100%', height: '56px' }}>
               {t('tests.back_home')}
            </button>
          </motion.div>
        ) : (
          <motion.div 
            key="exam" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="grid-2"
            style={{ alignItems: 'start' }}
          >
            {/* Left: Question Area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <button 
                   onClick={() => {
                     if (window.confirm('Testni yakunlamasdan chiqmoqchimisiz? Natijangiz saqlanmaydi.')) {
                       setSelectedTest(null);
                     }
                   }} 
                   className="btn-secondary" 
                   style={{ border: 'none', padding: '0', background: 'transparent' }}
                 >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '800', color: 'var(--text-tertiary)' }}>
                     <ChevronLeft size={18} /> {t('tests.exit')}
                    </div>
                 </button>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', fontWeight: '800', fontSize: '18px', background: 'var(--primary-soft)', padding: '8px 20px', borderRadius: '12px' }}>
                    <Timer size={20} /> {formatTime(timeLeft)}
                 </div>
              </div>

              <div className="card-premium" style={{ padding: 'var(--p-modal)', minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
                 <div style={{ marginBottom: '40px' }}>
                    <span className="label-small" style={{ color: 'var(--primary)' }}>
                      {t('tests.question_nav', { current: currentQuestion + 1, total: selectedTest.questions.length })}
                    </span>
                    <div className="markdown-pro" style={{ fontSize: '22px', fontWeight: '700', marginTop: '16px', lineHeight: '1.6' }}>
                       <ReactMarkdown>{selectedTest.questions[currentQuestion].q || selectedTest.questions[currentQuestion].question}</ReactMarkdown>
                    </div>
                 </div>

                 <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                    {selectedTest.questions[currentQuestion].options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        style={{ 
                          textAlign: 'left', 
                          padding: '20px 28px', 
                          borderRadius: '14px', 
                          border: '1px solid', 
                          borderColor: answers[currentQuestion] === i ? 'var(--primary)' : 'var(--border)',
                          background: answers[currentQuestion] === i ? 'var(--primary-soft)' : 'var(--bg-app)',
                          color: answers[currentQuestion] === i ? 'var(--primary)' : 'var(--text-primary)',
                          fontSize: '16px',
                          fontWeight: '700',
                          cursor: 'pointer',
                          transition: '0.2s',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                           <span style={{ opacity: 0.3, width: '20px' }}>{String.fromCharCode(65 + i)}</span>
                           {opt}
                        </div>
                        {answers[currentQuestion] === i && <CheckCircle2 size={20} />}
                      </button>
                    ))}
                 </div>

                 <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'space-between' }}>
                    <button 
                      onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                      disabled={currentQuestion === 0}
                      className="btn-secondary"
                      style={{ opacity: currentQuestion === 0 ? 0.3 : 1 }}
                    >
                      {t('tests.prev')}
                    </button>
                    
                    {currentQuestion === selectedTest.questions.length - 1 ? (
                      <button onClick={handleFinish} className="btn-premium" style={{ background: 'var(--success)', borderColor: 'var(--success)' }}>
                         {t('lessons.finish')} <Send size={18} />
                      </button>
                    ) : (
                      <button onClick={() => setCurrentQuestion(prev => prev + 1)} className="btn-premium">
                         {t('lessons.next_lesson')} <ChevronRight size={18} />
                      </button>
                    )}
                 </div>
              </div>
            </div>

            {/* Right: Navigation Sidebar */}
            <div className="card-premium" style={{ padding: '32px', position: 'sticky', top: '24px' }}>
               <h4 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <HelpCircle size={18} color="var(--primary)" /> {t('tests.panel')}
               </h4>
               
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '32px' }}>
                  {selectedTest.questions.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestion(idx)}
                      style={{
                        height: '44px',
                        borderRadius: '10px',
                        border: '1px solid',
                        borderColor: currentQuestion === idx ? 'var(--primary)' : 
                                    answers[idx] !== undefined ? 'var(--success)' : 'var(--border)',
                        background: currentQuestion === idx ? 'var(--primary)' : 
                                   answers[idx] !== undefined ? 'var(--success-soft)' : 'var(--bg-app)',
                        color: currentQuestion === idx ? 'white' : 
                               answers[idx] !== undefined ? 'var(--success)' : 'var(--text-secondary)',
                        fontSize: '14px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        transition: '0.2s'
                      }}
                    >
                      {idx + 1}
                    </button>
                  ))}
               </div>

               <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <span style={{ color: 'var(--text-tertiary)' }}>{t('tests.marked')}:</span>
                        <span style={{ fontWeight: '800' }}>{Object.keys(answers).length}</span>
                        <span style={{ color: 'var(--text-tertiary)' }}>{t('tests.remaining')}:</span>
                        <span style={{ fontWeight: '800' }}>{selectedTest.questions.length - Object.keys(answers).length}</span>
                  </div>
               </div>

               {Object.keys(answers).length === selectedTest.questions.length && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: '24px', padding: '16px', borderRadius: '12px', background: 'var(--success-soft)', color: 'var(--success)', display: 'flex', gap: '10px', alignItems: 'center', fontSize: '12px', fontWeight: '700' }}
                  >
                     <AlertCircle size={16} /> {t('tests.completed')}
                  </motion.div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tests;
