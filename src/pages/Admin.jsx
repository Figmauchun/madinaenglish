import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  Plus, Search, Loader2, X, Sparkles, Trash2, Edit3, 
  Check, LayoutDashboard, BookOpen, BarChart3, Settings,
  LogOut, ClipboardList, CheckCircle2, XCircle, Clock, Save,
  Zap, ArrowRight, MessageSquare, List, GraduationCap, Medal,
  Shield, FileText, Download, Eye, Star, ChevronRight, ArrowLeft,
  Calendar, Info, HelpCircle, Type, FileJson, Layout, Layers, TrendingUp
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../App';

let API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
if (API_BASE_URL && !API_BASE_URL.endsWith('/api')) {
  API_BASE_URL = API_BASE_URL.replace(/\/$/, '') + '/api';
}

const Admin = () => {
  const { t } = useTranslation();
  const { showToast } = useToast();
  const certRef = useRef(null);
  const [activeTab, setActiveTab] = useState('dashboard'); 
  const [loading, setLoading] = useState(false);
  
  const [tests, setTests] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);

  const [showCreateTestForm, setShowCreateTestForm] = useState(false);
  const [showCreateLessonForm, setShowCreateLessonForm] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [testSearch, setTestSearch] = useState('');
  const [lessonSearch, setLessonSearch] = useState('');
  const [resultSearch, setResultSearch] = useState('');
  const [isLessonPreview, setIsLessonPreview] = useState(false);

  const [testForm, setTestForm] = useState({ title: '', description: '', duration: 30, questionCount: 10 });
  const [questionForm, setQuestionForm] = useState({ text: '', options: ['', '', '', ''], correct: 0 });
  const [lessonForm, setLessonForm] = useState({ title: '', category: 'Grammar', level: 'B1', duration: '20 min', content: '' });
  const [certForm, setCertForm] = useState({ studentName: '', courseName: 'English Language Course', level: 'Excellent ⭐⭐⭐⭐', date: '26.04.2026' });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  useEffect(() => {
    if (selectedLesson) {
      setLessonForm({
        title: selectedLesson.title,
        category: selectedLesson.category || 'Grammar',
        level: selectedLesson.level || 'B1',
        duration: selectedLesson.duration || '20 min',
        content: selectedLesson.content || ''
      });
    }
  }, [selectedLesson]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'tests' || activeTab === 'dashboard') {
        const { data } = await axios.get(`${API_BASE_URL}/tests`);
        const mappedTests = data.map(test => ({
          ...test,
          questions: (test.questions || []).map(q => ({
            q: q.question || q.q,
            options: q.options,
            correct: q.correctAnswer !== undefined ? q.correctAnswer : q.correct
          }))
        }));
        setTests(mappedTests);
        if (mappedTests.length > 0 && activeTab === 'tests') {
           if (selectedTest) {
             const updated = mappedTests.find(t => t._id === selectedTest._id);
             if (updated) setSelectedTest(updated);
           } else {
             setSelectedTest(mappedTests[0]);
           }
        }
      } 
      
      if (activeTab === 'lessons' || activeTab === 'dashboard') {
        const { data } = await axios.get(`${API_BASE_URL}/lessons`);
        setLessons(data);
        if (data.length > 0 && !selectedLesson && activeTab === 'lessons') setSelectedLesson(data[0]);
      } 
      
      if (activeTab === 'results' || activeTab === 'dashboard') {
        const { data } = await axios.get(`${API_BASE_URL}/results`);
        setResults(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const triggerToast = (msg, type = 'success') => {
    showToast(msg, type);
  };

  const handleExportResults = () => {
    if (results.length === 0) return triggerToast('No data to export.', 'error');
    
    const headers = ['Student Name', 'Test Name', 'Score (%)', 'Date', 'Time'];
    const csvRows = [
      headers.join(','),
      ...results.map(r => {
        const d = new Date(r.date);
        return [
          `"${r.studentName}"`,
          `"${r.testName}"`,
          r.score,
          d.toLocaleDateString(),
          d.toLocaleTimeString()
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `Academic_Results_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    triggerToast('Export matrix downloaded.');
  };

  const handleCreateTest = async () => {
    if (!testForm.title) return;
    setLoading(true);
    try {
       const { data } = await axios.post(`${API_BASE_URL}/tests`, { 
          title: testForm.title, 
          questions: [], 
          duration: testForm.duration 
       });
       setTests([...tests, data]);
       setSelectedTest(data);
       setTestForm({ ...testForm, title: '' });
       setShowCreateTestForm(false);
       triggerToast('Unit initialized in repository.');
    } catch (error) {
       triggerToast('Initialization failure.', 'error');
    } finally {
       setLoading(false);
    }
  };

  const handleCreateLesson = async () => {
    if (!lessonForm.title) return;
    setLoading(true);
    try {
       const { data } = await axios.post(`${API_BASE_URL}/lessons`, { 
          title: lessonForm.title, 
          category: 'Grammar', 
          level: lessonForm.level, 
          duration: lessonForm.duration, 
          content: '' 
       });
       setLessons([...lessons, data]);
       setSelectedLesson(data);
       setLessonForm({ ...lessonForm, title: '' });
       setShowCreateLessonForm(false);
       triggerToast('Module commissioned to core.');
    } catch (error) {
       triggerToast('Commission failure.', 'error');
    } finally {
       setLoading(false);
    }
  };

  const handleGenerateLesson = async () => {
    if (!selectedLesson) return;
    setLoading(true);
    try {
       const response = await axios.post(`${API_BASE_URL}/generate-lesson`, {
          topic: selectedLesson.title,
          level: lessonForm.level
       });
       setLessonForm({
          ...lessonForm,
          content: response.data.content,
          duration: lessonForm.duration || '20 min'
       });
       triggerToast('Academic content synthesized.');
    } catch (error) {
       console.error(error);
       triggerToast('Synthesis failure.', 'error');
    } finally {
       setLoading(false);
    }
  };

  const handleGenerateTest = async () => {
    if (!selectedTest) return;
    setLoading(true);
    try {
       const response = await axios.post(`${API_BASE_URL}/generate-test`, {
          topic: selectedTest.title,
          level: 'Intermediate',
          count: testForm.questionCount || 10,
          timeLimit: testForm.duration || 30
       });
       
       const questions = response.data.questions || [];
       const generatedQuestions = questions.map(q => ({
          q: q.question || q.q || 'Empty Question',
          options: q.options || ['A', 'B', 'C', 'D'],
          correct: q.correctAnswer !== undefined ? q.correctAnswer : (q.correct !== undefined ? q.correct : 0)
       }));

       setSelectedTest({
          ...selectedTest,
          timeLimit: response.data.timeLimit || testForm.duration || 30,
          questions: generatedQuestions
       });
       triggerToast('Matrix synthesized. Review and click SAVE.');
    } catch (error) {
       console.error(error);
       triggerToast('AI Core failure.', 'error');
    } finally {
       setLoading(false);
    }
  };

  const handleSaveLesson = async () => {
    if (!selectedLesson) return;
    setLoading(true);
    try {
       const url = selectedLesson._id ? `${API_BASE_URL}/lessons/${selectedLesson._id}` : `${API_BASE_URL}/lessons`;
       const method = selectedLesson._id ? 'put' : 'post';
       
       await axios[method](url, {
          ...selectedLesson,
          ...lessonForm
       });
       fetchData();
       triggerToast('Lesson architecture archived.');
    } catch (error) {
       console.error(error);
       triggerToast('Archive failure.', 'error');
    } finally {
       setLoading(false);
    }
  };

  const handleSaveTest = async () => {
    if (!selectedTest) return;
    setLoading(true);
    try {
       const mappedQuestions = (selectedTest.questions || []).map(q => ({
          question: q.q,
          options: q.options,
          correctAnswer: q.correct
       }));

       const url = selectedTest._id ? `${API_BASE_URL}/tests/${selectedTest._id}` : `${API_BASE_URL}/tests`;
       const method = selectedTest._id ? 'put' : 'post';

       await axios[method](url, {
          ...selectedTest,
          timeLimit: testForm.duration || selectedTest.timeLimit || 30,
          questions: mappedQuestions
       });
       fetchData();
       triggerToast('Test matrix committed.');
    } catch (error) {
       console.error(error);
       triggerToast('Commit failure.', 'error');
    } finally {
       setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    if (!selectedTest || !questionForm.text) return;
    const newQuestion = {
       q: questionForm.text,
       options: [...questionForm.options],
       correct: questionForm.correct
    };
    setSelectedTest({
       ...selectedTest,
       questions: [...(selectedTest.questions || []), newQuestion]
    });
    setQuestionForm({ text: '', options: ['', '', '', ''], correct: 0 });
    triggerToast('Item added to matrix.');
  };

  const handleDeleteLesson = async (id) => {
    if (!window.confirm('Erase this module from repository?')) return;
    try {
       await axios.delete(`${API_BASE_URL}/lessons/${id}`);
       fetchData();
       if (selectedLesson?._id === id) setSelectedLesson(null);
       triggerToast('Module purged.');
    } catch (error) {
       triggerToast('Purge failure.', 'error');
    }
  };

  const handleDeleteTest = async (id) => {
    if (!window.confirm('Decommission this test matrix?')) return;
    try {
       await axios.delete(`${API_BASE_URL}/tests/${id}`);
       fetchData();
       if (selectedTest?._id === id) setSelectedTest(null);
       triggerToast('Matrix decommissioned.');
    } catch (error) {
       triggerToast('Decommission failure.', 'error');
    }
  };

  const handleDownloadCert = async () => {
    if (!certRef.current) return;
    setLoading(true);
    try {
       const width = certRef.current.offsetWidth;
       const height = certRef.current.offsetHeight;
       const canvas = await html2canvas(certRef.current, {
          scale: 3,
          useCORS: true,
          backgroundColor: '#ffffff',
          width: width,
          height: height,
          scrollX: 0,
          scrollY: 0,
          onclone: (clonedDoc) => {
             const clonedElem = clonedDoc.getElementById('cert-element');
             if (clonedElem) {
                clonedElem.style.position = 'fixed';
                clonedElem.style.top = '0';
                clonedElem.style.left = '0';
                clonedElem.style.zIndex = '999999';
                clonedElem.style.transform = 'none';
                clonedElem.style.margin = '0';
                clonedElem.style.boxShadow = 'none';
             }
          }
       });
       const imgData = canvas.toDataURL('image/png');
       const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [width, height]
       });
       pdf.addImage(imgData, 'PNG', 0, 0, width, height);
       pdf.save(`Certificate_${certForm.studentName.replace(/\s+/g, '_')}.pdf`);
       triggerToast('Export sequence completed.');
    } catch (error) {
       console.error(error);
       triggerToast('Export failure.', 'error');
    } finally {
       setLoading(false);
    }
  };

  const handleUploadCert = async () => {
     if (!certForm.studentName || !certForm.courseName) {
        return triggerToast('Student name and program are required.', 'error');
     }
     setLoading(true);
     try {
        await axios.post(`${API_BASE_URL}/results`, {
           studentName: certForm.studentName,
           testName: certForm.courseName,
           score: 100,
           answers: []
        });
        triggerToast("Sertifikat sertifikatlar bo'limiga muvaffaqiyatli yuklandi!");
     } catch (error) {
        console.error(error);
        triggerToast('Sertifikatni yuklashda xatolik.', 'error');
     } finally {
        setLoading(false);
     }
  };

  const StatCard = ({ icon, label, value, trend, color }) => (
    <motion.div whileHover={{ y: -5 }} className="card-premium" style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
         <div style={{ background: color, color: 'white', width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
         </div>
         <span style={{ fontSize: '10px', fontWeight: '900', color: color, background: `${color}15`, padding: '4px 8px', borderRadius: '6px' }}>{trend}</span>
      </div>
      <div className="label-small">{label}</div>
      <div style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '-0.02em' }}>{value}</div>
    </motion.div>
  );

  return (
    <div className="animate-fade-up">
      <div className="flex-between flex-stack-mobile" style={{ marginBottom: '40px', borderBottom: '1px solid var(--border)', paddingBottom: '32px' }}>
         <div>
            <span className="label-small" style={{ color: 'var(--primary)', letterSpacing: '0.1em' }}>ADMINISTRATION SYSTEM V2.0</span>
            <h1 className="display-text" style={{ fontSize: 'var(--f-h1)', marginTop: '8px' }}>Control Center</h1>
            <p style={{ fontSize: '15px', color: 'var(--text-secondary)', fontWeight: '500', marginTop: '4px' }}>Strategic management of academic modules and intelligence.</p>
         </div>
         <div style={{ display: 'flex', background: 'var(--border-soft)', padding: '6px', borderRadius: '16px', gap: '4px', overflowX: 'auto', maxWidth: '100%' }} className="no-scrollbar">
            {['dashboard', 'tests', 'lessons', 'certificate', 'results'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)} 
                style={{ 
                  border: 'none', 
                  background: activeTab === tab ? 'var(--bg-card)' : 'transparent',
                  color: activeTab === tab ? 'var(--primary)' : 'var(--text-secondary)',
                  padding: '10px 20px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  transition: '0.2s',
                  boxShadow: activeTab === tab ? 'var(--shadow-sm)' : 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
         </div>
      </div>

      <div style={{ minHeight: '700px' }}>
          {activeTab === 'dashboard' && (
             <div className="animate-fade-up">
                <div className="grid-4" style={{ marginBottom: '40px' }}>
                   <StatCard icon={<Layers size={20} />} label="Total Units" value={lessons.length} trend="+2 new" color="#4f46e5" />
                   <StatCard icon={<ClipboardList size={20} />} label="Active Tests" value={tests.length} trend="142 sub" color="#8b5cf6" />
                   <StatCard icon={<CheckCircle2 size={20} />} label="Audited Results" value={results.length} trend="98% acc" color="#10b981" />
                   <StatCard icon={<TrendingUp size={20} />} label="Avg Proficiency" value={results.length ? `${Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length)}%` : '0%'} trend="B2+ Avg" color="#f59e0b" />
                </div>

                <div className="grid-2">
                   <div className="card-premium" style={{ padding: '32px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                         <h3 className="display-text" style={{ fontSize: '18px' }}>Recent Academic Activity</h3>
                         <button onClick={() => setActiveTab('results')} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '12px' }}>Audit All</button>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                         {results.slice(0, 5).map((res, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: 'var(--bg-app)', borderRadius: '16px', border: '1px solid var(--border-soft)' }}>
                               <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800' }}>{res.studentName[0]}</div>
                                  <div>
                                     <div style={{ fontSize: '14px', fontWeight: '800' }}>{res.studentName}</div>
                                     <div style={{ fontSize: '11px', color: 'var(--text-tertiary)', fontWeight: '700' }}>{res.testName} • {new Date(res.date).toLocaleDateString()}</div>
                                  </div>
                               </div>
                               <div style={{ fontSize: '14px', fontWeight: '900', color: res.score >= 80 ? 'var(--success)' : 'var(--text-primary)' }}>{res.score}%</div>
                            </div>
                         ))}
                         {results.length === 0 && <div style={{ textAlign: 'center', padding: '40px', opacity: 0.3 }}>No recent activity detected.</div>}
                      </div>
                   </div>

                   <div className="card-premium" style={{ padding: '32px', background: 'var(--primary)', color: 'white', border: 'none' }}>
                      <Zap size={32} style={{ marginBottom: '24px', color: 'rgba(255,255,255,0.6)' }} />
                      <h3 className="display-text" style={{ fontSize: '22px', color: 'white', marginBottom: '12px' }}>System Integrity</h3>
                      <p style={{ fontSize: '14px', opacity: 0.8, lineHeight: '1.6', marginBottom: '32px' }}>All academic modules are synchronized. Gemini AI engine is responsive with low latency.</p>
                      
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700' }}>API Status</span>
                            <span style={{ background: '#10b981', padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '900' }}>OPERATIONAL</span>
                         </div>
                         <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '100px' }}>
                            <div style={{ width: '94%', height: '100%', background: 'white', borderRadius: '100px' }} />
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'tests' && (
             <div className="flex-stack-mobile" style={{ display: 'flex', gap: '40px', alignItems: 'start' }}>
                <div className="card-premium" style={{ padding: '24px', width: '100%', maxWidth: '320px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '900', color: 'var(--text-primary)' }}>TESTS ({tests.length})</h3>
                      <button onClick={() => setShowCreateTestForm(!showCreateTestForm)} className="btn-secondary" style={{ width: '32px', height: '32px', padding: '0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         {showCreateTestForm ? <X size={16} /> : <Plus size={16} />}
                      </button>
                   </div>
                   <AnimatePresence>
                      {showCreateTestForm && (
                         <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginBottom: '20px', padding: '16px', background: 'var(--bg-app)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                               <label className="label-small">UNIT IDENTIFIER</label>
                               <input className="auth-input" style={{ fontSize: '13px', height: '42px' }} placeholder="e.g. Present Simple *" value={testForm.title} onChange={e => setTestForm({...testForm, title: e.target.value})} />
                               
                               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                  <div>
                                     <label className="label-small">MINUTES</label>
                                     <input type="number" className="auth-input" style={{ height: '42px', fontSize: '13px' }} value={testForm.duration} onChange={e => setTestForm({...testForm, duration: parseInt(e.target.value)})} />
                                  </div>
                                  <div>
                                     <label className="label-small">QUESTIONS</label>
                                     <input type="number" className="auth-input" style={{ height: '42px', fontSize: '13px' }} value={testForm.questionCount} onChange={e => setTestForm({...testForm, questionCount: parseInt(e.target.value)})} />
                                  </div>
                               </div>

                               <button onClick={handleCreateTest} disabled={loading} className="btn-premium" style={{ height: '42px', fontSize: '13px', marginTop: '8px' }}>
                                  {loading ? 'Initializing...' : 'Create Unit'}
                               </button>
                            </div>
                         </motion.div>
                      )}
                   </AnimatePresence>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ position: 'relative' }}>
                         <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                         <input className="auth-input" style={{ height: '38px', paddingLeft: '36px', fontSize: '13px' }} placeholder="Filter units..." value={testSearch} onChange={e => setTestSearch(e.target.value)} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                         {tests.filter(t => t.title.toLowerCase().includes(testSearch.toLowerCase())).map(test => (
                            <div key={test._id} onClick={() => setSelectedTest(test)} style={{ padding: '14px 16px', borderRadius: '10px', border: '1px solid', borderColor: selectedTest?._id === test._id ? 'var(--primary)' : 'transparent', background: selectedTest?._id === test._id ? 'var(--primary-soft)' : 'transparent', cursor: 'pointer', transition: '0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                               <span style={{ fontSize: '14px', fontWeight: '800', color: selectedTest?._id === test._id ? 'var(--text-primary)' : 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{test.title}</span>
                               <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                  <button onClick={(e) => { e.stopPropagation(); handleDeleteTest(test._id); }} style={{ background: 'transparent', border: 'none', color: 'var(--error)', padding: '4px', opacity: 0.3, transition: '0.2s' }}>
                                     <Trash2 size={14} />
                                  </button>
                                  {selectedTest?._id === test._id && <ChevronRight size={14} color="var(--primary)" />}
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
                <div className="grid-2">
                   <div className="card-premium" style={{ minHeight: '600px', padding: 'var(--p-modal)' }}>
                      {selectedTest ? (
                         <>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingBottom: '32px', borderBottom: '1px solid var(--border)' }}>
                               <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                  <div style={{ background: 'var(--primary)', color: 'white', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><HelpCircle size={24} /></div>
                                  <h2 style={{ fontSize: '20px', fontWeight: '900' }}>{selectedTest.title}</h2>
                               </div>
                               <div style={{ display: 'flex', gap: '12px' }}>
                                  <button disabled={loading} onClick={handleSaveTest} className="btn-secondary" style={{ height: '44px', padding: '0 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', opacity: loading ? 0.5 : 1 }}>
                                     <Save size={18} /> {loading ? 'Saving...' : 'Save Test'}
                                  </button>
                                  <button disabled={loading} onClick={handleGenerateTest} className="btn-secondary" style={{ height: '44px', padding: '0 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', opacity: loading ? 0.5 : 1 }}>
                                     <Sparkles size={16} /> {loading ? 'Core Engaged...' : 'AI synthesis'}
                                  </button>
                               </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {selectedTest.questions?.length > 0 ? selectedTest.questions.map((q, idx) => (
                                   <div key={idx} style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--bg-app)', position: 'relative' }}>
                                      <div style={{ marginBottom: '16px', paddingRight: '40px' }}>
                                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: '900', color: 'var(--primary)', background: 'var(--primary-soft)', padding: '2px 8px', borderRadius: '4px' }}>QUESTION {idx + 1}</span>
                                         </div>
                                         <p style={{ fontWeight: '700', fontSize: '15px', lineHeight: '1.6' }}>{q.q}</p>
                                      </div>
                                      
                                      <div className="grid-2" style={{ gap: '10px' }}>
                                         {q.options?.map((opt, i) => (
                                            <div key={i} style={{ 
                                               fontSize: '13px', 
                                               padding: '10px 16px', 
                                               borderRadius: '10px', 
                                               background: q.correct === i ? 'var(--primary-soft)' : 'var(--bg-card)', 
                                               border: '1px solid', 
                                               borderColor: q.correct === i ? 'var(--primary)' : 'var(--border)', 
                                               color: q.correct === i ? 'var(--primary)' : 'var(--text-secondary)',
                                               display: 'flex',
                                               justifyContent: 'space-between',
                                               alignItems: 'center',
                                               fontWeight: q.correct === i ? '700' : '500'
                                            }}>
                                               <span>{String.fromCharCode(65 + i)}. {opt}</span>
                                               {q.correct === i && <Check size={14} />}
                                            </div>
                                         ))}
                                      </div>

                                      <div style={{ position: 'absolute', top: '24px', right: '24px', display: 'flex', gap: '8px' }}>
                                         <button onClick={() => {
                                            setQuestionForm({ text: q.q, options: [...q.options], correct: q.correct });
                                            const newQs = [...selectedTest.questions];
                                            newQs.splice(idx, 1);
                                            setSelectedTest({...selectedTest, questions: newQs});
                                            triggerToast('Item moved to editor.');
                                         }} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', opacity: 0.5 }}>
                                            <Edit3 size={16} />
                                         </button>
                                         <button onClick={() => {
                                            const newQs = [...selectedTest.questions];
                                            newQs.splice(idx, 1);
                                            setSelectedTest({...selectedTest, questions: newQs});
                                         }} style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', opacity: 0.5 }}>
                                            <Trash2 size={16} />
                                         </button>
                                      </div>
                                   </div>
                                )) : <div style={{ textAlign: 'center', padding: '100px 0', opacity: 0.3, fontSize: '13px' }}>Empty repository. Please generate or add items.</div>}
                            </div>
                         </>
                      ) : <div style={{ textAlign: 'center', padding: '100px 0', opacity: 0.3 }}>Identify unit.</div>}
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                      <div className="card-premium" style={{ padding: '32px' }}>
                         <h3 className="label-small" style={{ marginBottom: '24px' }}>UNIT PROPERTIES</h3>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                               <label className="label-small">DURATION (MINUTES)</label>
                               <input type="number" className="auth-input" style={{ height: '42px', fontSize: '13px' }} value={testForm.duration} onChange={e => setTestForm({...testForm, duration: parseInt(e.target.value)})} />
                            </div>
                            <div>
                               <label className="label-small">AI QUESTION TARGET</label>
                               <input type="number" className="auth-input" style={{ height: '42px', fontSize: '13px' }} value={testForm.questionCount} onChange={e => setTestForm({...testForm, questionCount: parseInt(e.target.value)})} />
                            </div>
                         </div>
                      </div>
                      <div className="card-premium" style={{ padding: '32px' }}>
                         <h3 className="label-small" style={{ marginBottom: '24px' }}>NEW ITEM CONFIG</h3>
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div>
                               <label className="label-small">QUESTION STEM</label>
                               <textarea className="auth-input" style={{ minHeight: '100px', fontSize: '13px', padding: '16px' }} placeholder="..." value={questionForm.text} onChange={e => setQuestionForm({...questionForm, text: e.target.value})} />
                            </div>
                            <div>
                               <label className="label-small">OPTIONS MATRIX</label>
                               <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                                  {questionForm.options.map((opt, i) => (
                                     <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <button onClick={() => setQuestionForm({...questionForm, correct: i})} style={{ flexShrink: 0, width: '22px', height: '22px', borderRadius: '50%', border: '2px solid var(--border)', borderColor: questionForm.correct === i ? 'var(--primary)' : 'var(--border)', background: questionForm.correct === i ? 'var(--primary)' : 'transparent', transition: '0.2s', boxShadow: questionForm.correct === i ? 'inset 0 0 0 4px var(--bg-card)' : 'none' }} />
                                        <input className="auth-input" style={{ height: '42px', fontSize: '13px' }} placeholder={String.fromCharCode(65 + i)} value={opt} onChange={e => {
                                           const newOpts = [...questionForm.options];
                                           newOpts[i] = e.target.value;
                                           setQuestionForm({...questionForm, options: newOpts});
                                        }} />
                                     </div>
                                  ))}
                               </div>
                            </div>
                            <button onClick={handleAddQuestion} className="btn-premium" style={{ width: '100%', height: '56px', background: 'var(--primary)', marginTop: '24px' }}>
                               <Plus size={18} /> Add to Matrix
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          )}
          
          {activeTab === 'lessons' && (
             <div className="flex-stack-mobile" style={{ display: 'flex', gap: '40px', alignItems: 'start' }}>
                <div className="card-premium" style={{ padding: '24px', width: '100%', maxWidth: '320px' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <h3 style={{ fontSize: '14px', fontWeight: '900' }}>LESSONS ({lessons.length})</h3>
                      <button onClick={() => setShowCreateLessonForm(!showCreateLessonForm)} className="btn-secondary" style={{ width: '32px', height: '32px', padding: '0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                         {showCreateLessonForm ? <X size={16} /> : <Plus size={16} />}
                      </button>
                   </div>
                   <AnimatePresence>
                      {showCreateLessonForm && (
                         <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginBottom: '20px', padding: '16px', background: 'var(--bg-app)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                               <label className="label-small">MODULE TITLE</label>
                               <input className="auth-input" style={{ fontSize: '13px', height: '42px' }} placeholder="e.g. Irregular Verbs" value={lessonForm.title} onChange={e => setLessonForm({...lessonForm, title: e.target.value})} />
                               
                               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                  <div>
                                     <label className="label-small">LEVEL</label>
                                     <select className="auth-input" style={{ height: '42px', fontSize: '13px', padding: '0 10px' }} value={lessonForm.level} onChange={e => setLessonForm({...lessonForm, level: e.target.value})}>
                                        <option>A1</option><option>A2</option><option>B1</option><option>B2</option><option>C1</option>
                                     </select>
                                  </div>
                                  <div>
                                     <label className="label-small">TARGET TIME</label>
                                     <input className="auth-input" style={{ height: '42px', fontSize: '13px' }} placeholder="20 min" value={lessonForm.duration} onChange={e => setLessonForm({...lessonForm, duration: e.target.value})} />
                                  </div>
                               </div>

                               <button onClick={handleCreateLesson} disabled={loading} className="btn-premium" style={{ height: '42px', fontSize: '13px', marginTop: '8px' }}>
                                  {loading ? 'Commissioning...' : 'Create Module'}
                               </button>
                            </div>
                         </motion.div>
                      )}
                   </AnimatePresence>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div style={{ position: 'relative' }}>
                         <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                         <input className="auth-input" style={{ height: '38px', paddingLeft: '36px', fontSize: '13px' }} placeholder="Filter modules..." value={lessonSearch} onChange={e => setLessonSearch(e.target.value)} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                         {lessons.filter(l => l.title.toLowerCase().includes(lessonSearch.toLowerCase())).map(lesson => (
                            <div key={lesson._id} onClick={() => setSelectedLesson(lesson)} style={{ padding: '18px', borderRadius: '12px', border: '1px solid', borderColor: selectedLesson?._id === lesson._id ? 'var(--primary)' : 'transparent', background: selectedLesson?._id === lesson._id ? 'rgba(99, 102, 241, 0.05)' : 'transparent', cursor: 'pointer', transition: '0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                               <span style={{ fontSize: '14px', fontWeight: '800', color: selectedLesson?._id === lesson._id ? 'var(--text-primary)' : 'var(--text-secondary)', lineHeight: '1.4', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lesson.title}</span>
                               <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                  <button onClick={(e) => { e.stopPropagation(); handleDeleteLesson(lesson._id); }} style={{ background: 'transparent', border: 'none', color: 'var(--error)', padding: '4px', opacity: 0.3, transition: '0.2s' }}>
                                     <Trash2 size={14} />
                                  </button>
                                  {selectedLesson?._id === lesson._id && <ChevronRight size={14} color="var(--primary)" />}
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                </div>
                <div className="card-premium" style={{ minHeight: '700px', padding: '0' }}>
                   {selectedLesson ? (
                      <>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '40px', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1 }}>
                               <div style={{ background: 'var(--primary)', color: 'white', width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BookOpen size={24} /></div>
                               <h2 style={{ fontSize: '22px', fontWeight: '900', maxWidth: '600px', lineHeight: '1.3' }}>{selectedLesson.title}</h2>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                               <button disabled={loading} onClick={handleGenerateLesson} className="btn-secondary" style={{ height: '52px', padding: '0 20px', fontSize: '13px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '2px', opacity: loading ? 0.5 : 1 }}>
                                  <Sparkles size={16} /> <span>{loading ? 'Synthesizing...' : 'AI Synthesis'}</span>
                               </button>
                               <button onClick={handleSaveLesson} className="btn-premium" style={{ height: '52px', padding: '0 24px', fontSize: '14px', background: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '10px', whiteSpace: 'nowrap' }}>
                                  <Save size={18} /> <span>Save Module</span>
                               </button>
                            </div>
                         </div>
                         <div className="grid-2" style={{ padding: 'var(--p-card)', gap: '48px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <label className="label-small">ACADEMIC CONTENT (MARKDOWN)</label>
                                  <div style={{ display: 'flex', gap: '8px', background: 'var(--border-soft)', padding: '4px', borderRadius: '8px' }}>
                                      <button onClick={() => setIsLessonPreview(false)} style={{ border: 'none', background: !isLessonPreview ? 'var(--bg-card)' : 'transparent', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', color: 'var(--text-primary)' }}>EDIT</button>
                                      <button onClick={() => setIsLessonPreview(true)} style={{ border: 'none', background: isLessonPreview ? 'var(--bg-card)' : 'transparent', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', color: 'var(--text-primary)' }}>PREVIEW</button>
                                   </div>
                               </div>
                               {!isLessonPreview ? (
                                  <textarea className="auth-input" style={{ minHeight: '450px', fontSize: '14px', lineHeight: '1.8', padding: '32px', border: '1px solid var(--border)', background: 'var(--bg-app)', borderRadius: '16px' }} placeholder="Synthesize academic content here..." value={lessonForm.content} onChange={e => setLessonForm({...lessonForm, content: e.target.value})}></textarea>
                               ) : (
                                  <div className="card-premium" style={{ minHeight: '450px', padding: '40px', background: 'var(--bg-app)', overflowY: 'auto', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{lessonForm.content}</div>
                               )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                               <div className="card-premium" style={{ background: 'var(--bg-app)', padding: '24px', border: '1px solid var(--border)' }}>
                                  <h4 className="label-small" style={{ marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '12px', color: 'var(--text-primary)' }}>PROPERTIES</h4>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                     <div>
                                        <label style={{ fontSize: '11px', fontWeight: '900', opacity: 0.6 }}>DIFFICULTY LEVEL</label>
                                        <select className="auth-input" style={{ height: '48px', fontSize: '14px', marginTop: '8px', padding: '0 16px' }} value={lessonForm.level} onChange={e => setLessonForm({...lessonForm, level: e.target.value})}>
                                           <option>Beginner (A1-A2)</option>
                                           <option>Intermediate (B1-B2)</option>
                                           <option>Advanced (C1-C2)</option>
                                        </select>
                                     </div>
                                     <div>
                                        <label style={{ fontSize: '11px', fontWeight: '900', opacity: 0.6 }}>DURATION TARGET</label>
                                        <input className="auth-input" style={{ height: '48px', fontSize: '14px', marginTop: '8px', padding: '0 16px' }} value={lessonForm.duration} onChange={e => setLessonForm({...lessonForm, duration: e.target.value})} />
                                     </div>
                                  </div>
                               </div>
                               <div style={{ padding: '32px', borderRadius: '20px', border: '1px dashed var(--border)', background: 'rgba(0,0,0,0.01)', textAlign: 'center' }}>
                                  <Layout size={32} style={{ margin: '0 auto 16px', opacity: 0.1 }} />
                                  <p style={{ fontSize: '12px', lineHeight: '1.6', opacity: 0.4, fontWeight: '500' }}>Preview mode generates an authentic student visualization of this academic unit.</p>
                               </div>
                            </div>
                         </div>
                      </>
                   ) : <div style={{ textAlign: 'center', padding: '150px 0', opacity: 0.3 }}>Identify module for architecting.</div>}
                </div>
             </div>
          )}

          {activeTab === 'certificate' && (
             <div className="grid-2">
                <div className="card-premium" style={{ padding: 'var(--p-card)', overflow: 'hidden' }}>
                   <h3 className="label-small" style={{ marginBottom: '32px' }}>LIVE PREVIEW</h3>
                   <div style={{ overflowX: 'auto', padding: '10px' }}>
                      <div ref={certRef} id="cert-element" style={{ width: '1122px', height: '793px', background: 'white', border: '20px solid #8b5cf6', padding: '80px', position: 'relative', color: '#1a1a1a', boxSizing: 'border-box', boxShadow: 'var(--shadow-lg)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '50px' }}>
                         <img src="/assets/newlogo.png" style={{ width: '100px' }} alt="Logo" />
                         <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '12px', fontWeight: '800', color: '#8b5cf6' }}>MISS MADINA ACADEMY</div>
                            <div style={{ fontSize: '10px', opacity: 0.5 }}>VERIFIED CREDENTIAL</div>
                         </div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                         <h1 style={{ fontSize: '56px', fontWeight: '900', letterSpacing: '-0.04em', margin: '0' }}>CERTIFICATE</h1>
                         <p style={{ fontSize: '14px', fontWeight: '700', letterSpacing: '0.2em', opacity: 0.5, marginBottom: '80px' }}>OF EXCELLENCE & PROFICIENCY</p>
                         <div style={{ marginBottom: '50px' }}>
                            <p style={{ fontSize: '13px', fontWeight: '600', opacity: 0.4 }}>THIS IS TO OFFICIALLY RECOGNIZE</p>
                            <h2 style={{ fontSize: '38px', fontWeight: '800', borderBottom: '2px solid #eee', display: 'inline-block', padding: '0 40px 10px' }}>{certForm.studentName || 'Student Name'}</h2>
                         </div>
                         <p style={{ fontSize: '16px', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto 80px' }}>
                            For successfully completing the <b>{certForm.courseName}</b> with a proficiency level rated as <b>{certForm.level}</b>.
                         </p>
                         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '60px' }}>
                            <div style={{ textAlign: 'left' }}>
                               <div style={{ fontSize: '12px', fontWeight: '800' }}>{certForm.date}</div>
                               <div style={{ fontSize: '10px', opacity: 0.5 }}>ISSUE DATE</div>
                            </div>
                            <div>
                               <div style={{ fontFamily: "'Great Vibes', cursive", fontSize: '38px', borderBottom: '1px solid #000', marginBottom: '4px', paddingBottom: '0' }}>Miss Madina</div>
                               <div style={{ fontSize: '10px', opacity: 0.5 }}>ACADEMY DIRECTOR</div>
                            </div>
                         </div>
                       </div>
                    </div>
                 </div>
                </div>
                <div className="card-premium" style={{ padding: '32px' }}>
                   <h3 className="label-small" style={{ marginBottom: '32px' }}>CONFIGURATION</h3>
                   <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <div>
                         <label className="label-small">STUDENT IDENTITY</label>
                         <input className="auth-input" value={certForm.studentName} onChange={e => setCertForm({...certForm, studentName: e.target.value})} placeholder="Full legal name..." />
                      </div>
                      <div>
                         <label className="label-small">ACADEMIC PROGRAM</label>
                         <input className="auth-input" value={certForm.courseName} onChange={e => setCertForm({...certForm, courseName: e.target.value})} />
                      </div>
                      <div>
                         <label className="label-small">PROFICIENCY RATING</label>
                         <input className="auth-input" value={certForm.level} onChange={e => setCertForm({...certForm, level: e.target.value})} />
                      </div>
                      <button disabled={loading} onClick={handleDownloadCert} className="btn-premium" style={{ height: '56px', marginTop: '24px' }}>
                         {loading ? <Loader2 className="animate-spin" /> : <Download size={18} />} 
                         {loading ? 'Generating PDF...' : 'Export Official PDF'}
                      </button>
                      <button disabled={loading} onClick={handleUploadCert} className="btn-secondary" style={{ height: '56px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                         {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18} />} 
                         {loading ? 'Saving...' : "Sertifikatlar bo'limiga yuklash"}
                      </button>
                   </div>
                </div>
             </div>
          )}
          
          {activeTab === 'results' && (
            <div className="card-premium" style={{ padding: 'var(--p-card)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                  <div style={{ flex: 1, position: 'relative', maxWidth: '400px' }}>
                     <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
                     <input className="auth-input" style={{ paddingLeft: '48px' }} placeholder="Search student or test..." value={resultSearch} onChange={e => setResultSearch(e.target.value)} />
                  </div>
                  <button onClick={handleExportResults} className="btn-premium" style={{ background: 'var(--success)' }}>
                     <Download size={18} /> Export CSV
                  </button>
               </div>
               <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                     <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                           <th style={{ padding: '20px', fontSize: '11px', fontWeight: '900', color: 'var(--text-tertiary)' }}>STUDENT IDENTITY</th>
                           <th style={{ padding: '20px', fontSize: '11px', fontWeight: '900', color: 'var(--text-tertiary)' }}>ACADEMIC UNIT</th>
                           <th style={{ padding: '20px', fontSize: '11px', fontWeight: '900', color: 'var(--text-tertiary)' }}>PROFICIENCY SCORE</th>
                           <th style={{ padding: '20px', fontSize: '11px', fontWeight: '900', color: 'var(--text-tertiary)' }}>TIMESTAMP</th>
                           <th style={{ padding: '20px', fontSize: '11px', fontWeight: '900', color: 'var(--text-tertiary)' }}>ACTIONS</th>
                        </tr>
                     </thead>
                     <tbody>
                        {results.filter(r => r.studentName.toLowerCase().includes(resultSearch.toLowerCase()) || r.testName.toLowerCase().includes(resultSearch.toLowerCase())).map((res, i) => (
                           <tr key={i} style={{ borderBottom: '1px solid var(--border-soft)', transition: '0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-app)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                              <td style={{ padding: '20px' }}>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px' }}>{res.studentName[0]}</div>
                                    <span style={{ fontWeight: '700', fontSize: '14px' }}>{res.studentName}</span>
                                 </div>
                              </td>
                              <td style={{ padding: '20px', fontSize: '14px', fontWeight: '500' }}>{res.testName}</td>
                              <td style={{ padding: '20px' }}>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '100px', height: '6px', background: 'var(--border-soft)', borderRadius: '10px', overflow: 'hidden' }}>
                                       <div style={{ height: '100%', background: res.score >= 80 ? 'var(--success)' : (res.score >= 50 ? '#f59e0b' : 'var(--error)'), width: `${res.score}%` }} />
                                    </div>
                                    <span style={{ fontSize: '13px', fontWeight: '800', color: res.score >= 80 ? 'var(--success)' : (res.score >= 50 ? '#f59e0b' : 'var(--error)') }}>{res.score}%</span>
                                 </div>
                              </td>
                              <td style={{ padding: '20px', fontSize: '13px', color: 'var(--text-secondary)' }}>{new Date(res.date).toLocaleDateString()}</td>
                              <td style={{ padding: '20px' }}>
                                 <button onClick={() => { setSelectedResult(res); setShowDetailsModal(true); }} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '11px' }}>Full Audit</button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}
      </div>

      <AnimatePresence>
         {showDetailsModal && selectedResult && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(8px)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
               <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="card-premium" style={{ maxWidth: '800px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: '48px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                     <div>
                        <h2 className="display-text" style={{ fontSize: '24px' }}>Academic Transcript</h2>
                        <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Full performance audit for {selectedResult.studentName}</p>
                     </div>
                     <button onClick={() => setShowDetailsModal(false)} className="btn-secondary" style={{ width: '44px', height: '44px', borderRadius: '50%', padding: 0 }}><X size={20} /></button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
                     <div style={{ padding: '24px', borderRadius: '16px', background: 'var(--bg-app)', border: '1px solid var(--border)' }}>
                        <div className="label-small">FINAL SCORE</div>
                        <div style={{ fontSize: '32px', fontWeight: '900', color: selectedResult.score >= 80 ? 'var(--success)' : 'var(--error)' }}>{selectedResult.score}%</div>
                     </div>
                     <div style={{ padding: '24px', borderRadius: '16px', background: 'var(--bg-app)', border: '1px solid var(--border)' }}>
                        <div className="label-small">COMPLETION TIME</div>
                        <div style={{ fontSize: '32px', fontWeight: '900' }}>{new Date(selectedResult.date).toLocaleTimeString()}</div>
                     </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                     <div className="label-small">ITEMIZED PERFORMANCE</div>
                     {selectedResult.answers?.map((ans, idx) => (
                        <div key={idx} style={{ padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', background: ans.isCorrect ? 'var(--success-soft)' : 'var(--error-soft)' }}>
                           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                              <span style={{ fontSize: '12px', fontWeight: '900', color: ans.isCorrect ? 'var(--success)' : 'var(--error)' }}>QUESTION {idx + 1}</span>
                              {ans.isCorrect ? <CheckCircle2 size={18} color="var(--success)" /> : <XCircle size={18} color="var(--error)" />}
                           </div>
                           <p style={{ fontWeight: '700', fontSize: '15px', marginBottom: '16px' }}>{ans.question}</p>
                           <div style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
                              <div style={{ opacity: 0.6 }}>Student Answer: <span style={{ fontWeight: '800', color: ans.isCorrect ? 'var(--success)' : 'var(--error)' }}>{ans.selected}</span></div>
                              {!ans.isCorrect && <div style={{ fontWeight: '800', color: 'var(--success)' }}>Correct: {ans.correct}</div>}
                           </div>
                        </div>
                     ))}
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

export default Admin;
