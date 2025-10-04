import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'student',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login.page').then(m => m.LoginPage)
  },
  { path: 'admin', loadComponent: () => import('./pages/admin/admin.page').then(m => m.AdminPage), canActivate: [RoleGuard], data: { roles: ['admin'] } },
  { path: 'treasurer', loadComponent: () => import('./pages/treasurer/treasurer.page').then(m => m.TreasurerPage), canActivate: [RoleGuard], data: { roles: ['treasurer'] } },
  { path: 'student', loadComponent: () => import('./pages/student/student.page').then(m => m.StudentPage), canActivate: [RoleGuard], data: { roles: ['student'] } },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
