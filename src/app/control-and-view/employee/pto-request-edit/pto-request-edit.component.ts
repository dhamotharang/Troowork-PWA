import { toDate } from '@angular/common/src/i18n/format_date';
import { Component, OnInit } from '@angular/core';
import { PeopleServiceService } from "../../../service/people-service.service";
import { DatepickerOptions } from 'ng2-datepicker';
import { Router, ActivatedRoute } from "@angular/router";
import { DatePipe } from '@angular/common';

import { DataServiceTokenStorageService } from '../../../service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../dialog/alertdialog/alertdialog.component';
import { ConfirmationdialogComponent, ConfirmDialogModel } from '../../dialog/confirmationdialog/confirmationdialog.component';

@Component({
  selector: 'app-pto-request-edit',
  templateUrl: './pto-request-edit.component.html',
  styleUrls: ['./pto-request-edit.component.scss']
})
export class PtoRequestEditComponent implements OnInit {

  ////////Author :  Aswathy//////

  role: String;
  name: String;
  toServeremployeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  requestdetails;
  startTime;
  EndTime;


  // editflag;
  ptorequestID$;
  // curr_date;
  checkFlag;
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
    addClass: '', // Optional, value to pass on to [ngClass] on the input field
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

  convert_Time(str) {
    var datePipe = new DatePipe('en-US');
    var setDob = datePipe.transform(str, 'h:mm:ss a');
    return setDob;

  };

  // Function to update the edited pto request

  submitEditedRequest() {

    this.checkFlag = true;
    if (!(this.requestdetails.StartDate)) {
      // alert('Start Date is not provided !');
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Start Date is not provided !!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
        return;
      });
    }
    if (!(this.requestdetails.EndDate)) {
      // alert('End Date is not provided !');
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'End Date is not provided !!!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
        return;
      });
    }

    if (!(this.startTime)) {
      // alert('Start Time is not provided !');
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Start Time is not provided !!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
        return;
      });
    }
    if (!(this.EndTime)) {
      // alert('End Time is not provided !');
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'End Time is not provided !!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
        return;
      });
    }
    else {
      var time1 = new Date(this.startTime);
      var time2 = new Date(this.EndTime);
      var curTime = new Date();
      var timediff = +time2 - +time1;

      if (timediff < 0) {
        // alert("Start Time can't be after End Time");
        const dialogRef = this.dialog.open(AlertdialogComponent, {
          data: {
            message: "Start Time can't be after End Time",
            buttonText: {
              cancel: 'Done'
            }
          },
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          this.checkFlag = false;
          return;
        });
      }

    }

    // if (!(this.requestdetails.Comments)) {
    //   alert('Comments are not provided !');
    //   return;
    // } else {
    //   var comments1 = this.requestdetails.Comments.trim();
    //   if (!(comments1)) {
    //     alert('Comments are not provided !');
    //     return;
    //   }
    // }


    var curr_date = this.convert_DT(new Date());
    if (this.convert_DT(curr_date) > this.convert_DT(this.requestdetails.StartDate)) {
      // alert("Start Date can't be less than Today...!");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: "Start Date can't be less than Today...!",
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
        return;
      });
    }
    if (this.convert_DT(this.requestdetails.EndDate) < this.convert_DT(this.requestdetails.StartDate)) {
      // alert("End Date can't be less than start date...!");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: "End Date can't be less than start date...!",
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
        return;
      });
    }

    var comments;
    if (this.requestdetails.Comments) {
      comments = this.requestdetails.Comments.trim();
    }
    else {
      comments = "";
    }

    var q = this.startTime.getHours();
    var q1 = this.startTime.getMinutes();
    var newTime = q + ":" + q1;

    var q2 = this.EndTime.getHours();
    var q3 = this.EndTime.getMinutes();
    var newTime1 = q2 + ":" + q3;

    // this.startTime=new Date ('2021-04-02T22:59:20.539Z').toLocaleTimeString();
    // this.EndTime= new Date().toLocaleTimeString();

    this.PeopleServiceService.setEditedRequestWithTime(curr_date, this.ptorequestID$, this.convert_DT(this.requestdetails.StartDate), this.convert_DT(this.requestdetails.EndDate), newTime, newTime1,
      comments, this.requestdetails.Reason, this.toServeremployeekey).subscribe((data) => {
        this.requestdetails = data;
        this.checkFlag = false;
        // alert('PTO Request Updated Successfully');
        const dialogRef = this.dialog.open(AlertdialogComponent, {
          data: {
            message: 'PTO Request Updated Successfully',
            buttonText: {
              cancel: 'Done'
            }
          },
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          // this.router.navigate(['/EmployeeDashboard', { outlets: { EmployeeOut: ['ViewPtoRequest'] } }]);
          // if (this.role == 'Employee' && this.IsSupervisor == 0) {
          if (this.role == 'Employee') {
            this.router.navigate(['/EmployeeDashboard', { outlets: { EmployeeOut: ['ViewPtoRequest'] } }]);
            // } else if (this.role == 'Employee' && this.IsSupervisor == 1) {
          } else if (this.role == 'Supervisor') {
            this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['ViewPtoRequest'] } }]);
          }
        });
      });
  }

  // Function to go back to the previous page

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
    // this.editflag = false;

    // Call to get the pto request details 
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



    });
  }
}

