import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import AppCard from '../../components/ui/AppCard';
import AppButton from '../../components/ui/AppButton';
import AppTable from '../../components/ui/AppTable';
import { 
  PlusCircle, Users, Calendar, Briefcase, 
  Sparkles, CheckCircle2, UserCheck, Star, MapPin, Gift
} from 'lucide-react';

export const BusinessDashboard: React.FC = () => {
  const { language, currentUser, currentBusiness, jobs, applications, interviews, ratings } = useApp();
  const navigate = useNavigate();
  const t = translations[language];

  if (!currentUser || !currentBusiness) {
    return <div className="text-center py-12">Loading...</div>;
  }

  // Business statistics
  const bizJobs = jobs.filter(j => j.business_id === currentBusiness.id);
  const bizJobIds = bizJobs.map(j => j.id);
  const bizApps = applications.filter(app => bizJobIds.includes(app.job_id) || app.business_name === currentBusiness.business_name);
  const pendingApps = bizApps.filter(app => app.status === 'Pending' || app.status === 'Applied');
  const shortlistedApps = bizApps.filter(app => app.status === 'Shortlisted');
  const scheduledInterviews = bizApps.filter(app => app.status === 'Interview Scheduled');
  const offersSent = bizApps.filter(app => app.status === 'Offer Sent' || app.status === 'Offer Received');
  const hiredApps = bizApps.filter(app => app.status === 'Hired' || app.status === 'Accepted');

  // Business reviews
  const myReviews = ratings.filter(r => r.to_user_id === currentUser.id);
  const avgRating = myReviews.length > 0 ? (myReviews.reduce((acc, r) => acc + r.rating, 0) / myReviews.length).toFixed(1) : null;

  // Columns for applicants table
  const columns = [
    {
      key: 'seeker_name',
      header: 'Seeker Name',
      render: (val: string, row: any) => (
        <div>
          <div className="font-extrabold text-slate-800">{val}</div>
          <div className="text-[10px] text-slate-400 font-bold">Applied: {new Date(row.applied_at).toLocaleDateString()}</div>
        </div>
      )
    },
    {
      key: 'job_title',
      header: 'Job Role',
      render: (val: string) => (
        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">{val}</span>
      )
    },
    {
      key: 'match_score',
      header: 'Match %',
      render: (val: number) => (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 font-black text-[11px]">
          <Sparkles className="w-3 h-3 mr-0.5" />
          {val}%
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (val: string) => (
        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
          val === 'Pending' || val === 'Applied' ? 'bg-slate-100 text-slate-600' :
          val === 'Shortlisted' ? 'bg-cyan-100 text-cyan-700' :
          val === 'Interview Scheduled' ? 'bg-amber-100 text-amber-700' :
          val === 'Offer Sent' || val === 'Offer Received' ? 'bg-purple-100 text-purple-700' :
          val === 'Hired' || val === 'Accepted' ? 'bg-emerald-100 text-emerald-700' :
          'bg-rose-100 text-rose-700'
        }`}>
          {val}
        </span>
      )
    }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-lg shadow-indigo-600/10">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-black">
            {language === 'kn' ? `ನಮಸ್ಕಾರ, ${currentBusiness.business_name || currentUser.name}!` : `Welcome, ${currentBusiness.business_name || currentUser.name}!`}
          </h2>
          <p className="text-xs text-indigo-100 font-medium">
            {language === 'kn'
              ? 'ನಿಮ್ಮ ಅಂಗಡಿಯ ನೇಮಕಾತಿ ಚಟುವಟಿಕೆಗಳನ್ನು ಇಲ್ಲಿ ನಿರ್ವಹಿಸಿ.'
              : 'Review applications, schedule interviews, and message local candidates on WhatsApp.'}
          </p>
        </div>

        {avgRating ? (
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-2xl flex items-center space-x-2 border border-white/10">
            <Star className="w-5 h-5 text-amber-300 fill-amber-300 animate-pulse" />
            <span className="font-extrabold text-sm">{avgRating} / 5 Worker Rating</span>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-2xl text-xs font-bold border border-white/10">
            {currentBusiness.is_verified ? '✓ Verified Employer' : '★ Offline Mode'}
          </div>
        )}
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <AppCard className="p-4 flex items-center space-x-3 shadow-none border border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-extrabold uppercase block select-none">Total Apps</span>
            <div className="text-lg font-black text-slate-800">{bizApps.length}</div>
          </div>
        </AppCard>

        <AppCard className="p-4 flex items-center space-x-3 shadow-none border border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-extrabold uppercase block select-none">Pending</span>
            <div className="text-lg font-black text-slate-800">{pendingApps.length}</div>
          </div>
        </AppCard>

        <AppCard className="p-4 flex items-center space-x-3 shadow-none border border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-extrabold uppercase block select-none">Shortlisted</span>
            <div className="text-lg font-black text-slate-800">{shortlistedApps.length}</div>
          </div>
        </AppCard>

        <AppCard className="p-4 flex items-center space-x-3 shadow-none border border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-extrabold uppercase block select-none">Interviews</span>
            <div className="text-lg font-black text-slate-800">{scheduledInterviews.length}</div>
          </div>
        </AppCard>

        <AppCard className="p-4 flex items-center space-x-3 shadow-none border border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-extrabold uppercase block select-none">Offers Sent</span>
            <div className="text-lg font-black text-slate-800">{offersSent.length}</div>
          </div>
        </AppCard>

        <AppCard className="p-4 flex items-center space-x-3 shadow-none border border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[9px] text-slate-400 font-extrabold uppercase block select-none">Hired</span>
            <div className="text-lg font-black text-slate-800">{hiredApps.length}</div>
          </div>
        </AppCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Quick links */}
        <div className="lg:col-span-1 space-y-6">
          <AppCard className="space-y-4">
            <div className="border-b border-slate-100 pb-3 text-left">
              <h3 className="font-extrabold text-[15px] text-slate-800">Employer Quick Actions</h3>
            </div>
            <div className="flex flex-col space-y-2.5">
              <AppButton
                onClick={() => navigate('/business/post')}
                variant="primary"
                fullWidth
                icon={<PlusCircle className="w-4 h-4" />}
              >
                {t.postAJob}
              </AppButton>

              <AppButton
                onClick={() => navigate('/business/jobs')}
                variant="secondary"
                fullWidth
                icon={<Briefcase className="w-4 h-4 text-slate-500" />}
              >
                {t.manageJobs}
              </AppButton>

              <AppButton
                onClick={() => navigate('/business/applicants')}
                variant="secondary"
                fullWidth
                icon={<Users className="w-4 h-4 text-slate-500" />}
              >
                Review Candidates ({pendingApps.length})
              </AppButton>
            </div>
          </AppCard>
        </div>

        {/* Right Column: Candidates Screen */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-extrabold text-slate-800 text-lg flex items-center space-x-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <span>Recent Job Applicants</span>
          </h3>

          <AppTable
            columns={columns}
            data={bizApps}
            pageSize={4}
            emptyTitle="No applicants found"
            emptyDescription="Jobs are listed in Discovery pages. Share your vacancy links to attract local workers."
          />
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
