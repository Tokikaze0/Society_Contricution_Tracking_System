import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: any): Observable<boolean | UrlTree> {
    const allowed: string[] = route.data?.roles ?? [];
    return this.authService.appUser$.pipe(
      map(u => {
        if (!u) return this.router.parseUrl('/login');
        if (allowed.length === 0 || allowed.includes(u.role)) return true;
        // Redirect to role home
        switch (u.role) {
          case 'admin':
            return this.router.parseUrl('/admin');
          case 'treasurer':
            return this.router.parseUrl('/treasurer');
          case 'student':
            return this.router.parseUrl('/student');
          default:
            return this.router.parseUrl('/login');
        }
      })
    );
  }
}
