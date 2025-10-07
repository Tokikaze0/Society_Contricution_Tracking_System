import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { user as authUser } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return authUser(this.auth).pipe(
      map(u => (u ? true : this.router.parseUrl('/login')))
    );
  }
}
