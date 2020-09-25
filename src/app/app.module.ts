import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { TableModule } from 'primeng/table';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { WorkOrderComponent } from './work-order/work-order.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { RepairAppointmentsComponent } from './repair-appointments/repair-appointments.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { EmployeesComponent } from './employees/employees.component';
import { LoginComponent } from './login/login.component';
import { AppService } from './app.service';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import {KeyFilterModule} from 'primeng/keyfilter';
import { PdfinvoiceComponent } from './pdfinvoice/pdfinvoice.component';
import {CalendarModule} from 'primeng/calendar';
import { filterWorkOrder } from './work-order/filter';
import { filterAppointments } from './appointments/filter';
import { filterRepair } from './repair-appointments/filter';
import { filterInvoices } from './invoice/filter';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    NgbModule,
    ToastrModule.forRoot(),
    CommonModule,
    ReactiveFormsModule,
    TableModule,
    ToastModule,
    ButtonModule,
    DialogModule,
    DropdownModule,
    KeyFilterModule,
    CalendarModule
  ],
  declarations: [
    AppComponent,
    DashboardComponent,
    UserProfileComponent,
    WorkOrderComponent,
    AppointmentsComponent,
    RepairAppointmentsComponent,
    InvoiceComponent,
    EmployeesComponent,
    LoginComponent,
    PdfinvoiceComponent,
    filterWorkOrder,
    filterAppointments,
    filterRepair,
    filterInvoices
  ],
  providers: [AppService,
    MessageService,
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
