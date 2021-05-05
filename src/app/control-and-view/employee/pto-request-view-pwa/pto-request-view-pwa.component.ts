import { Component, OnInit } from '@angular/core';
import { PeopleServiceService } from "../../../service/people-service.service";
import { ResponsiveService } from 'src/app/service/responsive.service';
import { DataServiceTokenStorageService } from '../../../service/DataServiceTokenStorage.service';
@Component({
  selector: 'app-pto-request-view-pwa',
  templateUrl: './pto-request-view-pwa.component.html',
  styleUrls: ['./pto-request-view-pwa.component.scss']
})
export class PtoRequestViewPWAComponent implements OnInit {
 ////////Author :  Amritha//////
    
 role: String;
 name: String;
 toServeremployeekey: Number;
 IsSupervisor: Number;
 OrganizationID: Number;
 requestdetails;
 editflag;
 isMobile: boolean;

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

 constructor(private PeopleServiceService: PeopleServiceService,private responsiveService: ResponsiveService, private dst: DataServiceTokenStorageService) { }
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

  //  var token = sessionStorage.getItem('token');
  //  var encodedProfile = token.split('.')[1];
  //  var profile = JSON.parse(this.url_base64_decode(encodedProfile));
  this.role = this.dst.getRole();
  this.IsSupervisor = this.dst.getIsSupervisor();
  this.name = this.dst.getName();
  this.toServeremployeekey = this.dst.getEmployeekey();
  this.OrganizationID = this.dst.getOrganizationID();

   this.PeopleServiceService.setgetRequestdetailsWithTime(this.toServeremployeekey, this.OrganizationID).subscribe((data) => {
     this.requestdetails = data;
   });
   this.onResize();
   this.responsiveService.checkWidth();
 }
//  PtoDetails(request_id){
//   this.router.navigate(['/EmployeeDashboard', { outlets: { EmployeeOut: ['PtoRequestDetailsPWA', request_id] } }]);
//  }
//  PtoDetailsEdit(request_id){
//   this.router.navigate(['/EmployeeDashboard', { outlets: { EmployeeOut: ['PtoRequestEditPWA', request_id] } }]);
//  }
onResize() {
  this.responsiveService.getMobileStatus().subscribe(isMobile => {
    this.isMobile = isMobile;
  });
}
}
