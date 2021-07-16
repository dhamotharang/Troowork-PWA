import { Component, OnInit } from '@angular/core';
// import { People } from '../../../../model-class/People';
import { PeopleServiceService } from '../../../../service/people-service.service';
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { ConectionSettings } from '../../../../service/ConnectionSetting';

import { DataServiceTokenStorageService } from '../../../../service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';
@Component({
  selector: 'app-resetpasswordforsamodule',
  templateUrl: './resetpasswordforsamodule.component.html',
  styleUrls: ['./resetpasswordforsamodule.component.scss']
})
export class ResetpasswordforsamoduleComponent implements OnInit {

  empKey$: Object;
  response: Object;
  managerMail: Object;
  userMail: Object;
  build;
  UserId;
  checkFlag;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;

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

  constructor(private route: ActivatedRoute, private peopleService: PeopleServiceService, private http: HttpClient, private router: Router, private dst: DataServiceTokenStorageService, private dialog: MatDialog) {
    this.route.params.subscribe(params => this.empKey$ = params.EmpKey);
  }

  resetUserPassword(username, password, userLoginId) {
    this.checkFlag = true;
    if (!(username)) {
      // alert("Please Enter User Name!");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please Enter User Name!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    else {
      this.peopleService.resetUserPassword(username, password, this.empKey$, userLoginId, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
        this.response = data[0];
        this.build = data;
        this.checkFlag = false;
        // this.router.navigateByUrl('/Managelogincredentials');
        this.router.navigate(['/SuperadminDashboard', { outlets: { SuperAdminOut: ['Managelogincredentials'] } }]);
      });


      if (this.build.length > 0) { // resetUserPassword returns username. just to make sure that the reset action was done properly, we are returnig the username
        this.peopleService.getUserEmail(username, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
          this.managerMail = data[0].EmailID;
          this.userMail = data[0].newmail;

          if (this.userMail == null) {
            // alert("Password Changed Successfully! Mail not send , Mail-Id not found !");
            const dialogRef = this.dialog.open(AlertdialogComponent, {
              data: {
                message: 'Password Changed Successfully! Mail not send , Mail-Id not found !',
                buttonText: {
                  cancel: 'Done'
                }
              },
            });
          } else {
            var message = 'Your Username is ' + username + ' and ' + 'Your Password is ' + password + "                https://troowork.azurewebsites.net";

            const obj = {
              from: this.managerMail,
              to: this.userMail,
              subject: 'Login Credentials',
              text: message
            };
            const url = ConectionSettings.Url + "/sendmail";
            return this.http.post(url, obj)
              .subscribe(res => console.log('Mail Sent Successfully...'));
          }

        });

      }
    }
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

    this.checkFlag = false;
    this.peopleService.getLoginDetailsByEmpKey(this.empKey$, this.OrganizationID).subscribe((data: any[]) => {
      this.build = data;
    });

  }
  goBack() {
    this.router.navigate(['/SuperadminDashboard', { outlets: { SuperAdminOut: ['Managelogincredentials'] } }]);
  }
}
