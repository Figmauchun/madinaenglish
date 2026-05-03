import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  ArrowRight, Globe, Shield, BookOpen, 
  ChevronRight, ArrowUpRight, Zap, Target,
  Star, Award, Cpu, Info, Sparkles, Layout,
  Layers
} from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div style={{ background: 'var(--bg-app)', color: 'var(--text-primary)', minHeight: '100vh', overflowX: 'hidden' }}>
      
      {/* Premium Header */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(32px)', zIndex: 1000, borderBottom: '1px solid var(--border-soft)' }} className="dark:bg-[#0f172a]/80">
         <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
               <img src="/assets/newlogo.png" alt="Miss Madina" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
               <span style={{ fontSize: '20px', fontWeight: '900', letterSpacing: '-0.04em', color: 'var(--primary)' }}>MADINA V2.0</span>
            </div>
             <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
               <button onClick={() => navigate('/lessons')} className="btn-premium" style={{ height: '44px', padding: '0 24px' }}>
                  {t('nav.view')} <ArrowRight size={18} />
               </button>
             </div>
         </div>
      </nav>

      {/* Modern Hero Section */}
      <header style={{ padding: '180px 20px 100px', textAlign: 'center', position: 'relative' }}>
         <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '800px', height: '400px', background: 'var(--primary)', filter: 'blur(160px)', opacity: 0.05, pointerEvents: 'none' }} />
         
         <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
               <div style={{ padding: '8px 20px', borderRadius: '100px', background: 'var(--primary-soft)', border: '1px solid var(--primary-soft)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Sparkles size={16} color="var(--primary)" />
                  <span className="label-small" style={{ marginBottom: 0, color: 'var(--primary)', letterSpacing: '0.05em' }}>{t('landing.badge')}</span>
               </div>
            </div>
            
            <h1 className="display-text hero-title" style={{ lineHeight: '1', marginBottom: '40px', letterSpacing: '-0.05em' }} dangerouslySetInnerHTML={{ __html: t('landing.title') }} />
            
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 64px', fontWeight: '500', lineHeight: '1.7' }}>
               {t('landing.description')}
            </p>
            
            <div className="flex-stack-mobile" style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
               <button onClick={() => navigate('/lessons')} className="btn-premium" style={{ height: '64px', padding: '0 40px', fontSize: '16px', boxShadow: 'var(--shadow-lg)' }}>
                  {t('landing.get_started')}
               </button>
               <button onClick={() => navigate('/admin')} className="btn-secondary" style={{ height: '64px', padding: '0 40px', fontSize: '16px' }}>
                  {t('landing.admin')}
               </button>
            </div>
         </motion.div>
      </header>

      {/* Grid Matrix */}
      <section style={{ padding: '80px 20px', background: 'var(--bg-card)' }}>
         <div className="grid-4" style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <FeatureCard icon={<Layers size={28} />} title={t('landing.lessons_title')} desc={t('landing.lessons_desc')} />
            <FeatureCard icon={<Target size={28} />} title={t('landing.tests_title')} desc={t('landing.tests_desc')} />
            <FeatureCard icon={<Award size={28} />} title={t('landing.safe')} desc={t('landing.safe_desc')} />
            <FeatureCard icon={<Cpu size={28} />} title={t('landing.fast')} desc={t('landing.fast_desc')} />
         </div>
      </section>

      {/* Showcase Section */}
      <section style={{ padding: '100px 20px' }}>
         <div className="grid-2" style={{ maxWidth: '1400px', margin: '0 auto', alignItems: 'center' }}>
            <div>
               <div className="label-small" style={{ color: 'var(--primary)' }}>PRECISION ENGINEERING</div>
               <h2 className="display-text" style={{ fontSize: '48px', marginBottom: '40px', letterSpacing: '-0.04em' }}>Academic Rigor. <br />Professional Design.</h2>
               <p style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '48px' }}>
                  We've eliminated the clutter of "gamified" apps to provide a focused, high-density environment. Our platform is architected for serious learners who require precision, efficiency, and verifiable results.
               </p>
               <div className="grid-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                  <StatItem value="12,000+" label="Active Learners" />
                  <StatItem value="98.4%" label="Pass Rate" />
                  <StatItem value="B2+" label="Average Exit" />
                  <StatItem value="AI-Ready" label="Intelligence" />
               </div>
            </div>
            <div className="card-premium hide-mobile" style={{ height: '540px', background: 'var(--primary)', border: 'none', position: 'relative', overflow: 'hidden' }}>
               <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
               <div style={{ height: '100%', padding: '60px', display: 'flex', flexDirection: 'column' }}>
                  <img src="/assets/newlogo.png" style={{ width: '64px', filter: 'brightness(0) invert(1)' }} alt="Logo" />
                  <div style={{ marginTop: 'auto' }}>
                     <h3 style={{ color: 'white', fontSize: '32px', fontWeight: '900', marginBottom: '16px' }}>{t('nav.admin')}</h3>
                     <p style={{ color: 'white', opacity: 0.7, fontSize: '16px', lineHeight: '1.6' }}>
                        Empowering educators with real-time analytics and automated certification systems.
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '80px 20px', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
         <div style={{ display: 'flex', justifyContent: 'center', gap: '32px', marginBottom: '40px' }}>
            <img src="/assets/newlogo.png" alt="Logo" style={{ width: '48px', opacity: 0.5 }} />
         </div>
         <p style={{ color: 'var(--text-tertiary)', fontSize: '13px', fontWeight: '700', letterSpacing: '0.05em' }}>
            {t('landing.footer_copyright')} • {t('landing.footer_dev')}
         </p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div whileHover={{ y: -8 }} className="card-premium" style={{ padding: '48px', background: 'var(--bg-app)' }}>
     <div style={{ color: 'var(--primary)', marginBottom: '32px' }}>{icon}</div>
     <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '16px' }}>{title}</h3>
     <p style={{ fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{desc}</p>
  </motion.div>
);

const StatItem = ({ value, label }) => (
  <div>
     <div style={{ fontSize: '36px', fontWeight: '900', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{value}</div>
     <div className="label-small" style={{ color: 'var(--primary)', marginTop: '4px' }}>{label}</div>
  </div>
);

export default Landing;
