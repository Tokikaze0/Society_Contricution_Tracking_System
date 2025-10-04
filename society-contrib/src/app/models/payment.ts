export type PaymentStatus = 'Paid' | 'Pending' | 'For Verification' | 'Rejected';

export interface Payment {
  id: string;
  studentId: string; // logical student id
  contributionId: string;
  homeroom?: string;
  status: PaymentStatus;
  datePaid?: any; // Firestore Timestamp
}
