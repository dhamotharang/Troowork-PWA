import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../service/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-welcome',
  templateUrl: './admin-welcome.component.html',
  styleUrls: ['./admin-welcome.component.scss']
})
export class AdminWelcomeComponent implements OnInit {
  empName: String;
  updateList;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  Message;

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

  constructor(private loginService: LoginService, private router: Router) { }

  callCreateWO() {
    this.router.navigateByUrl('/CreateWorkOrder')
  }
  callCreateInspection() {
    this.router.navigateByUrl('/InspectionCreate')
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

    this.loginService
      .getUpdateList(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.updateList = data;
      });

    this.loginService.getMaintenanceUpdateMsg(this.employeekey, this.OrganizationID).subscribe((data: any[]) => {

      if (data.length > 0)
        this.Message = data[0].Message;
    });

  }
}
