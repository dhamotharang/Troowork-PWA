import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../service/login.service';
import { Router } from '@angular/router';
import { ResponsiveService } from 'src/app/service/responsive.service';

import { DataServiceTokenStorageService } from '../../../../service/DataServiceTokenStorage.service';
@Component({
  selector: 'app-supervisor-welcome',
  templateUrl: './supervisor-welcome.component.html',
  styleUrls: ['./supervisor-welcome.component.scss']
})
export class SupervisorWelcomeComponent implements OnInit {
  empName: String;
  updateList;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  Message;
  isMobile: boolean;

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

  constructor(private loginService: LoginService, private router: Router,private responsiveService: ResponsiveService, private dst: DataServiceTokenStorageService) { }

  callCreateWO() {
    
    this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['CreateWorkOrderSuperVisor'] } }]);
  }
  callCreateInspection() {
  
    this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['Createinspectionbysuprvsr'] } }]);
  }
  ngOnInit() {

    // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.employeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();

    this.loginService
      .getUpdateList(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.updateList = data;
      });

    this.loginService
      .getEmpNameForWelcomeMessage(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.empName = data[0].EmpName;
      });
      this.loginService.getMaintenanceUpdateMsg(this.employeekey, this.OrganizationID).subscribe((data: any[])=> {
       
        if (data.length > 0)
        this.Message = data[0].Message;
      });
      this.onResize();
   this.responsiveService.checkWidth();
  }
  onResize() {
    this.responsiveService.getMobileStatus().subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }

}
