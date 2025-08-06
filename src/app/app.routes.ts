
import { LeadsManagementDashboard } from './leads-management-dashboard/leads-management-dashboard';
import { Dashboard } from './dashboard/dashboard';
import { Routes, provideRouter, withHashLocation } from '@angular/router';

export const routes: Routes = [
    { path: 'leads', component: LeadsManagementDashboard },
    { path: 'advisor', component: Dashboard },
    { path: '', redirectTo: 'advisor', pathMatch: 'full' } // Set default route to advisor
];

export const routerProviders = [
  provideRouter(routes, withHashLocation())
];
