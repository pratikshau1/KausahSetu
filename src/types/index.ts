export type UserRole = 'Job Seeker' | 'Business';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  phone: string;
  email: string;
  auth_provider: 'otp' | 'email' | 'google';
  created_at: string;
}

export interface JobSeeker {
  id: string;
  user_id: string;
  city: string;
  area: string;
  skills: string[];
  experience: string; // e.g. "2 years"
  languages: string[];
  preferred_job_type: 'Full-time' | 'Part-time' | 'Gig work' | 'Internship';
  profile_summary: string;
  resume_url?: string;
  created_at: string;
}

export interface Business {
  id: string;
  user_id: string;
  business_name: string;
  category: string; // e.g. "Bakery", "Retail", "Services"
  address: string;
  city: string;
  contact_person: string;
  phone: string;
  is_verified: boolean;
  created_at: string;
}

export interface Job {
  id: string;
  business_id: string;
  business_name: string; // denormalized for convenience
  title: string;
  salary: string; // e.g., "₹15,000/month"
  location: string; // e.g., "Hebbal, Bangalore"
  city: string; // e.g., "Bangalore"
  skills_required: string[];
  job_type: 'Full-time' | 'Part-time' | 'Gig work' | 'Internship';
  experience_required: string;
  description: string;
  is_featured: boolean;
  status: 'active' | 'closed' | 'draft';
  created_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  seeker_id: string;
  candidate_id?: string;
  seeker_name: string; // denormalized
  seeker_phone: string; // denormalized
  job_title: string; // denormalized
  business_name: string; // denormalized
  status: 'Pending' | 'Shortlisted' | 'Interview Scheduled' | 'Offer Sent' | 'Hired' | 'Rejected' | 'Applied' | 'Offer Received' | 'Accepted' | 'Closed';
  match_score: number;
  match_reason: string;
  applied_at: string;
  reviewed_at?: string;
  interview_date?: string;
  interview_link?: string;
  offer_salary?: string;
  offer_message?: string;
  joined_status?: string;
}

export interface Offer {
  id: string;
  application_id: string;
  job_title: string; // denormalized
  business_name: string; // denormalized
  seeker_name: string; // denormalized
  seeker_id: string; // denormalized
  message: string;
  salary_offered: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  created_at: string;
}

export interface Interview {
  id: string;
  application_id: string;
  job_title: string; // denormalized
  seeker_name: string; // denormalized
  seeker_id: string; // denormalized
  business_name: string; // denormalized
  meeting_link: string;
  interview_date: string;
  interview_time: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  created_at: string;
}

export interface Rating {
  id: string;
  from_user_id: string;
  from_user_name: string; // denormalized
  to_user_id: string;
  rating: number; // 1 to 5
  review: string;
  rating_type: 'seeker_to_employer' | 'employer_to_seeker';
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  titleKannada: string;
  message: string;
  messageKannada: string;
  type: 'application' | 'interview' | 'offer' | 'rating' | 'system';
  is_read: boolean;
  created_at: string;
}


