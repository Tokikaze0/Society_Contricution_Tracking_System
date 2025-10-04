import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  private auth = inject(Auth);
  private router = inject(Router);
  private firestore = inject(Firestore);

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const allowed: string[] = route.data?.['roles'] || [];
    const user = this.auth.currentUser || (await new Promise((resolve) => onAuthStateChanged(this.auth, resolve)));
    if (!user) {
      this.router.navigateByUrl('/login');
      return false;
    }
    // Anonymous users are students by default
    if (user.isAnonymous) {
      if (!allowed.length || allowed.includes('student')) return true;
      this.router.navigateByUrl('/login');
      return false;
    }
    const snap = await getDoc(doc(this.firestore, `users/${user.uid}`));
    const role = (snap.data() as any)?.role as string | undefined;
    if (!allowed.length) return !!role;
    if (role && allowed.includes(role)) return true;
    this.router.navigateByUrl('/login');
    return false;
  }
}
