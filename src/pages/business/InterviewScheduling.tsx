import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import AppCard from '../../components/ui/AppCard';
import AppButton from '../../components/ui/AppButton';
import AppInput from '../../components/ui/AppInput';
import { Calendar, Clock, Video, MessageSquare, ArrowLeft, Check, AlertCircle } from 'lucide-react';

export const InterviewScheduling: React.FC = () => {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const { language, applications, scheduleVideoInterview } = useApp();
  const t = translations[language];

  const app = applications.find(a => a.id === appId);

  // Form states
  const [date, setDate] = useState('');
  const [time, setTime] = useState('11:00 AM');
  const [meetLink, setMeetLink] = useState('https://meet.google.com/abc-defg-hij');
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!app) {
    return (
      <div className="text-center py-12 space-y-4 text-slate-500">
        <AlertCircle className="w-12 h-12 mx-auto text-slate-400" />
        <p>Application context not found.</p>
        <AppButton onClick={() => navigate('/business/applicants')} variant="secondary">
          Go back to applicants
        </AppButton>
      </div>
    );
  }

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !meetLink) {
      setErrorMsg('Please fill in all scheduling fields.');
      return;
    }

    scheduleVideoInterview(app.id, date, time, meetLink);
    setSuccess(true);
    setErrorMsg('');
  };

  const getWhatsAppInvitationLink = () => {
    const encodedMessage = encodeURIComponent(
      language === 'kn'
        ? `ನಮಸ್ಕಾರ ${app.seeker_name}, ${app.business_name} ಸಂಸ್ಥೆಯು "${app.job_title}" ಕೆಲಸದ ಇಂಟರ್ವ್ಯೂಗಾಗಿ ನಿಮ್ಮನ್ನು ಆಹ್ವಾನಿಸಿದೆ. ದಿನಾಂಕ: ${date}, ಸಮಯ: ${time}. ಗೂಗಲ್ ಮೀಟ್ ಲಿಂಕ್: ${meetLink}. ದಯವಿಟ್ಟು ಖಚಿತಪಡಿಸಿ.`
        : `Hello ${app.seeker_name}, ${app.business_name} has invited you for an interview for "${app.job_title}". Date: ${date}, Time: ${time}. Meet Link: ${meetLink}. Please confirm your availability.`
    );
    return `https://wa.me/91${app.seeker_phone}?text=${encodedMessage}`;
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto py-4 text-left">
      <AppButton
        onClick={() => navigate('/business/applicants')}
        variant="ghost"
        icon={<ArrowLeft className="w-4 h-4" />}
        className="px-3 h-10 text-slate-500 hover:text-indigo-600"
      >
        Back to Applicants
      </AppButton>

      <div className="text-left font-sans">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Schedule Video Interview
        </h2>
        <p className="text-xs text-slate-500">
          Set up a video interview call slot for **{app.seeker_name}** applying for **{app.job_title}**.
        </p>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 p-4 rounded-2xl text-xs font-semibold space-y-3">
          <div className="flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Interview Scheduled & Saved in Platform. Now invite candidate on WhatsApp:</span>
          </div>
          <AppButton
            onClick={() => window.open(getWhatsAppInvitationLink(), '_blank')}
            variant="primary"
            fullWidth
            icon={<MessageSquare className="w-4 h-4" />}
            className="!bg-emerald-600 hover:!bg-emerald-700 !border-emerald-600"
          >
            Send Interview Invitation via WhatsApp
          </AppButton>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4.5 h-4.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {!success && (
        <form onSubmit={handleScheduleSubmit} className="space-y-5 w-full">
          <AppCard className="space-y-4">
            <AppInput
              type="date"
              label="Interview Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              icon={<Calendar className="w-4 h-4" />}
              required
            />

            <AppInput
              type="text"
              label="Interview Time"
              placeholder="E.g., 11:30 AM / 3:00 PM"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              icon={<Clock className="w-4 h-4" />}
              required
            />

            <AppInput
              type="url"
              label="Video Meeting Link (Google Meet / Jitsi)"
              placeholder="https://meet.google.com/abc-defg-hij"
              value={meetLink}
              onChange={(e) => setMeetLink(e.target.value)}
              icon={<Video className="w-4 h-4" />}
              required
            />
            <p className="text-[10px] text-slate-400">
              💡 Copy-paste a free meeting URL link from Google Meet (meet.google.com) or Jitsi Meet (meet.jit.si).
            </p>
          </AppCard>

          <AppButton
            type="submit"
            fullWidth
            variant="primary"
          >
            Confirm & Schedule Slot
          </AppButton>
        </form>
      )}
    </div>
  );
};

export default InterviewScheduling;
