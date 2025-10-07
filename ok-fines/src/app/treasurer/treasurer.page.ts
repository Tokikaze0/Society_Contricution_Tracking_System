import { Component } from '@angular/core';
import { ContributionService } from '../services/contribution.service';
import { PaymentService } from '../services/payment.service';
import { AuthService } from '../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-treasurer',
  templateUrl: './treasurer.page.html',
  standalone: false,
})
export class TreasurerPage {
  contributions$ = this.contributions.getContributions$();

  form = this.fb.group({
    contributionId: ['', Validators.required],
    homeroom: ['', Validators.required],
    studentIds: ['', Validators.required],
    amount: ['']
  });

  constructor(
    private contributions: ContributionService,
    private payments: PaymentService,
    private auth: AuthService,
    private fb: FormBuilder
  ) {}

  async submitList(): Promise<void> {
    if (this.form.invalid) return;
    const { contributionId, homeroom, studentIds, amount } = this.form.getRawValue();
    const ids = studentIds!.split(/[,\s]+/).filter(Boolean);
    await this.payments.submitPayments(contributionId!, homeroom!, ids, amount ? Number(amount) : undefined);
    this.form.reset();
  }
}
