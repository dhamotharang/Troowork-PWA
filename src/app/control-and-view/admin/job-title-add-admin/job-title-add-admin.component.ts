import { Component, OnInit } from '@angular/core';
import { PeopleServiceService } from '../../../service/people-service.service';
import { Router } from '@angular/router';

import { DataServiceTokenStorageService } from '../../../service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../dialog/alertdialog/alertdialog.component';
@Component({
  selector: 'app-job-title-add-admin',
  templateUrl: './job-title-add-admin.component.html',
  styleUrls: ['./job-title-add-admin.component.scss']
})
export class JobTitleAddAdminComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  JobtitleName;
  JobTitleDescription; checkFlag;
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


  constructor(private peopleServiceService: PeopleServiceService, private router: Router, private dst: DataServiceTokenStorageService, private dialog: MatDialog) { }
  // Function to add new job title
  addNewJobtitle(JobtitleName, JobTitleDescription) {
    this.checkFlag = true;
    if (!(JobtitleName) || !(JobtitleName.trim())) {
      // alert('Job title Name is not provided !');
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Job title Name is not provided !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    if (!(JobTitleDescription) || !(JobTitleDescription.trim())) {
      // alert('Job Title Description is not provided !');
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Job Title Description is not provided !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    JobtitleName = JobtitleName.trim();
    JobTitleDescription = JobTitleDescription.trim();
    // Check whether jobtitle exists on not
    this.peopleServiceService.checkfor_jobtitle(JobtitleName, this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        if (data[0].count != 0) {
          // alert('Job title already exists !');
          const dialogRef = this.dialog.open(AlertdialogComponent, {
            data: {
              message: 'Job title already exists !',
              buttonText: {
                cancel: 'Done'
              }
            },
          });
          this.checkFlag = false;
        }
        else {
          this.peopleServiceService.addJobtitle(JobtitleName, JobTitleDescription, this.employeekey, this.OrganizationID)
            .subscribe((data: any[]) => {
              // alert('Job title successfully created !');
              const dialogRef = this.dialog.open(AlertdialogComponent, {
                data: {
                  message: 'Job title successfully created !',
                  buttonText: {
                    cancel: 'Done'
                  }
                },
              });

              dialogRef.afterClosed().subscribe(dialogResult => {
                this.checkFlag = false;
                this.router.navigate(['AdminDashboard', { outlets: { AdminOut: ['JobTitleViewAdmin'] } }]);
              });
            });
        }
      });

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
  }
  // Function to go back to previousPage
  goBack() {
    this.router.navigate(['AdminDashboard', { outlets: { AdminOut: ['JobTitleViewAdmin'] } }]);
  }
}
