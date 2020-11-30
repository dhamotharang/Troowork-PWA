import { Component, OnInit } from '@angular/core';
import { PeopleServiceService } from '../../../../service/people-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-title-add',
  templateUrl: './job-title-add.component.html',
  styleUrls: ['./job-title-add.component.scss']
})
export class JobTitleAddComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  JobtitleName;JobTitleDescription;
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


  constructor(private peopleServiceService: PeopleServiceService, private router: Router) { }

  addNewJobtitle(JobtitleName, JobTitleDescription) {
    if (!JobtitleName) {
      alert('Job title is not provided !');
      return;
    }
    if (!JobTitleDescription) {
      alert('Job title description is not provided !');
      return;
    }
    if (JobtitleName && !JobtitleName.trim()) {
      alert('Job title is not provided !');
      return;
    }
    if (JobTitleDescription && !JobTitleDescription.trim()) {
      alert('Job Title Description is not provided !');
      return;
    }
    if(JobtitleName){
      JobtitleName=JobtitleName.trim()
    }
    if(JobTitleDescription){
      JobTitleDescription=JobTitleDescription.trim()
    }

    this.peopleServiceService.checkfor_jobtitle(JobtitleName, this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        if (data[0].count != 0) {
          alert('Job title already exists !');
        }
        else {
          this.peopleServiceService.addJobtitle(JobtitleName, JobTitleDescription, this.employeekey, this.OrganizationID)
            .subscribe((data: any[]) => {
              alert('Job title successfully created !');
              // this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['JobTitileView'] } }]);
              if (this.role == 'Manager') {
                this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['JobTitileView'] } }]);
              }
              // else  if(this.role=='Employee' && this.IsSupervisor==1){
              else if (this.role == 'Supervisor') {
                this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['JobTitileView'] } }]);
              }
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
    // this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['JobTitileView'] } }]);
    if (this.role == 'Manager') {
      this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['JobTitileView'] } }]);
    }
    // else  if(this.role=='Employee' && this.IsSupervisor==1){
    else if (this.role == 'Supervisor') {
      this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['JobTitileView'] } }]);
    }
  }
}
