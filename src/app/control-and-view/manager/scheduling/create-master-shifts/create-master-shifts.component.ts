import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SchedulingService } from '../../../../service/scheduling.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';
import { ConfirmationdialogComponent, ConfirmDialogModel } from '../../../dialog/confirmationdialog/confirmationdialog.component';


@Component({
  selector: 'app-create-master-shifts',
  templateUrl: './create-master-shifts.component.html',
  styleUrls: ['./create-master-shifts.component.scss']
})
export class CreateMasterShiftsComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  supervisoremployeekey;
  IsSupervisor: Number;
  OrganizationID: Number;

  ShiftName;
  checkFlag;

  supervisorlist;

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
  constructor(private router: Router, private scheduleServ: SchedulingService, private _location: Location, private dst: DataServiceTokenStorageService, private dialog: MatDialog) { }

  addShift(newshiftName) {
    this.checkFlag = true;
    if (!(newshiftName) || !(newshiftName.trim())) {
      // alert("Please Enter Shift Name!");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please Enter Shift Name!!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
        return;
      });
    }

    newshiftName = newshiftName.trim();
    this.scheduleServ.checkNewShift(newshiftName, this.OrganizationID).subscribe((data: any[]) => {
      if (data[0].count > 0) {
        // alert("Shift name already present !");
        const dialogRef = this.dialog.open(AlertdialogComponent, {
          data: {
            message: 'Shift name already present !!',
            buttonText: {
              cancel: 'Done'
            }
          },
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          this.checkFlag = false;
          return;
        });
      }
      else {
        this.scheduleServ.createMasterShifts_supervisor(newshiftName, this.employeekey, this.OrganizationID, this.supervisoremployeekey)
          .subscribe((data: any[]) => {
            // alert("Shift created successfully");
            const dialogRef = this.dialog.open(AlertdialogComponent, {
              data: {
                message: 'Shift created successfully',
                buttonText: {
                  cancel: 'Done'
                }
              },
            });
            dialogRef.afterClosed().subscribe(dialogResult => {
              this.checkFlag = false;
              this._location.back();
            });
          });
      }
    });
  }

  ngOnInit() {
    // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.employeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();

    this.supervisoremployeekey = "";

    this.checkFlag = false;
    this.scheduleServ.getallsupervisorlist_shift(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.supervisorlist = data;
      });
  }

  goBack() {
    this._location.back();
  }

}
