import { Component, OnInit } from '@angular/core';
import { SchedulingService } from '../../../../service/scheduling.service';
import { Router } from "@angular/router";
import { ReportServiceService } from '../../../../service/report-service.service';

import { Location } from '@angular/common';
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
  constructor(private ReportServiceService: ReportServiceService, private scheduleService: SchedulingService, private router: Router, private _location: Location) { }

  setEmployeeForbatchSchedule(key) {
    this.empKey = key;
  }

  createScheduleName() {

    if (!this.scheduleName && !this.scheduleName.trim()) {
      alert("Please provide a Assignment Name");
      return;
    }
    if (!this.scheduleDescription && !this.scheduleDescription.trim()) {
      alert("Assignment Description is not provided!");
      return;
    }
    if (!this.scheduleName) {
      alert("Assignment Name is not provided !");
      return;
    } if (!this.scheduleDescription) {
      alert("Assignment Description is not provided!");
      return;
    }
    if (!this.empKey) {
      alert("Employee Name is not provided !");
      return;
    }
    if (!this.StartTime) {
      alert("Start Time is not provided !");
      return;
    }
    if (!this.EndTime) {
      alert("End Time is not provided !");
      return;
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
          alert("Assignment Name already present");
        }
        else if (data[0].count == 0) {
          this.scheduleService.addScheduleName(this.scheduleName,this.MasterShiftID, this.empKey, this.scheduleDescription, startTime, endTime, today_DT, this.employeekey, this.OrganizationID)
            .subscribe(res => {
              alert("Assignment Name created successfully.");
              this._location.back()
            });
        }
      });

  }
  ngOnInit() {

    //token starts....
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;

    //token ends
    this.employee_Key = "";
    this.MasterShiftID="0";
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
