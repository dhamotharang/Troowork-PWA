import { Component, OnInit, HostListener, Input, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { SchedulingService } from '../../../../service/scheduling.service';
import { ReportServiceService } from '../../../../service/report-service.service';

@Component({
  selector: 'app-view-master-shifts',
  templateUrl: './view-master-shifts.component.html',
  styleUrls: ['./view-master-shifts.component.scss']
})
export class ViewMasterShiftsComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;

  shiftdetails;
  delete_shiftKey;
  loading;
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

  constructor(private ReportServiceService: ReportServiceService, private scheduleServ: SchedulingService) { }

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

    this.ReportServiceService.getShiftNameList(this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
      this.shiftdetails = data;
    });
  }
  deleteShiftPass(Idemployeeshift) {
    this.delete_shiftKey = Idemployeeshift;
  }
  deleteShift() {
    this.scheduleServ.removeMasterShifts(this.delete_shiftKey, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
      alert("Shift Name deleted successfully");
      this.ReportServiceService.getShiftNameList(this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
        this.shiftdetails = data;
      });
    });
  }

}
