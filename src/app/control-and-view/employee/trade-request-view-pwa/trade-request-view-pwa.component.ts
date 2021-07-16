import { Component, OnInit } from '@angular/core';
import { PeopleServiceService } from "../../../service/people-service.service";
import { ResponsiveService } from 'src/app/service/responsive.service';

import { DataServiceTokenStorageService } from '../../../service/DataServiceTokenStorage.service';
@Component({
  selector: 'app-trade-request-view-pwa',
  templateUrl: './trade-request-view-pwa.component.html',
  styleUrls: ['./trade-request-view-pwa.component.scss']
})
export class TradeRequestViewPWAComponent implements OnInit {

  ////////Author :  Amritha//////

  role: String;
  name: String;
  toServeremployeekey;
  IsSupervisor: Number;
  OrganizationID: Number;
  requestdetails;
  editflag;
  deleteRequestKey;
  OtherEmployeedetails;
  checkEmp;
  isMobile: boolean;
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

  constructor(private PeopleServiceService: PeopleServiceService, private responsiveService: ResponsiveService, private dst: DataServiceTokenStorageService) { }

  // deletePass(key) {
  //   this.deleteRequestKey = key;
  // }

  // deleteRequest() {
  //   this.checkFlag = true;
  //   this.PeopleServiceService.setdeleteTradeRequest(this.deleteRequestKey, this.toServeremployeekey)
  //     .subscribe((data) => {
  //       this.checkFlag = false;
  //       alert('Trade Request Deleted Successfully');
  //       this.PeopleServiceService.setgetTradeRequestdetails(this.OrganizationID, this.toServeremployeekey).subscribe((data) => {
  //         this.requestdetails = data;
  //       });
  //     });
  // }
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

    this.checkEmp = parseInt(this.toServeremployeekey);
    this.PeopleServiceService.setgetTradeRequestdetails(this.OrganizationID, this.toServeremployeekey).subscribe((data) => {
      this.requestdetails = data;
    });
    this.onResize();
    this.responsiveService.checkWidth();
  }
  onResize() {
    this.responsiveService.getMobileStatus().subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }
}
