import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { translations } from '../i18n/translations';
import AppCard from '../components/ui/AppCard';
import AppButton from '../components/ui/AppButton';
import AppInput from '../components/ui/AppInput';
import SegmentedToggle from '../components/ui/SegmentedToggle';
import { Phone, Mail, Lock, Shield, Sparkles, MessageSquare, ArrowRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoginPage: React.FC = () => {
  const { language, setLanguage, loginUser, loginGoogle } = useApp();
  const navigate = useNavigate();
  const t = translations[language];

  // Auth States
  const [authMethod, setAuthMethod] = useState<'otp' | 'email'>('otp');
  const [selectedRole, setSelectedRole] = useState<'Job Seeker' | 'Business'>('Job Seeker');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showSmsPopup, setShowSmsPopup] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setErrorMsg(language === 'kn' ? 'ದಯವಿಟ್ಟು ಸರಿಯಾದ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ.' : 'Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMsg('');
    setOtpSent(true);
    setShowSmsPopup(true);
    // Hide notification pop-up after 7 seconds
    setTimeout(() => {
      setShowSmsPopup(false);
    }, 7000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '123456') {
      setErrorMsg(language === 'kn' ? 'ತಪ್ಪಾದ OTP. ದಯವಿಟ್ಟು 123456 ಬಳಸಿ.' : 'Incorrect OTP. Please use code 123456.');
      return;
    }
    setErrorMsg('');
    loginUser(phone, selectedRole);
    redirectDashboard();
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg(language === 'kn' ? 'ದಯವಿಟ್ಟು ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.' : 'Please enter email and password.');
      return;
    }
    setErrorMsg('');
    loginUser(email, selectedRole);
    redirectDashboard();
  };

  const handleGoogleLoginClick = () => {
    loginGoogle(selectedRole);
    redirectDashboard();
  };

  const redirectDashboard = () => {
    if (selectedRole === 'Job Seeker') navigate('/seeker');
    else navigate('/business');
  };

  return (
    <div className="min-h-[85vh] grid lg:grid-cols-12 gap-0 overflow-hidden rounded-3xl border border-slate-200/80 shadow-2xl bg-white relative">
      {/* Floating Mock SMS Alert Panel */}
      <AnimatePresence>
        {showSmsPopup && (
          <motion.div
            initial={{ y: -80, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -80, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 bg-slate-905 text-white px-5 py-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-800 flex items-center space-x-4 z-50 w-full max-w-md backdrop-blur-md"
            style={{ backgroundColor: 'rgba(15, 23, 42, 0.96)' }}
          >
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-indigo-400 fill-indigo-400/20" />
            </div>
            <div className="text-left flex-1">
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-slate-400 font-extrabold tracking-wider uppercase block">💬 SMS GATEWAY • KAUSHALSETU</span>
                <span className="text-[8px] text-slate-500 font-bold">Just Now</span>
              </div>
              <p className="text-xs font-semibold text-slate-200 mt-1">
                Your secure OTP verification code is <strong className="text-indigo-400 text-sm tracking-wider font-extrabold bg-indigo-500/20 px-2 py-0.5 rounded border border-indigo-500/30">123456</strong>.
              </p>
            </div>
            <button 
              onClick={() => setShowSmsPopup(false)}
              className="text-slate-400 hover:text-white text-xs cursor-pointer font-bold border-l border-slate-800 pl-3 self-stretch"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Panel - Premium SaaS Style background SVG */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-tr from-indigo-700 via-indigo-800 to-cyan-800 text-white p-8 lg:p-12 flex-col justify-between relative overflow-hidden">
        {/* Background glow meshes */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400 rounded-full blur-3xl opacity-20 translate-x-20 -translate-y-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-400 rounded-full blur-3xl opacity-20 -translate-x-20 translate-y-20"></div>

        {/* Logo and Intro */}
        <div className="space-y-4 relative z-10 text-left">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-white text-indigo-600 flex items-center justify-center font-extrabold text-lg shadow-md">
              KS
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              {t.brand}
            </span>
          </div>
          <h2 className="text-2xl lg:text-3xl font-black leading-tight pt-6">
            {language === 'kn' ? 'ಕೌಶಲ್ಯಕ್ಕೆ ತಕ್ಕ ಕೆಲಸ, ನಂಬಿಕಸ್ಥ ಸ್ಥಳೀಯ ನೇಮಕಾತಿ!' : 'Empowering Local Commerce, Matching Indian Skills'}
          </h2>
          <p className="text-xs text-indigo-100 leading-relaxed max-w-sm">
            {language === 'kn' 
              ? 'ಕೌಶಲ್ ಸೇತು ಭಾರತದ ಸಣ್ಣ ಅಂಗಡಿಗಳನ್ನು ಮತ್ತು ಸೇವಾ ಸಹಾಯಕರನ್ನು ಒಂದೇ ವೇದಿಕೆಯಲ್ಲಿ ಜೋಡಿಸುತ್ತದೆ.'
              : 'Our local matching system guides neighborhood stores and workers to discover the perfect collaboration locally.'}
          </p>
        </div>

        {/* Rich Futuristic & Local Shop SVG Illustration */}
        <div className="relative z-10 flex justify-center py-6">
          <svg viewBox="0 0 400 320" className="w-full max-w-[320px] h-auto drop-shadow-xl">
            {/* Indian local market silhouette with futuristic lines */}
            <defs>
              <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#818CF8" stopOpacity="0" />
              </linearGradient>
            </defs>
            <rect x="10" y="270" width="380" height="10" rx="5" fill="#475569" opacity="0.5" />
            
            {/* Bakery shop */}
            <rect x="40" y="140" width="120" height="130" rx="8" fill="#4F46E5" opacity="0.8" />
            <path d="M30,140 L170,140 L160,165 L40,165 Z" fill="#06B6D4" />
            <rect x="55" y="180" width="90" height="90" rx="4" fill="#FFFFFF" />
            <text x="100" y="200" fill="#6366F1" fontSize="9" fontWeight="black" textAnchor="middle">SWEETS & BAKERY</text>
            
            {/* Bread display outline */}
            <rect x="65" y="215" width="25" height="15" rx="2" fill="#E2E8F0" />
            <rect x="110" y="215" width="25" height="15" rx="2" fill="#E2E8F0" />
            
            {/* Seeker / Worker outline symbol */}
            <circle cx="270" cy="200" r="24" fill="url(#glow)" />
            <circle cx="270" cy="190" r="12" fill="#38BDF8" />
            <path d="M250,225 C250,215 258,210 270,210 C282,210 290,215 290,225 Z" fill="#38BDF8" />
            
            {/* Connecting arcs */}
            <path d="M160,180 Q215,140 270,190" fill="none" stroke="#22D3EE" strokeWidth="2.5" strokeDasharray="5 5" />
            <circle cx="215" cy="155" r="4" fill="#F43F5E" />
            <text x="215" y="145" fill="#F43F5E" fontSize="8" fontWeight="bold" textAnchor="middle">MATCH</text>

            {/* Futuristic city gears */}
            <circle cx="340" cy="80" r="15" fill="none" stroke="#818CF8" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="340" cy="80" r="8" fill="#818CF8" opacity="0.3" />
          </svg>
        </div>

        {/* Info footer */}
        <div className="text-left text-[10px] text-indigo-200/80 relative z-10">
          🇮🇳 Supporting Atmanirbhar Bharat initiative. Built locally.
        </div>
      </div>

      {/* Right Panel - Login Cards */}
      <div className="col-span-12 lg:col-span-7 bg-slate-50 p-8 lg:p-12 flex flex-col justify-center items-center">
        <div className="w-full max-w-md">
          <AppCard variant="glass" className="shadow-2xl border-white/60 text-left">
            {/* Form Headers */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  {t.welcomeBack}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {t.loginSubtitle}
                </p>
              </div>
            </div>

            {/* Global Language Toggle Pill */}
            <SegmentedToggle
              value={language}
              onChange={setLanguage}
              options={[
                { value: 'en', label: 'English' },
                { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' }
              ]}
              className="mb-6"
            />

            {/* Role Toggle Pill */}
            <SegmentedToggle
              label={language === 'kn' ? 'ನಿಮ್ಮ ಪ್ರವೇಶ ಪಾತ್ರ ಆರಿಸಿ:' : 'Choose Login Role:'}
              value={selectedRole}
              onChange={setSelectedRole}
              options={[
                { value: 'Job Seeker', label: t.jobSeeker },
                { value: 'Business', label: t.business }
              ]}
              className="mb-6"
            />

            {/* Error Widget */}
            {errorMsg && (
              <div className="mb-4 bg-rose-50 border border-rose-100 text-rose-600 px-3.5 py-2 rounded-xl text-xs font-semibold">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Auth Method Toggle Pill */}
            <SegmentedToggle
              value={authMethod}
              onChange={(val) => {
                setAuthMethod(val);
                setOtpSent(false);
                setErrorMsg('');
              }}
              options={[
                { value: 'otp', label: t.otpLogin },
                { value: 'email', label: t.emailLogin }
              ]}
              className="mb-6"
            />

            {/* Form Fields */}
            {authMethod === 'otp' ? (
              <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp} className="space-y-4 w-full">
                {!otpSent ? (
                  <div className="space-y-1.5 w-full">
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
                    <div className="text-[10px] text-slate-400 leading-normal">
                      ℹ️ {t.otpMockNote}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 w-full">
                    <AppInput
                      type="text"
                      maxLength={6}
                      label={t.enterOtp}
                      placeholder="123456"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      icon={<Lock className="w-4 h-4" />}
                      className="tracking-[0.4em] font-extrabold"
                      required
                    />
                    <p className="text-[10px] text-emerald-600 font-medium">
                      ✓ Simulated OTP sent to +91 {phone} (use code 123456).
                    </p>
                  </div>
                )}

                <AppButton
                  type="submit"
                  fullWidth
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  {otpSent ? t.verifyOtp : t.sendOtp}
                </AppButton>
              </form>
            ) : (
              <form onSubmit={handleEmailLogin} className="space-y-4 w-full">
                <AppInput
                  type="email"
                  label={t.emailAddress}
                  placeholder="nandi.bakery@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  icon={<Mail className="w-4 h-4" />}
                  required
                />

                <AppInput
                  type="password"
                  label={t.password}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  icon={<Lock className="w-4 h-4" />}
                  required
                />

                <AppButton
                  type="submit"
                  fullWidth
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  {language === 'kn' ? 'ಮುಂದುವರೆಯಿರಿ' : 'Continue'}
                </AppButton>
              </form>
            )}

            {/* Social Separator */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <span className="relative bg-white px-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Or Connect
              </span>
            </div>

            {/* Google Sign-in Trigger */}
            <AppButton
              onClick={handleGoogleLoginClick}
              type="button"
              variant="secondary"
              fullWidth
              icon={
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
              }
            >
              {t.googleLogin}
            </AppButton>

            {/* Quick Registration Link */}
            <div className="text-center text-xs text-slate-400 mt-6 pt-4 border-t border-slate-100">
              {t.dontHaveAccount}{' '}
              <Link to="/register" className="text-indigo-600 font-bold hover:underline">
                {t.signUpNow}
              </Link>
            </div>
          </AppCard>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
