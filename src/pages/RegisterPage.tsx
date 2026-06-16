import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { translations } from '../i18n/translations';
import AppCard from '../components/ui/AppCard';
import AppButton from '../components/ui/AppButton';
import AppInput from '../components/ui/AppInput';
import SegmentedToggle from '../components/ui/SegmentedToggle';
import { User, Phone, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { language, signupUser } = useApp();
  const navigate = useNavigate();
  const t = translations[language];

  const [role, setRole] = useState<'Job Seeker' | 'Business'>('Job Seeker');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email) {
      setErrorMsg(language === 'kn' ? 'ದಯವಿಟ್ಟು ಎಲ್ಲಾ ಕ್ಷೇತ್ರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ.' : 'Please fill in all the fields.');
      return;
    }
    if (phone.length < 10) {
      setErrorMsg(language === 'kn' ? 'ದಯವಿಟ್ಟು ಸರಿಯಾದ ಫೋನ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ.' : 'Please enter a valid 10-digit phone number.');
      return;
    }
    setErrorMsg('');
    signupUser(name, email, phone, role);
    if (role === 'Job Seeker') navigate('/seeker');
    else navigate('/business');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-6">
      <div className="w-full max-w-md">
        <AppCard variant="glass" className="shadow-2xl border-white/60 text-left">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-3 shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">
              {language === 'kn' ? 'ಖಾತೆ ರಚಿಸಿ' : 'Create an Account'}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {language === 'kn' ? 'ಸ್ಥಳೀಯ ಉದ್ಯೋಗ ಮತ್ತು ನೇಮಕಾತಿಗಾಗಿ ಕೈಜೋಡಿಸಿ' : 'Connect with nearby job opportunities & talent'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 bg-rose-50 border border-rose-100 text-rose-600 px-3.5 py-2 rounded-xl text-xs font-semibold">
              ⚠️ {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            {/* Role Switch */}
            <SegmentedToggle
              label={language === 'kn' ? 'ನಿಮ್ಮ ಪಾತ್ರ ಆಯ್ಕೆಮಾಡಿ:' : 'Register As:'}
              value={role}
              onChange={setRole}
              options={[
                { value: 'Job Seeker', label: t.roleLookingForJob },
                { value: 'Business', label: t.roleHiring }
              ]}
              className="mb-4"
            />

            {/* Name field */}
            <AppInput
              type="text"
              label={language === 'kn' ? 'ಪೂರ್ಣ ಹೆಸರು' : 'Full Name'}
              placeholder="Ramesh Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User className="w-4 h-4" />}
              required
            />

            {/* Phone field */}
            <AppInput
              type="tel"
              maxLength={10}
              label={t.phoneNumber}
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              icon={<Phone className="w-4 h-4" />}
              prefixText="+91"
              required
            />

            {/* Email field */}
            <AppInput
              type="email"
              label={t.emailAddress}
              placeholder="ramesh@kaushalsetu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <AppButton
              type="submit"
              fullWidth
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
            >
              {t.signUpNow}
            </AppButton>
          </form>

          <div className="text-center text-xs text-slate-400 mt-6 pt-4 border-t border-slate-100">
            {t.alreadyHaveAccount}{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              {t.login}
            </Link>
          </div>
        </AppCard>
      </div>
    </div>
  );
};

export default RegisterPage;
