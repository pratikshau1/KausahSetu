import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import AppCard from '../../components/ui/AppCard';
import AppButton from '../../components/ui/AppButton';
import { db } from '../../services/supabase';
import { 
  ArrowLeft, MapPin, DollarSign, Clock, Briefcase, 
  MessageSquare, CheckCircle, ShieldCheck, AlertCircle
} from 'lucide-react';

export const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { language, currentUser, currentSeeker, jobs, applications, applyForJob } = useApp();
  const t = translations[language];

  const job = jobs.find(j => j.id === id);
  const myApp = applications.find(a => a.job_id === id && a.seeker_id === currentSeeker?.id);

  // Local insights states
  const [matchPercentage, setMatchPercentage] = useState<number | null>(null);
  const [matchExplanation, setMatchExplanation] = useState('');
  const [predictedSalary, setPredictedSalary] = useState('');
  
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [applying, setApplying] = useState(false);

  const SALARY_GUIDE: Record<string, Record<string, string>> = {
    bangalore: {
      'delivery': '₹15,000 - ₹22,000 / month',
      'cashier': '₹12,000 - ₹18,000 / month',
      'bakery': '₹10,000 - ₹15,000 / month',
      'helper': '₹10,000 - ₹15,000 / month',
      'security': '₹12,000 - ₹16,000 / month',
      'retail': '₹12,000 - ₹18,000 / month',
      'default': '₹12,000 - ₹18,000 / month',
    },
    mysore: {
      'delivery': '₹12,000 - ₹18,000 / month',
      'cashier': '₹10,000 - ₹15,000 / month',
      'bakery': '₹9,000 - ₹13,000 / month',
      'helper': '₹9,000 - ₹13,000 / month',
      'security': '₹10,000 - SIGNAL_RANGE / month',
      'retail': '₹10,000 - ₹15,000 / month',
      'default': '₹10,000 - ₹15,000 / month',
    },
    hubli: {
      'delivery': '₹11,000 - ₹16,000 / month',
      'cashier': '₹9,000 - ₹14,000 / month',
      'bakery': '₹8,000 - ₹12,000 / month',
      'helper': '₹8,000 - ₹12,000 / month',
      'security': '₹9,000 - ₹13,000 / month',
      'retail': '₹9,000 - ₹14,000 / month',
      'default': '₹9,000 - ₹13,000 / month',
    },
    mangalore: {
      'delivery': '₹13,000 - ₹19,000 / month',
      'cashier': '₹11,000 - ₹16,000 / month',
      'bakery': '₹10,000 - ₹14,000 / month',
      'helper': '₹9,000 - ₹14,000 / month',
      'security': '₹11,000 - ₹15,000 / month',
      'retail': '₹11,000 - ₹16,000 / month',
      'default': '₹10,000 - ₹15,000 / month',
    },
    default: {
      'delivery': '₹12,000 - ₹17,000 / month',
      'cashier': '₹10,000 - ₹15,000 / month',
      'bakery': '₹9,000 - ₹13,000 / month',
      'helper': '₹9,000 - ₹13,000 / month',
      'security': '₹10,000 - ₹14,000 / month',
      'retail': '₹10,000 - ₹15,000 / month',
      'default': '₹10,000 - ₹15,000 / month',
    }
  };

  useEffect(() => {
    if (job) {
      loadLocalInsights();
    }
  }, [job, currentSeeker]);

  const loadLocalInsights = () => {
    if (!job) return;
    setLoadingInsights(true);

    // 1. Static Salary Guide Range Lookup
    const c = (job.city || '').toLowerCase().trim();
    const tTitle = (job.title || '').toLowerCase().trim();
    const cityMap = SALARY_GUIDE[c] || SALARY_GUIDE['default'];
    let salary = '';
    for (const [role, range] of Object.entries(cityMap)) {
      if (tTitle.includes(role)) {
        salary = range;
        break;
      }
    }
    if (!salary) salary = cityMap['default'];
    setPredictedSalary(`The average salary range for a "${job.title}" role in "${job.city}" is ${salary} based on local hiring norms.`);

    // 2. Deterministic match calculation
    if (currentSeeker) {
      // 1. Skill overlap (40%)
      const normSeekerSkills = (currentSeeker.skills || []).map(s => s.toLowerCase().trim()).filter(Boolean);
      const normJobSkills = (job.skills_required || []).map(s => s.toLowerCase().trim()).filter(Boolean);
      let skillScore = 0;
      let matchingSkills: string[] = [];
      if (normJobSkills.length > 0) {
        matchingSkills = normJobSkills.filter(s => normSeekerSkills.includes(s));
        skillScore = (matchingSkills.length / normJobSkills.length) * 40;
      } else {
        skillScore = 40;
      }

      // 2. City match (30%)
      const cityMatch = (currentSeeker.city || '').toLowerCase().trim() === (job.city || '').toLowerCase().trim();
      const locationScore = cityMatch ? 30 : 10;

      // 3. Experience Match (20%)
      const getYears = (str: string): number => {
        const m = str.match(/(\d+)/);
        return m ? parseInt(m[0], 10) : 0;
      };
      const seekerYears = getYears(currentSeeker.experience || '');
      const jobYears = getYears(job.experience_required || '');
      let expScore = seekerYears >= jobYears ? 20 : Math.max(0, 20 - (jobYears - seekerYears) * 5);

      // 4. Job Type match (10%)
      const jobTypeMatch = (currentSeeker.preferred_job_type || '').toLowerCase().trim() === (job.job_type || '').toLowerCase().trim();
      const jobTypeScore = jobTypeMatch ? 10 : 5;

      const score = Math.round(skillScore + locationScore + expScore + jobTypeScore);

      // Match reason explanation
      const reasons: string[] = [];
      if (matchingSkills.length > 0) {
        reasons.push(`You share ${matchingSkills.length} matching skills (${matchingSkills.join(', ')}).`);
      } else if (normJobSkills.length > 0) {
        reasons.push(`Consider updating your profile with skills like: ${job.skills_required.join(', ')}.`);
      }
      
      if (cityMatch) {
        reasons.push(`Both are located in ${job.city}.`);
      } else {
        reasons.push(`Job is in ${job.city} (different from your location: ${currentSeeker.city}).`);
      }

      if (seekerYears >= jobYears) {
        reasons.push(`Your experience (${currentSeeker.experience}) meets the requirement (${job.experience_required}).`);
      } else {
        reasons.push(`The job requires ${job.experience_required} but you listed ${currentSeeker.experience}.`);
      }

      if (jobTypeMatch) {
        reasons.push(`Preferred job type matches (${job.job_type}).`);
      }

      setMatchPercentage(score);
      setMatchExplanation(reasons.join(' '));
    }

    setLoadingInsights(false);
  };

  if (!job) {
    return (
      <div className="text-center py-12 space-y-4 text-slate-500">
        <AlertCircle className="w-12 h-12 mx-auto text-slate-400" />
        <p>Job not found.</p>
        <button onClick={() => navigate('/seeker/jobs')} className="text-indigo-600 font-bold hover:underline cursor-pointer">
          Go back to listings
        </button>
      </div>
    );
  }

  // Find business details to get their phone number
  const businessTable = db.getTable<any>('BUSINESSES');
  const businessDetails = businessTable.find(b => b.id === job.business_id);
  const employerPhone = businessDetails?.phone || '9123456789';

  // WhatsApp click-to-chat links
  const getWhatsAppLink = () => {
    const encodedMessage = encodeURIComponent(
      language === 'kn'
        ? `ನಮಸ್ಕಾರ, ಕೌಶಲ್ ಸೇತು ಮೂಲಕ ನಿಮ್ಮ "${job.title}" ಕೆಲಸದ ಜಾಹೀರಾತು ನೋಡಿದೆ. ನಾನು ಅರ್ಜಿ ಸಲ್ಲಿಸಲು ಆಸಕ್ತನಾಗಿದ್ದೇನೆ.`
        : `Hello, I found your job post on KaushalSetu for "${job.title}" and I am interested in applying.`
    );
    return `https://wa.me/91${employerPhone}?text=${encodedMessage}`;
  };

  const handleApply = async () => {
    if (!currentUser || !currentSeeker) {
      navigate('/login');
      return;
    }
    setApplying(true);
    await applyForJob(job.id);
    setApplying(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4 pb-24 md:pb-4 text-left relative">
      {/* Back button */}
      <AppButton
        onClick={() => navigate('/seeker/jobs')}
        variant="ghost"
        icon={<ArrowLeft className="w-4 h-4" />}
        className="px-3 h-10 text-slate-500 hover:text-indigo-600"
      >
        Back to Jobs
      </AppButton>

      {/* Main Details Panel */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Left main details */}
        <div className="md:col-span-2 space-y-6">
          <AppCard className="space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 px-2.5 py-1 rounded-lg font-bold">
                  {job.job_type}
                </span>
                <span className="text-xs bg-emerald-50 text-emerald-600 border border-emerald-100 px-2.5 py-1 rounded-lg font-bold">
                  {job.salary}
                </span>
              </div>

              <h2 className="text-2xl font-black text-slate-800 leading-tight">
                {job.title}
              </h2>

              <div className="flex items-center space-x-1.5 text-sm text-slate-500 font-bold">
                <span>{job.business_name}</span>
                {businessDetails?.is_verified && (
                  <span className="flex items-center text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    <span>{t.verified}</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400 font-medium pt-2 border-t border-slate-100">
                <span className="flex items-center"><MapPin className="w-4 h-4 mr-1 text-slate-400" /> {job.location}</span>
                <span className="flex items-center"><Clock className="w-4 h-4 mr-1 text-slate-400" /> {job.experience_required}</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800">Job Description</h3>
              <p className="text-xs md:text-sm text-slate-500 leading-relaxed">
                {job.description}
              </p>
            </div>

            {/* Skills required */}
            <div className="space-y-2">
              <h3 className="font-extrabold text-sm text-slate-800">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.skills_required.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-xl transition-colors font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </AppCard>

          {/* Compatibility Insights Panel */}
          <AppCard className="space-y-5 border-indigo-100 bg-gradient-to-r from-indigo-50/20 to-cyan-500/5">
            <div className="border-b border-slate-100 pb-3 text-left">
              <h3 className="font-extrabold text-[16px] text-slate-800 tracking-tight flex items-center space-x-2">
                <ShieldCheck className="w-4.5 h-4.5 text-indigo-600" />
                <span>Profile Compatibility & Local Salary Guide</span>
              </h3>
            </div>

            {loadingInsights ? (
              <div className="space-y-3 py-2">
                <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse w-5/6"></div>
                <div className="h-4 bg-slate-200 rounded animate-pulse w-2/3"></div>
              </div>
            ) : (
              <div className="space-y-4 text-xs md:text-sm">
                {/* Match score section */}
                {currentSeeker && matchPercentage !== null && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-slate-600">Profile Match Score</span>
                      <span className="text-indigo-600 font-extrabold">{matchPercentage}% Match</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-normal bg-white p-3 rounded-xl border border-slate-100">
                      💡 {matchExplanation}
                    </p>
                  </div>
                )}

                {/* Salary Predictions section */}
                {predictedSalary && (
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-600 flex items-center">
                      <DollarSign className="w-4 h-4 mr-1 text-slate-400" />
                      <span>Local Salary Guide</span>
                    </h4>
                    <p className="text-xs text-slate-500 leading-normal bg-white p-3 rounded-xl border border-slate-100">
                      📊 {predictedSalary}
                    </p>
                  </div>
                )}
              </div>
            )}
          </AppCard>
        </div>

        {/* Right Application Sidebar - Hidden on mobile, sticky action panel will handle it */}
        <div className="space-y-6 hidden md:block">
          <AppCard className="space-y-4">
            <div className="border-b border-slate-100 pb-3 text-left">
              <h3 className="font-extrabold text-[16px] text-slate-800 tracking-tight">
                Action Panel
              </h3>
            </div>
            
            {myApp ? (
              <div className="space-y-3.5">
                <div className="flex items-center space-x-2 text-emerald-600 bg-emerald-50 p-3.5 rounded-xl border border-emerald-100 justify-center">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-xs font-black">Applied ({myApp.status})</span>
                </div>
                <p className="text-[10px] text-slate-400 text-center leading-normal">
                  You submitted your application on {new Date(myApp.applied_at).toLocaleDateString()}. Check dashboard for response updates.
                </p>
              </div>
            ) : (
              <AppButton
                onClick={handleApply}
                disabled={applying}
                fullWidth
                variant="primary"
                icon={<Briefcase className="w-4 h-4" />}
              >
                {applying ? 'Applying...' : t.applyNow}
              </AppButton>
            )}

            {/* Direct WhatsApp chat */}
            <AppButton
              onClick={() => window.open(getWhatsAppLink(), '_blank')}
              fullWidth
              variant="secondary"
              className="!border-emerald-200 !text-emerald-600 hover:!border-emerald-300 hover:bg-emerald-50/10"
              icon={<MessageSquare className="w-4 h-4 text-emerald-500 fill-emerald-5" />}
            >
              {t.whatsappContact}
            </AppButton>

            <div className="text-[10px] text-slate-400 text-center leading-normal pt-2 border-t border-slate-100">
              📞 Contacting employers on WhatsApp directly is 100% free. Ensure your profile is updated!
            </div>
          </AppCard>
        </div>
      </div>

      {/* Sticky Bottom Bar for Mobile Viewports */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.06)] z-40 md:hidden flex gap-3">
        {myApp ? (
          <div className="flex-1 flex items-center space-x-2 text-emerald-600 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-100 justify-center">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-xs font-bold">Applied ({myApp.status})</span>
          </div>
        ) : (
          <AppButton
            onClick={handleApply}
            disabled={applying}
            className="flex-1 !h-12 text-sm"
            variant="primary"
            icon={<Briefcase className="w-4 h-4" />}
          >
            {applying ? 'Applying...' : t.applyNow}
          </AppButton>
        )}
        <AppButton
          onClick={() => window.open(getWhatsAppLink(), '_blank')}
          className="flex-1 !h-12 text-sm !border-emerald-200 !text-emerald-600 hover:bg-emerald-50"
          variant="secondary"
          icon={<MessageSquare className="w-4 h-4 text-emerald-500" />}
        >
          {t.whatsappContact}
        </AppButton>
      </div>
    </div>
  );
};

export default JobDetails;
