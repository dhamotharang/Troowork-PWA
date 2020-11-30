import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SchedulingService } from '../../../../service/scheduling.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-master-shifts',
  templateUrl: './create-master-shifts.component.html',
  styleUrls: ['./create-master-shifts.component.scss']
})
export class CreateMasterShiftsComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;

  ShiftName;

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
  constructor(private router: Router, private scheduleServ: SchedulingService, private _location: Location) { }

  addShift(newshiftName) {
    if (!(newshiftName) || !(newshiftName.trim())) {
      alert("Please Enter Shift Name!");
      return;
    }

    newshiftName = newshiftName.trim();
    this.scheduleServ.checkNewShift(newshiftName, this.OrganizationID).subscribe((data: any[]) => {
      if (data[0].count > 0) {
        alert("Shift name already present !");
        return;
      }
      else {
        this.scheduleServ.createMasterShifts(newshiftName, this.employeekey, this.OrganizationID)
          .subscribe((data: any[]) => {
            alert("Shift created successfully");
            this._location.back();
          });
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
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;

  }

  goBack() {
    this._location.back();
  }

}
