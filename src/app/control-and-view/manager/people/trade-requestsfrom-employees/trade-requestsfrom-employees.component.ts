import { Component, OnInit } from '@angular/core';
import { PeopleServiceService } from "../../../../service/people-service.service";
import { DatepickerOptions } from 'ng2-datepicker';

@Component({
  selector: 'app-trade-requestsfrom-employees',
  templateUrl: './trade-requestsfrom-employees.component.html',
  styleUrls: ['./trade-requestsfrom-employees.component.scss']
})
export class TradeRequestsfromEmployeesComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  curr_date;
  startdate;
  enddate;
  comments;
  traderequestdetails;
  tradestatus;
  fromdate;
  todate;
  tradeStatusKey;
  tradeobj;
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

  public convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }

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
    addClass: '', // Optional, value to pass on to [ngClass] on the input field
    addStyle: { 'font-size': '18px', 'width': '75%', 'border': '1px solid #ced4da', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };

  constructor(private PeopleServiceService: PeopleServiceService) { }

  ngOnInit() {

    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;

    this.fromdate = new Date(Date.now());
    this.todate = new Date(Date.now());
    this.tradeStatusKey = '0';
    var tstatus = null;

    this.tradeobj = {
      fromdate: this.convert_DT(this.fromdate),
      todate: this.convert_DT(this.todate),
      TradeStatuses: tstatus,

      OrganizationID: this.OrganizationID,
      employeekey: this.employeekey
    };
    this.PeopleServiceService.getTradeRequestdetailsforManager(this.tradeobj)
      .subscribe((data) => {
        this.traderequestdetails = data;
      });

    this.PeopleServiceService.getTradeStatus(this.OrganizationID)
      .subscribe((data) => {
        this.tradestatus = data;
      });
  }

  viewtrade(fromdate, todate, tradeStat) {

    if ((todate) && (this.convert_DT(fromdate) > this.convert_DT(todate))) {
      todate = null;
      alert("Please check your Start Date!");
      return;
    }
    else {
      var fdate;
      var tdate;
      fdate = this.convert_DT(fromdate);
      tdate = this.convert_DT(todate);

      var tstatus;
      if (!tradeStat) {
        tstatus = null;
      }
      else if (tradeStat == '0') {
        tstatus = null;
      }
      else {
        tstatus = tradeStat;
      }

      this.tradeobj = {
        fromdate: fdate,
        todate: tdate,
        TradeStatuses: tstatus,

        OrganizationID: this.OrganizationID,
        employeekey: this.employeekey
      };

      this.PeopleServiceService.getTradeRequestdetailsforManager(this.tradeobj)
        .subscribe((data) => {
          this.traderequestdetails = data;
        });
    }
  }
}
