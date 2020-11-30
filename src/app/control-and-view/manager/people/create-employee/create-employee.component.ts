import { Component, OnInit, Input } from '@angular/core';
import { People } from '../../../../model-class/People';
import { PeopleServiceService } from '../../../../service/people-service.service';
import { ActivatedRoute, Router } from "@angular/router";
import { DatepickerOptions } from 'ng2-datepicker';
@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent implements OnInit {
  marked = true;

  useroletype: People[];
  jobtitle: People[];
  supervisor: People[];
  department: People[];
  EmployeeNumber;
  UserRoleTypeKey;
  FirstName: String;
  LastName: String;
  MiddleName: String;
  BirthDate;
  Gender: String;
  AddressLine1: any;
  City: String;
  AddressLine2: any;
  State: String;
  Country: String;
  PrimaryPhone: any;
  ZipCode: any;
  AlternatePhone: any;
  EmailID: any;
  HireDate;
  theCheckbox: any;
  JobTitleKey;
  SupervisorKey;
  DepartmentKey;
  temp_res;

  minDate;
  maxDate;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  roleTypeKey;
  OrganizationID;

  //Author: Prakash Code Starts for Employee Calendar Starts Here
  // start_sun_hour: String;
  // start_sun_min: String;
  // start_sun_format: String;

  // start_mon_hour: String;
  // start_mon_min: String;
  // start_mon_format: String;

  // start_tue_hour: String;
  // start_tue_min: String;
  // start_tue_format: String;

  // start_wed_hour: String;
  // start_wed_min: String;
  // start_wed_format: String;

  // start_thu_hour: String;
  // start_thu_min: String;
  // start_thu_format: String;

  // start_fri_hour: String;
  // start_fri_min: String;
  // start_fri_format: String;

  // start_sat_hour: String;
  // start_sat_min: String;
  // start_sat_format: String;

  // end_sun_hour: String;
  // end_sun_min: String;
  // end_sun_format: String;

  // end_mon_hour: String;
  // end_mon_min: String;
  // end_mon_format: String;

  // end_tue_hour: String;
  // end_tue_min: String;
  // end_tue_format: String;

  // end_wed_hour: String;
  // end_wed_min: String;
  // end_wed_format: String;

  // end_thu_hour: String;
  // end_thu_min: String;
  // end_thu_format: String;

  // end_fri_hour: String;
  // end_fri_min: String;
  // end_fri_format: String;

  // end_sat_hour: String;
  // end_sat_min: String;
  // end_sat_format: String;

  // schedulerexception: People[];
  // exceptionweekend: People[];

  // sch_exception: People[];
  // idscheduler_exception;

  // sch_exception_weekend: People[];
  // idmaster_exception_weekend;

  // isemployeecalendar;

  // schedularcount = 0;

  // masterhour: People[];
  // masterminute: People[];

  // employeegrouping: People[];
  // idemployeegrouping;

  // exceptionstartdate;

  //Author: Prakash Code Starts for Employee Calendar Ends Here


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



  constructor(private route: ActivatedRoute, private PeopleServiceService: PeopleServiceService, private router: Router) { }

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

  createEmployee() {
    // this.schedularcount = 0;
    var managerkey;
    var IsSupervisor;
    // managerkey = this.employeekey;
    if (!(this.EmployeeNumber) || !this.EmployeeNumber.trim()) {
      alert("Employee Number Not provided !");
      return;
    }
    if (!(this.UserRoleTypeKey)) {
      alert("User Role Type Not provided !");
      return;
    }

    if (this.UserRoleTypeKey == 3) {
      managerkey = this.employeekey;
      this.SupervisorKey=this.employeekey;
    } else if (this.UserRoleTypeKey == 5) {
      managerkey = this.employeekey;
    }
    else {
      managerkey = -1;
    }

    if (this.UserRoleTypeKey == 5) {
      IsSupervisor = 1;
    }
    else {
      IsSupervisor = 0;
    }

    if (!(this.FirstName) || !this.FirstName.trim()) {
      alert("First Name is not provided !");
      return;
    }
    if (!(this.LastName) || !this.LastName.trim()) {
      alert("Last Name is not provided !");
      return;
    }
    if (!(this.Gender)) {
      this.Gender = null;
    }
    if (!(this.PrimaryPhone) || !this.PrimaryPhone.trim()) {
      alert("Primary Phone is not provided !");
      return;
    }
    if (!(this.HireDate)) {
      alert("Hire Date is not provided !");
      return;
    }
    if (!(this.JobTitleKey)) {
      alert("Job Title is not provided !");
      return;
    }
    if (!(this.DepartmentKey)) {
      alert("Department is not provided !");
      return;
    }
    var BD;
    var currentDate = this.convert_DT(new Date());

    if (!(this.BirthDate)) {
      // BD = this.convert_DT(new Date());
      // BD = null;
      BD = '1990-01-01';
    }
    else {
      BD = this.convert_DT(this.BirthDate);
    }
    var HD = this.convert_DT(this.HireDate);
    if (BD > currentDate) {
      alert("Wrong Birth Date !");
      return;
    }
    // if (HD > currentDate) {
    //   alert("Wrong Hire Date !");
    //   return;
    // }
    if (HD < BD) {
      alert("Hire Date must be greater than birth date !");
      return;
    }
    var str = "";
    str = this.FirstName + '' + this.LastName;

    //Author: Prakash Code Starts for Employee Calendar Starts Here

    // var ExSD;

    // if (!this.idscheduler_exception) {
    //   this.idscheduler_exception = null;
    //   this.idmaster_exception_weekend = null;
    // }
    // else {
    //   if (!(this.exceptionstartdate)) {
    //     ExSD = '1990-01-01';
    //   }
    //   else {
    //     ExSD = this.convert_DT(this.exceptionstartdate);
    //   }

    // }

    // const empschobj = {
    //   start_sun_hour: this.start_sun_hour,
    //   start_sun_min: this.start_sun_min,
    //   start_sun_format: this.start_sun_format,
    //   start_mon_hour: this.start_mon_hour,
    //   start_mon_min: this.start_mon_min,
    //   start_mon_format: this.start_mon_format,
    //   start_tue_hour: this.start_tue_hour,
    //   start_tue_min: this.start_tue_min,
    //   start_tue_format: this.start_tue_format,
    //   start_wed_hour: this.start_wed_hour,
    //   start_wed_min: this.start_wed_min,
    //   start_wed_format: this.start_wed_format,
    //   start_thu_hour: this.start_thu_hour,
    //   start_thu_min: this.start_thu_min,
    //   start_thu_format: this.start_thu_format,
    //   start_fri_hour: this.start_fri_hour,
    //   start_fri_min: this.start_fri_min,
    //   start_fri_format: this.start_fri_format,
    //   start_sat_hour: this.start_sat_hour,
    //   start_sat_min: this.start_sat_min,
    //   start_sat_format: this.start_sat_format,
    //   end_sun_hour: this.end_sun_hour,
    //   end_sun_min: this.end_sun_min,
    //   end_sun_format: this.end_sun_format,
    //   end_mon_hour: this.end_mon_hour,
    //   end_mon_min: this.end_mon_min,
    //   end_mon_format: this.end_mon_format,
    //   end_tue_hour: this.end_tue_hour,
    //   end_tue_min: this.end_tue_min,
    //   end_tue_format: this.end_tue_format,
    //   end_wed_hour: this.end_wed_hour,
    //   end_wed_min: this.end_wed_min,
    //   end_wed_format: this.end_wed_format,
    //   end_thu_hour: this.end_thu_hour,
    //   end_thu_min: this.end_thu_min,
    //   end_thu_format: this.end_thu_format,
    //   end_fri_hour: this.end_fri_hour,
    //   end_fri_min: this.end_fri_min,
    //   end_fri_format: this.end_fri_format,
    //   end_sat_hour: this.end_sat_hour,
    //   end_sat_min: this.end_sat_min,
    //   end_sat_format: this.end_sat_format,

    //   idscheduler_exception: this.idscheduler_exception,

    //   idmaster_exception_weekend: this.idmaster_exception_weekend,
    //   idemployeegrouping: this.idemployeegrouping,
    //   exceptionsdate: ExSD,

    //   //Author: Prakash Code Starts for Employee Calendar Ends Here

    //   employeenumber: this.EmployeeNumber,
    //   managerkey: managerkey,
    //   firstname: this.FirstName,
    //   lastname: this.LastName,
    //   middlename: this.MiddleName,
    //   birthDate: BD,
    //   gender: this.Gender,
    //   addressline1: this.AddressLine1,
    //   city: this.City,
    //   addressline2: this.AddressLine2,
    //   state: this.State,
    //   country: this.Country,
    //   primaryphone: this.PrimaryPhone,
    //   zipcode: this.ZipCode,
    //   alternatephone: this.AlternatePhone,
    //   email: this.EmailID,
    //   hireDate: HD,
    //   isSupervisor: this.theCheckbox,
    //   jobTitleKey: this.JobTitleKey,
    //   supervisorKey: this.SupervisorKey,
    //   departmentKey: this.DepartmentKey,
    //   metaupdatedBy: this.employeekey,
    //   OrganizationID: this.OrganizationID

    // };

    //Author: Prakash Code Starts for Employee Calendar Starts Here
    // if (this.start_sun_hour == '-1' && this.start_sun_min == '-1' && this.end_sun_hour == '-1' && this.end_sun_min == '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else if (this.start_sun_hour != '-1' && this.start_sun_min != '-1' && this.end_sun_hour != '-1' && this.end_sun_min != '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else {
    //   this.schedularcount++;
    //   alert('Values Missing in Sunday');
    //   return;
    // }

    // if (this.start_mon_hour == '-1' && this.start_mon_min == '-1' && this.end_mon_hour == '-1' && this.end_mon_min == '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else if (this.start_mon_hour != '-1' && this.start_mon_min != '-1' && this.end_mon_hour != '-1' && this.end_mon_min != '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else {
    //   this.schedularcount++;
    //   alert('Values Missing in Monday');
    //   return;
    // }

    // if (this.start_tue_hour == '-1' && this.start_tue_min == '-1' && this.end_tue_hour == '-1' && this.end_tue_min == '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else if (this.start_tue_hour != '-1' && this.start_tue_min != '-1' && this.end_tue_hour != '-1' && this.end_tue_min != '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else {
    //   this.schedularcount++;
    //   alert('Values Missing in Tuesday');
    //   return;
    // }

    // if (this.start_wed_hour == '-1' && this.start_wed_min == '-1' && this.end_wed_hour == '-1' && this.end_wed_min == '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else if (this.start_wed_hour != '-1' && this.start_wed_min != '-1' && this.end_wed_hour != '-1' && this.end_wed_min != '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else {
    //   this.schedularcount++;
    //   alert('Values Missing in Wednesday');
    //   return;
    // }

    // if (this.start_thu_hour == '-1' && this.start_thu_min == '-1' && this.end_thu_hour == '-1' && this.end_thu_min == '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else if (this.start_thu_hour != '-1' && this.start_thu_min != '-1' && this.end_thu_hour != '-1' && this.end_thu_min != '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else {
    //   this.schedularcount++;
    //   alert('Values Missing in Thursday');
    //   return;
    // }

    // if (this.start_fri_hour == '-1' && this.start_fri_min == '-1' && this.end_fri_hour == '-1' && this.end_fri_min == '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else if (this.start_fri_hour != '-1' && this.start_fri_min != '-1' && this.end_fri_hour != '-1' && this.end_fri_min != '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else {
    //   this.schedularcount++;
    //   alert('Values Missing in Friday');
    //   return;
    // }

    // if (this.start_sat_hour == '-1' && this.start_sat_min == '-1' && this.end_sat_hour == '-1' && this.end_sat_min == '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else if (this.start_sat_hour != '-1' && this.start_sat_min != '-1' && this.end_sat_hour != '-1' && this.end_sat_min != '-1') {
    //   this.schedularcount = this.schedularcount;
    // } else {
    //   this.schedularcount++;
    //   alert('Values Missing in Saturday');
    //   return;
    // }

    // if (this.schedularcount == 0) {
    this.PeopleServiceService.checkEmpNumber(this.EmployeeNumber, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
      if (data[0].count == 0) {
        // this.PeopleServiceService.createEmployeebyManager(empschobj).subscribe((data22: any[]) => {
        this.PeopleServiceService.createEmployeebyManager(this.EmployeeNumber, this.FirstName, this.LastName, this.MiddleName, BD, this.Gender, this.AddressLine1, this.City, this.AddressLine2, this.State, this.Country, this.PrimaryPhone, this.ZipCode, this.AlternatePhone, this.EmailID, HD, this.theCheckbox, this.JobTitleKey, this.SupervisorKey, this.DepartmentKey, this.employeekey, this.OrganizationID, managerkey,IsSupervisor).subscribe((data22: any[]) => {
          this.temp_res = data22;
          alert("Employee Created !");
          var empKey = this.temp_res.EmployeeKey;
          // this.router.navigate(['/Settingusernameandpswrdaftremplcreatebyman', empKey, str, this.UserRoleTypeKey]);
          // this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['Settingusernameandpswrdaftremplcreatebyman', empKey, str, this.UserRoleTypeKey] } }]);
          if (this.role == 'Manager') {
            this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['Settingusernameandpswrdaftremplcreatebyman', empKey, str, this.UserRoleTypeKey] } }]);
          }
          // else if (this.role == 'Employee' && this.IsSupervisor == 1) {
          else if (this.role == 'Supervisor') {
            this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['Settingusernameandpswrdaftremplcreatebyman', empKey, str, this.UserRoleTypeKey] } }]);
          }
        });
      } else {
        alert('Employee number already present!');
        return;
      }
    });
    // }
    // else {
    //   alert('Weekly Schedule!');
    //   return;
    // }

    //Author: Prakash Code Starts for Employee Calendar Ends Here

  }
  ngOnInit() {
    this.marked = false;

    this.UserRoleTypeKey = '';
    this.Gender = '';
    this.JobTitleKey = '';
    this.SupervisorKey = '';
    this.DepartmentKey = '';

    this.UserRoleTypeKey = '';
    this.Gender = '';
    this.JobTitleKey = '';
    this.DepartmentKey = '';
    this.UserRoleTypeKey = '';

    //Author: Prakash Code Starts for Employee Calendar Starts Here

    // this.start_sun_hour = '-1';
    // this.start_sun_min = '-1';
    // this.start_sun_format = 'AM';

    // this.start_mon_hour = '-1';
    // this.start_mon_min = '-1';
    // this.start_mon_format = 'AM';

    // this.start_tue_hour = '-1';
    // this.start_tue_min = '-1';
    // this.start_tue_format = 'AM';

    // this.start_wed_hour = '-1';
    // this.start_wed_min = '-1';
    // this.start_wed_format = 'AM';

    // this.start_thu_hour = '-1';
    // this.start_thu_min = '-1';
    // this.start_thu_format = 'AM';

    // this.start_fri_hour = '-1';
    // this.start_fri_min = '-1';
    // this.start_fri_format = 'AM';

    // this.start_sat_hour = '-1';
    // this.start_sat_min = '-1';
    // this.start_sat_format = 'AM';

    // this.end_sun_hour = '-1';
    // this.end_sun_min = '-1';
    // this.end_sun_format = 'AM';

    // this.end_mon_hour = '-1';
    // this.end_mon_min = '-1';
    // this.end_mon_format = 'AM';

    // this.end_tue_hour = '-1';
    // this.end_tue_min = '-1';
    // this.end_tue_format = 'AM';

    // this.end_wed_hour = '-1';
    // this.end_wed_min = '-1';
    // this.end_wed_format = 'AM';

    // this.end_thu_hour = '-1';
    // this.end_thu_min = '-1';
    // this.end_thu_format = 'AM';

    // this.end_fri_hour = '-1';
    // this.end_fri_min = '-1';
    // this.end_fri_format = 'AM';

    // this.end_sat_hour = '-1';
    // this.end_sat_min = '-1';
    // this.end_sat_format = 'AM';
    // this.idscheduler_exception = '';
    // this.idemployeegrouping = '';

    // this.idmaster_exception_weekend = '';

    //Author: Prakash Code Starts for Employee Calendar Starts Here


    this.minDate = new Date();
    this.maxDate = new Date();
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;
    this.role = profile.role;
    // this.IsSupervisor = profile.IsSupervisor;

    // this.isemployeecalendar = profile.isemployeecalendar;//Author: Prakash for Checking Whether the organization uses Calendar or not

    this.PeopleServiceService
      .getUserRoleType(this.OrganizationID)
      .subscribe((data: any[]) => {
        this.useroletype = data;
        for (var i = 0; i < data.length; i++) {
          if (data[i].UserRoleName == "Employee") {
            this.roleTypeKey = data[i].UserRoleTypeKey;
          }
        }
      });
    this.PeopleServiceService
      .getJobTitleforadmindd(this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.jobtitle = data;
      });
    this.PeopleServiceService
      .getSuperVisor(this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.supervisor = data;
      });
    this.PeopleServiceService
      .getDepartment(this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.department = data;
      });
    //Author: Prakash Code Starts for Employee Calendar Starts Here

    // this.PeopleServiceService
    //   .getallschedulingexception(this.OrganizationID)
    //   .subscribe((data: People[]) => {
    //     this.schedulerexception = data;
    //   });
    // this.PeopleServiceService
    //   .getallexceptionweekend()
    //   .subscribe((data: People[]) => {
    //     this.exceptionweekend = data;
    //   });
    // this.PeopleServiceService
    //   .getallmasterhour()
    //   .subscribe((data: People[]) => {
    //     this.masterhour = data;
    //   });
    // this.PeopleServiceService
    //   .getallmasterminute()
    //   .subscribe((data: People[]) => {
    //     this.masterminute = data;
    //   });
    // this.PeopleServiceService
    //   .getallemployeegrouping(this.OrganizationID)
    //   .subscribe((data: People[]) => {
    //     this.employeegrouping = data;
    //   });
    //Author: Prakash Code Starts for Employee Calendar Ends Here
  }

  toggleVisibility(e) {
    if (e == this.roleTypeKey) {
      this.marked = true;
    } else {
      this.marked = false;
    }
  }
}
