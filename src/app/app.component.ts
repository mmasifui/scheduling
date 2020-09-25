import { Component } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { AppService } from './app.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  user;
  data;
  employees = [];
  workOrders = [];
  appointments = [];
  repair = [];
  status = [];
  type = [];
  invoices = [];
  invoiceTitle;
  isInvoice = false;
  tempInvoice;
  tempItems = [];
  testTB = [];
  times = ["8am-12pm", "12pm-4pm", "4pm-8pm"];

  constructor(private messageService: MessageService, private router: Router, private service: AppService) {
    this.loadStatus();
    this.loadType();
    this.loadEmployees();
  }

  openInvoice(data) {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let today = month + "/" + date + "/" + year;

    if (data) {
      this.tempInvoice = {
        user_id: this.user.id,
        order_id: data.id,
        order_receiver_name: data.first_name + ', ' + data.last_name,
        order_receiver_address: data.address,
        order_receiver_email: data.email,
        order_total_before_tax: 0,
        order_tax_per: 5.3,
        order_total_tax: 0,
        order_total_after_tax: 0,
        order_amount_paid: 0,
        order_total_amount_due: 0,
        notes: '',
        date: today,
        items: []
      }
    } else {
      this.tempInvoice = {
        user_id: this.user.id,
        order_receiver_name: '',
        order_receiver_address: '',
        order_receiver_email: '',
        order_total_before_tax: 0,
        order_tax_per: 5.3,
        order_total_tax: 0,
        order_total_after_tax: 0,
        order_amount_paid: 0,
        order_total_amount_due: 0,
        notes: '',
        date: today,
        items: []
      }
    }
    this.tempItems = [
      {
        order_id: 0,
        item_code: '',
        item_name: '',
        order_item_quantity: 1,
        order_item_price: 0,
        order_item_final_amount: 0
      }
    ];
    this.isInvoice = true;
  }

  editInvoice(data) {
    this.invoiceTitle = 'Edit Invoice'
    this.tempInvoice = data;
    this.tempItems = data.items;
    this.isInvoice = true;
  }

  emailInvoice() {
    this.tempInvoice.items = this.tempItems;
    let randomNumber = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.tempInvoice.sid = randomNumber;
    this.tempInvoice.myname = this.user.first_name + ',' + this.user.last_name;
    this.tempInvoice.myaddress = this.user.address;
    this.tempInvoice.myphone = this.user.phone;
    this.tempInvoice.myemail = this.user.email;

    this.service.emailInvoice(this.tempInvoice).subscribe(data => {
      this.showSuccess("Invoice Emailed Successully...");
      this.loadInvoices();
      this.isInvoice = false;
    },
      error => {
        this.showError(JSON.stringify(error));
      });
  }

  createInvoice() {
    this.tempInvoice.items = this.tempItems;
    let randomNumber = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.tempInvoice.sid = randomNumber;
    this.tempInvoice.myname = this.user.first_name + ',' + this.user.last_name;
    this.tempInvoice.myaddress = this.user.address;
    this.tempInvoice.myphone = this.user.phone;
    this.tempInvoice.myemail = this.user.email;

    this.service.createInvoice(this.tempInvoice).subscribe(data => {
      this.showSuccess("Invoice Saved Successully...");
      this.loadInvoices();
      this.isInvoice = false;
    },
      error => {
        this.showError(JSON.stringify(error));
      });
  }

  subTotalChanged() {
    console.log("subtotalchnaged");
    this.tempInvoice.order_total_tax = parseFloat('' + ((+this.tempInvoice.order_total_before_tax / 100) * +this.tempInvoice.order_tax_per)).toFixed(2);
    this.tempInvoice.order_total_after_tax = parseFloat('' + (+this.tempInvoice.order_total_tax + +this.tempInvoice.order_total_before_tax)).toFixed(2);
    this.tempInvoice.order_total_amount_due = parseFloat('' + (+this.tempInvoice.order_total_after_tax - +this.tempInvoice.order_amount_paid)).toFixed(2);
  }

  itemChanged() {
    let itemsTotal = 0;
    for (let i in this.tempItems) {
      this.tempItems[i].order_item_final_amount = +this.tempItems[i].order_item_quantity * +this.tempItems[i].order_item_price
      itemsTotal = +itemsTotal + +this.tempItems[i].order_item_final_amount;
    }
    this.tempInvoice.order_total_before_tax = parseFloat('' + (itemsTotal)).toFixed(2);

    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let today = month + "/" + date + "/" + year;

    this.tempInvoice.date = today;

    this.subTotalChanged();
  }

  addItemRow() {
    let item = {
      order_id: 0,
      item_code: '',
      item_name: '',
      order_item_quantity: 1,
      order_item_price: 0,
      order_item_final_amount: 0
    };
    this.tempItems.push(item);
  }

  delItemRow(ii) {
    let temp = []
    for (let i in this.tempItems) {
      if (+i !== ii)
        temp.push(this.tempItems[i])
    }
    this.tempItems = temp;
    this.itemChanged();
  }

  loadEmployees() {
    this.service.getEmployees().subscribe(data => {
      this.employees = <any>data;
    },
      error => {
        this.showError(JSON.stringify(error));
      });
  }

  loadStatus() {
    this.service.loadStatus().subscribe(data => {
      this.status = <any>data;
    },
      error => {
        this.showError(JSON.stringify(error));
      });
  }

  loadInvoices() {
    this.service.loadInvoices().subscribe(data => {
      this.invoices = <any>data;
    },
      error => {
        this.showError(JSON.stringify(error));
      });
  }

  loadType() {
    this.service.loadType().subscribe(data => {
      this.type = <any>data;
    },
      error => {
        this.showError(JSON.stringify(error));
      });
  }

  loadWorkorders() {
    this.service.loadWorkorders().subscribe(data => {
      if (this.user.title === 'Admin')
        this.workOrders = <any>data;
      else
        this.workOrders = this.getMyData(data);

      let repairRecords = [];
      let appointmentRecords = [];

      let d = new Date();
      let currentHour = d.getHours();

      for (let wo of this.workOrders) {
        let recHour = 0;
        if(wo.time == "8am-12pm")
          recHour = 12;
        else if(wo.time == "12pm-4pm")
          recHour = 16;
        else if(wo.time == "4pm-8pm")
          recHour = 20;

        let recDate = new Date(wo.date);

        if(wo.statusStr == 'Appointment' && ((recDate > d) || (d == recDate && currentHour > recHour))) {
          appointmentRecords.push(wo);
        }
        if(wo.statusStr == 'Repair Appointment' && ((recDate > d) || (d == recDate && currentHour > recHour))) {
          repairRecords.push(wo);
        }
      }
      this.repair = repairRecords;
      this.appointments = appointmentRecords;
    },
      error => {
        this.showError(JSON.stringify(error));
      });
  }

  getMyData(data) {
    let tempData = [];
    for (let d of data) {
      if (d.technician == this.user.id)
        tempData.push(d);
    }
    return tempData;
  }

  logout() {
    localStorage.removeItem("smartUser");
    location.reload();
  }

  showSuccess(msg) {
    this.messageService.add({ severity: 'success', summary: 'Success Message', detail: msg });
  }

  showInfo(msg) {
    this.messageService.add({ severity: 'info', summary: 'Info Message', detail: msg });
  }

  showWarn(msg) {
    this.messageService.add({ severity: 'warn', summary: 'Warn Message', detail: msg });
  }

  showError(msg) {
    this.messageService.add({ severity: 'error', summary: 'Error Message', detail: msg });
  }

  printInvoice(invoice, items) {
    let itemss = [
      [
        { text: 'Item #' },
        { text: 'Item Name' },
        { text: 'Quantity' },
        { text: 'Price' },
        { text: 'Total' }
      ]
    ];
    for (let i of items) {
      let im = [
        { text: i.item_code + '', fontSize: 11 },
        { text: i.item_name + '', fontSize: 11 },
        { text: i.order_item_quantity + '', fontSize: 11 },
        { text: i.order_item_price + '', fontSize: 11 },
        { text: i.order_item_final_amount + '', fontSize: 11 }
      ];

      itemss.push(im);
    }

    console.log(JSON.stringify(itemss));

    let contents = [
      {
        image: 'data:image/jpeg;base64,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cFJlY3RMZWZ0bG9uZwAAAAAAAAANY3JvcFJlY3RSaWdodGxvbmcAAAAAAAAAC2Nyb3BSZWN0VG9wbG9uZwAAAAAAOEJJTQPtAAAAAAAQAEgAAAABAAEASAAAAAEAAThCSU0EJgAAAAAADgAAAAAAAAAAAAA/gAAAOEJJTQPyAAAAAAAKAAD///////8AADhCSU0EDQAAAAAABAAAAFo4QklNBBkAAAAAAAQAAAAeOEJJTQPzAAAAAAAJAAAAAAAAAAABADhCSU0nEAAAAAAACgABAAAAAAAAAAE4QklNA/UAAAAAAEgAL2ZmAAEAbGZmAAYAAAAAAAEAL2ZmAAEAoZmaAAYAAAAAAAEAMgAAAAEAWgAAAAYAAAAAAAEANQAAAAEALQAAAAYAAAAAAAE4QklNA/gAAAAAAHAAAP////////////////////////////8D6AAAAAD/////////////////////////////A+gAAAAA/////////////////////////////wPoAAAAAP////////////////////////////8D6AAAOEJJTQQIAAAAAAAQAAAAAQAAAkAAAAJAAAAAADhCSU0EHgAAAAAABAAAAAA4QklNBBoAAAAAAz0AAAAGAAAAAAAAAAAAAAA/AAAA+gAAAAQAbABvAGcAbwAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAA+gAAAD8AAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAQAAAAAAAG51bGwAAAACAAAABmJvdW5kc09iamMAAAABAAAAAAAAUmN0MQAAAAQAAAAAVG9wIGxvbmcAAAAAAAAAAExlZnRsb25nAAAAAAAAAABCdG9tbG9uZwAAAD8AAAAAUmdodGxvbmcAAAD6AAAABnNsaWNlc1ZsTHMAAAABT2JqYwAAAAEAAAAAAAVzbGljZQAAABIAAAAHc2xpY2VJRGxvbmcAAAAAAAAAB2dyb3VwSURsb25nAAAAAAAAAAZvcmlnaW5lbnVtAAAADEVTbGljZU9yaWdpbgAAAA1hdXRvR2VuZXJhdGVkAAAAAFR5cGVlbnVtAAAACkVTbGljZVR5cGUAAAAASW1nIAAAAAZib3VuZHNPYmpjAAAAAQAAAAAAAFJjdDEAAAAEAAAA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dGU9IjIwMjAtMDQtMTdUMTM6Mjk6NTUrMDU6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDktMThUMTQ6MTA6MzMtMDQ6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIwLTA5LTE4VDE0OjEwOjMzLTA0OjAwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkU5Rjg4NTNFREFGOUVBMTFCQzlCRDU3RkI1MjVGQjg3IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6OTFkM2M0NzEtODA4NS0xMWVhLWI5NzctOTc0NjJjMTA1YTIxIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6Zjk2MzY2NTYtOTQxYi1lYTQ0LWExNTUtZGQ5ODNjMTAxM2NmIiBkYzpmb3JtYXQ9ImltYWdlL2pwZWciIHBob3Rvc2hvcDpMZWdhY3lJUFRDRGlnZXN0PSIwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMSIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmOTYzNjY1Ni05NDFiLWVhNDQtYTE1NS1kZDk4M2MxMDEzY2YiIHN0RXZ0OndoZW49IjIwMjAtMDQtMTdUMTM6Mjk6NTUrMDU6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZDc5YTFiNjItNzdkYy05OTQxLTk2MjUtNjE1MTk4MGQzZGRlIiBzdEV2dDp3aGVuPSIyMDIwLTA0LTE3VDEzOjI5OjU1KzA1OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOkU5Rjg4NTNFREFGOUVBMTFCQzlCRDU3RkI1MjVGQjg3IiBzdEV2dDp3aGVuPSIyMDIwLTA5LTE4VDE0OjEwOjMzLTA0OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPD94cGFja2V0IGVuZD0idyI/Pv/iDFhJQ0NfUFJPRklMRQABAQAADEhMaW5vAhAAAG1udHJSR0IgWFlaIAfOAAIACQAGADEAAGFjc3BNU0ZUAAAAAElFQyBzUkdCAAAAAAAAAAAAAAABAAD21gABAAAAANMtSFAgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEWNwcnQAAAFQAAAAM2Rlc2MAAAGEAAAAbHd0cHQAAAHwAAAAFGJrcHQAAAIEAAAAFHJYWVoAAAIYAAAAFGdYWVoAAAIsAAAAFGJYWVoAAAJAAAAAFGRtbmQAAAJUAAAAcGRtZGQAAALEAAAAiHZ1ZWQAAANMAAAAhnZpZXcAAAPUAAAAJGx1bWkAAAP4AAAAFG1lYXMAAAQMAAAAJHRlY2gAAAQwAAAADHJUUkMAAAQ8AAAIDGdUUkMAAAQ8AAAIDGJUUkMAAAQ8AAAIDHRl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+Ln+0fceLx23d2btVMDVViSRQPUyU9RI0LnwhdLMo5A592v3G2SXmDZrC7h25bh4VM6xDxHiospjMU0ysscuuF21Ck0UiioWpVe/Xsjvv3e/cK+9suaOZ9l3PmW0hje5/dstzNDbySDULeV7i1tD46qVZxGskYDrSQmoBlPY46hjr3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6/9Df49+691737r3Rbvlh8isF8Xekt19q5aGHI5KihXF7P2/LM0J3Hu/JLJFhMVqT91aYzKZahl9SU0Tkc29w177e7Vn7Ocg3vMrRpLvUzi3soWIpJcyBiGYalJigjV7iYKwYxRMiHWyVmP2G9oN197/crYeRdukaGzlfxLqcCot7VCPFlOCK5CJUEeIy1FK9ahXYGwO4flRuXc3ePbWUze7dwZd4xkcjV0ciYXCU7qz47bWAp11UmCwFHG5SnpEN9IdpPI7SSHhhzp77bnuvMV9u+97k1zudxOPEmZiSWbWUU07VokbiKNQqKkemJVVNI+hzk3mv279hNk2T2t5CtLax2uAEoiuPGmaoElxMfimmYgF5D/RAIAC9bf8A8SqHE4v4z9HY3CRRQY2g6321RxRQ2MaTU1BHDWjjjV98kmr/AGq/vtx91u8t9w+737S3luVIk2iIuRwMtWE5P9IzeIW/pV6+eH7wN1uF972+6N7ucjNey71cuSeJVnJT8tBWnyp0Yf3PnUPde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3XSgKAovZQANTFjYC3LMSzH/Ekk+/de679+691737r3X//R3+PfuvdVcfzX/wCYVQ/AD4+Jndu0+OzXePaFRktrdObdyMimip62jgpX3FvvNUquKirwGx6TIwSPCg/yqvqaSmZo0naWOJfd73CbkXYoY7An9/XpZIW0qwiCgGSZgxAOnUqoKNWR1ZkaNJKZv/cQ+6PuH3sfdr91bh40Ptrsgiud3njqGMbswhs4noQk12Y5AGOUhinkUM6KjVo/L7cdX2B1/wDy4en+z+z8/UDcnxU3N8h+w96ZR6jcOU3BvKm6327uSTcuVoadY6mupf4rJkSUpkVKWGq0U8SqqRe8FfeLYObve/dfu2+3fL95Xmvd9ntZImuGlaJrne9bosp1khmayEKzMHMSySMquA8bZR+1e67H7F2n36fvCbby5a23KnK3M525YI0KC22yC7uRJHCaYZbeONirUaZ4xqbUS3R3eu9mbUl/lhYTfPW+Y2t2TQ57D0Xbabr2VlIs9hM/ilq/GlXQZKDQ8iY3bsSmogZQ9NPHNHIgdXUBb3x+5bzl7LfdD575P505dS292rHmIbnuag6mhiimFuFWR1UmOKxpMQgC1klda6ixxe5b9+Ng95vvP7TzXs27OvKF8n0Vt4g0NGzpVo5YzmOX6otGysFdWCq2kigET+Vj3JmOwuv+xdlVNBUPgOu90QDbmcMjy0stPuSKoyVZhkdiVQ0FajyRqpNkm5txcd/3bnNPMzcqc5e3W7CWbZNra3uraRh2wG8M6y2ldIwXt/qVqzNrmmrpXRUw+/b7cbfyfzfyhzLFdoN13ixbx4KUcG3KxpMR5+IpCsT5oOOerVPfTLrA7r3v3Xuve/de697917r3v3Xug77e3HlNn9TdobtwckUOa2t13vbceImmhSohiymE21k8nj5JaeQGOeKOrpULI3pYCx4Pv3XutHT+Rd/wpO3Pvbrz5or/ADUPmh1vit47Xxez9xfGur3ztbaex63L1lfhOwxunbuHp9jbXw+P3BBj8ricKyQ1EUlUrVZHkZHAXYFevdEB+Nf88n+dr8lfgd/Mm7w2x8maF9+fETJ/G3tqnq8X011I+QxfU/Ym79+7P7LweIpJ9ny4uTFbe+0xeU8tZBV1kGPpK0mVyY2htqFQdAx9v889e/PqyTO/8KQO7Y/+E6u3/lJjuxsCv8wfJ960PxAqt2w7U2/P9jvjF1M3YeT7MrdmzY2HarVGV6GxayO0VEcbT5zJw/sadMRqfUDHXuuPef8AOa/mDfD3/hPZ8aPkl3B3dSZv+YB88u0MlWdL7ny2zOsaLLbE6Fo8jU7jbfOO2bh9uwbN3BTPsfDYiMSVVA70sm+aQyRl4R71+fXuhs/4TEfzq/lb8z+2flz8Vf5g/Zsu7+2etdoUHcfXGR3B1ztvrrcO3dtbLzh2H3vtLdy7Xwm1cVHNtrOZzbdTR0VRj0ycLz5YySyQxJFTboc4691XLk/5yX8/n+c58h+98N/Jz2u/WvQnRNdHk6GgwEPR+D3Y+zM7U1+J2DX9r9hd+1q7dk3t2DNtfIV9Fg8QaVaSNaiAmsioZq9/U45GOvdbMP8AIP8Alr/NN+S3T3b+3/5oXxn3R1LvXqHduK2nsLuLcmyo+rqvudKU5zB71ocjsGVqYTZjZWf24ryZ/E0sGAy6ZNY6ZEejkef2KCnH/V/q/wBWPdU6/wDCnT+fF80Pgv8AIvZHwr+HGYw/TVfXdUbc7V333TVbd2/ufeOSfd25MxjcDt3Zke8KTK7T29h8fS7TqlyNVUY+rqKh6wLDLSfbs0vqcOvdMf8AJv8A5o/84TuPp3+Y3uL5B94fHHvPrr4nfEDuLs/anaOLz3UG7Ozo+56PYmc3V1nFioelq7+7eb2RQU23qqTKpm8dSTxyGmiWR5WnjXbLpNKg/Z17rX36r/4UCfz3+24M1V4T+YP1XtaHCzUcM6dqT/CrqieskqkkkX+C0fYO19vV+ZhiWA+aWnSWKJnCswYge9AA8WA/b17qzz+ab/Om/nC9Ld4fy+uiui/lN1/t3ePe3wW+JW+d45HZeM+PWb62333t3Rl91YLN7qouzd8YTK7IxuzcxkKGkMOQXIUeEpaUtUPKkIMi2GWpQZPzp/xX8+vdOvwN/nV/zs96fMLtP+Vt3Z2p1T2H8hO2Om+/9u9K9r7bfo7c8nUnyKw3xs3X3R0lnsZvnpTF7x6b33sfIZvbdHjMzSSUVc2PGUlmlmjnx0tDLUihoDXr3RuP5I3/AAol707C+HH8zvdHz07IxnZPdHwy6sl+RXWdblsLtHZG5N7bXq8RlNoVPXrYDauA2pgQu3u2Mft6ijnkjFTNV7yjgdgscdvUOcde6rT6z/nW/wA7LL/yo/ll8+N0/LAeLCfKHof43dMZiPqbpmKpx2frsXm9/wDc5p8evXkWLlp6PblZtekp3qYq1mXJ1mnxSQxv7t26QSM/nnPn/sde6O/8m/8AhTF8uum/5cv8uHaXU0W2uy/5hXy/6hrd+9g77rdn0mXbbWHl7T3h1lsl9s9ZYOGkx2W372NktuTRUaiBqOGShk0000kqpHqgXiKn/P17pYfDf5N/8KvPi78yPjzsD5ofHfsb5RdP/ITcGFp924+fbXTWfxPXOzmr4KXdm6Ze3/j+jbS6d3DtSky6VrUO7KhaTJJS/bU0QkkM8fsZ4HH2de6rD+ef8+v+cdt3+Zb8xPjr0d8wNodT7B6z+Q/cewNh4LduG+NWy9obd2r17ujL4PGUlVvrt/bscc2QqKLGrf7rJSTVNS58SAWVblBq0AgU8z/q/wAA618+jX7o/wCFB38z74tfyldv9h9idp9Id9fKPvr5YdqdW7C732hleneytudR9XbA63633DlqHceP6af/AEfy9o12f3mz4WmqwVixd6iohmZVRquFBNCPy4fzz1vqT/Ik/m3fzpvk38+ug+ley/k50Z8iul+28Rld+dnY7fe4Og6fdWwet9qY6nr91SYPEdYJtrsrb3Zb12coKChxNfi6uCqqXZlijoabI11LorQKdQNf5fb17r6H3uvXuve/de6//9Lf49+6918+T+eJ8kKv5AfzBO08JRZU1uyfj+lD0ZtWlhqKhqKHLbWD1vZNW9I8n20WYHY+UyWOqJURXlgxVMrFhElsBPe7fjvfPu5RrJqtrIC3TFKeHXxAfU+MZKHzUqPLr62f7q/2fi9rvuo8r7zcWJi5g5qlbdrhmVdTxTgCx0sO4xfQrBIqMaLJJMygeIam37p+aPS+D/lTdKfNXeOXWm7u6W+O3bn8u3rLYNTSzU9bu7uTce2dq7ZwG8MRUGNIq3A7Y6pWTN5CpgZVp6ubwFjNGFOcH93h93k/eO9/fYrmyRGGz8jy6b1EUsKWjf4izMxAKrb3pXQVJ8dldDohJbhT/eg7rv8A937cfvS/dcsH1bL7tb5BvUcsEh1w2Nz9XJfBtGowNDM8ixmWitpt0DK91HqLD/wlK+Q/aWD7R7d6DyGVkm+JuU2Tktzbtx26K9P7n7F3xksrSYjCV2Mq62QUeIrN7GsFDU0atGlYZlkKs0Sle6n96N7U+3m9e3PL+8SbVBJzbcO1oqqhE15ZPG4uIZYx8cSIWYMcqQwVh4jBuJnInMG48qe79i1tfmKO/tnlvDq0IrWqxLbXrV7VnSQx2glBVpYmjWUutrD4e4/urJfFT+Vj8Vu5u59yVcnXnSHW0G4O1N/ZernmzWXrsjlaynpKHD4uOQxzZLNZ7MVlHiMLj0K+arqIIFOqQsfn19qPZ7kv2b2W92Pky3nEFzP4ssk8pllcqixxqXIHZFGqogCg8XcvK7u2fnul7t88+8m/WfMXPW5Lc7lb2UVrHpQRosUIoAFFe5jV3Y1LMTwAABdvlX/N46c+P38s/b380rrbrze3yP6A3HjetNwwUeyqvE7Yz+J2t2XnKTatLm9wx7kNsXJt3eGSpcRk6QJLU02QmKMoWOR1lHqMxnrXrP8Awt5+LpU2+DvfoYj8djdd8H/AmjI4HP0+v49+6t2+p/Z/s9dD/hb18X/7Xwb77H1+nZPXp/pb60K/4+/Y692+p/Z/s9bTv8vP5oVHzy+InXny8yPSO+PjjtjtGDO57Z+0e0sljJdwV2wMbkKmhw3Ycz0kNFHRba3hT0Utfi5Zo0WsxTQV0LSUlVTzSe6qegn/AJd/82j4pfzNN1fKja3xuz1XlJ/i12vF1/k62telak7D2jkqKZds9xbIlpXlirNgbu3Bg83RUDs5qTFjEqZo4UrKdW91umK9Hu7tw2T3H0z25t7CUc2RzOe6x39hsRj6cqJ67J5TauWoaCjgLsiCaqqp0RbsBqYXI9+61187P+SL/wAJrqjvHYXzJy/8z74h9/8AXG5NrYXZdH8aaHcea3L1NVZjcVRhex6ndtRQY2hrKKfccVPX0+BQSVSSUSs+hCS0o9+690eD/hLR/K0+TfTWO/mY9Y/PL4r9k9TdXfI7qLrvpqbG9nbfjw1Lv3D1EfbeH7AxWGSrNSMlSQ4Pd8I+7jSSkYzjQ7lWC+691rrYv/hPf/NVrflfhfh7mPjl8jF+OND8o6vbE/ckOAli6hotk5LdWM2luLv/ABmWrawbMH33WmBp8iJS5qJ46eGk0NMFgNqjgPhr17q5b/hQ1/Lw/mXfPD+YD0n8ZPiP8MO2Kv4k/FTpHr7o7oLckWMw21uhVrMvt3Hbs7B3pS74zNTiNsbaoqPHwYjbFUlTUxGR9oxJTwvLNGs/uNDXz/1f6qde6J98bv5Z/wDPK+En82P4/fKrvP4pdodwV+/uyoch8jd9dVUOC7b21uDqXuuty/VXftPuau6xyNLtnF7vl68z+UyFNDVmGOmr/sq90cJb3s5b4hn/AFfLr3Qp9F9Ufzpv+Ey/yM+U+E6F+GeV+XnQPe9Xtnbe3+xcF15vnsvau8qLZ1fvyq6V3fJP1Qz7l2PvPFY3dmWp8zgcjDDDJVVDpG8sP2FbNoAAAnI+3r3W2l/Ib3V/ON3/ANNdqb7/AJs9Di9tS7k3bHX9EbNzmysXszuPE4yvzO7MnvN99YnCSU9Lhdp0s1bjqHbWPrKWPKw0VLI07NG0DPXr3VKv/Cqbof5ld497dJZfan8sw/Kv4udU9b1lZXdvdc027Mz3EdyZzIVkm5ttSV3VmWXe+y9vbdpaelmpYcjh8vh62pqZJxG8semJxACPhB/PP5f6j1rqmr+S3/KN/mJ1u/flx8hsf8ZO6+gum8r8JvmP1zs7bPaFFldsbu7WzHbHVO7drbB6m29jNy4naWb3mH3F9pNLkJcbS0DTUcD3V5I7aZQK1xjGa/t/1V630QXon+Ux8+OvKTcUHdH8kf5R/IWpydTj5dv1tbH3l1g+2YKaOpTIUog2JHHBmEyTzROHqAHhMR0khiB7tUUZan5H/i+tdXDfzHf5Q3zF+aPzf/lS4+i+DfevUvx0zHw7+BXRvei9eUbbix/xjwtFvbcWK7b2nV75zlFkcbj891LsvOmbz5WmkTVGjyQyjUhqanUSc/b/AKq9b6MD/wAJ/P5VPyV/l0fzo+zcN8ivhN2pvXrfbeH7261+PXzWqtk1sXXW0a/FvkTgu1sdl487UbaxGJ7x6jo8hh1YCtzFDWZyDGkU6z5EDZA4jh5f7PXuiBfzsf5Kn8wvZn8y/wCZ2Y+Evxb757K+N3y1nxvY1TlupdsZjde2srB2PubaPb/Y3X+56jH0CY/DxYP5H7KlytFig2ijx9Li5AVQqi6qc549e6u5/mI/yk++OrP+E1Xxd+DPx46O3p2x31tDevTHZvcuyevsZ/evdT9mbyTc+8O5K+KHHIlXnMVtXeu7HxVNOkbvHiaSm1ARxkrrr3VX/wArf5EH8w2r+BP8qn5e/Hbpze8Hy++K/TVLsbuDowwUI7b2rUbI71332n0/vLa+zMs0lDm8pgKvdM8mRxirPXSLNTEQSrHKiX1ElSaY690fv4m/zG/+FN3z++Y3xxxuE+LNN8TukuuMpidrfJut350XurZHU25aI1NG/Yu7twVvbxn3nNuSPFUM0e3MJteq101dUKtQ80Reoh0wpQUof9X+ode6ow+eH8qf+YNlf5q/zW7hyP8AK++RXyd6W3n8nO+t2bepNvYTsHA7W3vt7d+8M7lNp7ow2/OvTLVilNPkIKtRE7LJ6opVRgwTYYFqsK/y690fjeHxI+f9T/JYo/jx05/IyOzqGo+ae7d8di9b9k5bsDsrtWDA0nV+26HbnZuxtrZncG0O36Cu3DmcpW4efKYmu8tBR4JYhDJBkHkp91xQMeNKf7PDj/n611Wh/K//AJWPzs7r/mTfFDtDpT4PfIT4ndV9N/IDqjfvaG8+2/79YLbeyMb1zv2g3jvZ8durf+0tnZrIZDJbYpBjaDBRRZGqqapgk83hknkgqaA0oR1vr61XuvXuve/de6//09/j37r3Xzl9tfHbsv5ZfzW+6et8b1xu7sXC0vz07AXvapwePq3xWzdiz/IrcA7ByO9NwQyUlFtqAYOnr2QyzwVFQ6mOmV5rL7wKvOTty5n9y9xsv3dNLFLub+PpDgrG8zB3ZloYxTV3krRhQHVQdfWLZfeR5I9kvuJ8r74vOtjt+6wchW6bPV4tUl5FtkRtoIonLGZxI0BaNUcrHIHkURB3FSPz576qP5gHzo2t8dfivtyh2v8AHTYfaVT8dPhv1Rg5pF25HS7p7AbE13YVRHVSqKvcvbe7qr+LVtZP/lH2RpKaR2FMrH68PuZe1PKX3TvYtN42+whinispb3cHfLE+HI7xuz6pSsHcgJLZXxAf1aD45Pdv3c5294d/5i94/cjdrvd+bdwt0Kl3IkMEUYSzt41kWFIZJIxGJFKpSZ9Du0cMZXZPoOmtr/F/orbXw0+MghoOrdndh4bIfIjv44mSp3R8me/dl1kdLmMtSKy+Sj6H6hzsM8VFSsNOTrKUoosaiWSFoLrffdfnd/dL3KlabeZrRn2/bdZEW2WMyl0j46Tf3iaC+P01ouNCdco/vCe/X0sO88ncozD6ua6jTcNx0tquZYJGIgt1ZS0e32LMUgIULI7tdN4kk0jGqf8A4Ujfzisv8i+seiv5a3V25K/cMPW8mN3D8qdz47GzUdP2N2NgpTjup9oYtYqt5q7H4/Cuu4MnAYZI5MvXUCI4noJk98s/eDYLbk/n7mfbfDFtBHKZTGzhvBWRFl0O3kU1GtaUWh4Hrqv92/mTePcr2l9vNzkilveYryBLcNHGa3Uschtw8MS62driRBoVasWJUai3R2/+Eh3zk2X231p3x/J4+TeF27vnatXjd29m9ObH7DwmP3Btrc2yc7Oqd59PZXbeXw02Jr6KjzFUu4oqWsaaSo/iGUOgJTi0bxskiCWJgyMAQRkEEYIIxQ4pTB6mO4trm0nuLS7t3iu4XZJEdSroynSyOpAKsrVVgwBBwRXrZo+T3wH/AJHnw+6E7Q+S/fvwK+DWyup+odsVO5915uo+NnUHnlRZYaDEYDCUUm3KcZnde687W02LxGPjbz5HKVkFNFeSVR7t0nrinWhL/KU/lwYT+fN/M77k7u3H0Ttn44fAzYW6Yuw+x+sej8Rjdg7CxGHkkp8Z1N8Y9nVW2aPb322c3ZhcMajcWZxtFSVMtHRZKu14/I5Ghc+68DQg9bRf/CrD+Z9i/g18M9u/A74/ZjGbQ7t+VG0ZttV+L2c+Fxc/UPxQxKttjcctLg6P93bdL2iaSXaOD8dJFTvjKXOGlmgqcfF791sGmfPrSV/lu/IX5K/ySfnJ8P8A5W9o7D3jsLq7vjrXbG9NwYWsp6WU90/CzuLOtjspuTDUVJVyyVJSfaybiwVNUPSTy5LD4+aRRSTo03ut5AzwPX2MNmbx2r2Js/anYGxNw4nduyN9bawW8dm7rwFbBksFubau58XS5vb24cLkaZ5KbIYnNYiuhqaaeNiksMqspII9+6r0pffuvdJ1d3bTbJ0GEXc+3WzOUqM3R4zELmsacnkavbXiO46WgoBU/dVdRt8Tx/epGjNSa18oW49+690ovfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvdf/9Tf49+690jtude7E2cu6Rs/Z+2dqNvfcGX3ZvCXbeExuEn3RurPu0ua3Nn5sbTU0uXz+UlYtPWTmSokP6mNvbVrBb2UrzWtuiSvJrYhQNTVrqbHcfma9Gu777ve/wAG3W29bxc3UFnbLb26yyPIsECiiwwqxIjjXyRAFrmlT18i7szojsj+Tx/NO2lge2to5c4/48/IfaXaOyq6qDxUvZvTmA3/AB5fau88BkYleCtgz23KALKIyz0uQSamlCTROo+jT2737Y/vH+yW8bfyrfxtfbns80UiBwGt5pYmWRJA3w6JG8JmfDahIOySMtinv8G43ex7rtkkJbmG00hkcCMSzwlZYmFCwWG6aNXjcFtMb0YCWOSNdk75HfNHa/xG+L/Z3yX2djtvfJH457mq8hD0LvfD7iieH+9W+shls5tPbG52o6nK5PamdpKzMOu4cLl6CkrYmopKmld45S74Pe4POFlyRt11cc5vcbHz9tkKiSwMTAXkyhYisMmjRIjMgMdxE7IkRIkWqMI+VnJv3ZfcbcveS45X2vbre49v77cSovLom4NhBGhnZZLdZo5ba4MQGuGcIJ56eG8aOk9zptdE9ebs3Xn/APZte4pp6yff+7955bakmWgnWp3jm6Wrcbv3vHHKqJJtzH53JPjKKaNZaefKQVkEZWXHSoOKn3g+dN43mO8s2uy+77rK0ly9TqCFgQoqSQrHC57Y4ynCvX2N/wB1N7G8pbRzhZe5W87Wo5Q5Pto7fa4mq0bXQiaPW/HW1tDT46sZ7iGWhcKx2C/hV/I7/mZdZ/zIP5bfy56O2nWdd7M7VyVF8jN6di5PE+HC9F7RxOcylD2DsvsbH1CySPlO5Opa6E4ugCx1WQl3RJTN9sKOqqoRL7bRbtDyXscW8ZuEiota6vCqfC1V89FKAcE01oa9Y9ffXu/b7cvvM+6O5+3DJ+4574POIyvhC+aNDfeDpAqv1Pia2q1Z/FYNoZOnj+f3/MH7b/nR/wAwPq/+U38C5n3v1N192zUbJpji55IMD3R8i8Oubxm9OxchmUjmWTqHpPb0GThoq+KJ6SSnhy2YSSso5sc8I46xVocr+3/V/q8ut0DoDp/4lfyCf5XE9Nnclhtv9a/HLrWq7C7u7Bp4qHFbg7r7hq8fRQ7gzVJHncrE2U3x2nvM02F2xiJq5mTzY3EU7iOKFR7qv2cOtBn4J/BX5Qf8KZv5hfyo+ZvcuVbYHUmO3DPujdG6czjZs5s3H5eVabH9JfFractCdr1Wcxuzdh0FKmUqqaNatMLjVkrpYMjmaSqmQbnDeXFhdW9hOIrt0Kq5r2VxqFM1Hl6Gh8qET8mbjsWzc1bBu/M+0Pf7BbXUcs1upQeOkbKzREyKyUYYYMjqw7WWjV6uy/nUfyEvmD2f8F6zt7c/yKpPlD3F8Otr7o3ptmkO399U269w9VQhMlvvY+2MS+585gKeTD7cxcNbQUlHjFqauTER0yOGna4M5S5d5r2G4f8Ae3MK31o4NQwl1g8QVLSFFAOKKgqDwFOsgvfX3V9ivcqxH+t37S3HLG4xOrRJHJaNBTtEqyGO2W4k1irLrlIRwvkWrSd/KN/nB0/UHxd3T8ffkZ8/O2PjZR9SZvbkXQbY3bfeHa5zuwNyDPT7l2Vhsbsetn29tOk69zFDBNTvXpGz0uZEFGCtIfC/zPy1vm7TGXZ9/e0qF/FIQDwbSqsq0IANSCdWr5DpJ7Pe7/tfyjs0O2+4vtXb77LA7lHpbxsyMyFBLLJBNNKUrKgQMiCIRADsYkxlL/Ne+SG0cRurFUnz8707KyHZdBU1nQ2ejzu/U2/ujaWLy0Eec33BkNx1VDXYDJ49Xaj/AITNA80NbDURPf7cFsfN0g9xOX9u3q4uuYb1lgmSE/qSsp8RtWtWLArhWXAopOcUr1o5Vk+5v7p88+0HK3LPtJy/B++tvuNxlCW8DyQCCI0s5xEtBVmVyxKtJHpYLlgsn44/zSd67837/Kr+MXVmT7i7L+a2wPmz8ps53NLVgy4jd2wvkPi6rGQUjbphzdTWbmr023kHyVRDJSJFRyYwtPJHJGpMu7mu9bx7IcypsyT3HMVxsF4LcK5Ektw9tKsQVy1Q5lKqGbg2RihPIz3x2nYeVfvP817OLGGy5dseY40aJVCRxQpJHqXSop4ZWrAgHsIODw3Kt49M/LSXZ8tBuE57dqTdOdV4mlpdv4spU4qTG9lvkMzt7JUA3JE25c/jcAzSVEnlgNRA/iLr+OQHOPsT96K65TsrTmXZN73HbDyNZ25ht4tb26Lu0c0NjLEhBub20jFxK7lHcJMgkaia2yT5c9yfu/x8xpdbQLTb2XmPdJWa4lqsok20Rw3Ecn0x+mgknosa6X8NxrCnpU7v69+SWU6p6m2J0zsnO4et2FlNy9s5rJ52OLqyOv3fg9wSTbCwtPjJM3vmauMhaeSoopqpaerj8LtLH9AN19svfbdPaT2j9t/an285g2u25cvL3fp576yt7F5L6O7k+gFvFcX9yReWwWSWFXdklaaCQIBGSpFy7zf7L2PPvuBzV7k8z2tzbbtBbbVDHATuhjtJ7cC+maUQ2QSn6axzJEZIm8RVR+JUe7+it35al+U++9rdZbkwO5977A6nynWuO/ilSuSpdwbloanI9sYihh/ia08WUhrnWKtDKoLraKym3s65j+7dvu92H3oeftj9n9y2/mbdbPlu62aNTMLgHcktLrmeBAJazSCcXMVxFIrOgLxQoqShWJuXvdPl3b5/YjlXfud7K72Pa923WLcpPCXw2t7Z1j2qVz4WoxFAWhIJNDV6kV6TknVXzCx/amdbbz5Ztl7k7M+VG9tp5GsycUEmw87lsH2Pt7ZgqNVUH/u1u1ctjarHXVlpqiJ3/b8gJV7h7T/efj90eZ77lyx3GHlm55g5vuts0Ex/S3txa7nAt34rUFst8Xj+nmdvCmdxJCsbNLJcnCc+fd1u+Q9rG7rbjmWy2Tleyu40jLC+gin264vNPbT6m08K5iuMgyRsq9+ggDF8Tdrdh7b3tuSmbq/c2wNqy9Xbfpcvm941mfGSzfbdEmKTM1NTSV2+Nw4XPLVVtRkJxlaKgpleARxavqrDf7lHJnuLyxzzzzBD7Zbny9y83LUcN1c36X8D3fMUS2QnuBHdX9xBcQyztuE0FxbWsaLBoTTbs8iTxz7/AO+8obzyxssw55sd235d9uGihs0g8OHaXMphVXSyt5oNKLbobWaeQiTXJp4MAyxHXXcKbM7Bx+D677ZxHftdtzd1Nv3suu3amO2xvOeq3d91S0u045M5U0GZyGS2wRHQ1CRUYxyAoCrn3DGye13vevKXuBt/K3tpzhZ/eLnsbpd+3ya9kt7HcVk3JZo4LJGLxX8sm2foLJbG28KUSaFJdZgONw5x9um5l5Ru905w5fuPaaK8tGsdtS0MlzZqtppZroiBZIY47nunjLTfUEhqFR0yyda9lqtW+1Or+4sN8b/727Cq929SZHJlN97jpKDF1se8arDYmXcs1c2JkyaQvUwLVxNkW0vGDp9AYHtL7myWe5S8m+1PPlj91I7ptUu47BK0kW63cdvGw3Nraye4+paOWVJgUjcGZp7KSNolgrYmSc68lMbdd/555cufef8Ad98lpu0cVbG3eSVDZrNKLYJ4oiLiOQxMLcVVz3dwj9Tw9w9Zbw2tnsx1v2/kuspI+0sds3aVItHuDcmzNsZnceErNm47dFJWbiT7RqbH0soRXqJpKdPR9PpK/s5a+9Xs3z9ytznvXthzvfe0SxbxBs2128BvL+w226lt3sLe8hluIkhaIRsxWeYyR91DpIRAbz/J7dc78u77tO3c58uw87g7XJeXbl7e3vLmG3mS8ktXS3OsNIy6iI0WRu7j0CXZHU3y5qNwdmbq2Bjd4RqMX8jI8ft6tylPFR7uwm/995ajoMPSf7kb0eUjwWUiy2Otps9AiqL2UxvzN7R/ejuPcn3Z5l5e5O3mPlmeLfAgkLHxrLcdxuYr2CCETKZJHt7lbxImr4zWqSwJNNHEjydyZ7gfd7i2jknYebb3bifH5eMlwkTF7SewsYnkmf8AT74jPE9pccarOzMaVIXNRsjvDGdk4HJ5brLeu8t9/wCkfqOt2rvJshlU2ptjqXG7b2ZQ7i2//FsPvrC0228niMpJm5crDV0dZDmGP6JBIpUZj2794du9zPbi+5h9rd73P3VS92mW13UrePZWm1WttbqbEXVvuMUNjLGzTxXq3MM0c7vNLpXxGlmCsXM/tfe8l7rZbfzvtm28q/ubdkurMRxG6ud1kuLx7e48Kaxma5jliFklq8U0L2YHxIUIKq+XmO79b5C9Sb265683ju7b3WeMx+UoaPbl5MduXJ5LOVdXuSHK15y9JDgDgaPA49Wp/B5cxSV00CzcBVkz75O2+8lz94L2n5p5G9vd03GHl2CK9sZbaK7mt3lt5pLm9hupINSwC5VLe2a3CJLcQh2MzfoxKRfd5vPaZfaD3B5Y5y5w27b933ueSJ3uMSW0ccCJbGKPwXM/jvPORJ4mm0lgilMfFmEf5RdE9i94dpdd022KqDbu36DrnfCV+7Momanh2vuGq3FsmXF1WIgwG4MMTu1aSGdqVpzPSrHHLqRrgiQ/vU+wXOHv57qe3VrtG2xW+2W2yTSC+uvqRHYzi6iYmM2kqf47RojHFK7QyKsjaWaFHjBnsX7qcm+1/InOM++QPebvLvNkUtIjCpurdbe9EqytPbzf4oXaMShAkpZo6MPOA1H2rTbQ+SPUg2n2nmtzbkze68lsjflRDj4tu5XHnZW1aPHrDuBs3BNQ5DI1uJqNMYhSMTy21AsfYBstt929r5D+8z7Ezck84blzlu257hdWO7tEn0U8ItLGOHXevPGRc3K2xKpBE8QaVY9aOJFjVC55Dn5i9l/cH+sGw22yWVtax3tipkNxFJ9bdPIWt/BYPHGksdW1s2ha0NOiydibI+TnYE+Q3/sfZ3Z2Cko919R1mCwm43p8Tlparr/aNTBuCafDfxadIsXXZeERa2Nqgyg25PvFvmv2/wDvKc+bxvHuNyv7dc2R2Qvtk+mivImguUuNr2qS2luRaTSllSK7j8aNyuiYTpQtIZUSb+T+Z/ZDlKK05S5o5j2O6SSw3ZJ5rcNLEFv7tWt1WbwlJlSJtekZj00rw6CjM9A/J+q27Qxbi2x2HXZCs3F2hnquWOh/vU9NltyYjDz4Z4aCHdmDFJDFk0eOCo8zCm8ZbxuRpMXcw/d9+8PcbFtjc4+1vMlyW3PcZtCQNdO1xNbWhE8qRO2j6q4jYzzEYJkcR3DD6aUf7b7tex0G8XT7PvmzxWcdntkCAv8AShoraWZZgXNrPrJiIZ49A8TVTWvEDdU9UfLmv3ZgM9hKPdmC3Dhsn17uKCqy+cpq3E1mT2r0bS0+Rw2ZqDkXinx+5Nw0LYmrlJsstWxY2Bb3NVt7Lfe6k5/2XfbHYN7j3iwtdmnhnuLh3jbcdv2BFlMjtOoL3DwiylaWUQuZ2tZ3dDIOowh5++73a8v7ttO6XO33W0XMG4W7LDAySpFdb2zRzQr4YKyW9u4uol81iUAZA6SNT1l8ioOu9qyb56y37vXcCdUUGO64wFJX5irg2P2S2/d1Zjccm4GwO9trZPDZrJ4h8YaXMtO8VPBGI2DiMp7Kr/2k959t5J9v7Pnn2v5n3y/FjLDsgEd7cR7Xcyb1eXDSXkFrfQXFrcNbeFNHdSgxrE1vBNBKLeluIYed/ZyXnDfk5W532nbNoO/ySbjO8cKNe7d9Baw24t/HsrqKaGOYXPi2YRWkkYupUuG6ue2+2TbA4Rs1TrSZhsRjWy1Ks5qlpsmaKE19OtS01QahYarWokMjl7X1G9z3G5QO8tynyu3MdsIeYTt1t9VGHaQR3Hgp46CRmdpNMupdbOzNTUWYmp5sbuLJd23QbZMZNuFxJ4TFdJaPW3htpoumq0OnStK0oOHTv7EXRd1//9Xf49+691737r3WsL82vgz/ADFN7d31tb8hen/jD/OQ+CW5eynzNH1ZntmbD+OHzW+K+w8zlMrJkMP8ed+4/NdbbV3VHt3CyY9amXKbrjyG6WxqQtT4955qwn3t77pe8PtBvt3vnIfOF1bLIRWOLwyjLV8tDIojLojKqs4n1FaqICzMZC3jl32J9xditLHeNkm2TmW3tiiXkV1eJJrH0rAPLAJnuLeeeKaSW2A24QIyBp9yEaW/VOn88H/hO58le0d6dPbL/lQ/Bbr/AG98cdl7TOe3RXQ95bNw3Ye+O0N21f29Z/eGHvPfeOzlBhNg7cx9PBSQJk5ImmrqxxFrt7GXuZ73e6PvC9nee43NNxuk1sg8JXSGMrilAI0jWtCaljwxXA6hblP285Y5d3K6u7CZ4r24GmSe5uLu5opKkquoz6E7Q2mJFBIJoWY6rFv5V/8Awmsqeocv1v3F/MN3JtTsbcHV2J2xQdU/GvZNa24OrNoU23IjV41+yM3WYPCUu9q+lzNTLWT4qhpExNVlGmrKyqyjVUy+8YLLkF7/AHNt65muPFnMgfwxQaqAUWShICqaDw42IIWjSMjuh6Cc2fevi2DkW09tfZPapNp2pLbwXuSx8RcUZ7dqRyvNJlmvLhUkUt+lbwyRQzLcz/OS2t/ME7F+DnYXTn8tnbWFru9+4ZIuus1vLJdkYXrHJdY9WZqirV3vuXZWWzL00U29cnQxJh6JoqijqMbHkZshTzpVUlOryf1hHUkknJPr1oXfGD/hMl/P86W7i23uHqvckXxEyGeli2durvLqr5X0G09w7X2JmchQT7jeqk6j3hRb4z+IVcdDUPi6YstbPTwhgukSJ7rYAPFqft628v5knwv/AJmfanV/xv8Ain8X957l3l0h0z1btfDdldt9jd/x4/ub5F9i4DEYzb9LuDtrKZGOHPZl6GDESZWokbISQZbNZaWeop9VDQyLDnuhtXuPvK7fYcmXDwWiVMsqTpFI7GlASCjhVFcKQGLHUvah66T/AHDfcD7lftVb81czfeV2y33rmi7Kw21pd7TJuNtawIdTSIrQz25muHI1SFPFiSFI4mRJrgSWJ/ysvhnvr4SfFzG9ddqdiZ/sHtDd24q/sTfa1258puTbGzM3m6HG0f8AcrYz5FhoxGJpcaj1lUFD5LLTVVRcQvBFEMeRdi3fYNhhtt+3ie93eRjJK8kjSaWYDsQsSdK0zk1YsRggDG/72Xuz7c+73u3uW9+0nt1tfLXt3aRLbWcNnZwWbXCozFru5SBIwZZmYhAygpAkSsok8Qmx6WKKeKWCeKOaCaN4poZUWSKWKRSkkUsbgpJHIhIZSCCDY+xl1jN1q47X/wCElX8t3aXy/p/lLj892Zkdp03aOR7MT4t7p2/0lu748yUuVr6qvqus6naG5OqsmanrCL72SmpaBmNTR0YiWCpSaGOdfdeBpnqy/tP+Rt/Ko7SpKVR8LOk+rsxjMRksNgtzdGbMwnTmYwVPlqmKrraiip9i0OI2/V17zR+metoauRFd1UgOwJHvvL22cw2E+3bjG3gSU1FWKsdPw1I408q1p1I3tV7p82+zfO2z8/8AJc8Kb9ZF9HjRiWJhIuh1dCRqVlwRUHzBHRkPjn/Lv+F3xWqtsbi6c+OXUOB7O2vtCn2NF3lL1vsWTvXNbegp6akal3J2xS7cot4Zk1VNRQxzeSpCSJDGpXSigKtp2q02XbrTbLJSLaFAq1NTRRQEnzNAM9FfuDz1vvuZztzNz9zKYf3/ALtdNcT+Enhx+I/HQlW0L6LU9HT9mXQN697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de697917r3v3Xuve/de6//9bf49+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3Xvfuvde9+691737r3X//2Q==', alignment: 'center'
      },
      {
        columns: [
          {
            width: '45%',
            text: [
              { text: 'From,\n\n', fontSize: 15 },
              { text: this.user.first_name + ', ' + this.user.last_name + '\n', fontSize: 11 },
              { text: this.user.address + '\n', fontSize: 11 },
              { text: this.user.phone + '\n', fontSize: 11 },
              { text: this.user.email + '\n', fontSize: 11 }
            ]
          },
          {
            width: '10%',
            text: [
              { text: " " }
            ]
          },
          {
            width: '45%',
            text: [
              { text: 'To,' + '\n\n', fontSize: 15 },
              { text: invoice.order_receiver_name + '\n', fontSize: 11 },
              { text: invoice.order_receiver_address + '\n', fontSize: 11 },
              { text: invoice.order_receiver_email + '\n', fontSize: 11 }
            ]
          },
        ], margin: [0, 25, 0, 0]
      },
      {
        text: 'Date: ' + invoice.date, fontSize: 11,
        margin: [0, 20, 0, 0]
      },
      {
        text: 'Order #: ' + invoice.order_id, fontSize: 11,
        margin: [0, 20, 0, 0]
      },
      {
        table: {
          headerRows: 1,
          widths: [50, 250, '*', '*', '*'],

          body: itemss
        },
        margin: [0, 20, 0, 10]
      },
      {
        columns: [
          {
            width: '55%',
            text: [
              { text: 'Notes:\n\n', fontSize: 15 },
              { text: invoice.note + '\n', fontSize: 11 },
            ]
          },
          {
            width: '10%',
            text: [
              { text: " " }
            ]
          },
          {
            width: '35%',
            columns: [
              {
                width: '50%',
                text: [
                  { text: 'Subtotal:\n\n', fontSize: 11, alignment: 'right' },
                  { text: 'Tax Rate:\n\n', fontSize: 11, alignment: 'right' },
                  { text: 'Tax Amount:\n\n', fontSize: 11, alignment: 'right' },
                  { text: 'Total:\n\n', fontSize: 11, alignment: 'right' },
                  { text: 'Amount Paid:\n\n\n', fontSize: 11, alignment: 'right' },
                  { text: 'Amount Due:\n\n', fontSize: 13, alignment: 'right', bold: true },
                ]
              },
              {
                width: '50%',
                text: [
                  { text: '$ ' + invoice.order_total_before_tax + '\n\n', fontSize: 11, alignment: 'right' },
                  { text: invoice.order_tax_per + ' %\n\n', fontSize: 11, alignment: 'right' },
                  { text: '$ ' + invoice.order_total_tax + '\n\n', fontSize: 11, alignment: 'right' },
                  { text: '$ ' + invoice.order_total_after_tax + '\n\n', fontSize: 11, alignment: 'right' },
                  { text: '$ ' + invoice.order_amount_paid + '\n\n\n', fontSize: 11, alignment: 'right' },
                  { text: '$ ' + invoice.order_total_amount_due + '\n\n', fontSize: 11, alignment: 'right', bold: true },
                ]
              }]
          },
        ], margin: [0, 20, 0, 0]
      }
    ];

    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    let docDefinition = {
      content: contents
    };
    pdfMake.createPdf(docDefinition).download(invoice.order_receiver_name + invoice.order_id + ".pdf");
    // const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    // pdfDocGenerator.getDataUrl((dataUrl) => {
    //   console.log(dataUrl)
    // });
  }


}
