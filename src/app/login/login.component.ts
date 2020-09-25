import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;


  constructor(private service: AppService, private router: Router, public app: AppComponent, private formBuilder: FormBuilder, private route: ActivatedRoute) {
    if (localStorage.getItem("smartUser")) {
      this.app.user = JSON.parse(localStorage.getItem("smartUser"));
      this.router.navigate(['./dashboard']);
    }
  }

  ngOnInit() {
    this.route.data
    .subscribe((data: { data }) => {
      this.app.data = data.data;
    });

    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.form.controls; }

  login() {
    this.service.login(this.f.username.value, this.f.password.value).subscribe(data => {
      if(data[0]) {
        localStorage.setItem("smartUser",JSON.stringify(data[0]));
        this.app.user = data[0];
        location.reload();
        // this.router.navigate(['./dashboard']);
      } else {
        this.app.showError("Wrong Username and Password!");
      }
    },
      error => {
        this.app.showError(error);
        this.loading = false;
      });
  }

}
