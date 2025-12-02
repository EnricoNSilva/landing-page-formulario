import { Routes } from '@angular/router';
import { LandingPageComponent } from './app';
import { AdminComponent } from './admin/admin';

export const routes: Routes = [
    { path: '', component: LandingPageComponent },
    { path: 'admin', component: AdminComponent }
];
