import { Component, OnInit, HostListener, Input, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { SchedulingService } from '../../../../service/scheduling.service';
@Component({
  selector: 'app-viewshift',
  templateUrl: './viewshift.component.html',
  styleUrls: ['./viewshift.component.scss']
})
export class ViewshiftComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  grpName1;
  shiftdetails;
  delete_shiftKey;
  grpID;
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

  constructor(private scheduleServ: SchedulingService) { }

  ngOnInit() {
    //token starts....

    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;

    //token ends

    this.scheduleServ.getShifts(this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
      
      this.shiftdetails = data;

    });
  }
  deleteShiftPass(Idemployeeshift) {
    this.delete_shiftKey = Idemployeeshift;
  }
  deleteShift() {
    this.scheduleServ.removeEmployeeShift(this.delete_shiftKey, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
      alert("Group Name deleted successfully");
      this.scheduleServ.getShifts(this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
        this.shiftdetails = data;
      });
    });
  }

  // changeDisable(indexVal) {
  //   this.grpID = indexVal;
  //   this.grpName1 = this.shiftdetails[indexVal].Description;
  // }


  // cancelGrpName() {
  //   this.grpID = -1;

  //   this.scheduleServ.getShifts(this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
  //     this.shiftdetails = data;
  //   });
  // }

  // updateGrpName(grpName, grpnameid) {

  //   if (this.grpName1 == grpName) {
  //     this.grpID = -1;
  //     this.scheduleServ.getShifts(this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
  //       this.shiftdetails = data;
  //     });
  //   } else {
  //     this.scheduleServ.checkForEmpGrpDuplicate(grpName, this.OrganizationID).subscribe((data: any[]) => {
  //       if (data.length == 0) {
  //         this.scheduleServ.updateShiftDetails(grpnameid, grpName, this.OrganizationID, this.employeekey).subscribe((data: any[]) => {
  //           alert("Group Name updated Successfully");
  //           this.grpID = -1;
  //           this.scheduleServ.getShifts(this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
  //             this.shiftdetails = data;
  //           });
  //         });
  //       } else {
  //         alert("Group Name already exists");
  //         return;
  //       }
  //     });
  //   }
  // }
}
