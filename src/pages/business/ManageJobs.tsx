import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import GlassCard from '../../components/GlassCard';
import { db } from '../../services/supabase';
import { Briefcase, MapPin, DollarSign, ToggleLeft, ToggleRight, Trash, PlusCircle } from 'lucide-react';

export const ManageJobs: React.FC = () => {
  const { language, currentBusiness, jobs } = useApp();
  const navigate = useNavigate();
  const t = translations[language];

  if (!currentBusiness) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const myJobs = jobs.filter(j => j.business_id === currentBusiness.id);

  const toggleJobStatus = (jobId: string, currentStatus: 'active' | 'closed' | 'draft') => {
    const list = db.getJobs();
    const index = list.findIndex(j => j.id === jobId);
    if (index > -1) {
      list[index].status = currentStatus === 'active' ? 'closed' : 'active';
      db.saveTable('JOBS', list);
      window.location.reload(); // Refresh to trigger state pull
    }
  };

  const deleteJob = (jobId: string) => {
    const list = db.getJobs();
    const index = list.findIndex(j => j.id === jobId);
    if (index > -1) {
      list.splice(index, 1);
      db.saveTable('JOBS', list);
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 text-left max-w-4xl mx-auto py-4">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {t.manageJobs}
          </h2>
          <p className="text-xs text-slate-500">
            Open, close, or delete job vacancies you posted for local candidates.
          </p>
        </div>
        <button
          onClick={() => navigate('/business/post')}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-extrabold text-xs shadow-md shadow-indigo-600/10 flex items-center space-x-1.5 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Job</span>
        </button>
      </div>

      {myJobs.length === 0 ? (
        <GlassCard className="text-center py-12">
          <p className="text-sm text-slate-400">You haven't posted any jobs yet.</p>
        </GlassCard>
      ) : (
        <div className="space-y-4">
          {myJobs.map((job) => (
            <GlassCard key={job.id} className="flex justify-between items-center flex-wrap sm:flex-nowrap gap-4 text-left">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-base text-slate-800">{job.title}</h3>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                    job.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {job.status === 'active' ? 'Active' : 'Closed'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 text-xs text-slate-400 font-bold">
                  <span>Salary: {job.salary}</span>
                  <span>•</span>
                  <span>Type: {job.job_type}</span>
                </div>

                <div className="flex items-center text-[10px] text-slate-400 font-medium">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  <span>{job.location}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0">
                {/* Toggle Status */}
                <button
                  onClick={() => toggleJobStatus(job.id, job.status)}
                  className="p-2 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  title={job.status === 'active' ? 'Close Job' : 'Open Job'}
                >
                  {job.status === 'active' ? (
                    <ToggleRight className="w-8 h-8 text-indigo-600" />
                  ) : (
                    <ToggleLeft className="w-8 h-8 text-slate-300" />
                  )}
                </button>

                {/* Delete */}
                <button
                  onClick={() => deleteJob(job.id)}
                  className="p-2 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Delete Job"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageJobs;
