import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc, Timestamp, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Contribution } from '../models/contribution';

@Injectable({ providedIn: 'root' })
export class ContributionsService {
  private firestore = inject(Firestore);
  private col = collection(this.firestore, 'contributions');

  list$(): Observable<Contribution[]> {
    const q = query(this.col, orderBy('dueDate', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Contribution[]>;
  }

  async create(contribution: Omit<Contribution, 'id'>) {
    await addDoc(this.col, contribution as any);
  }

  async update(id: string, data: Partial<Contribution>) {
    await updateDoc(doc(this.firestore, 'contributions', id), data as any);
  }

  async remove(id: string) {
    await deleteDoc(doc(this.firestore, 'contributions', id));
  }
}
