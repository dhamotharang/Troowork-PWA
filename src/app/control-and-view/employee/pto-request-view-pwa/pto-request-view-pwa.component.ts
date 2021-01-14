import { Component, OnInit } from '@angular/core';
import { PeopleServiceService } from "../../../service/people-service.service";
@Component({
  selector: 'app-pto-request-view-pwa',
  templateUrl: './pto-request-view-pwa.component.html',
  styleUrls: ['./pto-request-view-pwa.component.scss']
})
export class PtoRequestViewPWAComponent implements OnInit {
 ////////Author :  Aswathy//////
    
 role: String;
 name: String;
 toServeremployeekey: Number;
 IsSupervisor: Number;
 OrganizationID: Number;
 requestdetails;
 editflag;
//  deleteRequestKey;
  router: any;

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
//  deletePass(key) {
//    this.deleteRequestKey = key;

//  }
//  deleteRequest() {
//    this.PeopleServiceService.deletePTORequest(this.deleteRequestKey, this.OrganizationID)
//      .subscribe((data) => {
//        alert('PTO Request Deleted Successfully');
//        this.PeopleServiceService.getRequestdetails(this.toServeremployeekey, this.OrganizationID).subscribe((data) => {
//          this.requestdetails = data;
//        });
//      });
//  }
 ngOnInit() {

   var token = localStorage.getItem('token');
   var encodedProfile = token.split('.')[1];
   var profile = JSON.parse(this.url_base64_decode(encodedProfile));
   this.role = profile.role;
   this.IsSupervisor = profile.IsSupervisor;
   this.name = profile.username;
   this.toServeremployeekey = profile.employeekey;
   this.OrganizationID = profile.OrganizationID;

   this.PeopleServiceService. setgetRequestdetails(this.toServeremployeekey, this.OrganizationID).subscribe((data) => {
     this.requestdetails = data;
   });
 }
//  PtoDetails(request_id){
//   this.router.navigate(['/EmployeeDashboard', { outlets: { EmployeeOut: ['PtoRequestDetailsPWA', request_id] } }]);
//  }
//  PtoDetailsEdit(request_id){
//   this.router.navigate(['/EmployeeDashboard', { outlets: { EmployeeOut: ['PtoRequestEditPWA', request_id] } }]);
//  }
}
