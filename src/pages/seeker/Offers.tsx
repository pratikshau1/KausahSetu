import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import AppCard from '../../components/ui/AppCard';
import AppButton from '../../components/ui/AppButton';
import AppModal from '../../components/ui/AppModal';
import EmptyState from '../../components/ui/EmptyState';
import { db } from '../../services/supabase';
import { Gift, Check, X, MessageSquare, Award } from 'lucide-react';

export const Offers: React.FC = () => {
  const { language, currentUser, currentSeeker, offers, respondToOffer } = useApp();
  const t = translations[language];
  const [successOfferId, setSuccessOfferId] = useState<string | null>(null);

  // Modal States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalAction, setModalAction] = useState<{ type: 'accept' | 'reject'; id: string } | null>(null);

  if (!currentUser || !currentSeeker) {
    return <div className="text-center py-12">Loading...</div>;
  }

  const myOffers = offers.filter(o => o.seeker_id === currentSeeker.id);

  const handleAccept = (offerId: string) => {
    respondToOffer(offerId, 'Accepted');
    setSuccessOfferId(offerId);
  };

  const handleReject = (offerId: string) => {
    respondToOffer(offerId, 'Rejected');
  };

  const triggerAction = (type: 'accept' | 'reject', id: string) => {
    setModalAction({ type, id });
    setShowConfirmModal(true);
  };

  const handleConfirmModal = () => {
    if (!modalAction) return;
    if (modalAction.type === 'accept') {
      handleAccept(modalAction.id);
    } else {
      handleReject(modalAction.id);
    }
  };

  const getWhatsAppLink = (offer: any) => {
    const businessTable = db.getTable<any>('BUSINESSES');
    const businessDetails = businessTable.find(b => b.business_name === offer.business_name);
    const phone = businessDetails?.phone || '9123456789';

    const encodedMessage = encodeURIComponent(
      language === 'kn'
        ? `ನಮಸ್ಕಾರ ${offer.business_name}, ಕೌಶಲ್ ಸೇತುನಲ್ಲಿ ನೀವು ಕಳುಹಿಸಿದ "${offer.job_title}" ಉದ್ಯೋಗ ಆಫರ್ ಅನ್ನು ನಾನು ಸ್ವೀಕರಿಸಿದ್ದೇನೆ. ಧನ್ಯವಾದಗಳು!`
        : `Hello ${offer.business_name}, I have officially accepted your job offer for "${offer.job_title}" on KaushalSetu. I look forward to working with you!`
    );
    return `https://wa.me/91${phone}?text=${encodedMessage}`;
  };

  return (
    <div className="space-y-6 text-left font-sans">
      <div className="text-left">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {t.offers}
        </h2>
        <p className="text-xs text-slate-500">
          {language === 'kn' ? 'ಸ್ಥಳೀಯ ಸಂಸ್ಥೆಗಳಿಂದ ನಿಮಗೆ ಬಂದಿರುವ ಉದ್ಯೋಗ ಪ್ರಸ್ತಾಪಗಳು' : 'Review and respond to official job offers sent by local businesses in your city'}
        </p>
      </div>

      {myOffers.length === 0 ? (
        <EmptyState
          icon={Gift}
          title={language === 'kn' ? 'ನಿಮಗೆ ಯಾವುದೇ ಉದ್ಯೋಗ ಆಫರ್‌ಗಳು ಬಂದಿಲ್ಲ.' : 'No job offers received yet.'}
          description="Build your profile, add skills, and apply to jobs in the Listings tab to get hiring offers from local stores."
        />
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {myOffers.map((offer) => {
            const isAccepted = offer.status === 'Accepted';
            const isRejected = offer.status === 'Rejected';
            const isPending = offer.status === 'Pending';
            
            return (
              <AppCard key={offer.id} className={`space-y-4 text-left border ${
                isAccepted ? 'border-emerald-100 bg-emerald-50/10' : 'border-slate-100'
              }`}>
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base text-slate-800">{offer.job_title}</h3>
                    <p className="text-xs text-slate-400 font-bold">{offer.business_name}</p>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                    isAccepted ? 'bg-emerald-100 text-emerald-700' :
                    isRejected ? 'bg-rose-100 text-rose-700' :
                    'bg-indigo-100 text-indigo-700'
                  }`}>
                    {offer.status}
                  </span>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Monthly Salary Offered</span>
                    <strong className="text-slate-700 text-sm">₹{Number(offer.salary_offered).toLocaleString()}/month</strong>
                  </div>
                  
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Employer Message</span>
                    <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/50 leading-relaxed italic">
                      "{offer.message}"
                    </p>
                  </div>
                </div>

                {/* Accept/Reject actions */}
                {isPending && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <AppButton
                      onClick={() => triggerAction('reject', offer.id)}
                      variant="secondary"
                      icon={<X className="w-4 h-4 text-slate-500" />}
                    >
                      {t.reject}
                    </AppButton>
                    <AppButton
                      onClick={() => triggerAction('accept', offer.id)}
                      variant="primary"
                      icon={<Check className="w-4 h-4" />}
                    >
                      {t.accept}
                    </AppButton>
                  </div>
                )}

                {/* Accepted Details and WhatsApp Alert */}
                {isAccepted && (
                  <div className="pt-2 space-y-3">
                    <div className="bg-emerald-50 text-emerald-700 p-3.5 rounded-xl border border-emerald-100 text-xs font-bold text-center">
                      🎉 Offer Accepted successfully! Let the employer know.
                    </div>
                    <AppButton
                      onClick={() => window.open(getWhatsAppLink(offer), '_blank')}
                      variant="primary"
                      fullWidth
                      className="!bg-emerald-600 hover:!bg-emerald-700 !border-emerald-600"
                      icon={<MessageSquare className="w-4 h-4" />}
                    >
                      {language === 'kn' ? 'ಮಾಲೀಕರಿಗೆ ವಾಟ್ಸಾಪ್ ಕಳುಹಿಸಿ' : 'Send WhatsApp Acceptance'}
                    </AppButton>
                  </div>
                )}
              </AppCard>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      <AppModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title={modalAction?.type === 'accept' ? 'Accept Job Offer' : 'Reject Job Offer'}
        description={
          modalAction?.type === 'accept'
            ? 'Are you sure you want to accept this job offer? The business owner will be notified of your decision.'
            : 'Are you sure you want to reject this job offer? This action cannot be undone.'
        }
        onConfirm={handleConfirmModal}
        confirmText={modalAction?.type === 'accept' ? 'Accept' : 'Reject'}
        type={modalAction?.type === 'reject' ? 'danger' : 'primary'}
      />
    </div>
  );
};

export default Offers;
