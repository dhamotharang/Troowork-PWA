import { Component, OnInit } from '@angular/core';
import { PeopleServiceService } from "../../../service/people-service.service";

import { DataServiceTokenStorageService } from '../../../service/DataServiceTokenStorage.service';
@Component({
  selector: 'app-pto-request-view',
  templateUrl: './pto-request-view.component.html',
  styleUrls: ['./pto-request-view.component.scss']
})
export class PtoRequestViewComponent implements OnInit {

    ////////Author :  Aswathy//////
    
  role: String;
  name: String;
  toServeremployeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  requestdetails;
  editflag;
  deleteRequestKey;
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

  constructor(private PeopleServiceService: PeopleServiceService, private dst: DataServiceTokenStorageService) { }
  deletePass(key) {
    this.deleteRequestKey = key;

  }
  deleteRequest() {
    this.checkFlag = true;
    this.PeopleServiceService.deletePTORequest(this.deleteRequestKey, this.OrganizationID)
      .subscribe((data) => {
        this.checkFlag = false;
        alert('PTO Request Deleted Successfully');
        this.PeopleServiceService.getRequestdetailsWithTime(this.toServeremployeekey, this.OrganizationID).subscribe((data) => {
          this.requestdetails = data;
        });
      });
  }
  ngOnInit() {

    // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.toServeremployeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();
    this.checkFlag = false;

    this.PeopleServiceService.getRequestdetailsWithTime(this.toServeremployeekey, this.OrganizationID).subscribe((data) => {
      this.requestdetails = data;
    });
  }

}
