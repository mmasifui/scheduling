import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { AppService } from '../app.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user;

  constructor(private router: Router, private route: ActivatedRoute, public app: AppComponent, private service: AppService) {
    if (!localStorage.getItem("smartUser")) {
      this.router.navigate(['./login']);
    } else {
      let tempp = JSON.parse(localStorage.getItem("smartUser"));
      this.app.user = tempp;
      this.user = tempp;
    }
  }

  ngOnInit() {
    this.route.data
      .subscribe((data: { data }) => {
        this.app.data = data.data;
      });
  }

  save() {
    this.service.saveUser(this.user).subscribe(data => {
      localStorage.setItem("smartUser", JSON.stringify(this.user));
      this.app.showSuccess("Saved Sucessfully...");
    },
      error => {
        this.app.showError(error);
      });
  }

}
