import { Component } from '@angular/core';
import { ContributionService } from '../services/contribution.service';
import { PaymentService } from '../services/payment.service';
import { Contribution, Payment } from '../models';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  standalone: false,
})
export class AdminPage {
  contributions$ = this.contributions.getContributions$();
  approvals$ = this.payments.getPendingApprovals$();
  statusInputs: Record<string, { homeroom?: string; status?: 'pending' | 'ready' | 'completed' }> = {};

  form = this.fb.group({
    title: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0)]],
    description: [''],
    dueDate: ['']
  });

  constructor(
    private contributions: ContributionService,
    private payments: PaymentService,
    private fb: FormBuilder,
    private auth: AuthService
  ) {}

  async createContribution(): Promise<void> {
    if (this.form.invalid) return;
    const { title, amount, description, dueDate } = this.form.getRawValue();
    await this.contributions.createContribution({
      title: title!,
      amount: Number(amount),
      description: description || undefined,
      dueDate: dueDate || undefined,
      createdBy: ''
    } as any);
    this.form.reset({ amount: 0 });
  }

  async deleteContribution(id: string): Promise<void> {
    // In MVP, delete via update to a status or actual delete if supported
    // For simplicity, perform a real delete through service extension if needed
    // Placeholder: not implemented in service; keep UI button for future
  }

  async applyHomeroomStatus(id: string): Promise<void> {
    const input = this.statusInputs[id];
    if (!input?.homeroom || !input?.status) return;
    await this.contributions.setHomeroomStatus(id, input.homeroom, input.status);
  }

  async approvePayment(p: Payment): Promise<void> {
    const role = await this.auth.getCurrentRole();
    if (role !== 'admin') return;
    await this.payments.approvePayment(p.id);
  }

  async rejectPayment(p: Payment): Promise<void> {
    const role = await this.auth.getCurrentRole();
    if (role !== 'admin') return;
    await this.payments.rejectPayment(p.id);
  }

  exportCsv(rows: any[]): void {
    const csv = [Object.keys(rows[0]).join(','), ...rows.map(r => Object.values(r).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'financial-summary.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  async exportFinancialSummary(): Promise<void> {
    const approvals = await this.approvals$.pipe().toPromise();
    if (!approvals || approvals.length === 0) return;
    this.exportCsv(approvals);
  }
}
