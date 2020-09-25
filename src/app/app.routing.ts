import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { WorkOrderComponent } from './work-order/work-order.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { RepairAppointmentsComponent } from './repair-appointments/repair-appointments.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { EmployeesComponent } from './employees/employees.component';
import { LoginComponent } from './login/login.component';
import { PdfinvoiceComponent } from './pdfinvoice/pdfinvoice.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'userProfile', component: UserProfileComponent },
  { path: 'workOrder', component: WorkOrderComponent, data: { data: 'data' } },
  { path: 'appointments', component: AppointmentsComponent, data: { data: 'data' } },
  { path: 'repairAppointments', component: RepairAppointmentsComponent, data: { data: 'data' } },
  { path: 'invoice', component: InvoiceComponent, data: { data: 'data' } },
  { path: 'employees', component: EmployeesComponent, data: { data: 'data' } },
  { path: 'login', component: LoginComponent, data: { data: 'login' } },
  { path: 'pdfinvoice/:pid', component: PdfinvoiceComponent, data: { data: 'login' } },

];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
