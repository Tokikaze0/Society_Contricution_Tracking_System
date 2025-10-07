import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword, signInAnonymously, signOut, user as authUser } from '@angular/fire/auth';
import { Firestore, collection, query, where, limit, getDocs, doc, setDoc, docData } from '@angular/fire/firestore';
import { Observable, of, map, switchMap, firstValueFrom } from 'rxjs';
import { AppUser, UserRole } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly firebaseUser$ = authUser(this.auth);
  readonly appUser$: Observable<AppUser | null> = this.firebaseUser$.pipe(
    switchMap(u => {
      if (!u) return of(null);
      const ref = doc(this.firestore, 'users', u.uid);
      return docData(ref, { idField: 'id' }) as Observable<AppUser>;
    })
  );

  constructor(private auth: Auth, private firestore: Firestore, private router: Router) {}

  async loginWithEmail(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async loginStudentWithId(studentId: string): Promise<void> {
    const cred = await signInAnonymously(this.auth);
    // Find the pre-registered student profile by studentId
    const studentsRef = collection(this.firestore, 'users');
    const q = query(studentsRef, where('studentId', '==', studentId), where('role', '==', 'student'), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) {
      throw new Error('Student ID not found');
    }
    const source = snap.docs[0].data() as any;

    // Link anonymous auth uid to this studentId by writing a users/{uid} doc
    const destRef = doc(this.firestore, 'users', cred.user.uid);
    await setDoc(destRef, {
      role: 'student',
      name: source.name ?? null,
      homeroom: source.homeroom ?? null,
      studentId: source.studentId,
    }, { merge: true });
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    await this.router.navigateByUrl('/login');
  }

  isInRole$(allowed: UserRole[]): Observable<boolean> {
    return this.appUser$.pipe(map(u => !!u && allowed.includes(u.role)));
  }

  async getCurrentRole(): Promise<UserRole | null> {
    const u = await firstValueFrom(this.appUser$);
    return u?.role ?? null;
  }
}
