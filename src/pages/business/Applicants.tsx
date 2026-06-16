import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import AppCard from '../../components/ui/AppCard';
import AppButton from '../../components/ui/AppButton';
import AppInput from '../../components/ui/AppInput';
import AppTextarea from '../../components/ui/AppTextarea';
import AppModal from '../../components/ui/AppModal';
import EmptyState from '../../components/ui/EmptyState';
import { db } from '../../services/supabase';
import { 
  Users, ShieldCheck, MessageSquare, Calendar, Gift, 
  MapPin, Check, Phone, Mail, ChevronDown, ChevronUp, AlertCircle,
  Clock, Video, Sparkles, XCircle, Award
} from 'lucide-react';

export const Applicants: React.FC = () => {
  const { 
    language, 
    currentBusiness, 
    applications, 
    jobs,
    shortlistApplicant, 
    viewApplicantProfile, 
    rejectApplicant,
    scheduleVideoInterview,
    sendJobOffer
  } = useApp();
  
  const navigate = useNavigate();
  const t = translations[language];

  // Tabs for Applicant Management Pipeline
  const [activeTab, setActiveTab] = useState<'Pending' | 'Shortlisted' | 'Interview' | 'Offers' | 'Hired' | 'Rejected'>('Pending');
  
  // Detailed Profile Modal state
  const [profileModalApp, setProfileModalApp] = useState<any | null>(null);

  // Expanded card state
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  // Forms states
  const [activeScheduleAppId, setActiveScheduleAppId] = useState<string | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('11:00 AM');
  const [scheduleLink, setScheduleLink] = useState('https://meet.google.com/abc-defg-hij');
  const [scheduleNotes, setScheduleNotes] = useState('');

  const [activeOfferAppId, setActiveOfferAppId] = useState<string | null>(null);
  const [offerSalary, setOfferSalary] = useState('');
  const [offerMsg, setOfferMsg] = useState('');
  const [offerJoinDate, setOfferJoinDate] = useState('');

  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  if (!currentBusiness) {
    return <div className="text-center py-12 text-slate-500 font-medium">Loading...</div>;
  }

  // Filter business applications - match via job's business_id for reliable linking
  const businessJobIds = jobs.filter(j => j.business_id === currentBusiness.id).map(j => j.id);
  const bizApps = applications.filter(app => 
    businessJobIds.includes(app.job_id) || app.business_name === currentBusiness.business_name
  );

  // Tabs layout calculations
  const tabCounts = {
    Pending: bizApps.filter(app => app.status === 'Pending' || app.status === 'Applied').length,
    Shortlisted: bizApps.filter(app => app.status === 'Shortlisted').length,
    Interview: bizApps.filter(app => app.status === 'Interview Scheduled').length,
    Offers: bizApps.filter(app => app.status === 'Offer Sent' || app.status === 'Offer Received').length,
    Hired: bizApps.filter(app => app.status === 'Hired' || app.status === 'Accepted').length,
    Rejected: bizApps.filter(app => app.status === 'Rejected').length,
  };

  const tabs = [
    { key: 'Pending' as const, label: 'Pending', count: tabCounts.Pending },
    { key: 'Shortlisted' as const, label: 'Shortlisted', count: tabCounts.Shortlisted },
    { key: 'Interview' as const, label: 'Interviews', count: tabCounts.Interview },
    { key: 'Offers' as const, label: 'Offers Sent', count: tabCounts.Offers },
    { key: 'Hired' as const, label: 'Hired', count: tabCounts.Hired },
    { key: 'Rejected' as const, label: 'Rejected', count: tabCounts.Rejected },
  ];

  const filteredApps = bizApps.filter((app) => {
    if (activeTab === 'Pending') return app.status === 'Pending' || app.status === 'Applied';
    if (activeTab === 'Shortlisted') return app.status === 'Shortlisted';
    if (activeTab === 'Interview') return app.status === 'Interview Scheduled';
    if (activeTab === 'Offers') return app.status === 'Offer Sent' || app.status === 'Offer Received';
    if (activeTab === 'Hired') return app.status === 'Hired' || app.status === 'Accepted';
    if (activeTab === 'Rejected') return app.status === 'Rejected';
    return false;
  });

  const toggleExpand = (appId: string) => {
    setExpandedAppId(expandedAppId === appId ? null : appId);
  };

  // Profile modal action (includes marking as reviewed/viewed)
  const handleOpenProfileModal = (app: any) => {
    setProfileModalApp(app);
    viewApplicantProfile(app.id);
  };

  // Shortlist action
  const handleShortlist = (appId: string) => {
    shortlistApplicant(appId);
    showSuccessToast('Candidate shortlisted successfully!');
  };

  // Reject action
  const handleReject = (appId: string) => {
    rejectApplicant(appId);
    showSuccessToast('Applicant rejected.');
  };

  // Schedule Interview Submit
  const handleScheduleSubmit = (e: React.FormEvent, appId: string) => {
    e.preventDefault();
    if (!scheduleDate || !scheduleTime || !scheduleLink) return;

    scheduleVideoInterview(appId, scheduleDate, scheduleTime, scheduleLink, scheduleNotes);
    
    setScheduleDate('');
    setScheduleTime('11:00 AM');
    setScheduleLink('https://meet.google.com/abc-defg-hij');
    setScheduleNotes('');
    setActiveScheduleAppId(null);
    showSuccessToast('Interview call scheduled and seeker notified!');
  };

  // Send Offer Submit
  const handleOfferSubmit = (e: React.FormEvent, appId: string) => {
    e.preventDefault();
    if (!offerSalary) return;

    sendJobOffer(
      appId, 
      offerMsg || 'We are happy to extend this local job vacancy offer to you.', 
      offerSalary, 
      offerJoinDate
    );

    setOfferSalary('');
    setOfferMsg('');
    setOfferJoinDate('');
    setActiveOfferAppId(null);
    showSuccessToast('Official job offer sent to candidate!');
  };

  const showSuccessToast = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  const getWhatsAppLink = (app: any) => {
    const encodedMessage = encodeURIComponent(
      language === 'kn'
        ? `ನಮಸ್ಕಾರ ${app.seeker_name}, ಕೌಶಲ್ ಸೇತುನಲ್ಲಿ ನೀವು ಸಲ್ಲಿಸಿದ "${app.job_title}" ಕೆಲಸದ ಅರ್ಜಿಯನ್ನು ನಾವು ಪರಿಶೀಲಿಸಿದ್ದೇವೆ. ದಯವಿಟ್ಟು ಸಂಪರ್ಕಿಸಿ.`
        : `Hello ${app.seeker_name}, we reviewed your application for "${app.job_title}" on KaushalSetu and would like to connect with you.`
    );
    return `https://wa.me/91${app.seeker_phone}?text=${encodedMessage}`;
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto py-4">
      {/* Title block */}
      <div className="text-left font-sans">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-600" />
          <span>{t.applicants}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Track applicant lifecycle pipelines, review detailed resumes, schedule interview calls, or issue job offers.
        </p>
      </div>

      {/* Action status notification */}
      {actionSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center space-x-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Tab Pipeline Navigation */}
      <div className="flex flex-wrap border-b border-slate-200 pb-1.5 gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTab(tab.key);
              setExpandedAppId(null);
              setActiveScheduleAppId(null);
              setActiveOfferAppId(null);
            }}
            className={`px-4 py-2.5 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center space-x-2 ${
              activeTab === tab.key
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/15'
                : 'bg-white hover:bg-slate-50 text-slate-500 border border-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
              activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      {filteredApps.length === 0 ? (
        <EmptyState
          icon={Users}
          title={`No ${activeTab} Candidates`}
          description={`There are currently no job applications in the "${activeTab}" stage of the hiring pipeline.`}
        />
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const isExpanded = expandedAppId === app.id;
            const isScheduling = activeScheduleAppId === app.id;
            const isOffering = activeOfferAppId === app.id;
            
            const seekers = db.getTable<any>('SEEKERS');
            const seekerProfile = seekers.find(s => s.id === app.seeker_id);

            return (
              <AppCard 
                key={app.id} 
                className={`border text-left ${
                  isExpanded ? 'border-indigo-200 shadow-md' : 'border-slate-100 shadow-sm'
                }`}
              >
                {/* Header overview row */}
                <div className="flex justify-between items-start flex-wrap gap-4 text-left">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                      <h3 className="font-extrabold text-base text-slate-800">
                        {app.seeker_name}
                      </h3>
                      {!app.reviewed_at && (
                        <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[9px] font-bold px-1.5 py-0.5 rounded-md animate-pulse">
                          NEW
                        </span>
                      )}
                      {app.reviewed_at && app.status === 'Pending' && (
                        <span className="bg-slate-100 text-slate-505 text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                          Reviewed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-bold">Applied: {app.job_title}</p>
                    <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                      <span>Submitted: {new Date(app.applied_at).toLocaleDateString()}</span>
                      {app.reviewed_at && (
                        <span>• Viewed: {new Date(app.reviewed_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5 flex-shrink-0">
                    <div className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100/50">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="text-xs font-black text-indigo-600">{app.match_score}% Fit</span>
                    </div>

                    <button
                      onClick={() => toggleExpand(app.id)}
                      className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4.5 h-4.5" /> : <ChevronDown className="w-4.5 h-4.5" />}
                    </button>
                  </div>
                </div>

                {/* Details layout */}
                {isExpanded && (
                  <div className="pt-4 border-t border-slate-100 space-y-4 text-xs">
                    {/* Basic Seeker details preview */}
                    {seekerProfile && (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/50 grid md:grid-cols-2 gap-4 text-slate-605">
                        <div>
                          <strong className="text-slate-800 block mb-1">Key Skills</strong>
                          <div className="flex flex-wrap gap-1">
                            {seekerProfile.skills.map((s: string, idx: number) => (
                              <span key={idx} className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[10px] font-medium text-slate-700">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <strong className="text-slate-800 block mb-1">Languages & Exp</strong>
                          <span>Languages: {seekerProfile.languages.join(', ')}</span> <br />
                          <span>Experience: {seekerProfile.experience}</span>
                        </div>
                      </div>
                    )}

                    {/* Compatibility reports */}
                    <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                      <span className="font-extrabold text-indigo-800 block mb-1">📋 Platform Compatibility Report</span>
                      <p className="text-slate-605 leading-relaxed">{app.match_reason}</p>
                    </div>

                    {/* Stage specific info render */}
                    {app.status === 'Interview Scheduled' && app.interview_date && (
                      <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl space-y-1 text-slate-700">
                        <span className="font-extrabold text-amber-800 block">📞 Interview Call Scheduled</span>
                        <div>Time: <strong>{app.interview_date}</strong></div>
                        {app.interview_link && (
                          <div>
                            Link: <a href={app.interview_link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold hover:underline">{app.interview_link}</a>
                          </div>
                        )}
                      </div>
                    )}

                    {app.status === 'Offer Sent' && app.offer_salary && (
                      <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl space-y-1 text-slate-700">
                        <span className="font-extrabold text-purple-800 block">✉️ Job Offer Letter Sent</span>
                        <div>Salary Offered: <strong>₹{Number(app.offer_salary).toLocaleString()} / month</strong></div>
                        {app.offer_message && <div>Details: <span className="italic">"{app.offer_message}"</span></div>}
                      </div>
                    )}

                    {app.status === 'Hired' && (
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-slate-700 flex items-center justify-between">
                        <div>
                          <span className="font-extrabold text-emerald-800 block">🎉 Applicant Successfully Hired</span>
                          <p className="text-[11px] text-slate-500">Call candidate to complete joining: <strong>+91 {app.seeker_phone}</strong></p>
                        </div>
                        <AppButton
                          onClick={() => window.open(getWhatsAppLink(app), '_blank')}
                          variant="secondary"
                          className="!h-9 !px-3 !text-xs !border-emerald-200 !text-emerald-600"
                          icon={<MessageSquare className="w-3.5 h-3.5 text-emerald-500" />}
                        >
                          Send Welcome Msg
                        </AppButton>
                      </div>
                    )}

                    {/* Actions Panel */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
                      <AppButton
                        onClick={() => handleOpenProfileModal(app)}
                        variant="secondary"
                        className="!h-10 !px-4 !text-xs"
                      >
                        View Profile
                      </AppButton>

                      {/* Pending specific actions */}
                      {(app.status === 'Pending' || app.status === 'Applied') && (
                        <AppButton
                          onClick={() => handleShortlist(app.id)}
                          variant="primary"
                          className="!h-10 !px-4 !text-xs"
                          icon={<Sparkles className="w-3.5 h-3.5" />}
                        >
                          Shortlist
                        </AppButton>
                      )}

                      {/* Shortlisted actions */}
                      {app.status === 'Shortlisted' && (
                        <AppButton
                          onClick={() => {
                            setActiveScheduleAppId(isScheduling ? null : app.id);
                            setActiveOfferAppId(null);
                          }}
                          variant="primary"
                          className="!h-10 !px-4 !text-xs"
                          icon={<Calendar className="w-3.5 h-3.5" />}
                        >
                          {isScheduling ? 'Cancel' : 'Schedule Interview'}
                        </AppButton>
                      )}

                      {/* Scheduled actions */}
                      {app.status === 'Interview Scheduled' && (
                        <AppButton
                          onClick={() => {
                            setActiveOfferAppId(isOffering ? null : app.id);
                            setActiveScheduleAppId(null);
                          }}
                          variant="primary"
                          className="!h-10 !px-4 !text-xs"
                          icon={<Gift className="w-3.5 h-3.5" />}
                        >
                          {isOffering ? 'Cancel Offer' : 'Send Offer'}
                        </AppButton>
                      )}

                      {/* Reject button (hide if already hired or rejected) */}
                      {app.status !== 'Hired' && app.status !== 'Accepted' && app.status !== 'Rejected' && (
                        <AppButton
                          onClick={() => handleReject(app.id)}
                          variant="ghost"
                          className="!h-10 !px-4 !text-xs border border-rose-200 text-rose-600 hover:bg-rose-50"
                        >
                          Reject
                        </AppButton>
                      )}

                      {/* Direct WhatsApp Call */}
                      <AppButton
                        onClick={() => window.open(getWhatsAppLink(app), '_blank')}
                        variant="secondary"
                        className="!h-10 !px-4 !text-xs !border-emerald-200 !text-emerald-600 hover:bg-emerald-50/20"
                        icon={<MessageSquare className="w-3.5 h-3.5 text-emerald-500" />}
                      >
                        WhatsApp Chat
                      </AppButton>
                    </div>

                    {/* Inline scheduling form drawer */}
                    {isScheduling && (
                      <form 
                        onSubmit={(e) => handleScheduleSubmit(e, app.id)}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4"
                      >
                        <h4 className="font-bold text-slate-800 text-[13px] border-b border-slate-200 pb-1">
                          Schedule Interview Specifications
                        </h4>
                        
                        <div className="grid md:grid-cols-3 gap-4">
                          <AppInput
                            type="date"
                            label="Select Date"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            required
                          />
                          <AppInput
                            type="text"
                            label="Select Time"
                            placeholder="E.g. 11:30 AM"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            required
                          />
                          <AppInput
                            type="url"
                            label="Video Meeting Link"
                            placeholder="https://meet.google.com/abc-def-ghi"
                            value={scheduleLink}
                            onChange={(e) => setScheduleLink(e.target.value)}
                            required
                          />
                        </div>

                        <AppTextarea
                          label="Notes / Instructions (Optional)"
                          placeholder="Please bring your ID card and have stable internet..."
                          value={scheduleNotes}
                          onChange={(e) => setScheduleNotes(e.target.value)}
                          rows={2}
                        />

                        <div className="flex justify-end">
                          <AppButton type="submit" variant="primary" className="!h-9 !px-4 !text-xs">
                            Confirm Schedule
                          </AppButton>
                        </div>
                      </form>
                    )}

                    {/* Inline offer letter form drawer */}
                    {isOffering && (
                      <form 
                        onSubmit={(e) => handleOfferSubmit(e, app.id)}
                        className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4"
                      >
                        <h4 className="font-bold text-slate-800 text-[13px] border-b border-slate-200 pb-1">
                          Issue Official Job Offer
                        </h4>
                        
                        <div className="grid md:grid-cols-2 gap-4">
                          <AppInput
                            type="text"
                            label="Offer Salary (INR ₹/month)"
                            placeholder="15000"
                            prefixText="₹"
                            value={offerSalary}
                            onChange={(e) => setOfferSalary(e.target.value.replace(/\D/g, ''))}
                            required
                          />
                          <AppInput
                            type="date"
                            label="Expected Joining Date"
                            value={offerJoinDate}
                            onChange={(e) => setOfferJoinDate(e.target.value)}
                          />
                        </div>

                        <AppTextarea
                          label="Offer Message / Instructions"
                          placeholder="We are happy to welcome you to Ganesh Provision Store..."
                          value={offerMsg}
                          onChange={(e) => setOfferMsg(e.target.value)}
                          rows={2.5}
                        />

                        <div className="flex justify-end">
                          <AppButton type="submit" variant="primary" className="!h-9 !px-4 !text-xs">
                            Issue Offer Letter
                          </AppButton>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </AppCard>
            );
          })}
        </div>
      )}

      {/* Candidate Profile Details modal overlay */}
      {profileModalApp && (
        <AppModal
          isOpen={!!profileModalApp}
          onClose={() => setProfileModalApp(null)}
          title={`Candidate Profile: ${profileModalApp.seeker_name}`}
          description="Detailed resume specifications and candidate credentials."
          confirmText="Done"
          onConfirm={() => setProfileModalApp(null)}
          maxWidthClass="max-w-2xl"
        >
          {(() => {
            const seekers = db.getTable<any>('SEEKERS');
            const profile = seekers.find(s => s.id === profileModalApp.seeker_id);
            if (!profile) return <p className="text-xs text-slate-500 py-4 text-center">Profile data not found.</p>;

            return (
              <div className="space-y-4 text-xs md:text-sm text-slate-600 leading-relaxed text-left py-2 font-sans">
                <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">CONTACT PHONE</span>
                    <span className="font-semibold text-slate-800">+91 {profileModalApp.seeker_phone || profile.phone || '9876543210'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">LOCATION CITY</span>
                    <span className="font-semibold text-slate-800">{profile.city || 'Bangalore'}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block font-bold mb-1">KEY SKILLS</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(profile.skills || []).map((s: string, idx: number) => (
                      <span key={idx} className="bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 text-[11px] font-medium">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">LANGUAGES</span>
                    <span className="text-slate-800 font-medium">{(profile.languages || []).join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">WORK EXPERIENCE</span>
                    <span className="text-slate-800 font-medium">{profile.experience || 'Fresher'}</span>
                  </div>
                </div>

                {profile.profile_summary && (
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/50">
                    <span className="text-[10px] text-slate-400 block font-bold mb-1">PROFILE SUMMARY</span>
                    <p className="italic text-slate-600">"{profile.profile_summary}"</p>
                  </div>
                )}

                <div className="border-t border-slate-100 pt-3">
                  <span className="text-[10px] text-slate-400 block font-bold mb-1">REPRESENTED RESUME / BIO</span>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Downloading Resume file (Mock PDF file initialized)");
                    }}
                    className="inline-flex items-center space-x-1.5 text-xs text-indigo-600 hover:text-indigo-705 font-bold hover:underline"
                  >
                    <span>📄 Download CV / Resume Document</span>
                  </a>
                </div>
              </div>
            );
          })()}
        </AppModal>
      )}
    </div>
  );
};

export default Applicants;
