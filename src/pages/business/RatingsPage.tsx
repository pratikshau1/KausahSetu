import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import AppCard from '../../components/ui/AppCard';
import AppButton from '../../components/ui/AppButton';
import AppSelect from '../../components/ui/AppSelect';
import AppTextarea from '../../components/ui/AppTextarea';
import { Star, Check, AlertCircle, MessageSquare } from 'lucide-react';

export const BusinessRatingsPage: React.FC = () => {
  const { language, currentUser, currentBusiness, jobs, applications, ratings, addRating } = useApp();
  const navigate = useNavigate();
  const t = translations[language];

  if (!currentUser || !currentBusiness) {
    return <div className="text-center py-12 text-slate-500 font-medium">Loading...</div>;
  }

  // Candidates who applied to this business
  const bizApps = applications.filter(app => app.business_name === currentBusiness.business_name);
  const uniqueSeekers = Array.from(new Set(bizApps.map(app => app.seeker_name)));

  // Form states
  const [targetSeekerName, setTargetSeekerName] = useState(uniqueSeekers[0] || '');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const myReviews = ratings.filter(r => r.to_user_id === currentUser.id && r.rating_type === 'seeker_to_employer');
  const avgRating = myReviews.length > 0 
    ? (myReviews.reduce((acc, r) => acc + r.rating, 0) / myReviews.length).toFixed(1) 
    : '0.0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetSeekerName) {
      setErrorMsg('Please select a candidate to rate.');
      return;
    }
    if (!review.trim()) {
      setErrorMsg('Please write a short review.');
      return;
    }

    const matchedApp = bizApps.find(app => app.seeker_name === targetSeekerName);
    if (!matchedApp) {
      setErrorMsg('Could not find candidate record.');
      return;
    }

    // Rate the worker
    addRating(matchedApp.seeker_id, rating, review, 'employer_to_seeker');
    
    setSuccess(true);
    setReview('');
    setRating(5);
    setErrorMsg('');
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-4 text-left">
      <div className="text-left">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {language === 'kn' ? 'ರೇಟಿಂಗ್ಸ್ ಮತ್ತು ವಿಮರ್ಶೆಗಳು' : 'Ratings & Reviews'}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'kn'
            ? 'ಉದ್ಯೋಗಿಗಳಿಗೆ ರೇಟಿಂಗ್ ನೀಡಿ ಮತ್ತು ನಿಮ್ಮ ಸಂಸ್ಥೆಯ ರೇಟಿಂಗ್‌ಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.'
            : 'Rate candidates who applied to your job posts and track feedback received from job seekers.'}
        </p>
      </div>

      {success && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center space-x-2">
          <Check className="w-4 h-4" />
          <span>Candidate feedback submitted successfully!</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center space-x-2">
          <AlertCircle className="w-4.5 h-4.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 items-start">
        {/* Left Side: Submit Review Form */}
        <div className="md:col-span-2 space-y-6">
          {uniqueSeekers.length === 0 ? (
            <AppCard className="text-center py-12" variant="solid">
              <p className="text-xs text-slate-400">
                You can rate candidates after they apply to one of your job vacancies.
              </p>
            </AppCard>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <AppCard className="space-y-5" variant="solid">
                <h3 className="font-extrabold text-[16px] text-slate-800 tracking-tight border-b border-slate-100 pb-2">
                  {language === 'kn' ? 'ಉದ್ಯೋಗಿಗೆ ರೇಟಿಂಗ್ ನೀಡಿ' : 'Submit Candidate Review'}
                </h3>
                
                {/* Select seeker */}
                <AppSelect
                  label={language === 'kn' ? 'ಅಭ್ಯರ್ಥಿಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ' : 'Select Candidate'}
                  value={targetSeekerName}
                  onChange={(e) => setTargetSeekerName(e.target.value)}
                  required
                >
                  {uniqueSeekers.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </AppSelect>

                {/* Stars Selector */}
                <div className="space-y-2">
                  <label className="text-[14px] font-semibold text-[#475569] block">
                    {language === 'kn' ? 'ರೇಟಿಂಗ್' : 'Rating'}
                  </label>
                  <div className="flex items-center space-x-2.5 bg-slate-50 border border-slate-100 p-3 rounded-xl w-fit">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 cursor-pointer focus:outline-none transition-transform active:scale-90"
                      >
                        <Star className={`w-8 h-8 ${
                          star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 hover:text-amber-300'
                        } transition-colors`} />
                      </button>
                    ))}
                    <span className="text-sm font-bold text-slate-600 ml-3">{rating} / 5 Stars</span>
                  </div>
                </div>

                {/* Comments Textarea */}
                <AppTextarea
                  label={language === 'kn' ? 'ನಿಮ್ಮ ಅಭಿಪ್ರಾಯ / ಕಾಮೆಂಟ್ಸ್' : 'Comments'}
                  rows={4}
                  placeholder={language === 'kn' ? 'ವಿಮರ್ಶೆಯನ್ನು ಬರೆಯಿರಿ. ಉದಾ: ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ಬಂದಿದ್ದಾರೆ, ಬೇಗನೆ ಕಲಿಯುತ್ತಾರೆ...' : "Write your review here. E.g. On-time for interview, fast learner, polite customer handling..."}
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  required
                />
              </AppCard>

              <AppButton
                type="submit"
                variant="primary"
                fullWidth
              >
                {language === 'kn' ? 'ವಿಮರ್ಶೆಯನ್ನು ಸಲ್ಲಿಸಿ' : 'Submit Candidate Review'}
              </AppButton>
            </form>
          )}
        </div>

        {/* Right Side: Rating Summary & Feedback Received */}
        <div className="space-y-6">
          {/* Summary Card */}
          <AppCard className="space-y-4 text-center" variant="solid">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 text-left">
              {language === 'kn' ? 'ರೇಟಿಂಗ್ ಸಾರಾಂಶ' : 'Your Rating Summary'}
            </h3>
            
            <div className="py-4">
              <div className="text-4xl font-black text-indigo-600 mb-1">{avgRating}</div>
              <div className="flex justify-center items-center space-x-0.5 text-amber-400 mb-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const val = parseFloat(avgRating);
                  return (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(val) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-400">
                {language === 'kn'
                  ? `${myReviews.length} ಉದ್ಯೋಗಾಕಾಂಕ್ಷಿಗಳ ವಿಮರ್ಶೆಗಳಿಂದ`
                  : `Based on ${myReviews.length} review(s) from candidates`}
              </p>
            </div>
          </AppCard>

          {/* Feedback list */}
          <AppCard className="space-y-4" variant="solid">
            <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-2 flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              <span>{language === 'kn' ? 'ಅಭ್ಯರ್ಥಿಗಳಿಂದ ವಿಮರ್ಶೆಗಳು' : 'Candidate Reviews'}</span>
            </h3>

            {myReviews.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                {language === 'kn' ? 'ನಿಮಗೆ ಇನ್ನೂ ಯಾವುದೇ ವಿಮರ್ಶೆಗಳು ಬಂದಿಲ್ಲ.' : 'No reviews received yet.'}
              </p>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                {myReviews.map((rev) => (
                  <div key={rev.id} className="text-left border-b border-slate-100 pb-3 last:border-b-0 last:pb-0 space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700">{rev.from_user_name}</span>
                      <div className="flex items-center text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span className="text-[11px] font-bold text-slate-600 ml-1">{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 italic">"{rev.review}"</p>
                    <span className="text-[10px] text-slate-400 block">{new Date(rev.created_at).toLocaleDateString()}</span>
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

export default BusinessRatingsPage;
