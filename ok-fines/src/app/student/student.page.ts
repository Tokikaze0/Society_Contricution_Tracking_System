import { Component } from '@angular/core';
import { PaymentService } from '../services/payment.service';
import { AuthService } from '../services/auth.service';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-student',
  templateUrl: './student.page.html',
  standalone: false,
})
export class StudentPage {
  payments$ = this.authService.appUser$.pipe(
    switchMap(u => this.paymentService.getPaymentsByStudent$(u?.studentId || ''))
  );

  constructor(private paymentService: PaymentService, private authService: AuthService) {}
}
