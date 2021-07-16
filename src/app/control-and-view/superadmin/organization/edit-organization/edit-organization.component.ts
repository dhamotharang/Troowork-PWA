import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../../../service/organization.service';
import { Organization } from '../../../../model-class/Organization';
import { ActivatedRoute, Router } from "@angular/router";
import { DataServiceTokenStorageService } from '../../../../service/DataServiceTokenStorage.service';

import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';

@Component({
  selector: 'app-edit-organization',
  templateUrl: './edit-organization.component.html',
  styleUrls: ['./edit-organization.component.scss']
})
export class EditOrganizationComponent implements OnInit {
  checkFlag;
  OrgId$: Object;
  OrgDetail;
  updatedby: number;
  temp_TenantID;
  employeekey;
  OrgID;
  constructor(private route: ActivatedRoute, private organizationService: OrganizationService, private router: Router, private dst: DataServiceTokenStorageService, private dialog: MatDialog) {
    this.route.params.subscribe(params => this.OrgId$ = params.OrganizationID);
  }
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

  updateOrg(OName, ODesc, state, tid, loc, country, tename, email) {
    this.checkFlag = true;
    if (!(OName) || !(OName.trim())) {
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
    if (!(tid) || !(tid.trim())) {
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
    OName = OName.trim();
    tid = tid.trim();
    if (ODesc) {
      ODesc = ODesc.trim();
    } if (loc) {
      loc = loc.trim();
    } if (state) {
      state = state.trim();
    } if (country) {
      country = country.trim();
    } if (tename) {
      tename = tename.trim();
    }



    this.updatedby = this.employeekey;
    if (tid == this.temp_TenantID) {
      this.organizationService.UpdateOrganizationDetails(OName, ODesc, state, tid, loc, country, tename, email, this.updatedby, this.OrgId$).subscribe((data: any[]) => {
        // alert("Organization Updated !");
        const dialogRef = this.dialog.open(AlertdialogComponent, {
          data: {
            message: 'Organization Updated !',
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
      this.organizationService.checkForTenantId(tid).subscribe((data: any[]) => {
        if (data[0].count == 0) {
          this.organizationService.UpdateOrganizationDetails(OName, ODesc, state, tid, loc, country, tename, email, this.updatedby, this.OrgId$).subscribe((data: any[]) => {
            // alert("Organization Updated !");
            const dialogRef = this.dialog.open(AlertdialogComponent, {
              data: {
                message: 'Organization Updated !',
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
  }
  ngOnInit() {
    // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));

    this.employeekey = this.dst.getEmployeekey();
    this.OrgID = this.dst.getOrganizationID();
    this.checkFlag = false;
    this.organizationService.ViewOrgDetailsforedit(this.OrgId$).subscribe((data: any[]) => {
      this.OrgDetail = data;
      this.temp_TenantID = this.OrgDetail.TenantID;

    });
  }
  goBack() {
    this.router.navigate(['/SuperadminDashboard', { outlets: { SuperAdminOut: ['ViewOrganization'] } }]);
  }
}
