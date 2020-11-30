import { Component, OnInit } from '@angular/core';
import { PeopleServiceService } from "../../../service/people-service.service";
import { DatepickerOptions } from 'ng2-datepicker';
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-trade-request-edit',
  templateUrl: './trade-request-edit.component.html',
  styleUrls: ['./trade-request-edit.component.scss']
})
export class TradeRequestEditComponent implements OnInit {

  role: String;
  name: String;
  toServeremployeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  traderequestdetails;
  editflag;
  traderequestID$;
  // curr_date;
  OtherEmployeedetails;
  EmployeeDetails;

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
    // barTitleIfEmpty: 'Click to select a date',
    // placeholder: 'Click to select a date', // HTML input placeholder attribute (default: '')
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
  constructor(public PeopleServiceService: PeopleServiceService, private router: Router, private route: ActivatedRoute) { this.route.params.subscribe(params => this.traderequestID$ = params.requestID); }

  submitEditedRequest() {

    if (!(this.traderequestdetails.StartDate)) {
      alert('Start Date is not provided !');
      return;
    }
    if (!(this.traderequestdetails.EndDate)) {
      alert('End Date is not provided !');
      return;
    }

    if (!(this.traderequestdetails.Comments)) {
      alert('Comments are not provided !');
      return;
    } else {
      var comments = this.traderequestdetails.Comments.trim();
      if (!(comments)) {
        alert('Comments are not provided !');
        return;
      }
    }

    if (!(this.traderequestdetails.OtherEmployeeKey)) {
      alert('Employee is not provided !');
      return;
    }

    var curr_date = this.convert_DT(new Date());

    if (this.convert_DT(curr_date) > this.convert_DT(this.traderequestdetails.StartDate)) {
      alert("Start Date can't be less than Today...!");
      return;
    }
    if (this.convert_DT(this.traderequestdetails.EndDate) < this.convert_DT(this.traderequestdetails.StartDate)) {
      alert("End Date can't be less than start date...!");
      return;
    }


    var comments = this.traderequestdetails.Comments.trim();

    this.PeopleServiceService.setEditedTradeRequest(curr_date, this.traderequestID$, this.traderequestdetails.OtherEmployeeKey,
      this.convert_DT(this.traderequestdetails.StartDate), this.convert_DT(this.traderequestdetails.EndDate), comments).subscribe((data) => {
        this.traderequestdetails = data;
        alert('Trade Request Updated Successfully');
        if (this.role == 'Employee') {
          this.router.navigate(['/EmployeeDashboard', { outlets: { EmployeeOut: ['ViewTradeRequest'] } }]);
        } else if (this.role == 'Supervisor') {
          this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['ViewTradeRequest'] } }]);
        }
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
    // this.curr_date = this.convert_DT(new Date());
    this.editflag = false;

    this.PeopleServiceService.getAllEmployeeNames(this.OrganizationID, this.toServeremployeekey)
      .subscribe((data) => {
        this.EmployeeDetails = data;
      });
    this.PeopleServiceService.getTradeRequestInfoforEmployee(this.traderequestID$, this.OrganizationID).subscribe((data) => {

      this.traderequestdetails = data[0];
    });
  }

  goBack() {
    if (this.role == 'Employee') {
      this.router.navigate(['/EmployeeDashboard', { outlets: { EmployeeOut: ['ViewTradeRequest'] } }]);
    } else if (this.role == 'Supervisor') {
      this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['ViewTradeRequest'] } }]);
    }
  }
}
