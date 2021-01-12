import { Component, OnInit } from '@angular/core';
import { PeopleServiceService } from "../../../service/people-service.service";

@Component({
  selector: 'app-trade-request-view-pwa',
  templateUrl: './trade-request-view-pwa.component.html',
  styleUrls: ['./trade-request-view-pwa.component.scss']
})
export class TradeRequestViewPWAComponent implements OnInit {

////////Author :  Aswathy//////
    
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

constructor(private PeopleServiceService: PeopleServiceService) { }

deletePass(key) {
  this.deleteRequestKey = key;
}

deleteRequest() {
  this.PeopleServiceService.setdeleteTradeRequest(this.deleteRequestKey, this.toServeremployeekey)
    .subscribe((data) => {
      alert('Trade Request Deleted Successfully');
      this.PeopleServiceService.setgetTradeRequestdetails(this.OrganizationID, this.toServeremployeekey).subscribe((data) => {
        this.requestdetails = data;
      });
    });
}
ngOnInit() {

  var token = localStorage.getItem('token');
  var encodedProfile = token.split('.')[1];
  var profile = JSON.parse(this.url_base64_decode(encodedProfile));
  this.role = profile.role;
  this.IsSupervisor = profile.IsSupervisor;
  this.name = profile.username;
  this.toServeremployeekey = profile.employeekey;
  this.OrganizationID = profile.OrganizationID;

  this.checkEmp=parseInt(this.toServeremployeekey);
  this.PeopleServiceService.setgetTradeRequestdetails(this.OrganizationID, this.toServeremployeekey).subscribe((data) => {
    this.requestdetails = data;
  });
}
}
