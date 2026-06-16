import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import GlassCard from '../../components/GlassCard';
import { Award, Compass, BookOpen, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

// Static local career learning maps (replaces skill analysis)
const CAREER_GUIDE_DATA: Record<string, {
  missingSkills: string[];
  roadmap: string[];
  suggestions: { skill: string; resource: string }[];
}> = {
  'Bakery Counter Staff': {
    missingSkills: ['Billing Systems', 'Food Packaging', 'Food Safety Standards', 'Customer Relations'],
    roadmap: [
      'Learn standard billing and inventory methods used in local bakery counters.',
      'Understand proper hygiene protocols and safe food handling/storage practices.',
      'Practice handling busy customer lines and friendly local language communication.'
    ],
    suggestions: [
      { skill: 'Billing & POS software', resource: 'Free online tutorial: Retail Billing Software basics' },
      { skill: 'Food safety & hygiene basics', resource: 'FSSAI online documentation for local food businesses' }
    ]
  },
  'Delivery Rider': {
    missingSkills: ['Navigation App Usage', 'Safe Driving Practices', 'Time Management', 'Digital Payments Handling'],
    roadmap: [
      'Master Google Maps and local offline shortcuts in Tier-2/Tier-3 towns.',
      'Practice handling customer communication for location guidance and payment confirmations.',
      'Review digital payment app transactions (UPI, QR Codes, Cash on Delivery bookkeeping).'
    ],
    suggestions: [
      { skill: 'GPS and local routing optimization', resource: 'Online Rider Training basics by Logistics Portal' },
      { skill: 'UPI & cash collection handling', resource: 'Digital Banking Safety guidelines' }
    ]
  },
  'Cashier / Accountant': {
    missingSkills: ['MS Excel / Spreadsheet Basics', 'Tally Prime / Local Billing ERP', 'Cash Register Management', 'Basic Taxation'],
    roadmap: [
      'Learn basic calculations, bookkeeping entries, and data formatting in spreadsheet software.',
      'Practice operating local accounting apps (Tally ERP, Vyapar, Khatabook).',
      'Understand digital reconciliation protocols for credit/debit card machines and UPI.'
    ],
    suggestions: [
      { skill: 'MS Excel for Shop Managers', resource: 'Free Course: Google Sheets / Excel for Beginners (Swayam / YouTube)' },
      { skill: 'Tally & Khatabook operations', resource: 'Vyapar app learning center & YouTube playlist tutorials' }
    ]
  },
  'Retail Store Manager': {
    missingSkills: ['Staff Scheduling & Leadership', 'Inventory Control Systems', 'Vendor Management', 'Monthly Sales Reporting'],
    roadmap: [
      'Study retail store layout organization and stock replenishment models.',
      'Learn to manage shifts, roster schedules, and resolve simple worker disputes.',
      'Analyze customer buying behaviors and organize weekly store sales dashboards.'
    ],
    suggestions: [
      { skill: 'Retail Store Inventory management', resource: 'Government Skill India portal course: Retail Team Leader' },
      { skill: 'Vendor communications & management', resource: 'SBA online resources: Small Retail Operations guide' }
    ]
  },
  'Sales Assistant': {
    missingSkills: ['Product Demonstration', 'Active Listening & Empathy', 'Up-selling / Cross-selling techniques', 'Inventory Tagging'],
    roadmap: [
      'Develop product knowledge catalogs for electronics, apparel, or grocery categories.',
      'Practice handling common customer objections and standard pricing calculations.',
      'Master store stock replenishment and checking visual merchandising displays.'
    ],
    suggestions: [
      { skill: 'Sales & Customer Interaction', resource: 'Skill India free courses: Retail Sales Associate' },
      { skill: 'Visual Merchandising techniques', resource: 'Retail Management YouTube channels and guidebooks' }
    ]
  }
};

export const SkillGapSuggestions: React.FC = () => {
  const { language, currentSeeker } = useApp();
  const t = translations[language];

  if (!currentSeeker) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const [targetRole, setTargetRole] = useState('Bakery Counter Staff');
  const [loading, setLoading] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<typeof CAREER_GUIDE_DATA[string] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleAnalyze = () => {
    setLoading(true);
    // Simulate short local loading for premium experience feel
    setTimeout(() => {
      setSelectedGuide(CAREER_GUIDE_DATA[targetRole] || CAREER_GUIDE_DATA['Bakery Counter Staff']);
      setHasSearched(true);
      setLoading(false);
    }, 450);
  };

  const targetRoles = [
    'Bakery Counter Staff',
    'Delivery Rider',
    'Cashier / Accountant',
    'Retail Store Manager',
    'Sales Assistant'
  ];

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-4 text-left">
      <div className="text-left">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {t.skillGapTitle}
        </h2>
        <p className="text-xs text-slate-500">
          {t.skillGapDesc}
        </p>
      </div>

      <GlassCard className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-500">{t.targetRole}</label>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="glass-input flex-1"
            >
              {targetRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-indigo-600/10 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>{loading ? 'Loading...' : t.analyzeGaps}</span>
            </button>
          </div>
        </div>
      </GlassCard>

      {loading && (
        <div className="space-y-4">
          <div className="h-24 bg-white border border-slate-100 rounded-2xl animate-pulse"></div>
          <div className="h-32 bg-white border border-slate-100 rounded-2xl animate-pulse"></div>
        </div>
      )}

      {hasSearched && !loading && selectedGuide && (
        <div className="space-y-6">
          {/* Skills Required */}
          <GlassCard className="space-y-3.5">
            <h3 className="font-extrabold text-sm text-slate-800 flex items-center space-x-2">
              <AlertCircle className="w-4.5 h-4.5 text-indigo-500" />
              <span>Expected Core Skills for {targetRole}</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {selectedGuide.missingSkills.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="text-xs bg-indigo-50 border border-indigo-100 text-indigo-600 px-3 py-1 rounded-lg font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-slate-400">
              * Add these to your Profile Skills in the Profile tab to improve your match chances with matching job listings!
            </p>
          </GlassCard>

          {/* Learning path */}
          <GlassCard className="space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800 flex items-center space-x-2">
              <Compass className="w-4.5 h-4.5 text-indigo-500" />
              <span>{t.learningPath}</span>
            </h3>

            <div className="relative border-l border-slate-200 pl-5 ml-2.5 space-y-5">
              {selectedGuide.roadmap.map((step, idx) => (
                <div key={idx} className="relative">
                  <span className="absolute -left-7.5 top-0.5 w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold">
                    {idx + 1}
                  </span>
                  <p className="text-xs md:text-sm font-semibold text-slate-700 leading-relaxed">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Resources */}
          <GlassCard className="space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800 flex items-center space-x-2">
              <BookOpen className="w-4.5 h-4.5 text-cyan-500" />
              <span>Free Recommended Resources</span>
            </h3>
            <div className="space-y-3">
              {selectedGuide.suggestions.map((sug, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start space-x-3 text-xs">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 mt-0.5" />
                  <div>
                    <strong className="text-slate-800 block">{sug.skill}</strong>
                    <span className="text-slate-400">{sug.resource}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default SkillGapSuggestions;
