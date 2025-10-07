import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  standalone: false,
})
export class LoginPage {
  emailForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  studentForm = this.fb.group({
    studentId: ['', [Validators.required]],
  });

  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  async loginEmail(): Promise<void> {
    if (this.emailForm.invalid) return;
    this.loading = true; this.error = null;
    try {
      const { email, password } = this.emailForm.getRawValue();
      await this.auth.loginWithEmail(email!, password!);
      const role = await this.auth.getCurrentRole();
      await this.redirectByRole(role);
    } catch (e: any) {
      this.error = e.message ?? 'Login failed';
    } finally {
      this.loading = false;
    }
  }

  async loginStudent(): Promise<void> {
    if (this.studentForm.invalid) return;
    this.loading = true; this.error = null;
    try {
      const { studentId } = this.studentForm.getRawValue();
      await this.auth.loginStudentWithId(studentId!);
      await this.router.navigateByUrl('/student');
    } catch (e: any) {
      this.error = e.message ?? 'Login failed';
    } finally {
      this.loading = false;
    }
  }

  private async redirectByRole(role: string | null): Promise<void> {
    switch (role) {
      case 'admin':
        await this.router.navigateByUrl('/admin');
        break;
      case 'treasurer':
        await this.router.navigateByUrl('/treasurer');
        break;
      default:
        await this.router.navigateByUrl('/student');
    }
  }
}
