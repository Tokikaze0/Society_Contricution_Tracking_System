import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { TreasurerPage } from './treasurer.page';

const routes: Routes = [
  { path: '', component: TreasurerPage }
];

@NgModule({
  declarations: [TreasurerPage],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IonicModule, RouterModule.forChild(routes)]
})
export class TreasurerPageModule {}
