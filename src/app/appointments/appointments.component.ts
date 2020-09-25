import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../app.component';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';
import { ThrowStmt } from '@angular/compiler';
import { exit } from 'process';


@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})
export class AppointmentsComponent implements OnInit {

  data;
  record;
  addRecord = {
    date: new Date(),
    time: this.app.times[0],
    first_name: '',
    last_name: '',
    address: '',
    status: 0,
    type: 0,
    technician: 0,
    email: '',
    make:'',
    model:'',
    serial:'',
    phone: '',
    phone1: '',
    comments:''
  }
  isEdit = false;
  isAdd = false;
  delConfirm = false;
  dialogTitle = ''
  search = '';

  constructor(public app: AppComponent, public route: ActivatedRoute, private router: Router, private service: AppService) {
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
        this.data = data.data;
      });
    this.record = this.addRecord;
  }

  changeStatus(data) {
    this.record = JSON.parse(JSON.stringify(data));
    let v = <any>document.getElementById("workStatus");
    this.record.status = v.value;

    this.service.saveWorkorder(this.record).subscribe(data => {
      this.app.loadWorkorders();
      this.app.showSuccess("Updated Sucessfully...");
      this.isEdit = false;
    },
      error => {
        this.app.showError(error);
      });

  }

  changeType(data) {
    this.record = JSON.parse(JSON.stringify(data));
    let p = <any>document.getElementById("workType");
    this.record.type = p.value;

    this.service.saveWorkorder(this.record).subscribe(data => {
      this.app.loadWorkorders();
      this.app.showSuccess("Updated Sucessfully...");
      this.isEdit = false;
    },
      error => {
        this.app.showError(error);
      });
  }

  changeTechnician(data) {
    this.record = JSON.parse(JSON.stringify(data));
    let t = <any>document.getElementById("technician");
    this.record.technician = t.value;

    this.service.saveWorkorder(this.record).subscribe(data => {
      this.app.loadWorkorders();
      this.app.showSuccess("Updated Sucessfully...");
      this.isEdit = false;
    },
      error => {
        this.app.showError(error);
      });
  }

  edit(data) {
    this.dialogTitle = 'Edit Work Order';
    this.record = JSON.parse(JSON.stringify(data));
    this.isEdit = true;
  }

  save() {
    let t = <any>document.getElementById("technicianS");
    this.record.technician = +t.value;
    let p = <any>document.getElementById("workTypeS");
    this.record.type = +p.value;
    let v = <any>document.getElementById("workStatusS");
    this.record.status = +v.value;
    let time = <any>document.getElementById("visitTime");
    this.record.time = time.value;

    if (this.dialogTitle == 'Edit Work Order') {
      this.service.saveWorkorder(this.record).subscribe(data => {
        this.app.loadWorkorders();
        this.app.showSuccess("Saved Sucessfully...");
        this.isEdit = false;
      },
        error => {
          this.app.showError(error);
        });
    } else {
      this.service.insertWorkorder(this.record).subscribe(data => {
        this.app.loadWorkorders();
        this.app.showSuccess("Added Work Order Sucessfully...");
        this.isEdit = false;
        this.record = JSON.parse(JSON.stringify(this.addRecord));
      },
        error => {
          this.app.showError(error);
        });
    }
  }

  deleteConfirm(data) {
    this.record = JSON.parse(JSON.stringify(data));
    this.delConfirm = true
  }

  del() {
    this.service.deleteWorkorder(this.record).subscribe(data => {
      this.app.loadWorkorders();
      this.app.showSuccess("Deleted Sucessfully...");
      this.delConfirm = false;
    },
      error => {
        this.app.showError(error);
      });
  }
}
