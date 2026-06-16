import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import AppCard from '../../components/ui/AppCard';
import AppButton from '../../components/ui/AppButton';
import AppInput from '../../components/ui/AppInput';
import AppSelect from '../../components/ui/AppSelect';
import { 
  Search, MapPin, DollarSign, Clock, Compass, 
  ShieldCheck, CheckCircle2, SlidersHorizontal, ArrowRight 
} from 'lucide-react';

export const JobListings: React.FC = () => {
  const { language, jobs, currentSeeker } = useApp();
  const navigate = useNavigate();
  const t = translations[language];

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [minSalary, setMinSalary] = useState(0);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Apply filters & calculate match score
  const filteredJobs = jobs
    .filter(job => job.status === 'active')
    .map(job => {
      let score = 0;
      if (currentSeeker) {
        // 1. Skill overlap (40%)
        const normSeekerSkills = (currentSeeker.skills || []).map(s => s.toLowerCase().trim()).filter(Boolean);
        const normJobSkills = (job.skills_required || []).map(s => s.toLowerCase().trim()).filter(Boolean);
        let skillScore = 0;
        if (normJobSkills.length > 0) {
          const overlapCount = normJobSkills.filter(s => normSeekerSkills.includes(s)).length;
          skillScore = (overlapCount / normJobSkills.length) * 40;
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

        score = Math.round(skillScore + locationScore + expScore + jobTypeScore);
      }
      return { ...job, matchScore: score };
    })
    .filter(job => {
      // Query filter
      const matchesQuery = 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills_required.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase());
      
      // City filter
      const matchesCity = selectedCity ? job.city === selectedCity : true;

      // Job Type filter
      const matchesType = selectedType === 'All' ? true : job.job_type === selectedType;

      // Salary filter (clean salary string like ₹14,000/month or numbers)
      const numSal = Number(job.salary.replace(/\D/g, ''));
      const matchesSalary = minSalary ? numSal >= minSalary : true;

      return matchesQuery && matchesCity && matchesType && matchesSalary;
    })
    // Sort by match score (highest first)
    .sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner */}
      <div className="text-left space-y-2">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {language === 'kn' ? 'ಸ್ಥಳೀಯ ಉದ್ಯೋಗಗಳು' : 'Find Local Jobs'}
        </h2>
        <p className="text-xs text-slate-500">
          {language === 'kn' ? 'ನಿಮ್ಮ ಹತ್ತಿರವಿರುವ ಕಿರಾಣಿ ಅಂಗಡಿಗಳು, ಬೇಕರಿಗಳು ಮತ್ತು ವ್ಯಾಪಾರ ಸಂಸ್ಥೆಗಳ ಉದ್ಯೋಗಗಳು' : 'Browse active helper, cashier, and staff vacancies in your neighborhood'}
        </p>
      </div>

      {/* Search Bar & Filter Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <AppInput
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <AppButton
          onClick={() => setShowFiltersMobile(!showFiltersMobile)}
          variant="secondary"
          className="sm:hidden flex items-center justify-center space-x-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
        </AppButton>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 items-start">
        {/* Filters Panel (Desktop Sidebar / Mobile collapse) */}
        <div className={`lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-6 text-left ${
          showFiltersMobile ? 'block' : 'hidden lg:block'
        }`}>
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5">
            <h3 className="font-extrabold text-sm text-slate-800 flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-500" />
              <span>Filters</span>
            </h3>
            <button
              onClick={() => {
                setSelectedCity('');
                setSelectedType('All');
                setMinSalary(0);
                setSearchQuery('');
              }}
              className="text-[10px] text-indigo-600 font-extrabold hover:underline cursor-pointer"
            >
              Reset All
            </button>
          </div>

          {/* City Filter */}
          <div className="space-y-2">
            <AppSelect
              label="City"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="">All Cities</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Mysore">Mysore</option>
              <option value="Hubli">Hubli</option>
              <option value="Mangalore">Mangalore</option>
            </AppSelect>
          </div>

          {/* Job Type Filter */}
          <div className="space-y-2">
            <span className="text-[14px] font-semibold text-[#475569] mb-[8px] block select-none">{t.filterJobType}</span>
            <div className="flex flex-col space-y-1.5">
              {['All', 'Full-time', 'Part-time', 'Gig work', 'Internship'].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedType === type 
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                  }`}
                >
                  {type === 'All' ? t.allTypes : type}
                </button>
              ))}
            </div>
          </div>

          {/* Min Salary Filter */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>{t.filterSalary}</span>
              <span className="text-indigo-600">₹{minSalary.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="25000"
              step="1000"
              value={minSalary}
              onChange={(e) => setMinSalary(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[9px] text-slate-400 font-bold">
              <span>₹0</span>
              <span>₹25,000+</span>
            </div>
          </div>
        </div>

        {/* Listings List */}
        <div className="lg:col-span-3 space-y-4">
          {filteredJobs.length === 0 ? (
            <div className="bg-white p-12 text-center text-xs text-slate-400 rounded-2xl border border-slate-100">
              {t.noJobsFound}
            </div>
          ) : (
            filteredJobs.map((job) => (
              <AppCard 
                key={job.id} 
                onClick={() => navigate(`/seeker/jobs/${job.id}`)}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="space-y-2.5 text-left">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-0.5 rounded-md font-bold">
                      {job.job_type}
                    </span>
                    <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-md font-bold">
                      {job.salary}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-slate-800 flex items-center">
                    {job.title}
                  </h3>

                  <div className="flex items-center space-x-1 text-xs text-slate-400 font-bold">
                    <span>{job.business_name}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 fill-indigo-50" />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-slate-400 font-medium">
                    <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {job.location}</span>
                    <span className="flex items-center"><Clock className="w-3.5 h-3.5 mr-1 text-slate-400" /> {job.experience_required}</span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 flex-shrink-0 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
                  {currentSeeker && (
                    <div className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100/50">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="text-xs font-black text-indigo-600">{job.matchScore}% Match</span>
                    </div>
                  )}
                  <button className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center space-x-1 cursor-pointer">
                    <span>{t.viewDetails}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </AppCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default JobListings;
