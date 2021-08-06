import { Component, OnInit } from '@angular/core';
import { PeopleServiceService } from "../../../../service/people-service.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DatepickerOptions } from 'ng2-datepicker';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';
import { ConfirmationdialogComponent, ConfirmDialogModel } from '../../../dialog/confirmationdialog/confirmationdialog.component';

@Component({
  selector: 'app-trade-request-action',
  templateUrl: './trade-request-action.component.html',
  styleUrls: ['./trade-request-action.component.scss']
})
export class TradeRequestActionComponent implements OnInit {

  //////////Authors : Aswathy///////

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  approvedstartdate;
  approvedenddate;
  traderequestdetailsbyID;
  traderequestDetails$;
  statuscurrentdate;
  assignmentdetails;
  assignmentdetails1;
  StatusKey;
  statuscomments;
  requestdetails;
  editflag;
  Status: String;
  details;

  checkFlag;
  options: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2030,
    displayFormat: 'MM/DD/YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    //locale: frLocale,
    //minDate: new Date(Date.now()), // Minimal selectable date
    //maxDate: new Date(Date.now()),  // Maximal selectable date
    barTitleIfEmpty: 'Click to select a date',
    placeholder: 'Click to select a date', // HTML input placeholder attribute (default: '')
    addClass: 'form-control', // Optional, value to pass on to [ngClass] on the input field
    addStyle: { 'font-size': '18px', 'width': '75%', 'border': '1px solid #ced4da', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };

  options1: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2030,
    displayFormat: 'MM/DD/YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    //locale: frLocale,
    //minDate: new Date(Date.now()), // Minimal selectable date
    //maxDate: new Date(Date.now()),  // Maximal selectable date
    barTitleIfEmpty: 'Click to select a date',
    placeholder: 'Click to select a date', // HTML input placeholder attribute (default: '')
    addClass: '', // Optional, value to pass on to [ngClass] on the input field
    addStyle: { 'font-size': '18px', 'width': '75%', 'border': '1px solid #ced4da', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };

  convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(- 2),
      day = ("0" + date.getDate()).slice(- 2);
    return [date.getFullYear(), mnth, day].join("-");
  };

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

  charValidation(event: any) {
    const patternChar = /[a-zA-Z ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !patternChar.test(inputChar)) {
      event.preventDefault();
    }
  }
  goBack() {
    if (this.role == 'Manager') {
      this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['TradeRequestsFromEmployees'] } }]);
    } else if (this.role == 'Supervisor') {
      this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['TradeRequestsFromEmployees'] } }]);
    }
  }
  constructor(private PeopleServiceService: PeopleServiceService, private route: ActivatedRoute, private router: Router, private dst: DataServiceTokenStorageService, private dialog: MatDialog) {
    this.route.params.subscribe(params => this.traderequestDetails$ = params.requestID);
  }

  // Function to save the approval/rejection of trade 
  saveTradeRequestAction() {

    this.checkFlag = true;
    if (!(this.traderequestdetailsbyID.Status)) {
      // alert('Status is not provided !');
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Status is not provided !',
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

    if ((this.traderequestdetailsbyID.Status) == "Approved") {

      if (!(this.traderequestdetailsbyID.ApproverApprovedStartDate)) {
        // alert('Approved Start Date is not provided !');
        const dialogRef = this.dialog.open(AlertdialogComponent, {
          data: {
            message: 'Approved Start Date is not provided !',
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

      if (!(this.traderequestdetailsbyID.ApproverApprovedEndDate)) {
        // alert('Approved End Date is not provided !');
        const dialogRef = this.dialog.open(AlertdialogComponent, {
          data: {
            message: 'Approved End Date is not provided !',
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


      if ((this.convert_DT(this.traderequestdetailsbyID.ApproverApprovedStartDate) < this.convert_DT(this.traderequestdetailsbyID.StartDate)) || (this.convert_DT(this.traderequestdetailsbyID.ApproverApprovedStartDate) > this.convert_DT(this.traderequestdetailsbyID.EndDate))) {
        // alert("Approved start date must be between requested dates!");

        const dialogRef = this.dialog.open(AlertdialogComponent, {
          data: {
            message: 'Approved start date must be between requested dates!',
            buttonText: {
              cancel: 'Done'
            }
          },
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          this.checkFlag = false;
          return;
        });
      } else {
        this.traderequestdetailsbyID.ApproverApprovedStartDate = this.convert_DT(this.traderequestdetailsbyID.ApproverApprovedStartDate);
      }
      if ((this.convert_DT(this.traderequestdetailsbyID.ApproverApprovedEndDate) < this.convert_DT(this.traderequestdetailsbyID.StartDate)) || (this.convert_DT(this.traderequestdetailsbyID.ApproverApprovedEndDate) > this.convert_DT(this.traderequestdetailsbyID.EndDate))) {
        // alert("Approved end date must be between requested dates!");
        const dialogRef = this.dialog.open(AlertdialogComponent, {
          data: {
            message: 'Approved end date must be between requested dates!',
            buttonText: {
              cancel: 'Done'
            }
          },
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          this.checkFlag = false;
          return;
        });
      } else {
        this.traderequestdetailsbyID.ApproverApprovedEndDate = this.convert_DT(this.traderequestdetailsbyID.ApproverApprovedEndDate);
      }

      if ((this.traderequestdetailsbyID.ApproverComments)) {
        var comments = this.traderequestdetailsbyID.ApproverComments.trim();
      }
    } else if ((this.traderequestdetailsbyID.Status) == "Rejected") {
      if (!(this.traderequestdetailsbyID.ApproverComments)) {
        // alert("Status comments can't be empty");
        const dialogRef = this.dialog.open(AlertdialogComponent, {
          data: {
            message: "Status comments can't be empty",
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
        var comments = this.traderequestdetailsbyID.ApproverComments.trim();
      }
      this.traderequestdetailsbyID.ApproverApprovedStartDate = null;
      this.traderequestdetailsbyID.ApproverApprovedEndDate = null;
    }

    this.PeopleServiceService.saveTradeRequestAction(this.traderequestDetails$, this.employeekey,
      this.statuscurrentdate, this.traderequestdetailsbyID.ApproverApprovedStartDate, this.traderequestdetailsbyID.ApproverApprovedEndDate,
      this.traderequestdetailsbyID.Status, comments)
      .subscribe((data: any[]) => {
        this.details = data[0];
        // alert("Request updated Successfully");
        const dialogRef = this.dialog.open(AlertdialogComponent, {
          data: {
            message: "Status comments can't be empty",
            buttonText: {
              cancel: 'Done'
            }
          },
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          this.checkFlag = false;
          if (this.role == 'Manager') {
            this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['TradeRequestsFromEmployees'] } }]);
          } else if (this.role == 'Supervisor') {
            this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['TradeRequestsFromEmployees'] } }]);
          }
        });
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
    this.statuscurrentdate = this.convert_DT(new Date());
    this.editflag = false;

    this.checkFlag = false;
    this.PeopleServiceService.getTradeRequestdetailsbyID(this.traderequestDetails$)
      .subscribe((data) => {
        this.traderequestdetailsbyID = data[0];
        this.traderequestdetailsbyID.Status = '';
      });

    this.PeopleServiceService.getAssignmentTradebyID(this.traderequestDetails$)
      .subscribe((data: any) => {
        if (data.length > 0) {
          this.assignmentdetails1 = data;
          var hi = "";
          for (var i = 0; i < this.assignmentdetails1.length; i++) {
            hi = hi + (i + 1) + ". " + this.assignmentdetails1[i].BatchSchduleName + "\n";
          }
          this.assignmentdetails = hi;
        } else if (data.length == 0) {
          this.assignmentdetails = "No Assignments found";
        }
      });
  }
}
