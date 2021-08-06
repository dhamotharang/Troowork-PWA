import { Component, OnInit } from '@angular/core';
import { People } from '../../../model-class/People';
import { PeopleServiceService } from '../../../service/people-service.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { DataServiceTokenStorageService } from '../../../service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationdialogComponent, ConfirmDialogModel } from '../../dialog/confirmationdialog/confirmationdialog.component';
@Component({
  selector: 'app-job-title-view-admin',
  templateUrl: './job-title-view-admin.component.html',
  styleUrls: ['./job-title-view-admin.component.scss']
})
export class JobTitleViewAdminComponent implements OnInit {
  jobView: People[];
  deleteJobtitleKey: number;
  searchform: FormGroup;
  checkFlag;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  loading: boolean;
  pageNo: Number = 1;
  itemsPerPage: Number = 25;
  showHide1: boolean;
  showHide2: boolean;
  pagination: Number;

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


  constructor(private formBuilder: FormBuilder, private peopleServiceService: PeopleServiceService, private router: Router, private dst: DataServiceTokenStorageService, private dialog: MatDialog) { }
  // Function to search from the jobtitle list
  searchJobTitle(SearchJobTitle) {
    var value = SearchJobTitle.trim();
    if (value.length >= 3) {
      this.peopleServiceService.searchJobtitle(value, this.employeekey, this.OrganizationID).subscribe((data: People[]) => {
        this.jobView = data;
        this.showHide2 = false;
        this.showHide1 = false;
      });
    }
    else if (value.length == 0) {
      if ((value.length == 0) && (SearchJobTitle.length == 0)) {
        this.loading = true;
      }
      this.peopleServiceService.getJobtitleView(this.employeekey, this.OrganizationID).subscribe((data: People[]) => {
        this.jobView = data;
        this.loading = false;
        if (this.jobView[0].totalItems > this.itemsPerPage) {
          this.showHide2 = true;
          this.showHide1 = false;
        }
        else if (this.jobView[0].totalItems <= this.itemsPerPage) {
          this.showHide2 = false;
          this.showHide1 = false;
        }
      });
    }
  }
  // Function to delete the jobtitle list
  deleteJobPass(key) {
    this.deleteJobtitleKey = key;
    this.checkFlag = true;
    const message = `Are you sure !!  Do you want to delete`;
    const dialogData = new ConfirmDialogModel("DELETE", message);
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.peopleServiceService.deleteJobTitle(this.deleteJobtitleKey, this.OrganizationID)
          .subscribe(res =>
            this.peopleServiceService.getJobtitleView(this.employeekey, this.OrganizationID).subscribe((data: People[]) => {
              this.jobView = data;
              this.checkFlag = false;
            })
          );
      } else {
        this.checkFlag = false;
      }
    });

  }
  // deleteJobTitle() {
  //   this.checkFlag = true;
  //   this.peopleServiceService.deleteJobTitle(this.deleteJobtitleKey, this.OrganizationID)
  //     .subscribe(res =>
  //       this.peopleServiceService.getJobtitleView(this.employeekey, this.OrganizationID).subscribe((data: People[]) => {
  //         this.jobView = data;
  //         this.checkFlag = false;

  //       })
  //     );
  // }
  // Function to go to the previous page of pagination of jobtitle list
  previousPage() {
    this.pageNo = +this.pageNo - 1;
    this.peopleServiceService.getJobtitleView(this.employeekey, this.OrganizationID).subscribe((data: People[]) => {
      this.jobView = data;
      if (this.pageNo == 1) {
        this.showHide2 = true;
        this.showHide1 = false;
      } else {
        this.showHide2 = true;
        this.showHide1 = true;
      }
    });
  }

  // Function to go to the next page of pagination of jobtitle list
  nextPage() {
    this.pageNo = +this.pageNo + 1;
    this.peopleServiceService.getJobtitleView(this.employeekey, this.OrganizationID).subscribe((data: People[]) => {
      this.jobView = data;
      this.pagination = +this.jobView[0].totalItems / (+this.pageNo * (+this.itemsPerPage));
      if (this.pagination > 1) {
        this.showHide2 = true;
        this.showHide1 = true;
      }
      else {
        this.showHide2 = false;
        this.showHide1 = true;
      }
    });
  }
  ngOnInit() {
    this.loading = true;
    // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.employeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();

    this.checkFlag = false;
    // Call to get the jobtitle list for view
    this.peopleServiceService.getJobtitleView(this.employeekey, this.OrganizationID).subscribe((data: People[]) => {
      this.jobView = data;
      this.loading = false;
      if (this.jobView[0].totalItems > this.itemsPerPage) {
        this.showHide2 = true;
        this.showHide1 = false;
      }
      else if (this.jobView[0].totalItems <= this.itemsPerPage) {
        this.showHide2 = false;
        this.showHide1 = false;
      }
    });

    this.searchform = this.formBuilder.group({
      SearchJobTitle: ['', Validators.required]
    });
  }

}
