import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { WorkOrderServiceService } from '../../../../service/work-order-service.service';
import { ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';
@Component({
  selector: 'app-edit-interval-type-color',
  templateUrl: './edit-interval-type-color.component.html',
  styleUrls: ['./edit-interval-type-color.component.scss']
})
export class EditIntervalTypeColorComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  EmployeeKey;
  curDate;
  interval;
  intervalID$;

  checkFlag;
  public convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

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

  constructor(private route: ActivatedRoute, private dst: DataServiceTokenStorageService, private WorkOrderServiceService: WorkOrderServiceService, private _location: Location, private dialog: MatDialog) {
    this.route.params.subscribe(params => this.intervalID$ = params.intervalID);
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

    this.checkFlag = false;
    this.curDate = this.convert_DT(new Date(Date.now()));
    this.WorkOrderServiceService.getIntervalTypeDetails(this.intervalID$, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.interval = data[0];
      });
  }
  goBack() {
    this._location.back();
  }
  updateIntervalColor() {
    this.checkFlag = true;

    if (!(this.interval.Colour)) {
      // alert("Please select a colour");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please select a colour!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
        return false;
      });
    }
    else {

      this.WorkOrderServiceService.updateIntervalDetails(this.interval.Colour, this.intervalID$, this.OrganizationID)
        .subscribe(res => {
          // alert("Interval colour updated successfully.");
          const dialogRef = this.dialog.open(AlertdialogComponent, {
            data: {
              message: 'Interval colour updated successfully',
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
  }
}
