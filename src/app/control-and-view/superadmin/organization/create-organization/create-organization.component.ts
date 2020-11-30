import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../../../service/organization.service';
import { Organization } from '../../../../model-class/Organization';
import { ActivatedRoute, Router } from "@angular/router";

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

  constructor(private organizationService: OrganizationService, private router: Router) { }
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

  createOrg() {

    if (!(this.OrgName) || !(this.OrgName.trim())) {
      alert('Organization Name is not provided !');
      return;
    }
    if (!(this.tenID) || !(this.tenID.trim())) {
      alert('Tenant ID is not provided !');
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
          alert('Organization Successfully Created !');
          this.router.navigate(['/SuperadminDashboard', { outlets: { SuperAdminOut: ['ViewOrganization'] } }]);
        });
      }
      else {
        alert("Tenant ID is already present !")
        return;
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
    this.OrgID = profile.OrganizationID;
  }

}
