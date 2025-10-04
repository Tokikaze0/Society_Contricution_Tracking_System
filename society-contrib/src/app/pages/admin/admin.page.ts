import { Component, inject } from '@angular/core';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ContributionsService } from '../../services/contributions.service';
import { Contribution } from '../../models/contribution';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  template: `
  <ion-header><ion-toolbar><ion-title>Admin Dashboard</ion-title></ion-toolbar></ion-header>
  <ion-content class="ion-padding">
    <form [formGroup]="form" (ngSubmit)="create()" class="ion-margin-bottom">
      <ion-item>
        <ion-input label="Title" labelPlacement="floating" formControlName="title"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input type="number" label="Amount" labelPlacement="floating" formControlName="amount"></ion-input>
      </ion-item>
      <ion-item>
        <ion-textarea label="Description" labelPlacement="floating" formControlName="description"></ion-textarea>
      </ion-item>
      <ion-item>
        <ion-datetime-button datetime="due"></ion-datetime-button>
        <ion-modal [keepContentsMounted]="true">
          <ng-template>
            <ion-datetime id="due" presentation="date" (ionChange)="setDue($event)"></ion-datetime>
          </ng-template>
        </ion-modal>
      </ion-item>
      <ion-button type="submit" [disabled]="form.invalid">Add Contribution</ion-button>
    </form>

    <ion-list>
      <ion-item *ngFor="let c of contributions$ | async">
        <ion-label>
          <h2>{{ c.title }} - {{ c.amount | currency }}</h2>
          <p>{{ c.description }}</p>
        </ion-label>
        <ion-button fill="clear" (click)="setStatus(c, 'Pending')">Pending</ion-button>
        <ion-button fill="clear" (click)="setStatus(c, 'Ready to Collect')">Ready</ion-button>
        <ion-button fill="clear" (click)="setStatus(c, 'Completed')">Completed</ion-button>
        <ion-button color="danger" fill="clear" (click)="remove(c)">Delete</ion-button>
      </ion-item>
    </ion-list>

    <ion-button expand="block" (click)="exportCsv()">Export Summary (CSV)</ion-button>
  </ion-content>
  `,
})
export class AdminPage {
  private fb = inject(FormBuilder);
  private svc = inject(ContributionsService);
  private toast = inject(ToastController);

  contributions$: Observable<Contribution[]> = this.svc.list$();

  form = this.fb.group({
    title: ['', Validators.required],
    amount: [0, Validators.required],
    description: [''],
    dueDate: [null as unknown as Date | null],
  });

  setDue(ev: CustomEvent) {
    const value = (ev.detail as any).value as string;
    this.form.patchValue({ dueDate: new Date(value) });
  }

  async create() {
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    await this.svc.create({
      title: v.title!,
      amount: Number(v.amount),
      description: v.description || '',
      dueDate: v.dueDate ? (v.dueDate as any) : null,
      status: 'Pending',
      createdBy: 'admin',
      homeroomStatuses: {},
    });
    this.form.reset({ amount: 0 });
    (await this.toast.create({ message: 'Contribution added', duration: 1500 })).present();
  }

  async setStatus(c: Contribution, status: Contribution['status']) {
    await this.svc.update(c.id, { status });
  }

  async remove(c: Contribution) {
    await this.svc.remove(c.id);
  }

  async exportCsv() {
    const sub = this.contributions$.subscribe(async (list) => {
      const rows = [
        ['Title', 'Amount', 'Status'],
        ...list.map((c) => [c.title, String(c.amount), c.status]),
      ];
      const csv = rows.map((r) => r.map((v) => `"${(v || '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'contributions-summary.csv';
      a.click();
      URL.revokeObjectURL(url);
      sub.unsubscribe();
    });
  }
}
