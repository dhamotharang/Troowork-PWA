import { Component, OnInit } from '@angular/core';
import { People } from '../../../../model-class/People';
import { ActivatedRoute, Router } from "@angular/router";
import { PeopleServiceService } from '../../../../service/people-service.service';
import { DatepickerOptions } from 'ng2-datepicker';

@Component({
  selector: 'app-view-employee-weekly-schedule-detail',
  templateUrl: './view-employee-weekly-schedule-detail.component.html',
  styleUrls: ['./view-employee-weekly-schedule-detail.component.scss']
})
export class ViewEmployeeWeeklyScheduleDetailComponent implements OnInit {

  marked = true;

  editempdtails;
  empk$: Object;
  BirthDate: Date;

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  empNum;
  statusFlag;

  fname;
  lname;
  mname;
  enumber;
  egender;
  //Author: Prakash Code Starts for Employee Calendar Starts Here

  schedularcount = 0;

  schedulerexception: People[];
  exceptionweekend: People[];

  sch_exception: People[];
  idscheduler_exception;

  sch_exception_weekend: People[];
  idmaster_exception_weekend;

  isemployeecalendar;

  masterhour: People[];
  masterminute: People[];

  idemployeegrouping;

  employeegrouping: People[];

  exceptionstartdate: Date;
  exceptionsdate;

  showHide;

  //Author: Prakash Code Starts for Employee Calendar Ends Here

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

  // adding properties and methods that will be used by the igxDatePicker
  public date: Date = new Date(Date.now());

  // private dayFormatter = new Intl.DateTimeFormat('en', { weekday: 'long' });
  // private monthFormatter = new Intl.DateTimeFormat('en', { month: 'long' });

  // public formatter = (_: Date) => {
  //   return `You selected ${this.dayFormatter.format(_)}, ${_.getDate()} ${this.monthFormatter.format(_)}, ${_.getFullYear()}`;
  // }
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
  convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(- 2),
      day = ("0" + date.getDate()).slice(- 2);
    return [date.getFullYear(), mnth, day].join("-");
  };

  constructor(private route: ActivatedRoute, private PeopleServiceService: PeopleServiceService, private router: Router) {
    this.route.params.subscribe(params => this.empk$ = params.EmployeeKey);
  }

  numberValid(event: any) {
    const pattern = /[0-9\+\-\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  charValidation(event: any) {
    const patternChar = /[a-zA-Z ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !patternChar.test(inputChar)) {
      event.preventDefault();
    }
  }

  createeditweeklyschedule(start_sun_hour, start_sun_min, start_sun_format, start_mon_hour, start_mon_min, start_mon_format, start_tue_hour, start_tue_min, start_tue_format, start_wed_hour, start_wed_min, start_wed_format, start_thu_hour, start_thu_min, start_thu_format, start_fri_hour, start_fri_min, start_fri_format, start_sat_hour, start_sat_min, start_sat_format, end_sun_hour, end_sun_min, end_sun_format, end_mon_hour, end_mon_min, end_mon_format, end_tue_hour, end_tue_min, end_tue_format, end_wed_hour, end_wed_min, end_wed_format, end_thu_hour, end_thu_min, end_thu_format, end_fri_hour, end_fri_min, end_fri_format, end_sat_hour, end_sat_min, end_sat_format, idscheduler_exception, idemployeegrouping, exceptionstdate) {

    if (!(idemployeegrouping)) {
      alert('Please Select Employee Group');
      return;
    }

    this.schedularcount = 0;

    //Author: Prakash Code Starts for Employee Calendar Starts Here
    if (start_sun_hour == '-1' && start_sun_min == '-1' && end_sun_hour == '-1' && end_sun_min == '-1') {
      this.schedularcount = this.schedularcount;
    }
    else if (start_sun_hour != '-1' && start_sun_min != '-1' && end_sun_hour != '-1' && end_sun_min != '-1') {
      this.schedularcount = this.schedularcount;
    }
    else {
      this.schedularcount++;
      alert('Values Missing in Sunday');
      return;
    }

    if (start_mon_hour == '-1' && start_mon_min == '-1' && end_mon_hour == '-1' && end_mon_min == '-1') {
      this.schedularcount = this.schedularcount;
    }
    else if (start_mon_hour != '-1' && start_mon_min != '-1' && end_mon_hour != '-1' && end_mon_min != '-1') {
      this.schedularcount = this.schedularcount;
    }
    else {
      this.schedularcount++;
      alert('Values Missing in Monday');
      return;
    }

    if (start_tue_hour == '-1' && start_tue_min == '-1' && end_tue_hour == '-1' && end_tue_min == '-1') {
      this.schedularcount = this.schedularcount;
    }
    else if (start_tue_hour != '-1' && start_tue_min != '-1' && end_tue_hour != '-1' && end_tue_min != '-1') {
      this.schedularcount = this.schedularcount;
    }
    else {
      this.schedularcount++;
      alert('Values Missing in Tuesday');
      return;
    }

    if (start_wed_hour == '-1' && start_wed_min == '-1' && end_wed_hour == '-1' && end_wed_min == '-1') {
      this.schedularcount = this.schedularcount;
    }
    else if (start_wed_hour != '-1' && start_wed_min != '-1' && end_wed_hour != '-1' && end_wed_min != '-1') {
      this.schedularcount = this.schedularcount;
    }
    else {
      this.schedularcount++;
      alert('Values Missing in Wednesday');
      return;
    }

    if (start_thu_hour == '-1' && start_thu_min == '-1' && end_thu_hour == '-1' && end_thu_min == '-1') {
      this.schedularcount = this.schedularcount;
    }
    else if (start_thu_hour != '-1' && start_thu_min != '-1' && end_thu_hour != '-1' && end_thu_min != '-1') {
      this.schedularcount = this.schedularcount;
    }
    else {
      this.schedularcount++;
      alert('Values Missing in Thursday');
      return;
    }

    if (start_fri_hour == '-1' && start_fri_min == '-1' && end_fri_hour == '-1' && end_fri_min == '-1') {
      this.schedularcount = this.schedularcount;
    }
    else if (start_fri_hour != '-1' && start_fri_min != '-1' && end_fri_hour != '-1' && end_fri_min != '-1') {
      this.schedularcount = this.schedularcount;
    }
    else {
      this.schedularcount++;
      alert('Values Missing in Friday');
      return;
    }

    if (start_sat_hour == '-1' && start_sat_min == '-1' && end_sat_hour == '-1' && end_sat_min == '-1') {
      this.schedularcount = this.schedularcount;
    }
    else if (start_sat_hour != '-1' && start_sat_min != '-1' && end_sat_hour != '-1' && end_sat_min != '-1') {
      this.schedularcount = this.schedularcount;
    } else {
      this.schedularcount++;
      alert('Values Missing in Saturday');
      return;
    }

    // var empNum ;
    if (!idscheduler_exception) {
      idscheduler_exception = null;
      this.exceptionsdate = null;
    }
    else {
      this.exceptionsdate = this.convert_DT(exceptionstdate);
    }

    if (this.schedularcount == 0) {
      this.PeopleServiceService.Employeecreateeditweeklyschedule(this.empk$, this.employeekey, this.OrganizationID, start_sun_hour, start_sun_min, start_sun_format, start_mon_hour, start_mon_min, start_mon_format, start_tue_hour, start_tue_min, start_tue_format, start_wed_hour, start_wed_min, start_wed_format, start_thu_hour, start_thu_min, start_thu_format, start_fri_hour, start_fri_min, start_fri_format, start_sat_hour, start_sat_min, start_sat_format, end_sun_hour, end_sun_min, end_sun_format, end_mon_hour, end_mon_min, end_mon_format, end_tue_hour, end_tue_min, end_tue_format, end_wed_hour, end_wed_min, end_wed_format, end_thu_hour, end_thu_min, end_thu_format, end_fri_hour, end_fri_min, end_fri_format, end_sat_hour, end_sat_min, end_sat_format, idscheduler_exception, idemployeegrouping, this.exceptionsdate)
        .subscribe((data: People[]) => {
          alert("Updated Successfully!");
          // this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewEmployee'] } }]);
          if (this.role == 'Manager') {
            this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ScheduleEmployee'] } }]);
          }
          // else if (this.role == 'Employee' && this.IsSupervisor == 1) {
          else if (this.role == 'Supervisor') {
            this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['ViewEmployee'] } }]);
          }
        });


    }
    else {
      alert('Weekly Schedule!');
      return;
    }

    //Author: Prakash Code Starts for Employee Calendar Ends Here

  }

  ngOnInit() {

    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;
    this.isemployeecalendar = profile.isemployeecalendar;//Author: Prakash for Checking Whether the organization uses Calendar or not

    if (this.OrganizationID == 223 || this.OrganizationID == 134) {
      this.showHide = true;
    } else {
      this.showHide = false;
    }
    this.PeopleServiceService.EditEmployeeDetailsbyManager(this.empk$, this.OrganizationID).subscribe((data: Array<any>) => {
      this.editempdtails = data[0];
      this.BirthDate = this.editempdtails.BirthDate;
      this.empNum = this.editempdtails.EmployeeNumber;
      this.fname = this.editempdtails.FirstName;
      this.lname = this.editempdtails.LastName;
      this.mname = this.editempdtails.MiddleName;
      this.egender = this.editempdtails.Gender;


      //Author: Prakash Code Starts for Employee Calendar Starts Here

      if (!(this.editempdtails.EmployeeGroupID)) {
        this.idemployeegrouping = '';
      }
      else {
        this.idemployeegrouping = this.editempdtails.EmployeeGroupID;
      }

      if (!(this.editempdtails.Idscheduler_exception)) {
        this.idscheduler_exception = '';
        this.idmaster_exception_weekend = '';
      }
      else {
        this.idscheduler_exception = this.editempdtails.Idscheduler_exception;
        this.idmaster_exception_weekend = '';
        // this.exceptionstartdate=this.editempdtails.exceptionsdate;
        // this.idmaster_exception_weekend = this.editempdtails.Idmaster_exception_weekend;
      }

      if (!(this.editempdtails.exceptionsdate)) {
        this.exceptionstartdate = new Date(Date.now());
      }
      else {
        this.exceptionstartdate = this.editempdtails.exceptionsdate;
      }

      if (!(this.editempdtails.start_sun_hour)) { this.editempdtails.start_sun_hour = '-1'; }
      if (!(this.editempdtails.start_sun_min)) { this.editempdtails.start_sun_min = '-1'; }
      if (!(this.editempdtails.start_sun_format)) { this.editempdtails.start_sun_format = 'AM'; }
      if (!(this.editempdtails.start_mon_hour)) { this.editempdtails.start_mon_hour = '-1'; }
      if (!(this.editempdtails.start_mon_min)) { this.editempdtails.start_mon_min = '-1'; }
      if (!(this.editempdtails.start_mon_format)) { this.editempdtails.start_mon_format = 'AM'; }
      if (!(this.editempdtails.start_tue_hour)) { this.editempdtails.start_tue_hour = '-1'; }
      if (!(this.editempdtails.start_tue_min)) { this.editempdtails.start_tue_min = '-1'; }
      if (!(this.editempdtails.start_tue_format)) { this.editempdtails.start_tue_format = 'AM'; }
      if (!(this.editempdtails.start_wed_hour)) { this.editempdtails.start_wed_hour = '-1'; }
      if (!(this.editempdtails.start_wed_min)) { this.editempdtails.start_wed_min = '-1'; }
      if (!(this.editempdtails.start_wed_format)) { this.editempdtails.start_wed_format = 'AM'; }
      if (!(this.editempdtails.start_thu_hour)) { this.editempdtails.start_thu_hour = '-1'; }
      if (!(this.editempdtails.start_thu_min)) { this.editempdtails.start_thu_min = '-1'; }
      if (!(this.editempdtails.start_thu_format)) { this.editempdtails.start_thu_format = 'AM'; }
      if (!(this.editempdtails.start_fri_hour)) { this.editempdtails.start_fri_hour = '-1'; }
      if (!(this.editempdtails.start_fri_min)) { this.editempdtails.start_fri_min = '-1'; }
      if (!(this.editempdtails.start_fri_format)) { this.editempdtails.start_fri_format = 'AM'; }
      if (!(this.editempdtails.start_sat_hour)) { this.editempdtails.start_sat_hour = '-1'; }
      if (!(this.editempdtails.start_sat_min)) { this.editempdtails.start_sat_min = '-1'; }
      if (!(this.editempdtails.start_sat_format)) { this.editempdtails.start_sat_format = 'AM'; }
      if (!(this.editempdtails.end_sun_hour)) { this.editempdtails.end_sun_hour = '-1'; }
      if (!(this.editempdtails.end_sun_min)) { this.editempdtails.end_sun_min = '-1'; }
      if (!(this.editempdtails.end_sun_format)) { this.editempdtails.end_sun_format = 'AM'; }
      if (!(this.editempdtails.end_mon_hour)) { this.editempdtails.end_mon_hour = '-1'; }
      if (!(this.editempdtails.end_mon_min)) { this.editempdtails.end_mon_min = '-1'; }
      if (!(this.editempdtails.end_mon_format)) { this.editempdtails.end_mon_format = 'AM'; }
      if (!(this.editempdtails.end_tue_hour)) { this.editempdtails.end_tue_hour = '-1'; }
      if (!(this.editempdtails.end_tue_min)) { this.editempdtails.end_tue_min = '-1'; }
      if (!(this.editempdtails.end_tue_format)) { this.editempdtails.end_tue_format = 'AM'; }
      if (!(this.editempdtails.end_wed_hour)) { this.editempdtails.end_wed_hour = '-1'; }
      if (!(this.editempdtails.end_wed_min)) { this.editempdtails.end_wed_min = '-1'; }
      if (!(this.editempdtails.end_wed_format)) { this.editempdtails.end_wed_format = 'AM'; }
      if (!(this.editempdtails.end_thu_hour)) { this.editempdtails.end_thu_hour = '-1'; }
      if (!(this.editempdtails.end_thu_min)) { this.editempdtails.end_thu_min = '-1'; }
      if (!(this.editempdtails.end_thu_format)) { this.editempdtails.end_thu_format = 'AM'; }
      if (!(this.editempdtails.end_fri_hour)) { this.editempdtails.end_fri_hour = '-1'; }
      if (!(this.editempdtails.end_fri_min)) { this.editempdtails.end_fri_min = '-1'; }
      if (!(this.editempdtails.end_fri_format)) { this.editempdtails.end_fri_format = 'AM'; }
      if (!(this.editempdtails.end_sat_hour)) { this.editempdtails.end_sat_hour = '-1'; }
      if (!(this.editempdtails.end_sat_min)) { this.editempdtails.end_sat_min = '-1'; }
      if (!(this.editempdtails.end_sat_format)) { this.editempdtails.end_sat_format = 'AM'; }

      //Author: Prakash Code Starts for Employee Calendar Ends Here

    });






    this.PeopleServiceService
      .getallemployeegrouping(this.OrganizationID)
      .subscribe((data: People[]) => {
        this.employeegrouping = data;
      });
    //Author: Prakash Code Starts for Employee Calendar Starts Here

    this.PeopleServiceService
      .getallschedulingexception(this.OrganizationID)
      .subscribe((data: People[]) => {
        this.schedulerexception = data;
      });
    this.PeopleServiceService
      .getallexceptionweekend()
      .subscribe((data: People[]) => {
        this.exceptionweekend = data;
      });
    this.PeopleServiceService
      .getallmasterhour()
      .subscribe((data: People[]) => {
        this.masterhour = data;
      });
    this.PeopleServiceService
      .getallmasterminute()
      .subscribe((data: People[]) => {
        this.masterminute = data;
      });
    //Author: Prakash Code Starts for Employee Calendar Ends Here

  }

  toggleVisibility(e) {
    if (e.target.checked) {
      this.marked = false;
    } else {
      this.marked = true;
    }
  }
  GoBack() {
    // this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewEmployee'] } }]);
    if (this.role == 'Manager') {
      this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ScheduleEmployee'] } }]);
    }
    // else if (this.role == 'Employee' && this.IsSupervisor == 1) {
    else if (this.role == 'Supervisor') {
      this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['ViewEmployee'] } }]);
    }
  }

  statusChanged(statusKey) {
    if (statusKey != 1 && statusKey != "") {
      this.statusFlag = true;
    }
    else {
      this.statusFlag = false;
    }

  }

  getweeklyschedulebyonchange(employeegroupid) {
    if (!employeegroupid) {

    }
    else {
      this.PeopleServiceService.getweeklyschedulebyEmployeeGroupid(employeegroupid).subscribe((data: Array<any>) => {
        this.editempdtails = data[0];
        // this.BirthDate = this.editempdtails.BirthDate;
        // this.HireDate = this.editempdtails.HireDate;
        // this.empNum = this.editempdtails.EmployeeNumber;
        // if (this.editempdtails.EmployeeStatusKey != 1 && this.editempdtails.EmployeeStatusKey != "") {
        //   this.statusFlag = true;
        //   this.remark = this.editempdtails.Remark;
        // }

        //Author: Prakash Code Starts for Employee Calendar Starts Here

        this.idemployeegrouping = this.editempdtails.EmployeeGroupID;

        if (!(this.editempdtails.Idscheduler_exception)) {
          this.idscheduler_exception = '';
          this.idmaster_exception_weekend = '';
        }
        else {
          this.idscheduler_exception = this.editempdtails.Idscheduler_exception;
          this.idmaster_exception_weekend = '';
          // this.idmaster_exception_weekend = this.editempdtails.Idmaster_exception_weekend;
        }

        if (!(this.editempdtails.start_sun_hour)) { this.editempdtails.start_sun_hour = '-1'; }
        if (!(this.editempdtails.start_sun_min)) { this.editempdtails.start_sun_min = '-1'; }
        if (!(this.editempdtails.start_sun_format)) { this.editempdtails.start_sun_format = 'AM'; }
        if (!(this.editempdtails.start_mon_hour)) { this.editempdtails.start_mon_hour = '-1'; }
        if (!(this.editempdtails.start_mon_min)) { this.editempdtails.start_mon_min = '-1'; }
        if (!(this.editempdtails.start_mon_format)) { this.editempdtails.start_mon_format = 'AM'; }
        if (!(this.editempdtails.start_tue_hour)) { this.editempdtails.start_tue_hour = '-1'; }
        if (!(this.editempdtails.start_tue_min)) { this.editempdtails.start_tue_min = '-1'; }
        if (!(this.editempdtails.start_tue_format)) { this.editempdtails.start_tue_format = 'AM'; }
        if (!(this.editempdtails.start_wed_hour)) { this.editempdtails.start_wed_hour = '-1'; }
        if (!(this.editempdtails.start_wed_min)) { this.editempdtails.start_wed_min = '-1'; }
        if (!(this.editempdtails.start_wed_format)) { this.editempdtails.start_wed_format = 'AM'; }
        if (!(this.editempdtails.start_thu_hour)) { this.editempdtails.start_thu_hour = '-1'; }
        if (!(this.editempdtails.start_thu_min)) { this.editempdtails.start_thu_min = '-1'; }
        if (!(this.editempdtails.start_thu_format)) { this.editempdtails.start_thu_format = 'AM'; }
        if (!(this.editempdtails.start_fri_hour)) { this.editempdtails.start_fri_hour = '-1'; }
        if (!(this.editempdtails.start_fri_min)) { this.editempdtails.start_fri_min = '-1'; }
        if (!(this.editempdtails.start_fri_format)) { this.editempdtails.start_fri_format = 'AM'; }
        if (!(this.editempdtails.start_sat_hour)) { this.editempdtails.start_sat_hour = '-1'; }
        if (!(this.editempdtails.start_sat_min)) { this.editempdtails.start_sat_min = '-1'; }
        if (!(this.editempdtails.start_sat_format)) { this.editempdtails.start_sat_format = 'AM'; }
        if (!(this.editempdtails.end_sun_hour)) { this.editempdtails.end_sun_hour = '-1'; }
        if (!(this.editempdtails.end_sun_min)) { this.editempdtails.end_sun_min = '-1'; }
        if (!(this.editempdtails.end_sun_format)) { this.editempdtails.end_sun_format = 'AM'; }
        if (!(this.editempdtails.end_mon_hour)) { this.editempdtails.end_mon_hour = '-1'; }
        if (!(this.editempdtails.end_mon_min)) { this.editempdtails.end_mon_min = '-1'; }
        if (!(this.editempdtails.end_mon_format)) { this.editempdtails.end_mon_format = 'AM'; }
        if (!(this.editempdtails.end_tue_hour)) { this.editempdtails.end_tue_hour = '-1'; }
        if (!(this.editempdtails.end_tue_min)) { this.editempdtails.end_tue_min = '-1'; }
        if (!(this.editempdtails.end_tue_format)) { this.editempdtails.end_tue_format = 'AM'; }
        if (!(this.editempdtails.end_wed_hour)) { this.editempdtails.end_wed_hour = '-1'; }
        if (!(this.editempdtails.end_wed_min)) { this.editempdtails.end_wed_min = '-1'; }
        if (!(this.editempdtails.end_wed_format)) { this.editempdtails.end_wed_format = 'AM'; }
        if (!(this.editempdtails.end_thu_hour)) { this.editempdtails.end_thu_hour = '-1'; }
        if (!(this.editempdtails.end_thu_min)) { this.editempdtails.end_thu_min = '-1'; }
        if (!(this.editempdtails.end_thu_format)) { this.editempdtails.end_thu_format = 'AM'; }
        if (!(this.editempdtails.end_fri_hour)) { this.editempdtails.end_fri_hour = '-1'; }
        if (!(this.editempdtails.end_fri_min)) { this.editempdtails.end_fri_min = '-1'; }
        if (!(this.editempdtails.end_fri_format)) { this.editempdtails.end_fri_format = 'AM'; }
        if (!(this.editempdtails.end_sat_hour)) { this.editempdtails.end_sat_hour = '-1'; }
        if (!(this.editempdtails.end_sat_min)) { this.editempdtails.end_sat_min = '-1'; }
        if (!(this.editempdtails.end_sat_format)) { this.editempdtails.end_sat_format = 'AM'; }

        //Author: Prakash Code Starts for Employee Calendar Ends Here

      });
    }
  }

}
