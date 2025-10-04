import { Component, inject, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Auth, signInWithEmailAndPassword, signInAnonymously } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  template: `
  <ion-header>
    <ion-toolbar>
      <ion-title>Sign In</ion-title>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <form [formGroup]="form" (ngSubmit)="signInAdminTreasurer()">
      <ion-item>
        <ion-input type="email" label="Email" labelPlacement="floating" formControlName="email"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input type="password" label="Password" labelPlacement="floating" formControlName="password"></ion-input>
      </ion-item>
      <ion-button expand="block" type="submit" [disabled]="form.invalid || loading()">Sign in (Admin/Treasurer)</ion-button>
    </form>

    <ion-item class="ion-margin-top">
      <ion-input label="Student ID" labelPlacement="floating" [value]="studentId()" (ionInput)="onStudentId($event)"></ion-input>
    </ion-item>
    <ion-button expand="block" color="secondary" (click)="signInStudent()" [disabled]="loading()">Continue as Student</ion-button>

    <ion-note color="medium" *ngIf="error()">{{ error() }}</ion-note>
  </ion-content>
  `,
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private router = inject(Router);
  private firestore = inject(Firestore);

  loading = signal(false);
  error = signal('');
  studentId = signal('');

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onStudentId(ev: any) {
    const target = ev?.target as HTMLInputElement | undefined;
    this.studentId.set((target?.value ?? '').toString());
  }

  async signInAdminTreasurer() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set('');
    try {
      const { email, password } = this.form.getRawValue();
      const cred = await signInWithEmailAndPassword(this.auth, email!, password!);
      const snap = await getDoc(doc(this.firestore, `users/${cred.user.uid}`));
      const role = (snap.data() as any)?.role as string | undefined;
      if (role === 'admin') this.router.navigateByUrl('/admin');
      else if (role === 'treasurer') this.router.navigateByUrl('/treasurer');
      else this.router.navigateByUrl('/student');
    } catch (e: any) {
      this.error.set(e?.message || 'Sign-in failed');
    } finally {
      this.loading.set(false);
    }
  }

  async signInStudent() {
    if (!this.studentId()) {
      this.error.set('Enter Student ID');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    try {
      await signInAnonymously(this.auth);
      localStorage.setItem('studentId', this.studentId());
      this.router.navigateByUrl('/student');
    } catch (e: any) {
      this.error.set(e?.message || 'Student sign-in failed');
    } finally {
      this.loading.set(false);
    }
  }
}
