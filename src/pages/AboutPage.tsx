import React from 'react';
import { useApp } from '../context/AppContext';
import { translations } from '../i18n/translations';
import GlassCard from '../components/GlassCard';
import { Shield, BookOpen, Heart, Users, MessageSquare } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { language } = useApp();
  const t = translations[language];

  return (
    <div className="space-y-12 max-w-4xl mx-auto py-6 text-left font-sans">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs">
          <Heart className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
          <span>Made for India - Bharat First</span>
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {language === 'kn' ? 'ಕೌಶಲ್ ಸೇತು ಬಗ್ಗೆ' : 'About KaushalSetu'}
        </h1>
        <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
          {language === 'kn' 
            ? 'ಭಾರತದ ೨ನೇ ಮತ್ತು ೩ನೇ ಹಂತದ ನಗರಗಳ ಸ್ಥಳೀಯ ಅಂಗಡಿಗಳನ್ನು ಮತ್ತು ಕೌಶಲ್ಯ ಉದ್ಯೋಗಾಕಾಂಕ್ಷಿಗಳನ್ನು ಜೋಡಿಸುವ ಒಂದು ಸೇತುವೆ.'
            : 'Bridging the digital divide by connecting local shop owners with helpers, cashiers, delivery drivers, and retail staff.'}
        </p>
      </div>

      {/* Mission card */}
      <GlassCard className="bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border-indigo-200 p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-3">
          {language === 'kn' ? 'ನಮ್ಮ ಧ್ಯೇಯೋದ್ದೇಶ' : 'Our Mission'}
        </h2>
        <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
          {language === 'kn'
            ? 'ಭಾರತದ ಪ್ರತಿಯೊಂದು ಸಣ್ಣ ಪಟ್ಟಣಗಳಲ್ಲೂ ಸ್ಥಳೀಯ ಉದ್ಯೋಗಾವಕಾಶಗಳು ಹೆಚ್ಚಾಗಿವೆ. ಆದರೆ ನೇಮಕಾತಿಯಲ್ಲಿ ಪಾರದರ್ಶಕತೆ ಇಲ್ಲ. ನಾವು ಸುಲಭವಾದ ಕೌಶಲ್ಯ ಹೊಂದಾಣಿಕೆ, ಕನ್ನಡ ಭಾಷಾ ಬೆಂಬಲ ಮತ್ತು ವಾಟ್ಸಾಪ್ ಸಂಪರ್ಕದ ಮೂಲಕ ಸರಳವಾದ ನೇಮಕಾತಿ ತಂತ್ರಜ್ಞಾನವನ್ನು ಪ್ರತಿಯೊಬ್ಬರಿಗೂ ತಲುಪಿಸುತ್ತಿದ್ದೇವೆ. ಸ್ಥಳೀಯ ವ್ಯಾಪಾರಗಳು ಬೆಳೆಯಲು ಇದು ಸಹಕಾರಿಯಾಗಿದೆ.'
            : 'In India, Tier-2 and Tier-3 towns host vibrant retail and service clusters, yet finding localized work or helper staff remains fragmented. KaushalSetu uses structured profile matching, regional language support, and direct communication links to empower small-scale retailers and local job seekers with an accessible, professional hiring experience.'}
        </p>
      </GlassCard>

      {/* Core values grid */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-800">
            {language === 'kn' ? 'ಸುಲಭ ಪ್ರಕ್ರಿಯೆ' : 'Simplified Process'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'kn' ? 'ರೆಸ್ಯೂಮ್ ತಯಾರಿಕೆಯಿಂದ ಜಾಬ್ ವಿವರಣೆವರೆಗೆ ಎಲ್ಲವೂ ಸುಲಭವಾಗಿ ಮತ್ತು ವೇಗವಾಗಿ ನಡೆಯುತ್ತದೆ.' : 'From building resume profiles to compiling responsibilities, standard templates and editors do the work.'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-800">
            {language === 'kn' ? 'ನಂಬಿಕೆ ಮತ್ತು ಭದ್ರತೆ' : 'Verified Local Networks'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'kn' ? 'ಅಂಗಡಿಗಳ ವಿಳಾಸ ಮತ್ತು ಮಾಲೀಕರ ವಿವರಗಳನ್ನು ಅಡ್ಮಿನ್ ಮೂಲಕ ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ.' : 'Local businesses receive verified badges upon coordinate check to protect seeker applicants.'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="font-extrabold text-sm text-slate-800">
            {language === 'kn' ? 'ವಾಟ್ಸಾಪ್ ಉಚಿತ ಚಾಟ್' : 'Zero-Cost Communication'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {language === 'kn' ? 'ಯಾವುದೇ ವೆಚ್ಚವಿಲ್ಲದೆ ನೇರವಾಗಿ ವಾಟ್ಸಾಪ್ ಲಿಂಕ್ ಬಳಸಿ ಮಾಲೀಕರನ್ನು ಸಂಪರ್ಕಿಸಬಹುದು.' : 'Workers and businesses chat directly on WhatsApp. No paid API setup or SMS package is required.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
