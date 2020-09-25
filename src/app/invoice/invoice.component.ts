import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppComponent } from '../app.component';
import { AppService } from '../app.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit {

  record;
  search = '';
  delConfirm = false;

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

    this.app.loadInvoices();
  }

  deleteConfirm(data) {
    this.record = JSON.parse(JSON.stringify(data));
    this.delConfirm = true
  }

  del() {
    this.service.deleteInvoice(this.record).subscribe(data => {
      this.app.loadInvoices();
      this.app.showSuccess("Deleted Sucessfully...");
      this.delConfirm = false;
    },
      error => {
        this.app.showError(error);
      });
  }

}
