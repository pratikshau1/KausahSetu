import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { translations } from '../i18n/translations';
import GlassCard from '../components/GlassCard';
import AppButton from '../components/ui/AppButton';
import { 
  Compass, PlusCircle, ArrowRight, MessageSquare, Zap, Globe, 
  Users, ShoppingBag, Award, Star, ShieldCheck
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { language, currentUser } = useApp();
  const navigate = useNavigate();
  const t = translations[language];

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const categories = [
    { name: 'Retail & Sales', nameKn: 'ಚಿಲ್ಲರೆ ವ್ಯಾಪಾರ ಮತ್ತು ಮಾರಾಟ', icon: ShoppingBag, count: '120+ Jobs' },
    { name: 'Bakery & Sweets', nameKn: 'ಬೇಕರಿ ಮತ್ತು ಸ್ವೀಟ್ಸ್', icon: Star, count: '45+ Jobs' },
    { name: 'Store Helper / Clerk', nameKn: 'ಸ್ಟೋರ್ ಸಹಾಯಕಿ / ಕ್ಲರ್ಕ್', icon: Users, count: '80+ Jobs' },
    { name: 'Delivery Rider', nameKn: 'ಡೆಲಿವರಿ ರೈಡರ್', icon: Compass, count: '150+ Jobs' },
    { name: 'Cashier / Billing', nameKn: 'ಕ್ಯಾಶಿಯರ್ / ಬಿಲ್ಲಿಂಗ್', icon: Award, count: '30+ Jobs' },
    { name: 'Home Services', nameKn: 'ಮನೆ ಸೇವೆಗಳು', icon: Zap, count: '65+ Jobs' },
  ];

  const features = [
    {
      title: 'Profile Match Checker',
      titleKn: 'ಪ್ರೊಫೈಲ್ ಹೊಂದಾಣಿಕೆ ಪರಿಶೀಲನೆ',
      desc: 'Our platform calculates a compatibility score based on your skills, experience, and local area.',
      descKn: 'ನಿಮ್ಮ ಕೌಶಲ್ಯ, ಅನುಭವ ಮತ್ತು ಸ್ಥಳೀಯ ಪ್ರದೇಶದ ಆಧಾರದ ಮೇಲೆ ನಮ್ಮ ವೇದಿಕೆಯು ಹೊಂದಾಣಿಕೆಯ ಸ್ಕೋರ್ ಲೆಕ್ಕಾಚಾರ ಮಾಡುತ್ತದೆ.',
      icon: ShieldCheck,
      color: 'from-violet-500 to-indigo-500'
    },
    {
      title: 'Skill Gap Analysis',
      titleKn: 'ಕೌಶಲ್ಯ ಅಂತರ ವಿಶ್ಲೇಷಣೆ',
      desc: 'Identify missing skills and get personalized learning recommendations to improve your profile.',
      descKn: 'ಕಾಣೆಯಾದ ಕೌಶಲ್ಯಗಳನ್ನು ಗುರುತಿಸಿ ಮತ್ತು ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಸುಧಾರಿಸಲು ವೈಯಕ್ತಿಕ ಶಿಫಾರಸುಗಳನ್ನು ಪಡೆಯಿರಿ.',
      icon: Award,
      color: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'WhatsApp Job Connect',
      titleKn: 'ವಾಟ್ಸಾಪ್ ಉದ್ಯೋಗ ಸಂಪರ್ಕ',
      desc: 'Directly chat with employers on WhatsApp to apply or schedule calls easily.',
      descKn: 'ಉದ್ಯೋಗದಾತರೊಂದಿಗೆ ನೇರವಾಗಿ ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಚಾಟ್ ಮಾಡಿ ಮತ್ತು ಸುಲಭವಾಗಿ ಸಂದರ್ಶನ ನಿಗದಿಪಡಿಸಿ.',
      icon: MessageSquare,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      title: 'Regional Language Support',
      titleKn: 'ಪ್ರಾದೇಶಿಕ ಭಾಷಾ ಬೆಂಬಲ',
      desc: 'Switch between English and Kannada instantly to navigate and apply in your language.',
      descKn: 'ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಭಾಷೆಗಳ ನಡುವೆ ಸುಲಭವಾಗಿ ಬದಲಾಯಿಸಿ ಮತ್ತು ನಿಮ್ಮದೇ ಭಾಷೆಯಲ್ಲಿ ಉದ್ಯೋಗಗಳನ್ನು ಪಡೆಯಿರಿ.',
      icon: Globe,
      color: 'from-amber-500 to-orange-500'
    }
  ];

  const handleSeekerCTA = () => {
    if (currentUser?.role === 'Job Seeker') navigate('/seeker/jobs');
    else navigate('/login');
  };

  const handleBusinessCTA = () => {
    if (currentUser?.role === 'Business') navigate('/business/post');
    else navigate('/login');
  };

  return (
    <div className="space-y-20 pb-12 bg-grid-pattern -m-4 md:-m-6 lg:-m-8 p-4 md:p-6 lg:p-8 relative font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-10 lg:py-16 text-center lg:text-left">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.08),transparent_50%)]"></div>
        <div className="grid lg:grid-cols-12 gap-12 items-center relative">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{language === 'kn' ? 'ಸ್ಥಳೀಯ ಉದ್ಯೋಗ ಸಂಪರ್ಕ ವೇದಿಕೆ' : 'Local Job Connectivity Platform'}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-none text-slate-900">
              {language === 'kn' ? 'ಸ್ಥಳೀಯ ಉದ್ಯೋಗ ಹುಡುಕಿ.' : 'Find Local Jobs.'} <br className="hidden md:inline" />
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                {language === 'kn' ? 'ಸ್ಥಳೀಯ ಪ್ರತಿಭೆ ನೇಮಿಸಿ.' : 'Hire Local Talent.'}
              </span>
            </h1>

            <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t.subtagline}
            </p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-4">
              <AppButton
                onClick={handleSeekerCTA}
                variant="primary"
                icon={<Compass className="w-5 h-5 animate-pulse" />}
                iconPosition="left"
                className="w-full sm:w-auto"
              >
                {language === 'kn' ? 'ಉದ್ಯೋಗಗಳನ್ನು ಹುಡುಕಿ' : 'Find Jobs'}
              </AppButton>

              <AppButton
                onClick={handleBusinessCTA}
                variant="secondary"
                icon={<PlusCircle className="w-5 h-5" />}
                iconPosition="left"
                className="w-full sm:w-auto"
              >
                {language === 'kn' ? 'ಉದ್ಯೋಗ ಪೋಸ್ಟ್ ಮಾಡಿ' : 'Post a Job'}
              </AppButton>
            </div>
          </div>

          {/* Right Hero Illustration */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="absolute w-72 h-72 bg-gradient-to-tr from-indigo-300 to-cyan-200 rounded-full blur-3xl opacity-35 -z-10 animate-pulse-slow"></div>
            
            {/* SVG Illustration - Local Indian Shop Ecosystem */}
            <svg viewBox="0 0 500 500" className="w-full max-w-[400px] h-auto drop-shadow-2xl animate-float">
              {/* Bakery/Shops background */}
              <defs>
                <linearGradient id="grad-sky" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#818CF8" />
                  <stop offset="100%" stopColor="#22D3EE" />
                </linearGradient>
              </defs>
              {/* Base Floor */}
              <rect x="20" y="440" width="460" height="20" rx="10" fill="#E2E8F0" />
              {/* Shop building */}
              <rect x="50" y="160" width="220" height="280" rx="15" fill="url(#grad-sky)" opacity="0.9" />
              <rect x="65" y="240" width="190" height="200" rx="8" fill="#FFFFFF" />
              
              {/* Shop Awning (striped canopy) */}
              <path d="M40,160 L280,160 L260,200 L60,200 Z" fill="#6366F1" />
              <path d="M60,160 L90,160 L80,200 L50,200 Z" fill="#4F46E5" />
              <path d="M120,160 L150,160 L140,200 L110,200 Z" fill="#4F46E5" />
              <path d="M180,160 L210,160 L200,200 L170,200 Z" fill="#4F46E5" />
              <path d="M240,160 L270,160 L260,200 L230,200 Z" fill="#4F46E5" />
              
              {/* Small shop signage */}
              <rect x="100" y="210" width="120" height="25" rx="5" fill="#06B6D4" />
              <text x="160" y="227" fill="#FFFFFF" fontSize="11" fontWeight="bold" textAnchor="middle">KAUSHAL SETU SHOP</text>
              
              {/* Inside Shop Elements */}
              <rect x="80" y="320" width="60" height="120" fill="#F1F5F9" />
              <circle cx="110" cy="300" r="12" fill="#E2E8F0" />
              
              {/* Delivery Bike Outline */}
              <circle cx="380" cy="390" r="30" fill="none" stroke="#6366F1" strokeWidth="6" />
              <circle cx="380" cy="390" r="10" fill="#6366F1" />
              <rect x="330" y="350" width="60" height="15" rx="5" fill="#06B6D4" />
              <line x1="330" y1="365" x2="380" y2="390" stroke="#0F172A" strokeWidth="6" />
              
              {/* Glowing Phone mockup */}
              <rect x="300" y="100" width="130" height="230" rx="18" fill="#0F172A" stroke="#E2E8F0" strokeWidth="4" />
              <rect x="308" y="120" width="114" height="190" rx="10" fill="#F8FAFC" />
              {/* WhatsApp UI bubble */}
              <rect x="316" y="150" width="98" height="30" rx="6" fill="#22C55E" />
              <text x="365" y="169" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">Offer Accepted! ✅</text>
              {/* Match Score Gauge */}
              <circle cx="365" cy="240" r="28" fill="none" stroke="#E2E8F0" strokeWidth="5" />
              <circle cx="365" cy="240" r="28" fill="none" stroke="#6366F1" strokeWidth="5" strokeDasharray="130 180" />
              <text x="365" y="244" fill="#0F172A" fontSize="12" fontWeight="extrabold" textAnchor="middle">95%</text>
            </svg>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center font-sans">
          <div className="space-y-1">
            <div className="text-3xl md:text-5xl font-black text-cyan-400">12,500+</div>
            <div className="text-xs md:text-sm text-slate-300 font-medium">
              {language === 'kn' ? 'ಸಕ್ರಿಯ ಉದ್ಯೋಗಾಕಾಂಕ್ಷಿಗಳು' : 'Active Job Seekers'}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl md:text-5xl font-black text-cyan-400">1,800+</div>
            <div className="text-xs md:text-sm text-slate-300 font-medium">
              {language === 'kn' ? 'ನೋಂದಾಯಿತ ಸ್ಥಳೀಯ ಅಂಗಡಿಗಳು' : 'Registered Local Shops'}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl md:text-5xl font-black text-cyan-400">98%</div>
            <div className="text-xs md:text-sm text-slate-300 font-medium">
              {language === 'kn' ? 'ಯಶಸ್ವಿ ಪ್ರೊಫೈಲ್ ಹೊಂದಾಣಿಕೆ' : 'Successful Profile Match'}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl md:text-5xl font-black text-cyan-400">35+</div>
            <div className="text-xs md:text-sm text-slate-300 font-medium">
              {language === 'kn' ? 'ಕರ್ನಾಟಕದ ಪ್ರಮುಖ ನಗರಗಳು' : 'Karnataka Towns Seeding'}
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Showcase */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">
            {language === 'kn' ? 'ನಮ್ಮ ಪ್ರಮುಖ ವೈಶಿಷ್ಟ್ಯಗಳು' : 'Our Core Features'}
          </h2>
          <p className="text-sm text-slate-500">
            {language === 'kn' ? 'ಸರಳ ತಂತ್ರಜ್ಞಾನ, ಸ್ಥಳೀಯ ಉದ್ಯೋಗಿಗಳಿಗೆ ಸೂಕ್ತ ವಿನ್ಯಾಸ' : 'Simple technology tailored for local neighborhood workers'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <GlassCard key={i} className="hover:scale-[1.02] flex flex-col justify-between min-h-[200px]" delay={i * 0.1}>
                <div className="space-y-3 text-left">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${feat.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-extrabold text-base text-slate-800">
                    {language === 'kn' ? feat.titleKn : feat.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {language === 'kn' ? feat.descKn : feat.desc}
                  </p>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="grid md:grid-cols-2 gap-12">
        {/* Seeker Workflow */}
        <div className="space-y-6 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-left font-sans">
          <h3 className="text-xl font-extrabold text-indigo-600 flex items-center space-x-2">
            <Compass className="w-5 h-5" />
            <span>{language === 'kn' ? 'ಉದ್ಯೋಗಾಕಾಂಕ್ಷಿಗಳಿಗೆ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?' : 'How it Works for Job Seekers'}</span>
          </h3>
          <ol className="space-y-4">
            <li className="flex space-x-3.5 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">1</span>
              <div>
                <h4 className="font-bold text-sm text-slate-800">{language === 'kn' ? 'OTP ಲಾಗಿನ್ ಮಾಡಿ' : 'Quick Mobile Login'}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{language === 'kn' ? 'ನಿಮ್ಮ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗೆ ಬರುವ OTP ಬಳಸಿ ತಕ್ಷಣ ಲಾಗಿನ್ ಆಗಿ.' : 'Access with just your phone number via secure Mobile OTP verification.'}</p>
              </div>
            </li>
            <li className="flex space-x-3.5 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">2</span>
              <div>
                <h4 className="font-bold text-sm text-slate-800">{language === 'kn' ? 'ಪ್ರೊಫೈಲ್ ಸಿದ್ಧಪಡಿಸಿ' : 'Build Your Profile'}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{language === 'kn' ? 'ಕೌಶಲ್ಯ ಮತ್ತು ಅನುಭವ ನಮೂದಿಸಿ, ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಅನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.' : 'Add your skills, experience, and preferences to complete your professional profile.'}</p>
              </div>
            </li>
            <li className="flex space-x-3.5 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">3</span>
              <div>
                <h4 className="font-bold text-sm text-slate-800">{language === 'kn' ? 'ಸ್ಥಳೀಯ ಉದ್ಯೋಗ ಹುಡುಕಿ' : 'Find Best Match & Apply'}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{language === 'kn' ? 'ನಿಮ್ಮ ಹತ್ತಿರದ ಅಂಗಡಿಗಳ ಉದ್ಯೋಗ ನೋಡಿ, ಪ್ರೊಫೈಲ್ ಹೊಂದಾಣಿಕೆ ಚೆಕ್ ಮಾಡಿ ಅಪ್ಲೈ ಮಾಡಿ.' : 'Explore nearby shops and helper jobs with real-time profile match percentages.'}</p>
              </div>
            </li>
            <li className="flex space-x-3.5 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">4</span>
              <div>
                <h4 className="font-bold text-sm text-slate-800">{language === 'kn' ? 'ವಾಟ್ಸಾಪ್‌ನಲ್ಲಿ ಅಪ್‌ಡೇಟ್ ಪಡೆಯಿರಿ' : 'Receive WhatsApp Alerts'}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{language === 'kn' ? 'ಸಂದರ್ಶನದ ವಿವರಗಳು ಮತ್ತು ಉದ್ಯೋಗ ಆಫರ್ ವಾಟ್ಸಾಪ್ ಮೂಲಕ ಲಭ್ಯವಾಗುತ್ತದೆ.' : 'Get click-to-chat links or updates on WhatsApp for scheduling calls.'}</p>
              </div>
            </li>
          </ol>
        </div>

        {/* Business Workflow */}
        <div className="space-y-6 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-left font-sans">
          <h3 className="text-xl font-extrabold text-cyan-600 flex items-center space-x-2">
            <PlusCircle className="w-5 h-5" />
            <span>{language === 'kn' ? 'ವ್ಯಾಪಾರಸ್ಥರಿಗೆ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?' : 'How it Works for Businesses'}</span>
          </h3>
          <ol className="space-y-4">
            <li className="flex space-x-3.5 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 text-xs font-bold">1</span>
              <div>
                <h4 className="font-bold text-sm text-slate-800">{language === 'kn' ? 'ವ್ಯಾಪಾರ ಪ್ರೊಫೈಲ್ ರಚಿಸಿ' : 'Setup Shop Profile'}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{language === 'kn' ? 'ನಿಮ್ಮ ಅಂಗಡಿಯ ಮಾಹಿತಿ ಮತ್ತು ವಿಳಾಸ ದಾಖಲಿಸಿ.' : 'Register your bakery, retail store, or boutique details in minutes.'}</p>
              </div>
            </li>
            <li className="flex space-x-3.5 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 text-xs font-bold">2</span>
              <div>
                <h4 className="font-bold text-sm text-slate-800">{language === 'kn' ? 'ಉದ್ಯೋಗ ವಿವರಣೆ ಲೋಡ್ ಮಾಡಿ' : 'Post Job with Templates'}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{language === 'kn' ? 'ಕೆಲಸದ ಹೆಸರು ನಮೂದಿಸಿ, ಸುಲಭವಾಗಿ ಉದ್ಯೋಗ ವಿವರಣೆ ಸಿದ್ಧಪಡಿಸಿ.' : 'Load templates and fill out job descriptions and qualifications quickly.'}</p>
              </div>
            </li>
            <li className="flex space-x-3.5 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 text-xs font-bold">3</span>
              <div>
                <h4 className="font-bold text-sm text-slate-800">{language === 'kn' ? 'ಅಭ್ಯರ್ಥಿಗಳ ಹೊಂದಾಣಿಕೆ ಪರಿಶೀಲಿಸಿ' : 'Screen Candidate Scores'}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{language === 'kn' ? 'ಅಭ್ಯರ್ಥಿಗಳ ಪ್ರೊಫೈಲ್ ಮತ್ತು ಪ್ರೊಫೈಲ್ ಹೊಂದಾಣಿಕೆ ಚೆಕ್ ಮಾಡಿ ಸಂಪರ್ಕಿಸಿ.' : 'Check match reasons based on skills overlap before messaging candidates.'}</p>
              </div>
            </li>
            <li className="flex space-x-3.5 items-start">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 text-xs font-bold">4</span>
              <div>
                <h4 className="font-bold text-sm text-slate-800">{language === 'kn' ? 'ಉದ್ಯೋಗ ಪ್ರಸ್ತಾಪ ಕಳುಹಿಸಿ' : 'Send WhatsApp Interview/Offer'}</h4>
                <p className="text-xs text-slate-400 mt-0.5">{language === 'kn' ? 'ವಾಟ್ಸಾಪ್ ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ ತಕ್ಷಣ ಆಫರ್ ಕಳುಹಿಸಿ.' : 'Use templates to trigger pre-filled WhatsApp click-to-chat invites.'}</p>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="space-y-8 font-sans">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">
            {language === 'kn' ? 'ಜನಪ್ರಿಯ ಸ್ಥಳೀಯ ಕೆಲಸಗಳು' : 'Popular Local Job Roles'}
          </h2>
          <p className="text-sm text-slate-500">
            {language === 'kn' ? 'ನಿಮ್ಮ ಆದ್ಯತೆಯ ಕೆಲಸದ ವಿಭಾಗವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ' : 'Choose categories in your city to check salaries and listings'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                onClick={handleSeekerCTA}
                className="bg-white p-5 rounded-2xl border border-slate-100 hover:border-indigo-500 hover:scale-[1.03] active:scale-[0.98] cursor-pointer transition-all text-center space-y-3 shadow-sm"
              >
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-extrabold text-xs text-slate-800 truncate">
                  {language === 'kn' ? cat.nameKn : cat.name}
                </div>
                <div className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full inline-block font-bold">
                  {cat.count}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* WhatsApp Integration Banner */}
      <section className="bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-emerald-500/10 font-sans">
        <div className="space-y-4 text-left max-w-xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 rounded-full text-xs font-bold">
            <MessageSquare className="w-3.5 h-3.5 text-white" />
            <span>{language === 'kn' ? 'ವಾಟ್ಸಾಪ್ ಕ್ಲಿಕ್-ಟು-ಚಾಟ್ ಸಂಯೋಜನೆ' : 'WhatsApp Click-to-Chat Ready'}</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-extrabold leading-tight">
            {language === 'kn' ? 'ಯಾವುದೇ ವೆಚ್ಚವಿಲ್ಲದೆ ನೇರ ವಾಟ್ಸಾಪ್ ಸಂಪರ್ಕ!' : 'Connect Instantly via Free WhatsApp Links!'}
          </h2>
          <p className="text-xs md:text-sm text-white/90 leading-relaxed">
            {language === 'kn' 
              ? 'ಅಭ್ಯರ್ಥಿಗಳನ್ನು ಸಂಪರ್ಕಿಸಲು ಮತ್ತು ಸಂದರ್ಶನದ ಆಹ್ವಾನಗಳನ್ನು ಕಳುಹಿಸಲು ಯಾವುದೇ ಪಾವತಿ ಅಗತ್ಯವಿಲ್ಲ. ಸಿಸ್ಟಮ್ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಸಿದ್ಧಪಡಿಸಿದ ವಾಟ್ಸಾಪ್ ಸಂದೇಶವನ್ನು ಸಿದ್ಧಪಡಿಸುತ್ತದೆ.'
              : 'Our system creates formatted WhatsApp messages automatically. Simply click a button to notify candidates of interviews or accept offers instantly without paid SMS integrations.'}
          </p>
        </div>
        <button
          onClick={handleSeekerCTA}
          className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-emerald-600 font-extrabold text-sm shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 cursor-pointer flex-shrink-0"
        >
          <MessageSquare className="w-4 h-4" />
          <span>{language === 'kn' ? 'ಈಗಲೇ ಪ್ರಾರಂಭಿಸಿ' : 'Start Connecting Now'}</span>
        </button>
      </section>

      {/* Testimonials */}
      <section className="space-y-8 font-sans">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">
            {language === 'kn' ? 'ನಮ್ಮ ಯಶಸ್ಸಿನ ಕಥೆಗಳು' : 'Success Stories'}
          </h2>
          <p className="text-sm text-slate-500">
            {language === 'kn' ? 'ಕೌಶಲ್ ಸೇತು ಮೂಲಕ ಉದ್ಯೋಗ ಕಂಡುಕೊಂಡ ಯಶೋಗಾಥೆಗಳು' : 'Real stories from Indian local shopkeepers and workers'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <GlassCard className="text-left flex flex-col justify-between">
            <p className="text-xs text-slate-500 leading-relaxed italic">
              {language === 'kn'
                ? '"ನನ್ನ ಬೇಕರಿಗೆ ಹೆಲ್ಪರ್ ಬೇಕಾಗಿದ್ದರು. ಕೌಶಲ್ ಸೇತು ಮೂಲಕ ನಮೂದಿಸಿದ ೨ ದಿನದಲ್ಲೇ ಮ್ಯಾಚಿಂಗ್ ಪ್ರೊಫೈಲ್ ಸಿಕ್ಕಿತು. ಇಂಟರ್ವ್ಯೂ ಸಹ ಫೋನ್ ಮೂಲಕ ಸುಲಭವಾಗಿ ನಿಗದಿ ಮಾಡಿದೆವು."'
                : '"I needed helper staff for my bakery in Mysore. Posted a job on KaushalSetu and found Ramesh. The profile match was 95% and he works perfectly. Highly recommend!"'}
            </p>
            <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-600">MG</div>
              <div>
                <h4 className="font-extrabold text-xs text-slate-800">Manjunath Gowda</h4>
                <p className="text-[10px] text-slate-400">Nandi Sweets & Bakery, Mysore</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="text-left flex flex-col justify-between">
            <p className="text-xs text-slate-500 leading-relaxed italic">
              {language === 'kn'
                ? '"ಮೊಬೈಲ್ ಒಟಿಪಿ ಮೂಲಕ ಸುಲಭವಾಗಿ ಲಾಗಿನ್ ಆದೆ. ಅಪ್ಲಿಕೇಶನ್‌ನಲ್ಲಿ ಕನ್ನಡ ಬೆಂಬಲ ಇರುವುದು ತುಂಬಾ ಸಹಾಯವಾಯಿತು. ಕೌಶಲ್ಯ ಮಾರ್ಗದರ್ಶನದಿಂದ ಹೊಸ ವಿಷಯ ಕಲಿತು ಉದ್ಯೋಗ ಪಡೆದೆ."'
                : '"Registering was so easy with Mobile OTP. Having the entire app in Kannada is a lifesaver. The Career Guidance page guided me on what billing software questions to prepare."'}
            </p>
            <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-cyan-100 flex items-center justify-center font-bold text-xs text-cyan-600">RK</div>
              <div>
                <h4 className="font-extrabold text-xs text-slate-800">Ramesh Kumar</h4>
                <p className="text-[10px] text-slate-400">Grocery Assistant, Bangalore</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="text-left flex flex-col justify-between">
            <p className="text-xs text-slate-500 leading-relaxed italic">
              {language === 'kn'
                ? '"ನಮ್ಮ ಬೊಟಿಕ್ ಸೇಲ್ಸ್ ಹುದ್ದೆಗೆ ಹೆಚ್ಚು ಹುಡುಗಿಯರು ಬೇಕಾಗಿದ್ದರು. ಇಲ್ಲಿ ಸ್ಥಳೀಯವಾಗಿ ಹತ್ತಿರದಲ್ಲಿರುವವರನ್ನು ಸಂಪರ್ಕಿಸುವುದು ತುಂಬಾ ಸುಲಭವಾಗಿದೆ. ವಾಟ್ಸಾಪ್ ಆಫರ್ ಸೂಪರ್ ಆಗಿದೆ."'
                : '"Finding retail workers in local towns can be tough. KaushalSetu lets us look for candidates near our locality. WhatsApp links let us coordinate quickly."'}
            </p>
            <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-slate-100">
              <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-xs text-emerald-600">AD</div>
              <div>
                <h4 className="font-extrabold text-xs text-slate-800">Ananya D.</h4>
                <p className="text-[10px] text-slate-400">Boutique Owner, Mysore</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-8 font-sans max-w-3xl mx-auto">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-extrabold text-slate-900">
            {language === 'kn' ? 'ಸಾಮಾನ್ಯ ಪ್ರಶ್ನೆಗಳು' : 'Frequently Asked Questions'}
          </h2>
          <p className="text-sm text-slate-500">
            {language === 'kn' ? 'ಕೌಶಲ್ ಸೇತು ಬಗ್ಗೆ ತಿಳಿಯಬೇಕಾದ ಅಗತ್ಯ ಮಾಹಿತಿ' : 'Common questions about the hiring platform'}
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: language === 'kn' ? 'ಕೌಶಲ್ ಸೇತು ಬಳಸಲು ಉಚಿತವೇ?' : 'Is KaushalSetu free to use?',
              a: language === 'kn'
                ? 'ಹೌದು, ಇದು ಸ್ಥಳೀಯ ಉದ್ಯೋಗಾಕಾಂಕ್ಷಿಗಳಿಗೆ ಮತ್ತು ಅಂಗಡಿ ಮಾಲೀಕರಿಗೆ ೧೦೦% ಉಚಿತವಾಗಿದೆ.'
                : 'Yes, KaushalSetu is 100% free for local neighborhood workers and business owners.'
            },
            {
              q: language === 'kn' ? 'ಪ್ರೊಫೈಲ್ ಮ್ಯಾಚಿಂಗ್ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?' : 'How does the Match Checker work?',
              a: language === 'kn'
                ? 'ನಮ್ಮ ಸಿಸ್ಟಮ್ ನಿಮ್ಮ ಕೌಶಲ್ಯಗಳು, ಅನುಭವ, ನಗರ ಮತ್ತು ಆದ್ಯತೆಯ ಕೆಲಸದ ವಿಧವನ್ನು ಪರಿಶೀಲಿಸಿ ನಿಖರ ಸ್ಕೋರ್ ನೀಡುತ್ತದೆ.'
                : 'We automatically calculate a compatibility score based on your skills, experience, preferred city, and job type.'
            },
            {
              q: language === 'kn' ? 'ನಾನು ವಾಟ್ಸಾಪ್ ಮೂಲಕ ಸಂಪರ್ಕಿಸಬಹುದೇ?' : 'How do I contact candidates or businesses?',
              a: language === 'kn'
                ? 'ಹೌದು, ಇಂಟರ್ವ್ಯೂ ಆಹ್ವಾನಗಳು ಮತ್ತು ಆಫರ್‌ಗಳು ನೇರ ವಾಟ್ಸಾಪ್ ಕ್ಲಿಕ್-ಟು-ಚಾಟ್ ಲಿಂಕ್ ಮೂಲಕ ಲಭ್ಯವಿವೆ.'
                : 'You can directly connect using pre-filled WhatsApp click-to-chat links generated by the platform.'
            },
            {
              q: language === 'kn' ? 'ಕೌಶಲ್ಯ ಅಂತರ ವಿಶ್ಲೇಷಣೆ ಏನು?' : 'What is the Skill Gap Analysis?',
              a: language === 'kn'
                ? 'ಇದು ನಿಮ್ಮ ಕೌಶಲ್ಯಗಳನ್ನು ಉದ್ಯೋಗದ ಅವಶ್ಯಕತೆಗಳೊಂದಿಗೆ ಹೋಲಿಸಿ, ಕಾಣೆಯಾದ ಕೌಶಲ್ಯಗಳನ್ನು ಗುರುತಿಸಿ ಸುಧಾರಣೆ ಸಲಹೆ ನೀಡುತ್ತದೆ.'
                : 'It compares your skills against job requirements, identifies gaps, and recommends ways to upskill.'
            }
          ].map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 bg-white rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex justify-between items-center text-left font-bold text-sm text-slate-800 hover:bg-slate-50 cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <span className="text-slate-400 text-lg">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 text-xs text-slate-500 leading-relaxed border-t border-slate-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="pt-12 border-t border-slate-200 text-left text-xs text-slate-500 space-y-8 font-sans">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white font-black text-sm shadow">
                KS
              </div>
              <span className="font-extrabold text-base text-slate-800 tracking-tight">KaushalSetu</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Empowering Tier-2 & Tier-3 cities in India by connecting local shops and skilled seekers instantly.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-700">Quick Links</h4>
            <ul className="space-y-2 text-slate-500 font-semibold list-none pl-0">
              <li><Link to="/" className="hover:text-indigo-600">Home</Link></li>
              <li><Link to="/about" className="hover:text-indigo-600">About Us</Link></li>
              <li><Link to="/login" className="hover:text-indigo-600">Login</Link></li>
              <li><Link to="/register" className="hover:text-indigo-600">Register</Link></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-700">Contact Us</h4>
            <ul className="space-y-2 text-slate-500 font-semibold list-none pl-0">
              <li>📍 Karnataka Town Seeding</li>
              <li>✉️ contact@kaushalsetu.in</li>
              <li>📞 +91 9876543210</li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-700">Legals</h4>
            <ul className="space-y-2 text-slate-500 font-semibold list-none pl-0">
              <li><a href="#" className="hover:text-indigo-600">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-600">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600">Hiring Guidelines</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-100 pt-6 text-center text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} KaushalSetu Inc. Supporting Atmanirbhar Bharat. Built locally with ❤️</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
