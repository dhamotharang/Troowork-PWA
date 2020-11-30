import { Component, OnInit } from '@angular/core';
import { PeopleServiceService } from '../../../service/people-service.service';
import { DatepickerOptions } from 'ng2-datepicker';
import { Router } from "@angular/router";

@Component({
  selector: 'app-pto-request',
  templateUrl: './pto-request.component.html',
  styleUrls: ['./pto-request.component.scss']
})
export class PtoRequestComponent implements OnInit {

  ////////Author :  Aswathy//////

  role: String;
  name: String;
  toServeremployeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  // curr_date;
  startdate;
  enddate;
  comments;
  ptoreason;

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

  options1: DatepickerOptions = {
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

    if (!(this.startdate)) {
      alert('Start Date is not provided !');
      return;
    }

    if (!(this.enddate)) {
      alert('End Date is not provided !');
      return;
    }
    var timeDiff = Math.abs(this.startdate.getTime() - this.enddate.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays > 365) {
      alert("Dates selected should be in an year");
      return;
    }
    var curr_date = this.convert_DT(new Date());
    if (this.convert_DT(curr_date) > this.convert_DT(this.startdate)) {
      alert("Start Date can't be less than Today...!");
      return;
    }

    if (this.convert_DT(this.enddate) < this.convert_DT(this.startdate)) {
      alert("End Date can't be less than start date...!");
      return;
    }

    var requestcomments;
    if (this.comments) {
      requestcomments = this.comments.trim();
    }
    else {
      requestcomments = "";
    }
    this.PeopleServiceService
      .submitRequest(curr_date, this.toServeremployeekey, this.OrganizationID, this.convert_DT(this.startdate),
        this.convert_DT(this.enddate), requestcomments, this.ptoreason).subscribe((data: any[]) => {
          alert("PTO Request Submitted Successfully");
          // this.router.navigate(['/EmployeeDashboard', { outlets: { EmployeeOut: ['ViewPtoRequest'] } }]);

          // if (this.role == 'Employee' && this.IsSupervisor == 0) {
          if (this.role == 'Employee') {
            this.router.navigate(['/EmployeeDashboard', { outlets: { EmployeeOut: ['ViewPtoRequest'] } }]);
            // } else if (this.role == 'Employee' && this.IsSupervisor == 1) {
          } else if (this.role == 'Supervisor') {
            this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['ViewPtoRequest'] } }]);
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


    var curr_date = this.convert_DT(new Date());

  }
}
