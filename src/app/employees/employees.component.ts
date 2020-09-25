import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { AppService } from '../app.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  user;
  addUser = {
    first_name: '',
    last_name: '',
    username: '',
    password: '',
    title: '',
    email: '',
    phone: '',
    phone1: ''
  }
  isEdit = false;
  isAdd = false;
  delConfirm = false;
  userDialogTitle = ''

  constructor(private router: Router, public app: AppComponent, private route: ActivatedRoute, private service: AppService) {
    if (!localStorage.getItem("smartUser")) {
      this.router.navigate(['./login']);
    } else {
      let tempp = JSON.parse(localStorage.getItem("smartUser"));
      this.app.user = tempp;
    }
  }

  ngOnInit(): void {
    this.route.data
      .subscribe((data: { data }) => {
        this.app.data = data.data;
      });
    this.app.loadEmployees();
    this.user = JSON.parse(JSON.stringify(this.app.user));
  }

  edit(data) {
    this.userDialogTitle = 'Edit Employee';
    this.user = JSON.parse(JSON.stringify(data));
    this.isEdit = true;
  }

  save() {
    if (this.userDialogTitle == 'Edit Employee') {
      this.service.saveUser(this.user).subscribe(data => {
        this.app.loadEmployees();
        this.app.showSuccess("Saved Sucessfully...");
        this.isEdit = false;
      },
        error => {
          this.app.showError(error);
        });
    } else {
      this.service.insertUser(this.user).subscribe(data => {
        this.app.loadEmployees();
        this.app.showSuccess("Added Employee Sucessfully...");
        this.isEdit = false;
      },
        error => {
          this.app.showError(error);
        });
    }

  }

  deleteConfirm(data) {
    this.user = JSON.parse(JSON.stringify(data));
    this.delConfirm = true
  }

  del() {
    this.service.deleteUser(this.user).subscribe(data => {
      this.app.loadEmployees();
      this.app.showSuccess("Deleted Sucessfully...");
      this.delConfirm = false;
    },
      error => {
        this.app.showError(error);
      });
  }
}
