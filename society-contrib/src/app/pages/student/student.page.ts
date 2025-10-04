import { Component, inject, computed } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { PaymentsService } from '../../services/payments.service';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [IonicModule, CommonModule],
  template: `
  <ion-header><ion-toolbar><ion-title>My Contributions</ion-title></ion-toolbar></ion-header>
  <ion-content class="ion-padding">
    <ion-list>
      <ion-item *ngFor="let p of payments | async">
        <ion-label>
          <h2>{{ p.contributionId }}</h2>
          <p>Status: {{ p.status }}</p>
          <p>Date: {{ p.datePaid?.toDate?.() || p.datePaid | date }}</p>
        </ion-label>
      </ion-item>
    </ion-list>
  </ion-content>
  `,
})
export class StudentPage {
  private paymentsSvc = inject(PaymentsService);
  private studentId = localStorage.getItem('studentId') || 'UNKNOWN';
  payments = this.paymentsSvc.listByStudent$(this.studentId);
}
