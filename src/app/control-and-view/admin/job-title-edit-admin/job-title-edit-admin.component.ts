import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { People } from '../../../model-class/People';
import { PeopleServiceService } from '../../../service/people-service.service';
import { Router } from '@angular/router';

import { DataServiceTokenStorageService } from '../../../service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../dialog/alertdialog/alertdialog.component';
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
  checkFlag;
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


  constructor(private route: ActivatedRoute, private peopleServiceService: PeopleServiceService, private router: Router, private dst: DataServiceTokenStorageService, private dialog: MatDialog) {
    this.route.params.subscribe(params => this.JobTitle_Key$ = params.JobTitle_Key);
  }
  updateJobTitle(JobTitle, JobTitleDescription) {
    this.checkFlag = true;
    if (!(JobTitle) || !(JobTitle.trim())) {
      // alert('Job title is not provided !');
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Job title is not provided !',
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

    // else {
    JobTitle = JobTitle.trim();
    JobTitleDescription = JobTitleDescription.trim();
    if (JobTitle !== this.JT) {
      this.peopleServiceService.CheckNewJobtitle(JobTitle, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
        if (data[0].count > 0) {
          // alert("Job title already present !");
          const dialogRef = this.dialog.open(AlertdialogComponent, {
            data: {
              message: 'Job title already present !',
              buttonText: {
                cancel: 'Done'
              }
            },
          });
          this.checkFlag = false;
          return;
        }
        else {
          this.peopleServiceService.updateEditJobtitle(this.JobTitle_Key$, JobTitle, JobTitleDescription, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
            // alert('Job title  successfully updated !');
            const dialogRef = this.dialog.open(AlertdialogComponent, {
              data: {
                message: 'Job title  successfully updated !',
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
    } else {
      this.peopleServiceService.updateEditJobtitle(this.JobTitle_Key$, JobTitle, JobTitleDescription, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
        // alert('Job title  successfully updated !');
        const dialogRef = this.dialog.open(AlertdialogComponent, {
          data: {
            message: 'Job title  successfully updated !',
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
    // }
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
    this.peopleServiceService.getEditJobtitleDetails(this.JobTitle_Key$, this.OrganizationID).subscribe((data: People[]) => {
      this.JobtitleDetails = data;
      this.JT = this.JobtitleDetails[0].JobTitle;
    });
  }
  goBack() {
    this.router.navigate(['AdminDashboard', { outlets: { AdminOut: ['JobTitleViewAdmin'] } }]);
  }
}
