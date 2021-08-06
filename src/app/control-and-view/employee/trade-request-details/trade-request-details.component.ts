import { Component, OnInit } from "@angular/core";
import { PeopleServiceService } from "../../../service/people-service.service";
import { DatepickerOptions } from "ng2-datepicker";
import { Router, ActivatedRoute } from "@angular/router";

import { DataServiceTokenStorageService } from '../../../service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../dialog/alertdialog/alertdialog.component';
import { ConfirmationdialogComponent, ConfirmDialogModel } from '../../dialog/confirmationdialog/confirmationdialog.component';
@Component({
  selector: "app-trade-request-details",
  templateUrl: "./trade-request-details.component.html",
  styleUrls: ["./trade-request-details.component.scss"],
})
export class TradeRequestDetailsComponent implements OnInit {
  ////////Author :  Aswathy//////

  role: String;
  name: String;
  toServeremployeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  traderequestdetails;
  editflag;
  show;
  show1;
  traderequestID$;
  checkFlag;
  options: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2030,
    displayFormat: "MM/DD/YYYY",
    barTitleFormat: "MMMM YYYY",
    dayNamesFormat: "dd",
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    //locale: frLocale,
    //minDate: new Date(Date.now()), // Minimal selectable date
    //maxDate: new Date(Date.now()),  // Maximal selectable date
    // barTitleIfEmpty: 'Click to select a date',
    // placeholder: 'Click to select a date', // HTML input placeholder attribute (default: '')
    addClass: "form-control", // Optional, value to pass on to [ngClass] on the input field
    addStyle: {
      "font-size": "18px",
      width: "75%",
      border: "1px solid #ced4da",
      "border-radius": "0.25rem",
    }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: "my-date-picker", // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown
  };

  convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

  url_base64_decode(str) {
    var output = str.replace("-", "+").replace("_", "/");
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += "==";
        break;
      case 3:
        output += "=";
        break;
      default:
        throw "Illegal base64url string!";
    }
    return window.atob(output);
  }

  constructor(
    public PeopleServiceService: PeopleServiceService,
    private router: Router,
    private route: ActivatedRoute, private dst: DataServiceTokenStorageService, private dialog: MatDialog
  ) {
    this.route.params.subscribe(
      (params) => (this.traderequestID$ = params.requestID)
    );
  }

  // Function to go back to previous page
  goBack() {
    if (this.role == 'Employee') {
      this.router.navigate(['/EmployeeDashboard', { outlets: { EmployeeOut: ['ViewTradeRequest'] } }]);
    } else if (this.role == 'Supervisor') {
      this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['ViewTradeRequest'] } }]);
    }
  }

  ngOnInit() {
    // var token = sessionStorage.getItem("token");
    // var encodedProfile = token.split(".")[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.toServeremployeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();

    this.editflag = false;
    this.checkFlag = false;


    // call to get the trade request details

    this.PeopleServiceService.getTradeRequestInfoforEmployee(
      this.traderequestID$,
      this.OrganizationID
    ).subscribe((data) => {
      this.traderequestdetails = data[0];
      if (data[0].StatusKey === 4) {
        this.show = false;
      } else {
        this.show = true;
      }

      if (data[0].CancelRequestedID == this.toServeremployeekey) {
        this.show1 = false; this.show = true;
      } else {
        this.show1 = true; this.show = false;
      }
    });
  }

  // Function to cancel the approved trade
  cancelTrade() {
    this.checkFlag = true;
    this.PeopleServiceService.requestForTradeCancel(this.traderequestID$, this.toServeremployeekey, this.convert_DT(new Date())).subscribe((data) => {
      this.checkFlag = false;
      // alert("Cancelling the trade requested successfully");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Cancelling the trade requested successfully',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (this.role == 'Employee') {
          this.router.navigate(['/EmployeeDashboard', { outlets: { EmployeeOut: ['ViewTradeRequest'] } }]);
        } else if (this.role == 'Supervisor') {
          this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['ViewTradeRequest'] } }]);
        }
      });
    });
  }

  // Function to approval the cancellation request of trade
  cancelTradeApproval() {
    this.checkFlag = true;
    this.PeopleServiceService.tradeCancelApprove(this.traderequestID$, this.toServeremployeekey, this.convert_DT(new Date())).subscribe((data) => {
      this.checkFlag = false;
      // alert("Trade request cancelled successfully");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Trade request cancelled successfully',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (this.role == 'Employee') {
          this.router.navigate(['/EmployeeDashboard', { outlets: { EmployeeOut: ['ViewTradeRequest'] } }]);
        } else if (this.role == 'Supervisor') {
          this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['ViewTradeRequest'] } }]);
        }
      });
    });
  }

}
