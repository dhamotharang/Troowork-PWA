import { Component, OnInit, HostListener, Input, ElementRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { SchedulingService } from '../../../../service/scheduling.service';
import { ReportServiceService } from '../../../../service/report-service.service';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';
import { ConfirmationdialogComponent, ConfirmDialogModel } from '../../../dialog/confirmationdialog/confirmationdialog.component';


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

  constructor(private ReportServiceService: ReportServiceService, private scheduleServ: SchedulingService, private dst: DataServiceTokenStorageService, private dialog: MatDialog) { }

  ngOnInit() {
    //token starts....

    // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.employeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();

    //token ends

    this.ReportServiceService.getShiftNameList(this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
      this.shiftdetails = data;
    });
  }
  deleteShiftPass(Idemployeeshift) {
    this.delete_shiftKey = Idemployeeshift;

    const message = `Are you sure !!  Do you want to delete`;
    const dialogData = new ConfirmDialogModel("DELETE", message);
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.scheduleServ.removeMasterShifts(this.delete_shiftKey, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
          // alert("Shift Name deleted successfully");
          const dialogRef = this.dialog.open(AlertdialogComponent, {
            data: {
              message: 'Shift Name deleted successfully',
              buttonText: {
                cancel: 'Done'
              }
            },
          });
          dialogRef.afterClosed().subscribe(dialogResult => {
            this.ReportServiceService.getShiftNameList(this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
              this.shiftdetails = data;
            });
          });
        });
      }
    });

  }
  // deleteShift() {
  //   this.scheduleServ.removeMasterShifts(this.delete_shiftKey, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
  //     alert("Shift Name deleted successfully");
  //     this.ReportServiceService.getShiftNameList(this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
  //       this.shiftdetails = data;
  //     });
  //   });
  // }

}
