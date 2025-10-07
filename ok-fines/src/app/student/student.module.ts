import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { StudentPage } from './student.page';

const routes: Routes = [
  { path: '', component: StudentPage }
];

@NgModule({
  declarations: [StudentPage],
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)]
})
export class StudentPageModule {}
