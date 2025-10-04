export type ContributionStatus = 'Pending' | 'Ready to Collect' | 'Completed';

export interface Contribution {
  id: string;
  title: string;
  amount: number;
  description?: string;
  dueDate?: any; // Firestore Timestamp
  status: ContributionStatus;
  createdBy: string; // uid of admin
  homeroomStatuses?: Record<string, ContributionStatus>;
}
