import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { DatepickerOptions } from 'ng2-datepicker';
import { WorkOrderServiceService } from '../../../../service/work-order-service.service';
import { SchedulingService } from '../../../../service/scheduling.service';


@Component({
  selector: 'app-view-service-request',
  templateUrl: './view-service-request.component.html',
  styleUrls: ['./view-service-request.component.scss']
})
export class ViewServiceRequestComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  EmployeeKey;

  fromdate;
  todate;
  requestdetails;
  vpto;

  curdate;
  curtime;
  EmployeeOption;

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

  constructor(private WorkOrderServiceService: WorkOrderServiceService,private SchedulingService: SchedulingService) { }

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


    this.fromdate = this.convert_DT(this.fromdate);
    this.todate = this.convert_DT(this.todate);


    this.vpto = {
      fromdate: this.fromdate,
      todate: this.todate,

      OrganizationID: this.OrganizationID,
      employeekey: this.employeekey
    };
    // this.PeopleServiceService.getRequestdetailsforManager(this.employeekey, this.OrganizationID)
    //   .subscribe((data) => {
    //     this.requestdetails = data;
    //   });

    this.WorkOrderServiceService.getviewWorkorderservicerequest(this.vpto)
      .subscribe((data) => {
        this.requestdetails = data;
      });
      this.SchedulingService.getEmployeesForSchedulerReport(this.OrganizationID)
      .subscribe((data: any[]) => {
        this.EmployeeOption = data;
      });
  }

  viewserviceRequest(fromdate, todate) {

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
      this.fromdate = fdate;
      this.todate = tdate;
      this.vpto = {
        fromdate: fdate,
        todate: tdate,
        OrganizationID: this.OrganizationID,
        employeekey: this.employeekey
      };

      this.WorkOrderServiceService.getviewWorkorderservicerequest(this.vpto)
        .subscribe((data) => {
          this.requestdetails = data;
        });
    }
  }

  createworkorderbyservicerequest(servicerequestid,empKey) {

    this.curdate = new Date(Date.now());

    var h = this.curdate.getHours();
    var mi = this.curdate.getMinutes();
    var s = this.curdate.getSeconds();

    this.curdate = this.convert_DT(this.curdate);
    this.curtime = h + ":" + mi + ":" + s;
    this.vpto = {
      date1: this.curdate,
      time1: this.curtime,
      servicerequestid: servicerequestid,
      OrganizationID: this.OrganizationID,
      employeekey: this.employeekey,
      CreateEmpKey:empKey
    };
    if(!empKey){
      alert("Employee not provided !");
      return;
    }
    this.WorkOrderServiceService.generateWorkorderbyservicerequest(this.vpto)
      .subscribe((data: any[]) => {
        this.requestdetails = data;
        if (data.length > 0) {
          alert("WorkOrder created successfully");
          this.viewserviceRequest(this.fromdate, this.todate);
        }
      });

  }

}
