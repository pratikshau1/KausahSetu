import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { translations } from '../../i18n/translations';
import AppCard from '../../components/ui/AppCard';
import AppButton from '../../components/ui/AppButton';
import AppInput from '../../components/ui/AppInput';
import AppSelect from '../../components/ui/AppSelect';
import FormSection from '../../components/ui/FormSection';
import { Store, MapPin, User, Phone, Check, ShieldCheck, AlertCircle } from 'lucide-react';

export const BusinessProfile: React.FC = () => {
  const { language, currentUser, currentBusiness, updateBusiness } = useApp();
  const t = translations[language];

  if (!currentUser || !currentBusiness) {
    return <div className="text-center py-12">Loading...</div>;
  }

  // Local form states
  const [businessName, setBusinessName] = useState(currentBusiness.business_name || '');
  const [category, setCategory] = useState(currentBusiness.category || 'Bakery');
  const [address, setAddress] = useState(currentBusiness.address || '');
  const [city, setCity] = useState(currentBusiness.city || '');
  const [contactPerson, setContactPerson] = useState(currentBusiness.contact_person || '');
  const [phone, setPhone] = useState(currentBusiness.phone || '');
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState(currentBusiness.is_verified);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusiness({
      business_name: businessName,
      category,
      address,
      city,
      contact_person: contactPerson,
      phone,
      is_verified: verifyStatus
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleRequestVerification = () => {
    setVerifyStatus(true);
    updateBusiness({
      is_verified: true
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-4 text-left">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {language === 'kn' ? 'ವ್ಯಾಪಾರ ಪ್ರೊಫೈಲ್' : 'Business Profile Setup'}
        </h2>
      </div>

      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center space-x-2">
          <Check className="w-4 h-4" />
          <span>Profile saved successfully! Database synced.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <AppCard className="space-y-6">
          <FormSection title="Store Registry Details">
            <AppInput
              type="text"
              label={t.businessName}
              placeholder="E.g., Nandi Sweets & Bakery"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
            />

            <AppSelect
              label={t.businessCategory}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="Bakery">Bakery & Confectionery</option>
              <option value="Retail">Retail Grocery Store</option>
              <option value="Boutique">Clothing Boutique / Retail</option>
              <option value="Restaurant">Restaurant & Cafe</option>
              <option value="Services">Services (Laundry, Security)</option>
            </AppSelect>

            <AppInput
              type="text"
              label={t.businessAddress}
              placeholder="Opposite Railway Station, 12th Main Road"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              containerClassName="md:col-span-2"
              required
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
            </AppSelect>

            <AppInput
              type="text"
              label={t.contactPerson}
              placeholder="Manjunath Gowda"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              icon={<User className="w-4 h-4" />}
              required
            />

            <AppInput
              type="text"
              label="Contact Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              icon={<Phone className="w-4 h-4" />}
              required
              containerClassName="md:col-span-2"
            />
          </FormSection>
        </AppCard>

        {/* Verification Status Card */}
        <AppCard className="space-y-4">
          <div className="border-b border-slate-100 pb-3 text-left">
            <h3 className="font-extrabold text-[16px] text-slate-800 tracking-tight">
              Verification Registry
            </h3>
          </div>

          {verifyStatus ? (
            <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex items-center space-x-2.5">
              <ShieldCheck className="w-6 h-6 text-emerald-600 flex-shrink-0 animate-pulse" />
              <div className="text-xs">
                <strong className="block font-black">✓ Verified Local Business Account</strong>
                <span>Candidates will see the verified checkmark next to your jobs. This improves candidate application rates by 80%.</span>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start space-x-2.5 text-xs text-amber-700">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-black">Account Unverified</strong>
                  <span>Verify your shop address to display the verified trust badge to applicants.</span>
                </div>
              </div>
              <AppButton
                type="button"
                onClick={handleRequestVerification}
                variant="primary"
                className="h-9 px-4 text-xs rounded-lg active:scale-95"
              >
                Request Instantly
              </AppButton>
            </div>
          )}
        </AppCard>

        <AppButton type="submit" fullWidth variant="primary">
          {t.saveProfile}
        </AppButton>
      </form>
    </div>
  );
};

export default BusinessProfile;
