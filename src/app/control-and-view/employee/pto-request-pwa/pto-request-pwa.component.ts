import { Component, OnInit } from '@angular/core';
import { PeopleServiceService } from '../../../service/people-service.service';
import { DatepickerOptions } from 'ng2-datepicker';
import { Router } from "@angular/router";
import { ResponsiveService } from 'src/app/service/responsive.service';
import { DatePipe } from '@angular/common';

import { DataServiceTokenStorageService } from '../../../service/DataServiceTokenStorage.service';

@Component({
  selector: 'app-pto-request-pwa',
  templateUrl: './pto-request-pwa.component.html',
  styleUrls: ['./pto-request-pwa.component.scss']
})
export class PtoRequestPWAComponent implements OnInit {

  ////////Author :  Amritha//////

  role: String;
  name: String;
  toServeremployeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  // curr_date;
  startdate;
  enddate;
  starttime = new Date();
  endtime = new Date();
  comments;
  ptoreason;
  isMobile: boolean;
  checkFlag;

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
    addStyle: { 'font-size': '18px', 'width': '100%', 'border': '1px solid #ced4da', 'background-color': 'white', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
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
    addStyle: { 'font-size': '18px', 'width': '100%', 'border': '1px solid #ced4da', 'background-color': 'white', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };

  constructor(private PeopleServiceService: PeopleServiceService, private router: Router, private responsiveService: ResponsiveService, private dst: DataServiceTokenStorageService) {
    this.starttime.setHours(0);
    this.starttime.setMinutes(0);
    this.starttime.setSeconds(0);
    this.endtime.setHours(23);
    this.endtime.setMinutes(59);
    this.endtime.setSeconds(0);
  }

  convert_Time(str) {
    var datePipe = new DatePipe('en-US');
    var setDob = datePipe.transform(str, 'h:mm:ss a');
    return setDob;

  };

  submitRequest() {
    this.checkFlag = true;

    if (!(this.startdate)) {
      alert('Start Date is not provided !');
      this.checkFlag = false;
      return;
    }

    if (!(this.enddate)) {
      alert('End Date is not provided !');
      this.checkFlag = false;
      return;
    }

    if (!(this.starttime)) {
      alert('Start Time is not provided !');
      this.checkFlag = false;
      return;
    }

    if (!(this.endtime)) {
      alert('End Time is not provided !');
      this.checkFlag = false;
      return;
    }
    else {
      var time1 = new Date(this.starttime);
      var time2 = new Date(this.endtime);
      var curTime = new Date();
      var timediff = +time2 - +time1;

      if (timediff < 0) {
        alert("Start Time can't be after End Time");
        this.checkFlag = false;
        return;
      }
    }
    var timeDiff = Math.abs(this.startdate.getTime() - this.enddate.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays > 365) {
      alert("Dates selected should be in an year");
      this.checkFlag = false;
      return;
    }
    var curr_date = this.convert_DT(new Date());
    if (this.convert_DT(curr_date) > this.convert_DT(this.startdate)) {
      alert("Start Date can't be less than Today...!");
      this.checkFlag = false;
      return;
    }

    if (this.convert_DT(this.enddate) < this.convert_DT(this.startdate)) {
      alert("End Date can't be less than start date...!");
      this.checkFlag = false;
      return;
    }

    var requestcomments;
    if (this.comments) {
      requestcomments = this.comments.trim();
    }
    else {
      requestcomments = "";
    }

    var q = this.starttime.getHours();
    var q1 = this.starttime.getMinutes();
    var newTime = q + ":" + q1;

    var q2 = this.endtime.getHours();
    var q3 = this.endtime.getMinutes();
    var newTime1 = q2 + ":" + q3;

    this.PeopleServiceService
      .setPTORequestWithTime(curr_date, this.toServeremployeekey, this.OrganizationID, this.convert_DT(this.startdate),
        this.convert_DT(this.enddate), newTime, newTime1, requestcomments, this.ptoreason).subscribe((data: any[]) => {
          this.checkFlag = false;
          alert("PTO Request Submitted Successfully");
          // this.router.navigate(['/EmployeeDashboard', { outlets: { EmployeeOut: ['ViewPtoRequest'] } }]);

          // if (this.role == 'Employee' && this.IsSupervisor == 0) {
          if (this.role == 'Employee') {
            this.router.navigate(['/EmployeeDashboard', { outlets: { EmployeeOut: ['PtoRequestViewPWA'] } }]);
            // } else if (this.role == 'Employee' && this.IsSupervisor == 1) {
          } else if (this.role == 'Supervisor') {
            this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['PtoRequestViewPWA'] } }]);
          }
        });
  }

  ngOnInit() {

    // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.toServeremployeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();
    this.checkFlag = false;


    var curr_date = this.convert_DT(new Date());
    this.onResize();
    this.responsiveService.checkWidth();
  }
  onResize() {
    this.responsiveService.getMobileStatus().subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }
}
