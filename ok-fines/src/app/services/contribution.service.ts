import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, doc, updateDoc, serverTimestamp } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Contribution, ContributionStatus } from '../models';

@Injectable({ providedIn: 'root' })
export class ContributionService {
  private col = collection(this.firestore, 'contributions');

  constructor(private firestore: Firestore) {}

  getContributions$(): Observable<Contribution[]> {
    return collectionData(this.col, { idField: 'id' }) as unknown as Observable<Contribution[]>;
  }

  async createContribution(input: Omit<Contribution, 'id' | 'createdAt'>): Promise<void> {
    await addDoc(this.col, { ...input, createdAt: serverTimestamp() });
  }

  async updateContribution(id: string, data: Partial<Contribution>): Promise<void> {
    const ref = doc(this.firestore, 'contributions', id);
    await updateDoc(ref, data as any);
  }

  async setHomeroomStatus(id: string, homeroom: string, status: ContributionStatus): Promise<void> {
    const ref = doc(this.firestore, 'contributions', id);
    await updateDoc(ref, { [`homeroomStatuses.${homeroom}`]: status } as any);
  }
}
