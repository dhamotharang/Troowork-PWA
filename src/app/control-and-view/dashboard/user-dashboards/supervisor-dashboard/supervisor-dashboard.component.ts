import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../../service/login.service';
import { ResponsiveService } from 'src/app/service/responsive.service';

import { DataServiceTokenStorageService } from '../../../../service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from "@angular/router";
import { ConfirmationdialogComponent, ConfirmDialogModel } from '../../../dialog/confirmationdialog/confirmationdialog.component';
@Component({
  selector: 'app-supervisor-dashboard',
  templateUrl: './supervisor-dashboard.component.html',
  styleUrls: ['./supervisor-dashboard.component.scss']
})
export class SupervisorDashboardComponent implements OnInit {

  empName: String;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  scheduleIcon;
  popup: boolean = false;
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

  constructor(private loginService: LoginService, private responsiveService: ResponsiveService, private dst: DataServiceTokenStorageService, private router: Router, private dialog: MatDialog) { }
  logout() {

    const message = `Are you sure !!  Do you want to exit?`;
    const dialogData = new ConfirmDialogModel("LOGOUT", message);
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.leave();
        this.router.navigateByUrl('/');
        window.sessionStorage.clear();
      } else {
        this.stayhere();
      }
    });

  }
  ngOnInit() {

    // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.dst.setValues();
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.employeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();
    this.scheduleIcon = this.dst.getIsemployeecalendar();

    this.loginService
      .getEmpNameForWelcomeMessage(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.empName = data[0].EmpName;
      });
    this.onResize();
    this.responsiveService.checkWidth();
  }
  onResize() {
    this.responsiveService.getMobileStatus().subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }
  openNav() {
    document.getElementById("mySidenav").style.width = "300px";
    // document.getElementById("main").style.marginLeft = "250px";
    document.body.style.backgroundColor = "#EBFAFF !important";

  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    // document.getElementById("main").style.marginLeft= "0";
  }
  dropdownData() {
    var dropdown = document.getElementsByClassName("dropdown-btn");
    var i;
    for (i = 0; i < dropdown.length; i++) {
      dropdown[i].addEventListener("click", function () {
        this.classList.toggle("active");
        var dropdownContent = this.nextElementSibling;
        if (dropdownContent.style.display === "block") {
          dropdownContent.style.display = "none";
        } else {
          dropdownContent.style.display = "block";
        }
      });
    }
  }
  leave() {
    console.log("exit");
  }
  stayhere() {
    this.popup = false;
  }


}
