import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../../../service/organization.service';
import { Organization } from '../../../../model-class/Organization';
import { DataServiceTokenStorageService } from '../../../../service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';
import { ConfirmationdialogComponent, ConfirmDialogModel } from '../../../dialog/confirmationdialog/confirmationdialog.component';

@Component({
  selector: 'app-view-organization',
  templateUrl: './view-organization.component.html',
  styleUrls: ['./view-organization.component.scss']
})
export class ViewOrganizationComponent implements OnInit {
  organization: Organization[];
  delete_orgKey: number;
  pageNo: Number = 1;
  itemsPerPage: Number = 25;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  loading: boolean;// loading

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

  constructor(private organizationService: OrganizationService, private dst: DataServiceTokenStorageService, private dialog: MatDialog) { }

  // deleteOrganization() {
  //   this.loading = true;
  //   this.checkFlag = true;
  //   this.organizationService
  //     .DeleteOrganization(this.delete_orgKey, this.employeekey).subscribe(() => {
  //       alert("Organization deleted successfully... !");
  //       this.checkFlag = false;
  //       this.organizationService
  //         .getOrganization(this.pageNo, this.itemsPerPage)
  //         .subscribe((data: Organization[]) => {
  //           this.organization = data;
  //           this.loading = false;
  //         });

  //     });
  // }
  deleteOrgPass(OrganizationID) {
    this.delete_orgKey = OrganizationID;
    this.checkFlag = true;
    const message = `Are you sure !!  Do you want to delete`;
    const dialogData = new ConfirmDialogModel("DELETE", message);
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.loading = true;
        this.organizationService
          .DeleteOrganization(this.delete_orgKey, this.employeekey).subscribe(() => {
            // alert("Organization deleted successfully... !");
            const dialogRef = this.dialog.open(AlertdialogComponent, {
              data: {
                message: 'Organization deleted successfully... !',
                buttonText: {
                  cancel: 'Done'
                }
              },
            });
            this.checkFlag = false;
            this.organizationService
              .getOrganization(this.pageNo, this.itemsPerPage)
              .subscribe((data: Organization[]) => {
                this.organization = data;
                this.loading = false;
              });

          });
      } else {
        this.loading = false;
        this.checkFlag = false;
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

    this.organizationService
      .getOrganization(this.pageNo, this.itemsPerPage)
      .subscribe((data: Organization[]) => {
        this.organization = data;
        this.loading = false;
      });
  }

}
