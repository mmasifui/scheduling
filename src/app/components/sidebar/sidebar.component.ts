import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'design_app', class: '' },
    { path: '/workOrder', title: 'Work Order',  icon:'business_chart-bar-32', class: '' },
    { path: '/appointments', title: 'Appointments',  icon:'location_map-big', class: '' },
    { path: '/repairAppointments', title: 'Repairs',  icon:'business_chart-pie-36', class: '' },
    { path: '/invoice', title: 'Invoice',  icon:'files_paper', class: '' },
    { path: '/employees', title: 'Employees',  icon:'users_circle-08', class: '' },
];
export const ROUTESN: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'design_app', class: '' },
    { path: '/workOrder', title: 'Work Order',  icon:'business_chart-bar-32', class: '' },
    { path: '/appointments', title: 'Appointments',  icon:'location_map-big', class: '' },
    { path: '/repairAppointments', title: 'Repairs',  icon:'business_chart-pie-36', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor(public app: AppComponent ) { }

  ngOnInit() {
    if(this.app.user.title == 'Admin')
      this.menuItems = ROUTES.filter(menuItem => menuItem);
    else
      this.menuItems = ROUTESN.filter(menuItem => menuItem);
  }
  
  isMobileMenu() {
      if ( window.innerWidth > 991) {
          return false;
      }
      return true;
  };
}
