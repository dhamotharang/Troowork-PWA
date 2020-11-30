import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { People } from '../../../model-class/People';
import { PeopleServiceService } from '../../../service/people-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-job-title-edit-admin',
  templateUrl: './job-title-edit-admin.component.html',
  styleUrls: ['./job-title-edit-admin.component.scss']
})
export class JobTitleEditAdminComponent implements OnInit {
  JobTitle_Key$: object;
  JobtitleDetails: People[];
  JT;
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


  constructor(private route: ActivatedRoute, private peopleServiceService: PeopleServiceService, private router: Router) {
    this.route.params.subscribe(params => this.JobTitle_Key$ = params.JobTitle_Key);
  }
  updateJobTitle(JobTitle, JobTitleDescription) {
    if (!(JobTitle) || !(JobTitle.trim())) {
      alert('Job title is not provided !');
      return;
    }
    if (!(JobTitleDescription) || !(JobTitleDescription.trim())) {
      alert('Job Title Description is not provided !');
      return;
    }

    // else {
    JobTitle = JobTitle.trim();
    JobTitleDescription = JobTitleDescription.trim();
    if (JobTitle !== this.JT) {
      this.peopleServiceService.CheckNewJobtitle(JobTitle, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
        if (data[0].count > 0) {
          alert("Job title already present !");
          return;
        }
        else {
          this.peopleServiceService.updateEditJobtitle(this.JobTitle_Key$, JobTitle, JobTitleDescription, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
            alert('Job title  successfully updated !');
            this.router.navigate(['AdminDashboard', { outlets: { AdminOut: ['JobTitleViewAdmin'] } }]);
          });
        }
      });
    } else {
      this.peopleServiceService.updateEditJobtitle(this.JobTitle_Key$, JobTitle, JobTitleDescription, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
        alert('Job title  successfully updated !');
        this.router.navigate(['AdminDashboard', { outlets: { AdminOut: ['JobTitleViewAdmin'] } }]);
      });
    }
    // }
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

    this.peopleServiceService.getEditJobtitleDetails(this.JobTitle_Key$, this.OrganizationID).subscribe((data: People[]) => {
      this.JobtitleDetails = data;
      this.JT = this.JobtitleDetails[0].JobTitle;
    });
  }
  goBack() {
    this.router.navigate(['AdminDashboard', { outlets: { AdminOut: ['JobTitleViewAdmin'] } }]);
  }
}
