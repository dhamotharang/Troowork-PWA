import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../../../service/organization.service';
import { Organization } from '../../../../model-class/Organization';
import { ActivatedRoute, Router } from "@angular/router";

import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';
import { DataServiceTokenStorageService } from '../../../../service/DataServiceTokenStorage.service';
@Component({
  selector: 'app-create-organization',
  templateUrl: './create-organization.component.html',
  styleUrls: ['./create-organization.component.scss']
})
export class CreateOrganizationComponent implements OnInit {
  OrgName: String;
  OrgDesc: any;
  State: string;
  tenID: any;
  Location: any;
  Country: string;
  TenName: string;
  OrgEmail: any;
  updatedby: number;
  role;
  IsSupervisor;
  name;
  employeekey;
  OrgID;
  checkFlag;
  constructor(private organizationService: OrganizationService, private router: Router, private dst: DataServiceTokenStorageService, private dialog: MatDialog) { }
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
  // Function to save organization details
  createOrg() {
    this.checkFlag = true;
    if (!(this.OrgName) || !(this.OrgName.trim())) {
      // alert('Organization Name is not provided !');
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Organization Name is not provided',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    if (!(this.tenID) || !(this.tenID.trim())) {
      // alert('Tenant ID is not provided !');
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Tenant ID is not provided !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }

    this.OrgName = this.OrgName.trim();
    this.tenID = this.tenID.trim();
    if (this.OrgDesc) {
      this.OrgDesc = this.OrgDesc.trim();
    } if (this.Location) {
      this.Location = this.Location.trim();
    } if (this.State) {
      this.State = this.State.trim();
    } if (this.Country) {
      this.Country = this.Country.trim();
    } if (this.TenName) {
      this.TenName = this.TenName.trim();
    }
    // this.Location = this.Location.trim();
    // this.State = this.State.trim();
    // this.Country = this.Country.trim();
    // this.TenName = this.TenName.trim();

    this.updatedby = this.employeekey;

    this.organizationService.checkForTenantId(this.tenID).subscribe((data: any[]) => {
      if (data[0].count == 0) {
        this.organizationService.createOrganization(this.OrgName, this.OrgDesc, this.Location, this.State, this.Country, this.updatedby, this.TenName, this.OrgEmail, this.tenID).subscribe((data: any[]) => {
          // alert('Organization Successfully Created !'); 
          const dialogRef = this.dialog.open(AlertdialogComponent, {
            data: {
              message: 'Organization Successfully Created !',
              buttonText: {
                cancel: 'Done'
              }
            },
          });
          dialogRef.afterClosed().subscribe(dialogResult => {
            this.checkFlag = false;
            this.router.navigate(['/SuperadminDashboard', { outlets: { SuperAdminOut: ['ViewOrganization'] } }]);
          });
        });
      }
      else {
        // alert("Tenant ID is already present !");
        const dialogRef = this.dialog.open(AlertdialogComponent, {
          data: {
            message: 'Tenant ID is already present !',
            buttonText: {
              cancel: 'Done'
            }
          },
        });
        this.checkFlag = false;
        return;
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
    this.OrgID = this.dst.getOrganizationID();
    this.checkFlag = false;
  }

}
