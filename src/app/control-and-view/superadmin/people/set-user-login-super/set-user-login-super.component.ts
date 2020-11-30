import { Component, OnInit } from '@angular/core';
import { People } from '../../../../model-class/People';
import { PeopleServiceService } from '../../../../service/people-service.service';
import { ActivatedRoute, Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { ConectionSettings } from '../../../../service/ConnectionSetting';

@Component({
  selector: 'app-set-user-login-super',
  templateUrl: './set-user-login-super.component.html',
  styleUrls: ['./set-user-login-super.component.scss']
})
export class SetUserLoginSuperComponent implements OnInit {
  str$: Object;
  empKey$: Object;
  userRoleTypeKey$: Object;
  Organization$

  sasemail: People[];
  password: String = 'troowork';
  reEnterPassword: String = 'troowork';
  username: any;
  managerMail: Object;
  userMail: Object;
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
    this.route.params.subscribe(params => this.empKey$ = params.EmployeeKey);
    this.route.params.subscribe(params => this.str$ = params.str);
    this.route.params.subscribe(params => this.userRoleTypeKey$ = params.UserRoleTypeKey);
    this.route.params.subscribe(params => this.Organization$ = params.Organization);
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

    this.username = this.str$;
  }
  setUsernamePassword() {
    if (!this.username) {
      alert("User Name can't be empty");
    } else {
      this.peopleService.checkUserName(this.username, this.empKey$, this.OrganizationID)
        .subscribe((data: any[]) => {
          if (data[0].result == 'Exists') {
            alert("User Name already exists");
          } else {
            this.peopleService.setLoginCreds(this.username, this.password, this.empKey$, this.employeekey, this.userRoleTypeKey$, this.Organization$)
              .subscribe((data: any[]) => {
                // this.router.navigateByUrl('/Viewemployee');
                this.router.navigate(['/SuperadminDashboard',{ outlets: { SuperAdminOut: ['Viewemployee'] } }]);


                this.peopleService.getUserEmail(this.username, this.employeekey, this.OrganizationID).subscribe((data: People[]) => {
                  this.managerMail = data[0].EmailID;
                  this.userMail = data[0].newmail;

                  if (this.userMail == null) {
                    alert("Login Credentials created for user Successfully! Mail not send , Mail-Id not found !");
                  } else {
                    var message = 'Your Username is ' + this.username + ' and ' + 'Your Password is ' + this.password + "                https://troowork.azurewebsites.net";
                    console.log(message);
                    const obj = {
                      from: this.managerMail,
                      to: this.userMail,
                      subject: 'Login Credentials',
                      text: message
                    };
                    const url = ConectionSettings.Url+"/sendmail";
                    return this.http.post(url, obj)
                      .subscribe(res => console.log('Mail Sent Successfully...'));
                  }
                });

              });
          }
        });
    }
  }
}
