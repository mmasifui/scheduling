import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from '../app.service';

@Component({
  selector: 'app-pdfinvoice',
  templateUrl: './pdfinvoice.component.html',
  styleUrls: ['./pdfinvoice.component.css']
})
export class PdfinvoiceComponent implements OnInit {
  pid;
  url;
  constructor(private route: ActivatedRoute, private service: AppService) { }

  ngOnInit(): void {
    this.pid = this.route.snapshot.paramMap.get("pid")
    this.service.pdfdata(this.pid).subscribe(data => {
      let comingData = <any>data
      this.url = comingData[0].pdfdata;

      // let iframe = "<iframe width='100%' height='100%' src='" +  + "'></iframe>"
      // let x = window.open();
      // x.document.open();
      // x.document.write(iframe);
      // x.document.close();
    },
      error => {
        console.log(error);
      });
  }


}
