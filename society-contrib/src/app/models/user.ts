export type UserRole = 'admin' | 'treasurer' | 'student';

export interface AppUser {
  id: string;
  role: UserRole;
  name?: string;
  homeroom?: string;
  studentId?: string;
}
