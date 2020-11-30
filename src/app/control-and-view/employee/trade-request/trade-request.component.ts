import { Component, OnInit } from '@angular/core';
import { PeopleServiceService } from '../../../service/people-service.service';
import { DatepickerOptions } from 'ng2-datepicker';
import { Router } from "@angular/router";

@Component({
  selector: 'app-trade-request',
  templateUrl: './trade-request.component.html',
  styleUrls: ['./trade-request.component.scss']
})
export class TradeRequestComponent implements OnInit {

  ////////Author :  Aswathy//////

  role: String;
  name: String;
  toServeremployeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  curr_date;
  startdate;
  enddate;
  comments;
  EmployeeKey;
  EmployeeDetails;
  requestcomments;

  url_base64_decode(str) {
    var output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw 'Illegal base64url string!';
    }
    return window.atob(output);
  }

  convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(- 2),
      day = ("0" + date.getDate()).slice(- 2);
    return [date.getFullYear(), mnth, day].join("-");
  };

  options: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2030,
    displayFormat: 'MM/DD/YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    barTitleIfEmpty: 'Click to select a date',
    placeholder: 'Click to select a date', // HTML input placeholder attribute (default: '')
    addClass: '', // Optional, value to pass on to [ngClass] on the input field
    addStyle: { 'font-size': '18px', 'width': '75%', 'border': '1px solid #ced4da', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };
  constructor(private PeopleServiceService: PeopleServiceService, private router: Router) { }

  submitRequest() {

    // var requestcomment=this.requestcomments.trim();

    if (!(this.startdate)) {
      alert('Start Date is not provided !');
      return;
    }

    if (!(this.enddate)) {
      alert('End Date is not provided !');
      return;
    }

    if (!(this.EmployeeKey)) {
      alert('Employee Name is not provided !');
      return;
    }

    if (!(this.requestcomments)) {
      alert('Comments are not provided !');
      return;
    } else {
      var comments = this.requestcomments.trim();
      if (!(comments)) {
        alert('Comments are not provided !');
        return;
      }
    }

    if (this.convert_DT(this.curr_date) > this.convert_DT(this.startdate)) {
      alert("Start Date can't be less than Today...!");
      return;
    }

    if (this.convert_DT(this.enddate) < this.convert_DT(this.startdate)) {
      alert("End Date can't be less than start date...!");
      return;
    }
    if (this.requestcomments) {
      this.requestcomments = this.requestcomments.trim();
    } else {
      this.requestcomments = "";
    }
    this.PeopleServiceService
      .submitTradeRequest(this.curr_date, this.toServeremployeekey, this.OrganizationID, this.EmployeeKey, this.convert_DT(this.startdate),
        this.convert_DT(this.enddate), this.requestcomments).subscribe((data: any[]) => {
          alert("Trade Request Submitted Successfully");
          if (this.role == 'Employee') {
            this.router.navigate(['/EmployeeDashboard', { outlets: { EmployeeOut: ['ViewTradeRequest'] } }]);
          } else if (this.role == 'Supervisor') {
            this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['ViewTradeRequest'] } }]);
          }
        });
  }

  ngOnInit() {

    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.toServeremployeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;
    this.EmployeeKey = "";
    this.curr_date = this.convert_DT(new Date());

    this.PeopleServiceService.getAllEmployeeNames(this.OrganizationID, this.toServeremployeekey)
      .subscribe((data) => {
        this.EmployeeDetails = data;
      });

  }
}
