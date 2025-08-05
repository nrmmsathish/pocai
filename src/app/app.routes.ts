import { Routes } from '@angular/router';
import { LeadsManagementDashboard } from './leads-management-dashboard/leads-management-dashboard';
import { Dashboard } from './dashboard/dashboard';

export const routes: Routes = [
    { path: 'leads', component: LeadsManagementDashboard },
    { path: 'advisor', component: Dashboard },
    { path: '', component: Dashboard }
];
