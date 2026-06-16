import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import AppCard from '../../components/ui/AppCard';
import AppButton from '../../components/ui/AppButton';
import AppInput from '../../components/ui/AppInput';
import AppSelect from '../../components/ui/AppSelect';
import AppTextarea from '../../components/ui/AppTextarea';
import FormSection from '../../components/ui/FormSection';
import { Briefcase, MapPin, DollarSign, Clock, FileText, Check, FileInput } from 'lucide-react';

const JOB_TEMPLATES: Record<string, {
  title: string;
  skills: string;
  description: string;
  responsibilities: string;
  requirements: string;
}> = {
  'Delivery Rider': {
    title: 'Delivery Rider',
    skills: 'Driving, Map Navigation, Communication, Cash Handling',
    description: 'We are looking for a reliable Delivery Rider to deliver food, packages, and groceries to customers in our locality safely and on time.',
    responsibilities: 'Deliver orders to customer addresses using navigation apps.\nHandle cash and digital payments at delivery points.\nEnsure safe package handling during transit.',
    requirements: 'Must own a valid two-wheeler and driving license.\nBasic smartphone literacy and app navigation skills.\nGood communication skills in local languages.'
  },
  'Bakery Counter Staff': {
    title: 'Bakery counter staff / Assistant',
    skills: 'Customer Service, Packaging, Cash Billing, Cleanliness',
    description: 'Seeking a friendly and active Bakery Counter Staff / Assistant to welcome walk-in customers, handle orders, package bakery goods, and maintain billing counters.',
    responsibilities: 'Manage counter sales and assist customers in selecting products.\nPack baked goods, sweets, and bread packets neatly.\nClean the counter surfaces and store racks regularly.',
    requirements: 'Basic arithmetic for counter billing.\nFriendly attitude and clean personal grooming.\nMust be polite and customer-friendly.'
  },
  'Cashier / Store Billing Clerk': {
    title: 'Cashier / Store Billing Clerk',
    skills: 'Billing, Arithmetic, Digital Payments, Excel',
    description: 'We are hiring a Billing Clerk / Cashier to manage the cash register, process UPI/card transactions, issue receipts, and tally end-of-day sales.',
    responsibilities: 'Scan product tags and compute invoice totals.\nReceive digital payments via GPay/PhonePe and cards.\nKeep records of daily sales and cash drawer entries.',
    requirements: 'Prior experience of billing counters is preferred.\nHigh accuracy with calculations.\nFamiliarity with digital payment terminals.'
  },
  'Retail Sales Helper': {
    title: 'Retail Store Sales Assistant / Helper',
    skills: 'Customer Interaction, Stock Management, Arranging, Punctuality',
    description: 'Join our retail outlet as a Sales Assistant. You will help stock clothing/groceries, show items to customers, and assist in keeping the store clean.',
    responsibilities: 'Assist store customers in finding correct products.\nArrange inventory stock on display shelves neatly.\nSupport inventory unloading and package sorting.',
    requirements: 'Reliable and punctual work attitude.\nPolite tone and communication.\nAbility to stand for shift durations.'
  }
};

export const PostJob: React.FC = () => {
  const { language, currentBusiness, createJob } = useApp();
  const navigate = useNavigate();
  const t = translations[language];

  if (!currentBusiness) {
    return <div className="text-center py-12">Loading...</div>;
  }

  // Form states
  const [title, setTitle] = useState('');
  const [salary, setSalary] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState(currentBusiness.city || '');
  const [skillsRequired, setSkillsRequired] = useState('');
  const [experienceRequired, setExperienceRequired] = useState('Freshers welcome');
  const [jobType, setJobType] = useState<'Full-time' | 'Part-time' | 'Gig work' | 'Internship'>('Full-time');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requirements, setRequirements] = useState('');

  const [selectedTemplateKey, setSelectedTemplateKey] = useState('Delivery Rider');
  const [publishing, setPublishing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLoadTemplate = () => {
    const tmpl = JOB_TEMPLATES[selectedTemplateKey];
    if (tmpl) {
      setTitle(tmpl.title);
      setSkillsRequired(tmpl.skills);
      setDescription(tmpl.description);
      setResponsibilities(tmpl.responsibilities);
      setRequirements(tmpl.requirements);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);

    const skillsArray = skillsRequired.split(',').map(s => s.trim()).filter(Boolean);

    await createJob({
      title,
      salary: `₹${Number(salary).toLocaleString()}/month`,
      location: location || `${currentBusiness.address}, ${city}`,
      city,
      skills_required: skillsArray,
      experience_required: experienceRequired,
      job_type: jobType,
      description: `${description}\n\nResponsibilities:\n${responsibilities}\n\nRequirements:\n${requirements}`,
    });

    setPublishing(false);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      navigate('/business/jobs');
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-4 text-left">
      <div className="text-left font-sans">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {t.postAJob}
        </h2>
        <p className="text-xs text-slate-500">
          List a job vacancy for workers in your city. Use standard role templates to quickly fill out description content.
        </p>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center space-x-2">
          <Check className="w-4 h-4" />
          <span>{t.jobPostedSuccess} Redirecting...</span>
        </div>
      )}

      {/* Template Loader Card */}
      <AppCard className="space-y-4">
        <div className="border-b border-slate-100 pb-3 text-left">
          <h3 className="font-extrabold text-[16px] text-slate-800 tracking-tight flex items-center space-x-2">
            <FileInput className="w-4.5 h-4.5 text-indigo-500" />
            <span>Quick Template Loader</span>
          </h3>
          <p className="text-[12px] text-slate-400 mt-1">
            Select a common business job role to load premade structures for titles, skills, and responsibility summaries.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <AppSelect
            value={selectedTemplateKey}
            onChange={(e) => setSelectedTemplateKey(e.target.value)}
            containerClassName="flex-1"
          >
            {Object.keys(JOB_TEMPLATES).map(key => (
              <option key={key} value={key}>{key}</option>
            ))}
          </AppSelect>
          <AppButton
            type="button"
            onClick={handleLoadTemplate}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            Load Template
          </AppButton>
        </div>
      </AppCard>

      <form onSubmit={handleSubmit} className="space-y-6">
        <AppCard className="space-y-6">
          <FormSection title="Job Specifications">
            <AppInput
              type="text"
              label="Job Title"
              placeholder="E.g., Bakery Counter Assistant"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              icon={<Briefcase className="w-4 h-4" />}
              required
            />

            <AppSelect
              label="Job Type"
              value={jobType}
              onChange={(e) => setJobType(e.target.value as any)}
              required
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Gig work">Gig work</option>
              <option value="Internship">Internship</option>
            </AppSelect>

            <AppInput
              type="text"
              label="Monthly Salary (INR ₹)"
              placeholder="14000"
              value={salary}
              onChange={(e) => setSalary(e.target.value.replace(/\D/g, ''))}
              prefixText="₹"
              required
            />

            <AppInput
              type="text"
              label="Required Experience"
              placeholder="E.g., Freshers welcome / 1 Year"
              value={experienceRequired}
              onChange={(e) => setExperienceRequired(e.target.value)}
              required
            />

            <AppSelect
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            >
              <option value="">Select City</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Mysore">Mysore</option>
              <option value="Hubli">Hubli</option>
              <option value="Mangalore">Mangalore</option>
            </AppSelect>

            <AppInput
              type="text"
              label="Locality Address"
              placeholder="E.g., Kuvempunagar, Mysore"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              icon={<MapPin className="w-4 h-4" />}
              required
            />

            <AppInput
              type="text"
              label="Skills Needed (comma separated)"
              placeholder="Billing, Customer Service, Packaging"
              value={skillsRequired}
              onChange={(e) => setSkillsRequired(e.target.value)}
              required
              containerClassName="md:col-span-2"
            />
          </FormSection>
        </AppCard>

        <AppCard className="space-y-6">
          <div className="border-b border-slate-100 pb-3 text-left">
            <h3 className="font-extrabold text-[16px] text-slate-800 tracking-tight">
              Job Description & Content
            </h3>
          </div>

          <div className="space-y-4">
            <AppTextarea
              rows={3}
              label="Job Description Summary"
              placeholder="Briefly summarize the role..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <AppTextarea
              rows={3}
              label="Responsibilities (One per line)"
              placeholder="E.g., Welcome shop customers, Pack sweet items, Handle cash checkout billing..."
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              required
            />

            <AppTextarea
              rows={3}
              label="Requirements (One per line)"
              placeholder="E.g., Fluent in Kannada, Basic cash register billing arithmetic..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              required
            />
          </div>
        </AppCard>

        <AppButton type="submit" fullWidth variant="primary" loading={publishing}>
          {publishing ? 'Publishing Job Listing...' : 'Publish Job Listing'}
        </AppButton>
      </form>
    </div>
  );
};

export default PostJob;
