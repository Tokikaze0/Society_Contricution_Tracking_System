import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule) },
  { path: 'admin', canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin'] }, loadChildren: () => import('./admin/admin.module').then(m => m.AdminPageModule) },
  { path: 'treasurer', canActivate: [AuthGuard, RoleGuard], data: { roles: ['treasurer'] }, loadChildren: () => import('./treasurer/treasurer.module').then(m => m.TreasurerPageModule) },
  { path: 'student', canActivate: [AuthGuard, RoleGuard], data: { roles: ['student'] }, loadChildren: () => import('./student/student.module').then(m => m.StudentPageModule) },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
