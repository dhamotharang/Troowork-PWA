import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../../../service/organization.service';
import { Organization } from '../../../../model-class/Organization';
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

  constructor(private organizationService: OrganizationService) { }

  deleteOrganization() {
    this.loading = true;
    this.organizationService
      .DeleteOrganization(this.delete_orgKey, this.employeekey).subscribe(() => {
        alert("Organization deleted successfully... !");
        this.organizationService
          .getOrganization(this.pageNo, this.itemsPerPage)
          .subscribe((data: Organization[]) => {
            this.organization = data;
            this.loading = false;
          });

      });
  }
  deleteOrgPass(OrganizationID) {
    this.delete_orgKey = OrganizationID;
  }

  ngOnInit() {
    this.loading = true;
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;

    this.organizationService
      .getOrganization(this.pageNo, this.itemsPerPage)
      .subscribe((data: Organization[]) => {
        this.organization = data;
        this.loading = false;
      });
  }

}
