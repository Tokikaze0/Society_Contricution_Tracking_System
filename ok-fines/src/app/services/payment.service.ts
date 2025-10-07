import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, query, where, updateDoc, doc, serverTimestamp } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Payment } from '../models';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private col = collection(this.firestore, 'payments');

  constructor(private firestore: Firestore, private auth: Auth) {}

  getPaymentsByStudent$(studentId: string): Observable<Payment[]> {
    const q = query(this.col, where('studentId', '==', studentId));
    return collectionData(q, { idField: 'id' }) as unknown as Observable<Payment[]>;
  }

  getPaymentsByContribution$(contributionId: string): Observable<Payment[]> {
    const q = query(this.col, where('contributionId', '==', contributionId));
    return collectionData(q, { idField: 'id' }) as unknown as Observable<Payment[]>;
  }

  getPendingApprovals$(): Observable<Payment[]> {
    const q = query(this.col, where('status', '==', 'submitted'));
    return collectionData(q, { idField: 'id' }) as unknown as Observable<Payment[]>;
  }

  async submitPayments(contributionId: string, homeroom: string, studentIds: string[], amount?: number): Promise<void> {
    const now = serverTimestamp();
    const uid = this.auth.currentUser?.uid ?? null;
    for (const studentId of studentIds) {
      await addDoc(this.col, {
        studentId,
        contributionId,
        homeroom,
        status: 'submitted',
        datePaid: now,
        submittedBy: uid,
        amount: amount ?? null,
      });
    }
  }

  async approvePayment(id: string): Promise<void> {
    const ref = doc(this.firestore, 'payments', id);
    const uid = this.auth.currentUser?.uid ?? null;
    await updateDoc(ref, { status: 'approved', approvedBy: uid });
  }

  async rejectPayment(id: string): Promise<void> {
    const ref = doc(this.firestore, 'payments', id);
    const uid = this.auth.currentUser?.uid ?? null;
    await updateDoc(ref, { status: 'rejected', approvedBy: uid });
  }
}
