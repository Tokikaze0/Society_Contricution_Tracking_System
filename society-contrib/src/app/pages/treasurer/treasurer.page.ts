import { Component, inject, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormArray, FormBuilder, Validators } from '@angular/forms';
import { PaymentsService } from '../../services/payments.service';

@Component({
  selector: 'app-treasurer',
  standalone: true,
  imports: [IonicModule, CommonModule, ReactiveFormsModule],
  template: `
  <ion-header><ion-toolbar><ion-title>Homeroom Treasurer</ion-title></ion-toolbar></ion-header>
  <ion-content class="ion-padding">
    <form [formGroup]="form" (ngSubmit)="submit()">
      <ion-item>
        <ion-input label="Contribution ID" labelPlacement="floating" formControlName="contributionId"></ion-input>
      </ion-item>
      <div formArrayName="students" class="ion-margin-top">
        <div *ngFor="let g of students().controls; index as i" [formGroupName]="i" class="ion-margin-bottom">
          <ion-item>
            <ion-input label="Student ID" labelPlacement="floating" formControlName="studentId"></ion-input>
          </ion-item>
          <ion-item>
            <ion-select label="Status" interface="popover" formControlName="status">
              <ion-select-option value="Paid">Paid</ion-select-option>
              <ion-select-option value="For Verification">For Verification</ion-select-option>
            </ion-select>
          </ion-item>
          <ion-button size="small" color="medium" (click)="remove(i)">Remove</ion-button>
        </div>
      </div>
      <ion-button type="button" (click)="add()">Add Student</ion-button>
      <ion-button type="submit" [disabled]="form.invalid">Submit Paid List</ion-button>
    </form>
  </ion-content>
  `,
})
export class TreasurerPage {
  private fb = inject(FormBuilder);
  private payments = inject(PaymentsService);

  form = this.fb.group({
    contributionId: ['', Validators.required],
    students: this.fb.array([] as any[]),
  });

  students(): FormArray { return this.form.get('students') as FormArray; }

  add() {
    this.students().push(this.fb.group({
      studentId: ['', Validators.required],
      status: ['Paid', Validators.required],
    }));
  }

  remove(i: number) {
    this.students().removeAt(i);
  }

  async submit() {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    const homeroom = 'HOMEROOM_A';
    const payload = (value.students! as Array<any>).map((s) => ({
      id: '' as any,
      studentId: s.studentId!,
      contributionId: value.contributionId!,
      homeroom,
      status: s.status as any,
      datePaid: new Date() as any,
    }));
    await this.payments.submitPayments(payload);
    this.form.reset();
    (this.form.get('students') as FormArray).clear();
  }
}
