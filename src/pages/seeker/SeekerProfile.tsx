import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import AppCard from '../../components/ui/AppCard';
import AppButton from '../../components/ui/AppButton';
import AppInput from '../../components/ui/AppInput';
import AppSelect from '../../components/ui/AppSelect';
import AppTextarea from '../../components/ui/AppTextarea';
import FormSection from '../../components/ui/FormSection';
import { User, MapPin, Award, BookOpen, Clock, FileText, Check } from 'lucide-react';

export const SeekerProfile: React.FC = () => {
  const { language, currentUser, currentSeeker, updateSeeker } = useApp();
  const t = translations[language];

  if (!currentUser || !currentSeeker) {
    return <div className="text-center py-12">Loading...</div>;
  }

  // Local form states initialized from currentSeeker
  const [city, setCity] = useState(currentSeeker.city || '');
  const [area, setArea] = useState(currentSeeker.area || '');
  const [skills, setSkills] = useState(currentSeeker.skills?.join(', ') || '');
  const [experience, setExperience] = useState(currentSeeker.experience || 'Freshers');
  const [languages, setLanguages] = useState(currentSeeker.languages?.join(', ') || '');
  const [preferredJobType, setPreferredJobType] = useState(currentSeeker.preferred_job_type || 'Full-time');
  const [profileSummary, setProfileSummary] = useState(currentSeeker.profile_summary || '');
  
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
    const langsArray = languages.split(',').map(l => l.trim()).filter(Boolean);

    updateSeeker({
      city,
      area,
      skills: skillsArray,
      experience,
      languages: langsArray,
      preferred_job_type: preferredJobType,
      profile_summary: profileSummary,
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-4 text-left">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {language === 'kn' ? 'ನಿಮ್ಮ ಉದ್ಯೋಗ ಪ್ರೊಫೈಲ್' : 'Your Job Seeker Profile'}
        </h2>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center space-x-2">
          <Check className="w-4 h-4" />
          <span>{t.profileSaved}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <AppCard className="space-y-6">
          <FormSection title={language === 'kn' ? 'ವೈಯಕ್ತಿಕ ವಿವರಗಳು' : 'Personal & Location Details'}>
            <AppInput
              type="text"
              label={t.fullName}
              value={currentUser.name}
              className="bg-slate-100 text-slate-500 cursor-not-allowed"
              disabled
            />

            <AppInput
              type="text"
              label={t.phoneNumber}
              value={currentUser.phone}
              className="bg-slate-100 text-slate-500 cursor-not-allowed"
              disabled
            />

            <AppSelect
              label={t.city}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            >
              <option value="">Select City</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Mysore">Mysore</option>
              <option value="Hubli">Hubli</option>
              <option value="Mangalore">Mangalore</option>
              <option value="Belgaum">Belgaum</option>
            </AppSelect>

            <AppInput
              type="text"
              label={t.area}
              placeholder="Hebbal / Kuvempunagar"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              icon={<MapPin className="w-4 h-4" />}
              required
            />
          </FormSection>
        </AppCard>

        <AppCard className="space-y-6">
          <FormSection title={language === 'kn' ? 'ವೃತ್ತಿಪರ ಕೌಶಲ್ಯಗಳು' : 'Skills & Work Experience'}>
            <div className="md:col-span-2 space-y-1.5">
              <AppInput
                type="text"
                label={t.skills}
                placeholder="Store Helper, Billing, Packaging, Cleaning"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                icon={<Award className="w-4 h-4" />}
              />
              <p className="text-[10px] text-slate-400 leading-normal">
                ℹ️ Separating skills by comma allows our profile matching system to match you with matching job listings accurately.
              </p>
            </div>

            <AppSelect
              label={t.experience}
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              <option value="Freshers">Freshers / No Experience</option>
              <option value="0 - 1 Year">0 - 1 Year</option>
              <option value="1 Year">1 Year</option>
              <option value="2 Years">2 Years</option>
              <option value="3+ Years">3+ Years</option>
            </AppSelect>

            <AppSelect
              label={t.preferredJobType}
              value={preferredJobType}
              onChange={(e) => setPreferredJobType(e.target.value as any)}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Gig work">Gig work / Contract</option>
              <option value="Internship">Internship</option>
            </AppSelect>

            <AppInput
              type="text"
              label={t.languagesKnown}
              placeholder="Kannada, English, Hindi"
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              icon={<BookOpen className="w-4 h-4" />}
              containerClassName="md:col-span-2"
            />
          </FormSection>
        </AppCard>

        {/* Profile Summary */}
        <AppCard className="space-y-6">
          <div className="border-b border-slate-100 pb-3 text-left">
            <h3 className="font-extrabold text-[16px] text-slate-800 tracking-tight">
              {t.profileSummary}
            </h3>
          </div>

          <div className="space-y-2">
            <AppTextarea
              rows={4}
              placeholder="A short description summarizing your work attitude, key skills, and reliability."
              value={profileSummary}
              onChange={(e) => setProfileSummary(e.target.value)}
              className="resize-none"
            />
            <p className="text-[10px] text-slate-400">
              * The summary is displayed at the top of your resume and visible to businesses when you apply for jobs.
            </p>
          </div>
        </AppCard>

        {/* Save button */}
        <AppButton type="submit" fullWidth variant="primary">
          {t.saveProfile}
        </AppButton>
      </form>
    </div>
  );
};

export default SeekerProfile;
