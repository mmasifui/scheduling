import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(public app: AppComponent, private router: Router) {
    if (!localStorage.getItem("smartUser")) {
      this.router.navigate(['./login']);
    } else {
      let tempp = JSON.parse(localStorage.getItem("smartUser"));
      this.app.user = tempp;
    }
   }

  ngOnInit() {
  }
}

export interface Car {
  vin;
  year;
  brand;
  color;
}