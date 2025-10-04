import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, where, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Payment } from '../models/payment';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  private firestore = inject(Firestore);
  private col = collection(this.firestore, 'payments');

  listByContribution$(contributionId: string): Observable<Payment[]> {
    const q = query(this.col, where('contributionId', '==', contributionId));
    return collectionData(q, { idField: 'id' }) as Observable<Payment[]>;
  }

  listByStudent$(studentId: string): Observable<Payment[]> {
    const q = query(this.col, where('studentId', '==', studentId));
    return collectionData(q, { idField: 'id' }) as Observable<Payment[]>;
  }

  async submitPayments(payments: Omit<Payment, 'id'>[]) {
    const ops = payments.map((p) => addDoc(this.col, p as any));
    await Promise.all(ops);
  }

  async update(id: string, data: Partial<Payment>) {
    await updateDoc(doc(this.firestore, 'payments', id), data as any);
  }
}
