import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Lessons } from './pages/lessons/lessons';
import { Grades } from './pages/grades/grades';
import { Payments } from './pages/payments/payments';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
  { path: 'lessons', component: Lessons, canActivate: [authGuard] },
  { path: 'grades', component: Grades, canActivate: [authGuard] },
  { path: 'payments', component: Payments, canActivate: [authGuard] },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];