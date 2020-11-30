import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../service/login.service';
import { Location } from '@angular/common';
import { Router } from "@angular/router";

@Component({
  selector: 'app-expired-assignments-details',
  templateUrl: './expired-assignments-details.component.html',
  styleUrls: ['./expired-assignments-details.component.scss']
})
export class ExpiredAssignmentsDetailsComponent implements OnInit {
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  expiredList;
  loading;
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

  constructor(private loginService: LoginService, private _location: Location, private router: Router) { }

  ngOnInit() {

    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;

    this.loginService.getExpiredAssignmentList("Detail", this.OrganizationID).subscribe((data: any[]) => {
      this.expiredList = data;
    });
  }

  goBack() {
    this._location.back();
  }
  changeAssignment(BatchScheduleNameKey) {
    this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['editScheduleForReport', BatchScheduleNameKey] } }]);
  }
}
