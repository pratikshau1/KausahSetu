import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import AppCard from '../../components/ui/AppCard';
import AppButton from '../../components/ui/AppButton';
import { 
  FileText, Award, HelpCircle, User, Briefcase, 
  MapPin, Clock, ArrowRight, ShieldCheck, Sparkles, Star, Calendar, Gift
} from 'lucide-react';

export const SeekerDashboard: React.FC = () => {
  const { language, currentUser, currentSeeker, jobs, applications, ratings, offers, interviews } = useApp();
  const navigate = useNavigate();
  const t = translations[language];

  if (!currentUser || !currentSeeker) {
    return <div className="text-center py-12">Loading...</div>;
  }

  // Calculate Profile Completeness
  const calculateCompleteness = () => {
    let score = 0;
    if (currentSeeker.city) score += 15;
    if (currentSeeker.area) score += 15;
    if (currentSeeker.skills && currentSeeker.skills.length > 0) score += 25;
    if (currentSeeker.experience) score += 15;
    if (currentSeeker.languages && currentSeeker.languages.length > 0) score += 15;
    if (currentSeeker.profile_summary) score += 15;
    return score;
  };

  const completeness = calculateCompleteness();
  const seekerApps = applications.filter(app => app.seeker_id === currentSeeker.id);

  // Recommendations: jobs that match at least one skill, sorted by matchScore
  const recommendedJobs = jobs
    .filter(j => j.status === 'active')
    .map(j => {
      const overlap = j.skills_required.filter(s => 
        currentSeeker.skills.some(cs => cs.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(cs.toLowerCase()))
      ).length;
      const score = Math.min(100, Math.round(50 + (j.skills_required.length > 0 ? (overlap / j.skills_required.length) * 40 : 20) + (j.city === currentSeeker.city ? 10 : 0)));
      return { ...j, matchScore: score };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  // Average Rating
  const myRatings = ratings.filter(r => r.to_user_id === currentUser.id);
  const avgRating = myRatings.length > 0 ? (myRatings.reduce((acc, r) => acc + r.rating, 0) / myRatings.length).toFixed(1) : null;

  return (
    <div className="space-y-6 text-left">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-cyan-500 rounded-3xl p-6 md:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-lg shadow-indigo-600/10">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-black">
            {language === 'kn' ? `ನಮಸ್ಕಾರ, ${currentUser.name}!` : `Hello, ${currentUser.name}!`}
          </h2>
          <p className="text-xs text-indigo-100 font-medium">
            {language === 'kn'
               ? 'ನಿಮ್ಮ ಕೌಶಲ್ಯಕ್ಕೆ ತಕ್ಕ ಹತ್ತಿರದ ಉದ್ಯೋಗಗಳನ್ನು ಕೆಳಗೆ ಪರಿಶೀಲಿಸಿ.'
               : 'Welcome back to your local career portal. Let us guide you to nearby opportunities.'}
          </p>
        </div>

        {avgRating && (
          <div className="bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-2xl flex items-center space-x-2 border border-white/10">
            <Star className="w-5 h-5 text-amber-300 fill-amber-300 animate-pulse" />
            <span className="font-extrabold text-sm">{avgRating} / 5 Employer Rating</span>
          </div>
        )}
      </div>

      {/* Stats Counter Section */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AppCard className="space-y-1 p-5 shadow-none border border-slate-100">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> Total Applications</span>
          <div className="text-2xl font-black text-slate-800">{seekerApps.length}</div>
        </AppCard>
        <AppCard className="space-y-1 p-5 shadow-none border border-slate-100">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><Gift className="w-3.5 h-3.5" /> Offers Received</span>
          <div className="text-2xl font-black text-indigo-600">{offers.filter(o => o.seeker_id === currentSeeker.id).length}</div>
        </AppCard>
        <AppCard className="space-y-1 p-5 shadow-none border border-slate-100">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Interviews Slots</span>
          <div className="text-2xl font-black text-cyan-600">{interviews.filter(i => i.seeker_id === currentSeeker.id).length}</div>
        </AppCard>
        <AppCard className="space-y-1 p-5 shadow-none border border-slate-100">
          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5"><Star className="w-3.5 h-3.5" /> Avg Rating</span>
          <div className="text-2xl font-black text-emerald-600">{avgRating ? `${avgRating} ★` : 'No ratings'}</div>
        </AppCard>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Progress & Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Meter */}
          <AppCard className="space-y-4">
            <div className="border-b border-slate-100 pb-3 text-left">
              <h3 className="font-extrabold text-[15px] text-slate-800 flex items-center justify-between">
                <span>{t.profileCompletion}</span>
                <span className="text-indigo-600 font-black text-xs">{completeness}%</span>
              </h3>
            </div>
            
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-600 to-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completeness}%` }}
              ></div>
            </div>

            {completeness < 70 ? (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 text-[10px] text-amber-600 leading-normal font-medium">
                ⚠️ {t.completionLowWarning}
                <button 
                  onClick={() => navigate('/seeker/profile')}
                  className="text-indigo-600 font-extrabold hover:underline block mt-1 cursor-pointer"
                >
                  {language === 'kn' ? 'ಪ್ರೊಫೈಲ್ ಪೂರ್ಣಗೊಳಿಸಿ →' : 'Complete Profile Now →'}
                </button>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-[10px] text-emerald-600 font-medium flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{language === 'kn' ? 'ನಿಮ್ಮ ಪ್ರೊಫೈಲ್ ಉತ್ತಮ ಸ್ಥಿತಿಯಲ್ಲಿದೆ!' : 'Profile complete! Local hiring recommendations active.'}</span>
              </div>
            )}
          </AppCard>

          {/* Quick Actions */}
          <AppCard className="space-y-4">
            <div className="border-b border-slate-100 pb-3 text-left">
              <h3 className="font-extrabold text-[15px] text-slate-855">{t.quickActions}</h3>
            </div>
            
            <div className="flex flex-col space-y-2.5">


              <button
                onClick={() => navigate('/seeker/guidance')}
                className="flex items-center space-x-3 p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 hover:text-indigo-600 border border-slate-100 hover:border-indigo-100 transition-all text-left cursor-pointer group text-xs font-bold text-slate-705"
              >
                <Award className="w-4 h-4 text-cyan-500" />
                <span className="flex-1">{t.checkSkillGap}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/seeker/profile')}
                className="flex items-center space-x-3 p-3.5 rounded-xl bg-slate-50 hover:bg-indigo-50/50 hover:text-indigo-600 border border-slate-100 hover:border-indigo-100 transition-all text-left cursor-pointer group text-xs font-bold text-slate-705"
              >
                <User className="w-4 h-4 text-slate-500" />
                <span className="flex-1">{language === 'kn' ? 'ಪ್ರೊಫೈಲ್ ಸಂಪಾದಿಸಿ' : 'Edit Profile'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </AppCard>
        </div>

        {/* Right Column: Recommended Jobs & Applications Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Recommendations */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-800 text-lg flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-indigo-500" />
              <span>{t.recommendedJobs}</span>
            </h3>

            <div className="space-y-4">
              {recommendedJobs.length === 0 ? (
                <div className="bg-white p-8 text-center text-xs text-slate-400 rounded-2xl border border-slate-100">
                  {language === 'kn' ? 'ಯಾವುದೇ ಶಿಫಾರಸುಗಳಿಲ್ಲ. ಪ್ರೊಫೈಲ್ ಕೌಶಲ್ಯಗಳನ್ನು ನವೀಕರಿಸಿ!' : 'No matched jobs. Update your profile skills to get matches!'}
                </div>
              ) : (
                recommendedJobs.map((job) => (
                  <AppCard 
                    key={job.id} 
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left cursor-pointer hover:scale-[1.01]"
                    onClick={() => navigate(`/seeker/jobs/${job.id}`)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-bold">
                          {job.job_type}
                        </span>
                        <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold">
                          {job.salary}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-base text-slate-800">{job.title}</h4>
                      <p className="text-xs text-slate-400 font-bold">{job.business_name}</p>
                      
                      <div className="flex items-center space-x-4 text-[10px] text-slate-400 font-medium">
                        <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {job.location}</span>
                        <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-slate-400" /> {job.experience_required}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <div className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100/50">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                        <span className="text-xs font-black text-indigo-600">{job.matchScore}% Match</span>
                      </div>
                      <button className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 flex items-center space-x-1 cursor-pointer">
                        <span>{t.viewDetails}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </AppCard>
                ))
              )}
            </div>
          </div>

          {/* Recent Applications Tracker */}
          <AppCard className="space-y-4">
            <div className="border-b border-slate-100 pb-3 text-left">
              <h3 className="font-extrabold text-[15px] text-slate-800 flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-indigo-600" />
                <span>{language === 'kn' ? 'ಇತ್ತೀಚಿನ ಅರ್ಜಿಗಳ ಸ್ಥಿತಿ' : 'Recent Application Status'}</span>
              </h3>
            </div>

            {seekerApps.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-400">
                {language === 'kn' ? 'ನೀವು ಇನ್ನೂ ಯಾವುದೇ ಉದ್ಯೋಗಕ್ಕೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿಲ್ಲ.' : "You haven't applied to any jobs yet."}
              </div>
            ) : (
              <div className="space-y-3.5 divide-y divide-slate-100">
                {seekerApps.map((app, idx) => (
                  <div key={app.id} className={`pt-3.5 ${idx === 0 ? 'pt-0' : ''} flex justify-between items-center cursor-pointer hover:bg-slate-50/50 p-1 rounded-lg transition-colors`} onClick={() => navigate('/seeker/applications')}>
                    <div className="space-y-1 text-left">
                      <h4 className="font-extrabold text-xs text-slate-800">{app.job_title}</h4>
                      <p className="text-[10px] text-slate-400 font-bold">{app.business_name}</p>
                      <span className="text-[9px] text-slate-400">Applied: {new Date(app.applied_at).toLocaleDateString()}</span>
                    </div>

                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                      app.status === 'Pending' || app.status === 'Applied' ? 'bg-slate-100 text-slate-600' :
                      app.status === 'Shortlisted' ? 'bg-cyan-50 text-cyan-600' :
                      app.status === 'Interview Scheduled' ? 'bg-amber-100 text-amber-700' :
                      app.status === 'Offer Sent' || app.status === 'Offer Received' ? 'bg-purple-100 text-purple-700' :
                      app.status === 'Hired' || app.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </AppCard>
        </div>
      </div>
    </div>
  );
};

export default SeekerDashboard;
