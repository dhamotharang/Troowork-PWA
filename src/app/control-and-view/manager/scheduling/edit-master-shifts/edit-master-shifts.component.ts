import { Component, OnInit } from '@angular/core';
import { SchedulingService } from '../../../../service/scheduling.service';
import { ActivatedRoute } from "@angular/router";

import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-master-shifts',
  templateUrl: './edit-master-shifts.component.html',
  styleUrls: ['./edit-master-shifts.component.scss']
})
export class EditMasterShiftsComponent implements OnInit {
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;

  shiftDetails;
  shiftKey$: Object;
  shftNme;
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

  public convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");

  }
  constructor(private scheduleService: SchedulingService, private route: ActivatedRoute, private _location: Location) {
    this.route.params.subscribe(params => this.shiftKey$ = params.masterShiftID);
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

    this.scheduleService
      .getMasterShiftDetails(this.shiftKey$, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.shiftDetails = data[0];
        this.shftNme = data[0].ShiftName;
      });

  }
  goBack() {
    this._location.back();
  }

  updateShift() {
    if (!(this.shiftDetails.ShiftName) || !(this.shiftDetails.ShiftName.trim())) {
      alert("Shift Name can't be empty.");
      return false;
    }
    this.shiftDetails.ShiftName = this.shiftDetails.ShiftName.trim();
    if (this.shftNme != this.shiftDetails.ShiftName) {
      this.scheduleService
        .checkForDuplicateMasterShiftName(this.shiftKey$, this.shiftDetails.ShiftName, this.OrganizationID)
        .subscribe((data: any[]) => {
          if (data[0].count == 0) {
            this.scheduleService
              .udpateMasterShiftDetails(this.shiftKey$, this.shiftDetails.ShiftName, this.employeekey, this.OrganizationID)
              .subscribe(res => {
                alert("Shift Name updated Successfully");
                this._location.back();
              });
          }
          else {
            alert("Shift Name already present... :(");
            return false;
          }

        });
    } else {
      this.scheduleService
        .udpateMasterShiftDetails(this.shiftKey$, this.shiftDetails.ShiftName, this.employeekey, this.OrganizationID)
        .subscribe(res => {
          this._location.back();
        });
    }
  }
}
