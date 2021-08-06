import { Component, OnInit } from '@angular/core';
import { PeopleServiceService } from "../../../service/people-service.service";
import { DatepickerOptions } from 'ng2-datepicker';
import { Router, ActivatedRoute } from "@angular/router";

import { DataServiceTokenStorageService } from '../../../service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../dialog/alertdialog/alertdialog.component';
@Component({
  selector: 'app-pto-request-details',
  templateUrl: './pto-request-details.component.html',
  styleUrls: ['./pto-request-details.component.scss']
})
export class PtoRequestDetailsComponent implements OnInit {

  ////////Author :  Aswathy//////

  role: String;
  name: String;
  toServeremployeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  requestdetails;
  editflag;
  ptorequestID$;
  checkFlag;

  startTime;
  EndTime;

  ApprovedStartTime;
  ApprovedEndTime

  options: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2030,
    displayFormat: 'MM/DD/YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    //locale: frLocale,
    //minDate: new Date(Date.now()), // Minimal selectable date
    //maxDate: new Date(Date.now()),  // Maximal selectable date
    // barTitleIfEmpty: 'Click to select a date',
    // placeholder: 'Click to select a date', // HTML input placeholder attribute (default: '')
    addClass: 'form-control', // Optional, value to pass on to [ngClass] on the input field
    addStyle: { 'font-size': '18px', 'width': '75%', 'border': '1px solid #ced4da', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };

  convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(- 2),
      day = ("0" + date.getDate()).slice(- 2);
    return [date.getFullYear(), mnth, day].join("-");
  };

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

  constructor(public PeopleServiceService: PeopleServiceService, private router: Router, private route: ActivatedRoute, private dst: DataServiceTokenStorageService, private dialog: MatDialog) {
    this.route.params.subscribe(params => this.ptorequestID$ = params.requestID);
  }
  //Function to go back to previous page
  goBack() {
    // this.router.navigate(['/EmployeeDashboard', { outlets: { EmployeeOut: ['ViewPtoRequest'] } }]);

    // if (this.role == 'Employee' && this.IsSupervisor == 0) {
    if (this.role == 'Employee') {
      this.router.navigate(['/EmployeeDashboard', { outlets: { EmployeeOut: ['ViewPtoRequest'] } }]);
      // } else if (this.role == 'Employee' && this.IsSupervisor == 1) {
    } else if (this.role == 'Supervisor') {
      this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['ViewPtoRequest'] } }]);
    }
  }
  //Function to cancel the pto request which is approved
  cancelPTO() {
    this.checkFlag = true;
    this.PeopleServiceService.cancelPTObyEmployee(this.ptorequestID$, this.toServeremployeekey, this.OrganizationID, this.convert_DT(new Date())).subscribe((data) => {
      this.checkFlag = false;
      // alert("Request successfully cancelled by employee");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Request successfully cancelled by employee',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (this.role == 'Employee') {
          this.router.navigate(['/EmployeeDashboard', { outlets: { EmployeeOut: ['ViewPtoRequest'] } }]);
        } else if (this.role == 'Supervisor') {
          this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['ViewPtoRequest'] } }]);
        }
      });
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
    this.editflag = false;
    this.checkFlag = false;
    // Call to get the details of the pto request which is selected.
    this.PeopleServiceService.getRequestInfoforEmployeeWithTime(this.ptorequestID$).subscribe((data) => {
      this.requestdetails = data[0];
      var cur_time = new Date(Date.now());
      var startTime = this.requestdetails.StartTime;
      var EndTime = this.requestdetails.EndTime;
      var test1 = startTime.split(":");
      var test2 = EndTime.split(":");
      var start = new Date(cur_time.getFullYear(), cur_time.getMonth(), cur_time.getDate(), test1[0], test1[1], 0);
      var end = new Date(cur_time.getFullYear(), cur_time.getMonth(), cur_time.getDate(), test2[0], test2[1], 0);
      this.startTime = start;
      this.EndTime = end;

      var ApprovedStartTime = this.requestdetails.ApprovedStartTime;
      var ApprovedEndTime = this.requestdetails.ApprovedEndTime;
      var test3 = ApprovedStartTime.split(":");
      var test4 = ApprovedEndTime.split(":");
      var start1 = new Date(cur_time.getFullYear(), cur_time.getMonth(), cur_time.getDate(), test3[0], test3[1], 0);
      var end1 = new Date(cur_time.getFullYear(), cur_time.getMonth(), cur_time.getDate(), test4[0], test4[1], 0);
      this.ApprovedStartTime = start1;
      this.ApprovedEndTime = end1;

    });
  }
}
