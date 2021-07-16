import { Component, OnInit } from '@angular/core';
import { SchedulingService } from '../../../../service/scheduling.service';
import { Router } from "@angular/router";
import { ReportServiceService } from '../../../../service/report-service.service';

import { Location } from '@angular/common';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';

@Component({
  selector: 'app-create-batch-work',
  templateUrl: './create-batch-work.component.html',
  styleUrls: ['./create-batch-work.component.scss']
})
export class CreateBatchWorkComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  empName: String = null;
  empList;
  empKey: Number;
  scheduleName;
  scheduleDescription;
  employee_Key;
  StartTime;
  EndTime;
  shiftdetails;
  MasterShiftID;
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
  }
  constructor(private ReportServiceService: ReportServiceService, private dst: DataServiceTokenStorageService, private scheduleService: SchedulingService, private router: Router, private _location: Location, private dialog: MatDialog) { }

  setEmployeeForbatchSchedule(key) {
    this.empKey = key;
  }

  createScheduleName() {

    this.checkFlag = true;
    if (!this.scheduleName && !this.scheduleName.trim()) {
      // alert("Please provide a Assignment Name");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please provide a Assignment Name!',
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
    if (!this.scheduleDescription && !this.scheduleDescription.trim()) {
      // alert("Assignment Description is not provided!");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Assignment Description is not provided!!',
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
    if (!this.scheduleName) {
      // alert("Assignment Name is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Assignment Name is not provided !!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
        return;
      });
    } if (!this.scheduleDescription) {
      // alert("Assignment Description is not provided!");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Assignment Description is not provided!!',
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
    if (!this.empKey) {
      // alert("Employee Name is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Employee Name is not provided !!',
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
    if (!this.StartTime) {
      // alert("Start Time is not provided !");
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
    if (!this.EndTime) {
      // alert("End Time is not provided !");
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
    if (this.scheduleName) {
      this.scheduleName = this.scheduleName.trim();
    }
    if (this.scheduleDescription) {
      this.scheduleDescription = this.scheduleDescription.trim();
    }
    var q = this.EndTime.getHours();
    var q1 = this.EndTime.getMinutes();
    var endTime = q + ":" + q1;

    var q2 = this.StartTime.getHours();
    var q3 = this.StartTime.getMinutes();
    var today_DT = this.convert_DT(new Date());
    var startTime = q2 + ":" + q3;
    this.scheduleService
      .checkScheduleName(this.scheduleName, this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        if (data[0].count > 0) {
          // alert("Assignment Name already present");
          const dialogRef = this.dialog.open(AlertdialogComponent, {
            data: {
              message: 'Assignment Name already present!',
              buttonText: {
                cancel: 'Done'
              }
            },
          });
          dialogRef.afterClosed().subscribe(dialogResult => {
            this.checkFlag = false;
          });
        }
        else if (data[0].count == 0) {
          this.scheduleService.addScheduleName(this.scheduleName, this.MasterShiftID, this.empKey, this.scheduleDescription, startTime, endTime, today_DT, this.employeekey, this.OrganizationID)
            .subscribe(res => {
              // alert("Assignment Name created successfully.");
              const dialogRef = this.dialog.open(AlertdialogComponent, {
                data: {
                  message: 'Assignment Name created successfully.',
                  buttonText: {
                    cancel: 'Done'
                  }
                },
              });
              dialogRef.afterClosed().subscribe(dialogResult => {
                this.checkFlag = false;
                this._location.back();
              });
            });
        }
      });

  }
  ngOnInit() {

    //token starts....
    // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.employeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();

    //token ends
    this.checkFlag = false;
    this.employee_Key = "";
    this.MasterShiftID = "0";
    this.scheduleService
      .getAllEmpList(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.empList = data;
      });
    this.ReportServiceService.getShiftNameList(this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
      this.shiftdetails = data;
    });
  }
  goBack() {
    this._location.back();
  }
}
