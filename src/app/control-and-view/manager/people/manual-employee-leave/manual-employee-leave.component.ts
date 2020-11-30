import { Component, OnInit } from '@angular/core';
import { DatepickerOptions } from 'ng2-datepicker';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PeopleServiceService } from '../../../../service/people-service.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-manual-employee-leave',
  templateUrl: './manual-employee-leave.component.html',
  styleUrls: ['./manual-employee-leave.component.scss']
})
export class ManualEmployeeLeaveComponent implements OnInit {
  fromdate: Date;
  todate: Date;
  role: String;
  name: String;
  IsSupervisor: Number;
  OrganizationID: Number;
  employeekey: number;
  reason;
  reasonID;
  empKey$;

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

  options: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2030,
    displayFormat: 'MM/DD/YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    firstCalendarDay: 0,
    barTitleIfEmpty: 'Click to select a date',
    placeholder: 'Click to select a date', // HTML input placeholder attribute (default: '')
    addClass: '', // Optional, value to pass on to [ngClass] on the input field
    addStyle: { 'font-size': '18px', 'width': '100%', 'border': '1px solid #ced4da', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };

  public convert_DT(str) { //converting date to yyyy/mm/dd format
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  public date: Date = new Date(Date.now());

  constructor(private peopleService: PeopleServiceService, private route: ActivatedRoute, private _location: Location) {
    this.route.params.subscribe(params => this.empKey$ = params.EmployeeKey);
  }

  ngOnInit() {
    // token starts....
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;
    // token ends....

    this.fromdate = new Date();
    this.todate = new Date();
    this.reasonID = ""
    this.peopleService.getAllReasons(this.OrganizationID).subscribe((data: any[]) => {
      this.reason = data;
    });
  }

  saveLeave() {
    if (!this.reasonID) {
      alert("Please select a reason!!!");
      return;
    }
    if (!this.fromdate) {
      alert("Please provide a from date!!!");
      return;
    } if (!this.todate) {
      alert("Please provide a to date!!!");
      return;
    }
    this.peopleService.saveManualLeaveForEmployee(this.reasonID, this.convert_DT(this.fromdate), this.convert_DT(this.todate), this.empKey$, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
      alert("Manual leave for employee inserted successfully...");

      this._location.back();
    });
  }
  goBack() {
    this._location.back();
  }
}
