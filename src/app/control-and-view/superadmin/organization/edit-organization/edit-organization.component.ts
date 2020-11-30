import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../../../service/organization.service';
import { Organization } from '../../../../model-class/Organization';
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: 'app-edit-organization',
  templateUrl: './edit-organization.component.html',
  styleUrls: ['./edit-organization.component.scss']
})
export class EditOrganizationComponent implements OnInit {

  OrgId$: Object;
  OrgDetail;
  updatedby: number;
  temp_TenantID;
  employeekey;
  OrgID;
  constructor(private route: ActivatedRoute, private organizationService: OrganizationService, private router: Router) {
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

    if (!(OName) || !(OName.trim())) {
      alert('Organization Name is not provided !');
      return;
    }
    if (!(tid) || !(tid.trim())) {
      alert('Tenant ID is not provided !');
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
        alert("Organization Updated !");
        this.router.navigate(['/SuperadminDashboard', { outlets: { SuperAdminOut: ['ViewOrganization'] } }]);
      });
    }
    else {
      this.organizationService.checkForTenantId(tid).subscribe((data: any[]) => {
        if (data[0].count == 0) {
          this.organizationService.UpdateOrganizationDetails(OName, ODesc, state, tid, loc, country, tename, email, this.updatedby, this.OrgId$).subscribe((data: any[]) => {
            alert("Organization Updated !");
            this.router.navigate(['/SuperadminDashboard', { outlets: { SuperAdminOut: ['ViewOrganization'] } }]);

          });
        }
        else {
          alert("Tenant ID is already present !");
          return;
        }

      });
    }
  }
  ngOnInit() {
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.employeekey = profile.employeekey;
    this.OrgID = profile.OrganizationID;

    this.organizationService.ViewOrgDetailsforedit(this.OrgId$).subscribe((data: any[]) => {
      this.OrgDetail = data;
      this.temp_TenantID = this.OrgDetail.TenantID;

    });
  }
  goBack() {
    this.router.navigate(['/SuperadminDashboard', { outlets: { SuperAdminOut: ['ViewOrganization'] } }]);
  }
}
