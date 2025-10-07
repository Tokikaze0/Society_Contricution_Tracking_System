export type UserRole = 'admin' | 'treasurer' | 'student';

export interface AppUser {
  id: string;
  role: UserRole;
  name?: string;
  homeroom?: string;
  studentId?: string;
}

export type ContributionStatus = 'pending' | 'ready' | 'completed';

export interface Contribution {
  id: string;
  title: string;
  amount: number;
  description?: string;
  dueDate?: any; // Firestore Timestamp
  status?: ContributionStatus;
  createdBy: string; // uid of creator
  homeroomStatuses?: Record<string, ContributionStatus>;
  createdAt?: any; // Firestore Timestamp
}

export type PaymentStatus = 'submitted' | 'approved' | 'rejected';

export interface Payment {
  id: string;
  studentId: string;
  contributionId: string;
  homeroom?: string;
  status: PaymentStatus;
  datePaid?: any; // Firestore Timestamp
  submittedBy?: string; // treasurer uid
  approvedBy?: string; // admin uid
  amount?: number;
}
