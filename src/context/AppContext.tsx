import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/supabase';
import { User, JobSeeker, Business, Job, Application, Offer, Interview, Rating, Notification, UserRole } from '../types';
import confetti from 'canvas-confetti';

interface AppContextProps {
  language: 'en' | 'kn';
  setLanguage: (lang: 'en' | 'kn') => void;
  currentUser: User | null;
  currentSeeker: JobSeeker | null;
  currentBusiness: Business | null;
  jobs: Job[];
  applications: Application[];
  offers: Offer[];
  interviews: Interview[];
  ratings: Rating[];
  notifications: Notification[];
  users: User[];
  loginUser: (phoneOrEmail: string, role: UserRole) => boolean;
  loginGoogle: (role: UserRole) => void;
  signupUser: (name: string, email: string, phone: string, role: UserRole) => void;
  logoutUser: () => void;
  applyForJob: (jobId: string) => Promise<void>;
  createJob: (jobData: Omit<Job, 'id' | 'business_id' | 'business_name' | 'created_at' | 'is_featured' | 'status'>) => Promise<void>;
  updateSeeker: (seekerData: Partial<JobSeeker>) => void;
  updateBusiness: (businessData: Partial<Business>) => void;
  scheduleVideoInterview: (appId: string, date: string, time: string, meetLink: string, notes?: string) => void;
  sendJobOffer: (appId: string, message: string, salary: string, joiningDate?: string) => void;
  respondToOffer: (offerId: string, status: 'Accepted' | 'Rejected') => void;
  addRating: (toUserId: string, ratingValue: number, reviewText: string, type: 'seeker_to_employer' | 'employer_to_seeker') => void;
  shortlistApplicant: (appId: string) => void;
  viewApplicantProfile: (appId: string) => void;
  rejectApplicant: (appId: string) => void;
  markNotificationRead: (id: string) => void;
  triggerConfetti: () => void;
  toasts: { id: string; message: string; type: 'success' | 'error' | 'warning' }[];
  showToast: (message: string, type: 'success' | 'error' | 'warning') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'kn'>('en');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentSeeker, setCurrentSeeker] = useState<JobSeeker | null>(null);
  const [currentBusiness, setCurrentBusiness] = useState<Business | null>(null);

  // Database states
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<{ id: string; message: string; type: 'success' | 'error' | 'warning' }[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'warning') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Load from db (localStorage fallback)
  useEffect(() => {
    db.initialize();
    refreshState();
  }, []);

  // Sync state if currentUser changes
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'Job Seeker') {
        const s = db.getSeekerByUserId(currentUser.id);
        if (s) setCurrentSeeker(s);
        else {
          const newSeeker: JobSeeker = {
            id: 'seeker-' + Math.random().toString(36).substr(2, 9),
            user_id: currentUser.id,
            city: '',
            area: '',
            skills: [],
            experience: 'Freshers',
            languages: [],
            preferred_job_type: 'Full-time',
            profile_summary: '',
            created_at: new Date().toISOString()
          };
          db.saveSeeker(newSeeker);
          setCurrentSeeker(newSeeker);
        }
        setCurrentBusiness(null);
      } else if (currentUser.role === 'Business') {
        const b = db.getBusinessByUserId(currentUser.id);
        if (b) setCurrentBusiness(b);
        else {
          const newBusiness: Business = {
            id: 'biz-' + Math.random().toString(36).substr(2, 9),
            user_id: currentUser.id,
            business_name: '',
            category: 'Retail',
            address: '',
            city: '',
            contact_person: currentUser.name,
            phone: currentUser.phone,
            is_verified: false,
            created_at: new Date().toISOString()
          };
          db.saveBusiness(newBusiness);
          setCurrentBusiness(newBusiness);
        }
        setCurrentSeeker(null);
      } else {
        setCurrentSeeker(null);
        setCurrentBusiness(null);
      }
    } else {
      setCurrentSeeker(null);
      setCurrentBusiness(null);
    }
  }, [currentUser]);

  const refreshState = () => {
    setUsers(db.getUsers());
    setJobs(db.getJobs());
    setApplications(db.getApplications());
    setOffers(db.getOffers());
    setInterviews(db.getInterviews());
    setRatings(db.getRatings());
    setNotifications(db.getNotifications());
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
  };

  // Auth Operations
  const loginUser = (phoneOrEmail: string, role: UserRole): boolean => {
    const list = db.getUsers();
    // In our mock sandbox, let's check if user exists. If not, auto-create to make testing frictionless!
    let found = list.find(u => (u.phone === phoneOrEmail || u.email === phoneOrEmail) && u.role === role);
    
    if (!found) {
      // Create user automatically for testing ease
      const isEmail = phoneOrEmail.includes('@');
      const newUser: User = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        role,
        name: isEmail ? phoneOrEmail.split('@')[0] : 'User ' + phoneOrEmail.slice(-4),
        phone: isEmail ? '9876500000' : phoneOrEmail,
        email: isEmail ? phoneOrEmail : `${phoneOrEmail}@kaushalsetu.in`,
        auth_provider: isEmail ? 'email' : 'otp',
        created_at: new Date().toISOString()
      };
      db.saveUser(newUser);
      found = newUser;
    }

    setCurrentUser(found);
    refreshState();
    return true;
  };

  const loginGoogle = (role: UserRole) => {
    const newUser: User = {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      role,
      name: 'Google User',
      phone: '9988776655',
      email: 'googleuser@gmail.com',
      auth_provider: 'google',
      created_at: new Date().toISOString()
    };
    db.saveUser(newUser);
    setCurrentUser(newUser);
    refreshState();
  };

  const signupUser = (name: string, email: string, phone: string, role: UserRole) => {
    const newUser: User = {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      role,
      name,
      phone,
      email,
      auth_provider: 'email',
      created_at: new Date().toISOString()
    };
    db.saveUser(newUser);
    setCurrentUser(newUser);
    refreshState();
  };

  const logoutUser = () => {
    setCurrentUser(null);
    setCurrentSeeker(null);
    setCurrentBusiness(null);
  };

  // Seeker Operations
  const applyForJob = async (jobId: string) => {
    if (!currentSeeker || !currentUser) return;
    
    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return;

    // Local rule-based match calculation:
    // 1. Skill overlap (40%)
    const normSeekerSkills = (currentSeeker.skills || []).map(s => s.toLowerCase().trim()).filter(Boolean);
    const normJobSkills = (targetJob.skills_required || []).map(s => s.toLowerCase().trim()).filter(Boolean);
    
    let skillScore = 0;
    let matchingSkills: string[] = [];
    if (normJobSkills.length > 0) {
      matchingSkills = normJobSkills.filter(s => normSeekerSkills.includes(s));
      skillScore = (matchingSkills.length / normJobSkills.length) * 40;
    } else {
      skillScore = 40; // no specific skills required
    }

    // 2. Location/City match (30%)
    const cityMatch = (currentSeeker.city || '').toLowerCase().trim() === (targetJob.city || '').toLowerCase().trim();
    const locationScore = cityMatch ? 30 : 10;

    // 3. Experience Match (20%)
    const getYears = (str: string): number => {
      const match = str.match(/(\d+)/);
      return match ? parseInt(match[0], 10) : 0;
    };
    const seekerYears = getYears(currentSeeker.experience || '');
    const jobYears = getYears(targetJob.experience_required || '');
    
    let expScore = 0;
    if (seekerYears >= jobYears) {
      expScore = 20;
    } else {
      expScore = Math.max(0, 20 - (jobYears - seekerYears) * 5);
    }

    // 4. Job Type match (10%)
    const jobTypeMatch = (currentSeeker.preferred_job_type || '').toLowerCase().trim() === (targetJob.job_type || '').toLowerCase().trim();
    const jobTypeScore = jobTypeMatch ? 10 : 5;

    const matchScore = Math.round(skillScore + locationScore + expScore + jobTypeScore);

    // Build matching explanation
    const reasons: string[] = [];
    if (matchingSkills.length > 0) {
      reasons.push(`You share ${matchingSkills.length} matching skills (${matchingSkills.join(', ')}).`);
    } else if (normJobSkills.length > 0) {
      reasons.push(`Consider updating your profile with skills like: ${targetJob.skills_required.join(', ')}.`);
    }
    
    if (cityMatch) {
      reasons.push(`Both are located in ${targetJob.city}.`);
    } else {
      reasons.push(`Job is in ${targetJob.city} (different from your location: ${currentSeeker.city}).`);
    }

    if (seekerYears >= jobYears) {
      reasons.push(`Your experience (${currentSeeker.experience}) meets the requirement (${targetJob.experience_required}).`);
    } else {
      reasons.push(`The job requires ${targetJob.experience_required} but you listed ${currentSeeker.experience}.`);
    }

    if (jobTypeMatch) {
      reasons.push(`Preferred job type matches (${targetJob.job_type}).`);
    }

    const matchReason = reasons.join(' ');

    const newApp: Application = {
      id: 'app-' + Math.random().toString(36).substr(2, 9),
      job_id: jobId,
      seeker_id: currentSeeker.id,
      candidate_id: currentSeeker.id,
      seeker_name: currentUser.name,
      seeker_phone: currentUser.phone,
      job_title: targetJob.title,
      business_name: targetJob.business_name,
      status: 'Pending',
      match_score: matchScore,
      match_reason: matchReason,
      applied_at: new Date().toISOString()
    };

    db.saveApplication(newApp);

    // Add Notification to Business Owner
    const bizUser = users.find(u => {
      const b = db.getBusinessByUserId(u.id);
      return b?.id === targetJob.business_id;
    });

    if (bizUser) {
      const newNotif: Notification = {
        id: 'notif-' + Math.random().toString(36).substr(2, 9),
        user_id: bizUser.id,
        title: 'New Application Received',
        titleKannada: 'ಹೊಸ ಉದ್ಯೋಗ ಅರ್ಜಿ ಬಂದಿದೆ',
        message: `${currentUser.name} has applied for ${targetJob.title} (${matchScore}% Profile Match).`,
        messageKannada: `${currentUser.name} ಅವರು ${targetJob.title} ಹುದ್ದೆಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸಿದ್ದಾರೆ (${matchScore}% ಪ್ರೊಫೈಲ್ ಹೊಂದಾಣಿಕೆ).`,
        type: 'application',
        is_read: false,
        created_at: new Date().toISOString()
      };
      db.saveNotification(newNotif);
    }

    refreshState();
  };

  const updateSeeker = (seekerData: Partial<JobSeeker>) => {
    if (!currentSeeker) return;
    const updated = { ...currentSeeker, ...seekerData } as JobSeeker;
    db.saveSeeker(updated);
    setCurrentSeeker(updated);
    refreshState();
  };

  // Business Operations
  const updateBusiness = (businessData: Partial<Business>) => {
    if (!currentBusiness) return;
    const updated = { ...currentBusiness, ...businessData } as Business;
    db.saveBusiness(updated);
    setCurrentBusiness(updated);
    refreshState();
  };

  const createJob = async (jobData: Omit<Job, 'id' | 'business_id' | 'business_name' | 'created_at' | 'is_featured' | 'status'>) => {
    if (!currentBusiness) return;
    const newJob: Job = {
      ...jobData,
      id: 'job-' + Math.random().toString(36).substr(2, 9),
      business_id: currentBusiness.id,
      business_name: currentBusiness.business_name || 'My Local Business',
      is_featured: false,
      status: 'active',
      created_at: new Date().toISOString()
    };
    db.saveJob(newJob);
    refreshState();
  };

  const scheduleVideoInterview = (appId: string, date: string, time: string, meetLink: string, notes?: string) => {
    const apps = db.getApplications();
    const appIndex = apps.findIndex(a => a.id === appId);
    if (appIndex === -1) return;

    apps[appIndex].status = 'Interview Scheduled';
    apps[appIndex].interview_date = `${date} ${time}`;
    apps[appIndex].interview_link = meetLink;
    db.saveApplication(apps[appIndex]);

    const newInterview: Interview = {
      id: 'int-' + Math.random().toString(36).substr(2, 9),
      application_id: appId,
      job_title: apps[appIndex].job_title,
      seeker_name: apps[appIndex].seeker_name,
      seeker_id: apps[appIndex].seeker_id,
      business_name: apps[appIndex].business_name,
      meeting_link: meetLink,
      interview_date: date,
      interview_time: time,
      status: 'Scheduled',
      created_at: new Date().toISOString()
    };
    db.saveInterview(newInterview);

    // Notify Job Seeker
    const seekerRecord = db.getTable<JobSeeker>('SEEKERS').find(s => s.id === apps[appIndex].seeker_id);
    if (seekerRecord) {
      const newNotif: Notification = {
        id: 'notif-' + Math.random().toString(36).substr(2, 9),
        user_id: seekerRecord.user_id,
        title: 'Interview Scheduled',
        titleKannada: 'ಸಂದರ್ಶನ ನಿಗದಿಯಾಗಿದೆ',
        message: `${apps[appIndex].business_name} has scheduled your interview on ${date} at ${time}. Link: ${meetLink}. Notes: ${notes || ''}`,
        messageKannada: `${apps[appIndex].business_name} ಸಂಸ್ಥೆಯು ನಿಮ್ಮ ಸಂದರ್ಶನವನ್ನು ${date} ರಂದು ${time} ಕ್ಕೆ ನಿಗದಿಪಡಿಸಿದೆ. ಲಿಂಕ್: ${meetLink}. ಟಿಪ್ಪಣಿಗಳು: ${notes || ''}`,
        type: 'interview',
        is_read: false,
        created_at: new Date().toISOString()
      };
      db.saveNotification(newNotif);
    }

    refreshState();
  };

  const sendJobOffer = (appId: string, message: string, salary: string, joiningDate?: string) => {
    const apps = db.getApplications();
    const appIndex = apps.findIndex(a => a.id === appId);
    if (appIndex === -1) return;

    apps[appIndex].status = 'Offer Sent';
    apps[appIndex].offer_salary = salary;
    apps[appIndex].offer_message = message + (joiningDate ? ` | Joining Date: ${joiningDate}` : '');
    db.saveApplication(apps[appIndex]);

    const newOffer: Offer = {
      id: 'offer-' + Math.random().toString(36).substr(2, 9),
      application_id: appId,
      job_title: apps[appIndex].job_title,
      business_name: apps[appIndex].business_name,
      seeker_name: apps[appIndex].seeker_name,
      seeker_id: apps[appIndex].seeker_id,
      message: message + (joiningDate ? ` (Joining Date: ${joiningDate})` : ''),
      salary_offered: salary,
      status: 'Pending',
      created_at: new Date().toISOString()
    };
    db.saveOffer(newOffer);

    // Notify Job Seeker
    const seekerRecord = db.getTable<JobSeeker>('SEEKERS').find(s => s.id === apps[appIndex].seeker_id);
    if (seekerRecord) {
      const newNotif: Notification = {
        id: 'notif-' + Math.random().toString(36).substr(2, 9),
        user_id: seekerRecord.user_id,
        title: 'Offer Sent',
        titleKannada: 'ಉದ್ಯೋಗ ಆಫರ್ ಬಂದಿದೆ',
        message: `Congratulations! You received a job offer from ${apps[appIndex].business_name} for ₹${salary}.`,
        messageKannada: `ಅಭಿನಂದನೆಗಳು! ${apps[appIndex].business_name} ನಿಂದ ₹${salary} ಸಂಬಳದ ಉದ್ಯೋಗ ಪ್ರಸ್ತಾಪ ಬಂದಿದೆ.`,
        type: 'offer',
        is_read: false,
        created_at: new Date().toISOString()
      };
      db.saveNotification(newNotif);
    }

    refreshState();
  };

  const respondToOffer = (offerId: string, status: 'Accepted' | 'Rejected') => {
    const offersList = db.getOffers();
    const offerIndex = offersList.findIndex(o => o.id === offerId);
    if (offerIndex === -1) return;

    offersList[offerIndex].status = status;
    db.saveOffer(offersList[offerIndex]);

    // Update Application status
    const apps = db.getApplications();
    const appIndex = apps.findIndex(a => a.id === offersList[offerIndex].application_id);
    if (appIndex > -1) {
      apps[appIndex].status = status === 'Accepted' ? 'Hired' : 'Rejected';
      apps[appIndex].joined_status = status === 'Accepted' ? 'Hired' : 'Declined';
      db.saveApplication(apps[appIndex]);

      // Notify Business Owner
      const jobRecord = jobs.find(j => j.id === apps[appIndex].job_id);
      if (jobRecord) {
        const businessRecord = db.getTable<Business>('BUSINESSES').find(b => b.id === jobRecord.business_id);
        if (businessRecord) {
          const newNotif: Notification = {
            id: 'notif-' + Math.random().toString(36).substr(2, 9),
            user_id: businessRecord.user_id,
            title: status === 'Accepted' ? 'Candidate Hired!' : 'Offer Declined',
            titleKannada: status === 'Accepted' ? 'ಅಭ್ಯರ್ಥಿ ಕೆಲಸಕ್ಕೆ ಸೇರಿದ್ದಾರೆ!' : 'ಆಫರ್ ತಿರಸ್ಕರಿಸಲಾಗಿದೆ',
            message: status === 'Accepted'
              ? `${apps[appIndex].seeker_name} has accepted your job offer for "${apps[appIndex].job_title}"! They are now hired.`
              : `${apps[appIndex].seeker_name} has declined your job offer for "${apps[appIndex].job_title}".`,
            messageKannada: status === 'Accepted'
              ? `${apps[appIndex].seeker_name} ಅವರು ನಿಮ್ಮ "${apps[appIndex].job_title}" ಉದ್ಯೋಗ ಆಫರ್ ಅನ್ನು ಸ್ವೀಕರಿಸಿದ್ದಾರೆ! ಅವರು ನೇಮಕಗೊಂಡಿದ್ದಾರೆ.`
              : `${apps[appIndex].seeker_name} ಅವರು ನಿಮ್ಮ "${apps[appIndex].job_title}" ಉದ್ಯೋಗ ಆಫರ್ ಅನ್ನು ತಿರಸ್ಕರಿಸಿದ್ದಾರೆ.`,
            type: 'offer',
            is_read: false,
            created_at: new Date().toISOString()
          };
          db.saveNotification(newNotif);
        }
      }

      // Notify Job Seeker
      const seekerRecord = db.getTable<JobSeeker>('SEEKERS').find(s => s.id === apps[appIndex].seeker_id);
      if (seekerRecord && status === 'Accepted') {
        const newNotif: Notification = {
          id: 'notif-' + Math.random().toString(36).substr(2, 9),
          user_id: seekerRecord.user_id,
          title: 'Hired!',
          titleKannada: 'ನೇಮಕಗೊಂಡಿದ್ದೀರಿ!',
          message: `Congratulations! Your hiring for "${apps[appIndex].job_title}" has been finalized. You are officially Hired!`,
          messageKannada: `ಅಭಿನಂದನೆಗಳು! "${apps[appIndex].job_title}" ಗಾಗಿ ನಿಮ್ಮ ನೇಮಕಾತಿಯನ್ನು ಅಂತಿಮಗೊಳಿಸಲಾಗಿದೆ. ನೀವು ಅಧಿಕೃತವಾಗಿ ನೇಮಕಗೊಂಡಿದ್ದೀರಿ!`,
          type: 'offer',
          is_read: false,
          created_at: new Date().toISOString()
        };
        db.saveNotification(newNotif);
      }
    }

    if (status === 'Accepted') {
      triggerConfetti();
    }

    refreshState();
  };

  const shortlistApplicant = (appId: string) => {
    const apps = db.getApplications();
    const appIndex = apps.findIndex(a => a.id === appId);
    if (appIndex === -1) return;

    apps[appIndex].status = 'Shortlisted';
    apps[appIndex].reviewed_at = apps[appIndex].reviewed_at || new Date().toISOString();
    db.saveApplication(apps[appIndex]);

    // Notify Job Seeker
    const seekerRecord = db.getTable<JobSeeker>('SEEKERS').find(s => s.id === apps[appIndex].seeker_id);
    if (seekerRecord) {
      const newNotif: Notification = {
        id: 'notif-' + Math.random().toString(36).substr(2, 9),
        user_id: seekerRecord.user_id,
        title: 'Application Shortlisted',
        titleKannada: 'ಅರ್ಜಿ ಶಾರ್ಟ್‌ಲಿಸ್ಟ್ ಆಗಿದೆ',
        message: `Your application for "${apps[appIndex].job_title}" at ${apps[appIndex].business_name} has been shortlisted!`,
        messageKannada: `${apps[appIndex].business_name} ಸಂಸ್ಥೆಯಲ್ಲಿ ನಿಮ್ಮ "${apps[appIndex].job_title}" ಕೆಲಸದ ಅರ್ಜಿಯನ್ನು ಶಾರ್ಟ್‌ಲಿಸ್ಟ್ ಮಾಡಲಾಗಿದೆ!`,
        type: 'application',
        is_read: false,
        created_at: new Date().toISOString()
      };
      db.saveNotification(newNotif);
    }
    refreshState();
  };

  const viewApplicantProfile = (appId: string) => {
    const apps = db.getApplications();
    const appIndex = apps.findIndex(a => a.id === appId);
    if (appIndex === -1) return;

    if (!apps[appIndex].reviewed_at) {
      apps[appIndex].reviewed_at = new Date().toISOString();
      db.saveApplication(apps[appIndex]);

      // Notify Job Seeker
      const seekerRecord = db.getTable<JobSeeker>('SEEKERS').find(s => s.id === apps[appIndex].seeker_id);
      if (seekerRecord) {
        const newNotif: Notification = {
          id: 'notif-' + Math.random().toString(36).substr(2, 9),
          user_id: seekerRecord.user_id,
          title: 'Application Viewed',
          titleKannada: 'ಅರ್ಜಿ ವೀಕ್ಷಿಸಲಾಗಿದೆ',
          message: `Your application for "${apps[appIndex].job_title}" has been viewed by ${apps[appIndex].business_name}.`,
          messageKannada: `${apps[appIndex].business_name} ಸಂಸ್ಥೆಯು ನಿಮ್ಮ "${apps[appIndex].job_title}" ಕೆಲಸದ ಅರ್ಜಿಯನ್ನು ವೀಕ್ಷಿಸಿದೆ.`,
          type: 'application',
          is_read: false,
          created_at: new Date().toISOString()
        };
        db.saveNotification(newNotif);
      }
      refreshState();
    }
  };

  const rejectApplicant = (appId: string) => {
    const apps = db.getApplications();
    const appIndex = apps.findIndex(a => a.id === appId);
    if (appIndex === -1) return;

    apps[appIndex].status = 'Rejected';
    db.saveApplication(apps[appIndex]);

    // Notify Job Seeker
    const seekerRecord = db.getTable<JobSeeker>('SEEKERS').find(s => s.id === apps[appIndex].seeker_id);
    if (seekerRecord) {
      const newNotif: Notification = {
        id: 'notif-' + Math.random().toString(36).substr(2, 9),
        user_id: seekerRecord.user_id,
        title: 'Application Update',
        titleKannada: 'ಅರ್ಜಿಯ ಅಪ್ಡೇಟ್',
        message: `Your application for "${apps[appIndex].job_title}" at ${apps[appIndex].business_name} has been rejected.`,
        messageKannada: `${apps[appIndex].business_name} ಸಂಸ್ಥೆಯಲ್ಲಿ ನಿಮ್ಮ "${apps[appIndex].job_title}" ಕೆಲಸದ ಅರ್ಜಿಯನ್ನು ತಿರಸ್ಕರಿಸಲಾಗಿದೆ.`,
        type: 'application',
        is_read: false,
        created_at: new Date().toISOString()
      };
      db.saveNotification(newNotif);
    }
    refreshState();
  };

  const addRating = (toUserId: string, ratingValue: number, reviewText: string, type: 'seeker_to_employer' | 'employer_to_seeker') => {
    if (!currentUser) return;
    const newRating: Rating = {
      id: 'rating-' + Math.random().toString(36).substr(2, 9),
      from_user_id: currentUser.id,
      from_user_name: currentUser.name,
      to_user_id: toUserId,
      rating: ratingValue,
      review: reviewText,
      rating_type: type,
      created_at: new Date().toISOString()
    };
    db.saveRating(newRating);
    refreshState();
  };

  const markNotificationRead = (id: string) => {
    const notifs = db.getNotifications();
    const index = notifs.findIndex(n => n.id === id);
    if (index > -1) {
      notifs[index].is_read = true;
      db.saveTable('NOTIFICATIONS', notifs);
      refreshState();
    }
  };



  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      currentUser,
      currentSeeker,
      currentBusiness,
      jobs,
      applications,
      offers,
      interviews,
      ratings,
      notifications,
      users,
      loginUser,
      loginGoogle,
      signupUser,
      logoutUser,
      applyForJob,
      createJob,
      updateSeeker,
      updateBusiness,
      scheduleVideoInterview,
      sendJobOffer,
      respondToOffer,
      addRating,
      shortlistApplicant,
      viewApplicantProfile,
      rejectApplicant,
      markNotificationRead,
      triggerConfetti,
      toasts,
      showToast,
      removeToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
