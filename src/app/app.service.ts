import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
// import 'rxjs/add/operator/toPromise';

@Injectable()
export class AppService {
    private apiUrl: string;

    constructor(private http: HttpClient) {
        this.apiUrl = "https://azaservices.org/api";
        localStorage.getItem('user');
    }

    public getHeader() {
        let authUser = "Pakistan"
        let pw = 'PakistanZindaBaad!';
        let headers = new HttpHeaders();
        headers = headers.append("Authorization", "Basic " + btoa(authUser+":"+pw));        
        headers = headers.append("Content-Type", "application/x-www-form-urlencoded");
        const httpOptions = {
            headers: headers
        };
        return httpOptions;
    }

    getEmployees() {
        const url = this.apiUrl + '/user/get.php';
        return this.http.get(url);
    }

    loadWorkorders() {
        const url = this.apiUrl + '/workOrder/get.php';
        return this.http.get(url);
    }

    loadRepair() {
        const url = this.apiUrl + '/repair/get.php';
        return this.http.get(url);
    }

    loadAppointments() {
        const url = this.apiUrl + '/appointments/get.php';
        return this.http.get(url);
    }

    loadStatus() {
        const url = this.apiUrl + '/status/get.php';
        return this.http.get(url);
    }

    loadInvoices() {
        const url = this.apiUrl + '/invoice/get.php';
        return this.http.get(url);
    }

    loadType() {
        const url = this.apiUrl + '/type/get.php';
        return this.http.get(url);
    }

    login(user: string, pw: string) {
        let usr = { username: user, password: pw };
        const url = this.apiUrl + '/user/login.php'
        return this.http.post(url, usr);
    }

    insertUser(data) {
        const url = this.apiUrl + '/user/create.php'
        return this.http.post(url, data);
    }

    insertWorkorder(data) {
        const url = this.apiUrl + '/workOrder/create.php'
        return this.http.post(url, data);
    }

    insertRepair(data) {
        const url = this.apiUrl + '/repair/create.php'
        return this.http.post(url, data);
    }

    insertAppointment(data) {
        const url = this.apiUrl + '/appointments/create.php'
        return this.http.post(url, data);
    }

    createInvoice(data) {
        const url = this.apiUrl + '/invoice/create.php'
        return this.http.post(url, data);
    }

    emailInvoice(data) {
        const url = this.apiUrl + '/invoice/email.php'
        return this.http.post(url, data);
    }

    saveUser(data) {
        const url = this.apiUrl + '/user/update.php'
        return this.http.post(url, data);
    }

    saveWorkorder(data) {
        const url = this.apiUrl + '/workOrder/update.php'
        return this.http.post(url, data);
    }

    saveRepair(data) {
        const url = this.apiUrl + '/repair/update.php'
        return this.http.post(url, data);
    }

    saveAppointment(data) {
        const url = this.apiUrl + '/appointments/update.php'
        return this.http.post(url, data);
    }

    deleteUser(data) {
        const url = this.apiUrl + '/user/delete.php'
        return this.http.post(url, data);
    }

    deleteInvoice(data) {
        const url = this.apiUrl + '/invoice/delete.php'
        return this.http.post(url, data);
    }

    deleteWorkorder(data) {
        const url = this.apiUrl + '/workOrder/delete.php'
        return this.http.post(url, data);
    }

    deleteRepair(data) {
        const url = this.apiUrl + '/repair/delete.php'
        return this.http.post(url, data);
    }

    deleteAppointment(data) {
        const url = this.apiUrl + '/appointments/delete.php'
        return this.http.post(url, data);
    }

    pdfdata(data) {
        const url = this.apiUrl + '/pdf/get.php'
        return this.http.post(url, {pid:data});
    }
}
