import { User, JobSeeker, Business, Job, Application, Offer, Interview, Rating, Notification } from '../types';

const STORAGE_KEYS = {
  USERS: 'ks_users',
  SEEKERS: 'ks_seekers',
  BUSINESSES: 'ks_businesses',
  JOBS: 'ks_jobs',
  APPLICATIONS: 'ks_applications',
  OFFERS: 'ks_offers',
  INTERVIEWS: 'ks_interviews',
  RATINGS: 'ks_ratings',
  NOTIFICATIONS: 'ks_notifications',
};

// Seed Initial Mock Data
const INITIAL_USERS: User[] = [
  {
    id: 'user-seeker-1',
    role: 'Job Seeker',
    name: 'Ramesh Kumar',
    phone: '9876543210',
    email: 'ramesh@kaushalsetu.in',
    auth_provider: 'otp',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'user-biz-1',
    role: 'Business',
    name: 'Manjunath Gowda',
    phone: '9123456789',
    email: 'nandi.bakery@gmail.com',
    auth_provider: 'email',
    created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'user-biz-2',
    role: 'Business',
    name: 'Ganesh Prasad',
    phone: '9876501234',
    email: 'ganesh.provisions@gmail.com',
    auth_provider: 'email',
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const INITIAL_SEEKERS: JobSeeker[] = [
  {
    id: 'seeker-1',
    user_id: 'user-seeker-1',
    city: 'Bangalore',
    area: 'Hebbal',
    skills: ['Store Helper', 'Billing', 'Customer Service', 'Basic Math'],
    experience: '1 Year',
    languages: ['Kannada', 'English', 'Hindi'],
    preferred_job_type: 'Full-time',
    profile_summary: 'Hardworking retail assistant with experience in inventory stocking and cashier operations in local grocery shops. Fluency in Kannada and basic English.',
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const INITIAL_BUSINESSES: Business[] = [
  {
    id: 'biz-1',
    user_id: 'user-biz-1',
    business_name: 'Nandi Sweets & Bakery',
    category: 'Bakery',
    address: 'Opposite Railway Station, Kuvempunagar',
    city: 'Mysore',
    contact_person: 'Manjunath Gowda',
    phone: '9123456789',
    is_verified: true,
    created_at: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'biz-2',
    user_id: 'user-biz-2',
    business_name: 'Ganesh Provision Store',
    category: 'Retail',
    address: '12th Main Road, Hebbal Layout',
    city: 'Bangalore',
    contact_person: 'Ganesh Prasad',
    phone: '9876501234',
    is_verified: true,
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const INITIAL_JOBS: Job[] = [
  {
    id: 'job-1',
    business_id: 'biz-1',
    business_name: 'Nandi Sweets & Bakery',
    title: 'Bakery Helper & Counter Staff',
    salary: '₹14,000/month',
    location: 'Kuvempunagar, Mysore',
    city: 'Mysore',
    skills_required: ['Billing', 'Sweets Packaging', 'Customer Handling', 'Cleanliness'],
    job_type: 'Full-time',
    experience_required: 'Freshers (Training provided)',
    description: 'Looking for an enthusiastic worker to assist at the sweets display counter. Responsibilities include greeting customers, packaging traditional Indian sweets, billing, and maintaining cleanliness of the showcase.',
    is_featured: true,
    status: 'active',
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'job-2',
    business_id: 'biz-2',
    business_name: 'Ganesh Provision Store',
    title: 'Store Assistant & Bill Clerk',
    salary: '₹13,000/month',
    location: 'Hebbal, Bangalore',
    city: 'Bangalore',
    skills_required: ['Store Helper', 'Billing', 'Inventory', 'Kannada'],
    job_type: 'Full-time',
    experience_required: '0 - 1 Year',
    description: 'Help needed in grocery provision store. Tasks involve loading/unloading stock, arranging items on shelves, sorting orders for local home delivery, and managing the checkout billing counter.',
    is_featured: true,
    status: 'active',
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'job-3',
    business_id: 'biz-2',
    business_name: 'Ganesh Provision Store',
    title: 'Two-Wheeler Delivery Rider',
    salary: '₹15,000/month',
    location: 'Hebbal, Bangalore',
    city: 'Bangalore',
    skills_required: ['Driving License', 'Two-wheeler', 'Google Maps', 'Local Area Knowledge'],
    job_type: 'Part-time',
    experience_required: 'No previous experience needed',
    description: 'Deliver groceries to residents within a 3km radius. Driver must have their own two-wheeler, a valid driver license, and a smartphone to navigate with Google Maps.',
    is_featured: false,
    status: 'active',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'job-4',
    business_id: 'biz-1',
    business_name: 'Nandi Sweets & Bakery',
    title: 'Sweets Chef / Halwai Assistant',
    salary: '₹22,000/month',
    location: 'Kuvempunagar, Mysore',
    city: 'Mysore',
    skills_required: ['Cooking', 'Traditional Sweets', 'Food Safety'],
    job_type: 'Full-time',
    experience_required: '2+ Years',
    description: 'We need an experienced assistant Halwai cook to make traditional Mysore Pak, Laddu, and Pedha. Cleanliness and knowledge of food hygiene standards are essential.',
    is_featured: false,
    status: 'active',
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    job_id: 'job-2',
    seeker_id: 'seeker-1',
    seeker_name: 'Ramesh Kumar',
    seeker_phone: '9876543210',
    job_title: 'Store Assistant & Bill Clerk',
    business_name: 'Ganesh Provision Store',
    status: 'Interview Scheduled',
    match_score: 95,
    match_reason: 'Ramesh has 1 year experience as a Store Helper, knows Kannada and Billing, and lives in Hebbal, which matches this job perfectly.',
    applied_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const INITIAL_INTERVIEWS: Interview[] = [
  {
    id: 'int-1',
    application_id: 'app-1',
    job_title: 'Store Assistant & Bill Clerk',
    seeker_name: 'Ramesh Kumar',
    seeker_id: 'seeker-1',
    business_name: 'Ganesh Provision Store',
    meeting_link: 'https://meet.google.com/abc-defg-hij',
    interview_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    interview_time: '11:30 AM',
    status: 'Scheduled',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-1',
    user_id: 'user-seeker-1',
    title: 'Interview Scheduled',
    titleKannada: 'ಸಂದರ್ಶನ ನಿಗದಿಯಾಗಿದೆ',
    message: 'Ganesh Provision Store has scheduled an interview for Store Assistant & Bill Clerk. Link: https://meet.google.com/abc-defg-hij',
    messageKannada: 'ಗಣೇಶ್ ಪ್ರಾವಿಷನ್ ಸ್ಟೋರ್ ಸ್ಟೋರ್ ಅಸಿಸ್ಟೆಂಟ್ ಮತ್ತು ಬಿಲ್ ಕ್ಲರ್ಕ್ ಹುದ್ದೆಗೆ ಸಂದರ್ಶನವನ್ನು ನಿಗದಿಪಡಿಸಿದೆ. ಲಿಂಕ್: https://meet.google.com/abc-defg-hij',
    type: 'interview',
    is_read: false,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const INITIAL_RATINGS: Rating[] = [
  {
    id: 'rating-1',
    from_user_id: 'user-seeker-1',
    from_user_name: 'Ramesh Kumar',
    to_user_id: 'user-biz-2',
    rating: 5,
    review: 'Ganesh Provision Store is very respectful. The owner Ganesh Prasad pays salary on time and is friendly.',
    rating_type: 'seeker_to_employer',
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

// Helper functions for LocalStorage management
export const mockDb = {
  initialize: () => {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SEEKERS)) {
      localStorage.setItem(STORAGE_KEYS.SEEKERS, JSON.stringify(INITIAL_SEEKERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BUSINESSES)) {
      localStorage.setItem(STORAGE_KEYS.BUSINESSES, JSON.stringify(INITIAL_BUSINESSES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.JOBS)) {
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(INITIAL_JOBS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(INITIAL_APPLICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.OFFERS)) {
      localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.INTERVIEWS)) {
      localStorage.setItem(STORAGE_KEYS.INTERVIEWS, JSON.stringify(INITIAL_INTERVIEWS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.RATINGS)) {
      localStorage.setItem(STORAGE_KEYS.RATINGS, JSON.stringify(INITIAL_RATINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
  },

  getTable: <T>(key: keyof typeof STORAGE_KEYS): T[] => {
    mockDb.initialize();
    const data = localStorage.getItem(STORAGE_KEYS[key]);
    return data ? JSON.parse(data) : [];
  },

  saveTable: <T>(key: keyof typeof STORAGE_KEYS, data: T[]): void => {
    localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
  },

  // Custom DB Methods
  getJobs: (): Job[] => mockDb.getTable<Job>('JOBS'),
  
  saveJob: (job: Job): void => {
    const jobs = mockDb.getJobs();
    const index = jobs.findIndex(j => j.id === job.id);
    if (index > -1) {
      jobs[index] = job;
    } else {
      jobs.unshift(job);
    }
    mockDb.saveTable('JOBS', jobs);
  },

  getSeekerByUserId: (userId: string): JobSeeker | undefined => {
    const seekers = mockDb.getTable<JobSeeker>('SEEKERS');
    return seekers.find(s => s.user_id === userId);
  },

  saveSeeker: (seeker: JobSeeker): void => {
    const seekers = mockDb.getTable<JobSeeker>('SEEKERS');
    const index = seekers.findIndex(s => s.id === seeker.id);
    if (index > -1) {
      seekers[index] = seeker;
    } else {
      seekers.push(seeker);
    }
    mockDb.saveTable('SEEKERS', seekers);
  },

  getBusinessByUserId: (userId: string): Business | undefined => {
    const businesses = mockDb.getTable<Business>('BUSINESSES');
    return businesses.find(b => b.user_id === userId);
  },

  saveBusiness: (business: Business): void => {
    const businesses = mockDb.getTable<Business>('BUSINESSES');
    const index = businesses.findIndex(b => b.id === business.id);
    if (index > -1) {
      businesses[index] = business;
    } else {
      businesses.push(business);
    }
    mockDb.saveTable('BUSINESSES', businesses);
  },

  getApplications: (): Application[] => mockDb.getTable<Application>('APPLICATIONS'),

  saveApplication: (app: Application): void => {
    const apps = mockDb.getApplications();
    const index = apps.findIndex(a => a.id === app.id);
    if (index > -1) {
      apps[index] = app;
    } else {
      apps.unshift(app);
    }
    mockDb.saveTable('APPLICATIONS', apps);
  },

  getOffers: (): Offer[] => mockDb.getTable<Offer>('OFFERS'),

  saveOffer: (offer: Offer): void => {
    const offers = mockDb.getOffers();
    const index = offers.findIndex(o => o.id === offer.id);
    if (index > -1) {
      offers[index] = offer;
    } else {
      offers.unshift(offer);
    }
    mockDb.saveTable('OFFERS', offers);
  },

  getInterviews: (): Interview[] => mockDb.getTable<Interview>('INTERVIEWS'),

  saveInterview: (interview: Interview): void => {
    const interviews = mockDb.getInterviews();
    const index = interviews.findIndex(i => i.id === interview.id);
    if (index > -1) {
      interviews[index] = interview;
    } else {
      interviews.unshift(interview);
    }
    mockDb.saveTable('INTERVIEWS', interviews);
  },

  getRatings: (): Rating[] => mockDb.getTable<Rating>('RATINGS'),

  saveRating: (rating: Rating): void => {
    const ratings = mockDb.getRatings();
    ratings.unshift(rating);
    mockDb.saveTable('RATINGS', ratings);
  },

  getNotifications: (): Notification[] => mockDb.getTable<Notification>('NOTIFICATIONS'),

  saveNotification: (notif: Notification): void => {
    const notifications = mockDb.getNotifications();
    notifications.unshift(notif);
    mockDb.saveTable('NOTIFICATIONS', notifications);
  },

  getUsers: (): User[] => mockDb.getTable<User>('USERS'),

  saveUser: (user: User): void => {
    const users = mockDb.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index > -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    mockDb.saveTable('USERS', users);
  }
};
