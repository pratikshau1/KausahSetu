import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import AppCard from '../../components/ui/AppCard';
import AppButton from '../../components/ui/AppButton';
import EmptyState from '../../components/ui/EmptyState';
import { 
  Calendar, Video, ArrowRight, CheckCircle2, Gift, Briefcase, Check, XCircle
} from 'lucide-react';

export const MyApplications: React.FC = () => {
  const { language, currentUser, currentSeeker, applications, interviews, offers } = useApp();
  const navigate = useNavigate();
  const t = translations[language];

  if (!currentUser || !currentSeeker) {
    return <div className="text-center py-12 text-slate-500 font-medium">Loading...</div>;
  }

  const myApps = applications.filter(app => app.seeker_id === currentSeeker.id);

  return (
    <div className="space-y-6 text-left">
      <div className="text-left">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {t.applications}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'kn' ? 'ನೀವು ಸಲ್ಲಿಸಿದ ಉದ್ಯೋಗ ಅರ್ಜಿಗಳು ಮತ್ತು ಅವುಗಳ ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ' : 'Track the timeline of your submitted job applications and active interview stages'}
        </p>
      </div>

      {myApps.length === 0 ? (
        <div className="py-8">
          <EmptyState
            icon={Briefcase}
            title={language === 'kn' ? 'ಅರ್ಜಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ' : 'No Applications Yet'}
            description={language === 'kn' ? 'ನೀವು ಇನ್ನೂ ಯಾವುದೇ ಕೆಲಸಕ್ಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿಲ್ಲ.' : "You haven't applied for any jobs yet. Start exploring and apply for local jobs near you."}
            actionText={language === 'kn' ? 'ಉದ್ಯೋಗಗಳನ್ನು ಹುಡುಕಿ' : 'Find Jobs Now'}
            onAction={() => navigate('/seeker/jobs')}
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {/* Applications list */}
          <div className="md:col-span-2 space-y-4">
            {myApps.map((app) => {
              const appInterviews = interviews.filter(i => i.application_id === app.id);
              
              // Timeline calculations
              const steps = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Offer Sent', 'Hired'];
              let activeStepIndex = 0;
              if (app.status === 'Hired' || app.status === 'Accepted') {
                activeStepIndex = 5;
              } else if (app.status === 'Offer Sent' || app.status === 'Offer Received') {
                activeStepIndex = 4;
              } else if (app.status === 'Interview Scheduled') {
                activeStepIndex = 3;
              } else if (app.status === 'Shortlisted') {
                activeStepIndex = 2;
              } else if (app.reviewed_at) {
                activeStepIndex = 1;
              } else {
                activeStepIndex = 0;
              }

              return (
                <AppCard key={app.id} className="space-y-4 text-left" variant="solid">
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-base text-slate-800">{app.job_title}</h3>
                      <p className="text-xs text-slate-405 font-bold">{app.business_name}</p>
                    </div>
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                      app.status === 'Pending' || app.status === 'Applied' ? 'bg-slate-100 text-slate-600' :
                      app.status === 'Shortlisted' ? 'bg-cyan-50 text-cyan-600' :
                      app.status === 'Interview Scheduled' ? 'bg-amber-100 text-amber-700' :
                      app.status === 'Offer Sent' || app.status === 'Offer Received' ? 'bg-purple-100 text-purple-700 animate-pulse' :
                      app.status === 'Hired' || app.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>

                  {/* App details */}
                  <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-500">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold mb-0.5">Applied Date</span>
                      <span className="text-slate-700 font-semibold">{new Date(app.applied_at).toLocaleDateString()}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold mb-0.5">Profile Fit Rating</span>
                      <span className="text-indigo-600 font-bold">✓ {app.match_score}% Matching</span>
                    </div>
                  </div>

                  {/* Visual timeline tracker */}
                  <div className="py-4 border-t border-slate-100 space-y-3.5">
                    <span className="text-[9px] text-slate-400 block font-extrabold tracking-wider uppercase">Application Tracking Status</span>
                    {app.status === 'Rejected' ? (
                      <div className="bg-rose-50 border border-rose-100 text-rose-600 p-3.5 rounded-xl flex items-center space-x-2 text-xs font-semibold">
                        <XCircle className="w-4.5 h-4.5 text-rose-600 flex-shrink-0" />
                        <span>This application has been declined. You can apply to other matching job vacancies.</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center relative pt-1 px-1">
                          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
                          <div 
                            className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 -translate-y-1/2 z-0 transition-all duration-500" 
                            style={{ width: `${(activeStepIndex / 5) * 100}%` }}
                          />

                          {steps.map((step, idx) => {
                            const isCompleted = idx < activeStepIndex;
                            const isActive = idx === activeStepIndex;
                            return (
                              <div key={step} className="flex flex-col items-center z-10 relative">
                                <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 transition-all ${
                                  isCompleted ? 'bg-indigo-600 border-indigo-600 text-white' :
                                  isActive ? 'bg-white border-indigo-600 text-indigo-600 scale-110 shadow-sm' :
                                  'bg-white border-slate-200 text-slate-400'
                                }`}>
                                  {isCompleted ? (
                                    <Check className="w-3 h-3" />
                                  ) : (
                                    <span className="text-[9px] font-bold">{idx + 1}</span>
                                  )}
                                </div>
                                <span className={`text-[8px] font-black mt-1.5 hidden md:block ${
                                  isActive ? 'text-indigo-600 font-extrabold' : 
                                  isCompleted ? 'text-slate-600 font-bold' : 'text-slate-400'
                                }`}>
                                  {step}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <div className="text-[9px] font-bold text-indigo-600 md:hidden text-center">
                          Current Status: {steps[activeStepIndex]}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Active Offer Prompt */}
                  {(app.status === 'Offer Sent' || app.status === 'Offer Received') && (
                    <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Gift className="w-5 h-5 text-indigo-600 animate-bounce" />
                        <span className="text-xs font-bold text-indigo-700">Congratulations! Offer Received!</span>
                      </div>
                      <AppButton
                        onClick={() => navigate('/seeker/offers')}
                        variant="primary"
                        className="!h-9 !px-4 !text-xs !rounded-lg"
                        icon={<ArrowRight className="w-3.5 h-3.5" />}
                        iconPosition="right"
                      >
                        View Offer
                      </AppButton>
                    </div>
                  )}

                  {/* Interview scheduled info */}
                  {appInterviews.length > 0 && (
                    <div className="p-3.5 bg-amber-50/50 border border-amber-100 rounded-xl space-y-2.5">
                      <div className="flex items-center space-x-2 text-amber-700 font-bold text-xs">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        <span>Scheduled Interview Details</span>
                      </div>

                      {appInterviews.map((int) => (
                        <div key={int.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                          <div className="space-y-1">
                            <div>Date: <strong className="text-slate-700">{int.interview_date}</strong></div>
                            <div>Time: <strong className="text-slate-700">{int.interview_time}</strong></div>
                          </div>
                          
                          <AppButton
                            onClick={() => window.open(int.meeting_link, '_blank', 'noopener,noreferrer')}
                            variant="secondary"
                            className="!h-9 !px-4 !text-xs !border-amber-200 !text-amber-700 hover:!bg-amber-50"
                            icon={<Video className="w-4 h-4 text-amber-600" />}
                          >
                            Join Interview
                          </AppButton>
                        </div>
                      ))}
                    </div>
                  )}
                </AppCard>
              );
            })}
          </div>

          {/* Quick FAQ / Help Sidebar */}
          <div className="space-y-6">
            <AppCard className="space-y-4" variant="solid">
              <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2">Hiring Steps Guide</h3>
              
              <div className="space-y-3.5 text-xs text-slate-500">
                <div className="flex space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Applied:</strong> Business owner gets notified about your profile and match score.</span>
                </div>
                <div className="flex space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Interview Scheduled:</strong> Join using Google Meet or Jitsi Meet link at the date.</span>
                </div>
                <div className="flex space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Offer Received:</strong> View the salary and work details. Accept to complete hire.</span>
                </div>
              </div>
            </AppCard>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplications;
