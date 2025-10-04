import { Injectable, inject } from '@angular/core';
import { Firestore, doc, docData } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { AppUser } from '../models/user';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private firestore = inject(Firestore);
  private auth = inject(Auth);

  currentUser$(): Observable<AppUser | null> {
    const uid = this.auth.currentUser?.uid;
    if (!uid) return new Observable<AppUser | null>((sub) => sub.next(null));
    const ref = doc(this.firestore, `users/${uid}`);
    return docData(ref, { idField: 'id' }).pipe(map((d) => (d as AppUser) || null));
  }
}
