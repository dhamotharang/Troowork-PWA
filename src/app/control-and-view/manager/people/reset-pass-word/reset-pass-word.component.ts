import { Component, OnInit } from '@angular/core';
// import { People } from '../../../../model-class/People';
import { PeopleServiceService } from '../../../../service/people-service.service';
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { ConectionSettings } from '../../../../service/ConnectionSetting';

@Component({
  selector: 'app-reset-pass-word',
  templateUrl: './reset-pass-word.component.html',
  styleUrls: ['./reset-pass-word.component.scss']
})
export class ResetPassWordComponent implements OnInit {
  empKey$: Object;
  response: Object;
  managerMail: Object;
  userMail: Object;
  build;

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

  constructor(private route: ActivatedRoute, private peopleService: PeopleServiceService, private http: HttpClient, private router: Router) {
    this.route.params.subscribe(params => this.empKey$ = params.EmpKey);
  }

  resetUserPassword(username, password, userLoginId) {
    if (!(username) || !username.trim()) {
      alert("Please Enter User Name!");
      return;
    }
    else {
      if(username){
        username=username.trim();
      }
      this.peopleService.resetUserPassword(username, password, this.empKey$, userLoginId, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
        this.response = data[0];
        this.build = data;
        // this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['manageLoginCredentials'] } }]);
        if (this.role == 'Manager') {
          this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['manageLoginCredentials'] } }]);
        }
        // else  if(this.role=='Employee' && this.IsSupervisor==1){
        else if (this.role == 'Supervisor') {
          this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['manageLoginCredentials'] } }]);
        }
      });

      if (this.build.length > 0) { // resetUserPassword returns username. just to make sure that the reset action was done properly, we are returnig the username

        this.peopleService.getUserEmail(username, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {

          this.managerMail = data[0].EmailID;
          this.userMail = data[0].newmail;

          if (this.userMail == null) {
            alert("Password Changed Successfully! Mail not send , Mail-Id not found !");
          } else {
            var message = 'Your Username is ' + username + ' and ' + 'Your Password is ' + password + "                https://troowork.azurewebsites.net";
            console.log(message);
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

    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;

    this.peopleService.getLoginDetailsByEmpKey(this.empKey$, this.OrganizationID).subscribe((data: any[]) => {
      this.build = data;
    });

  }
  goBack() {
    // this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['manageLoginCredentials'] } }]);
    if (this.role == 'Manager') {
      this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['manageLoginCredentials'] } }]);
    }
    // else  if(this.role=='Employee' && this.IsSupervisor==1){
    else if (this.role == 'Supervisor') {
      this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['manageLoginCredentials'] } }]);
    }
  }
}