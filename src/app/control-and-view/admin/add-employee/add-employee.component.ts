import { Component, OnInit } from '@angular/core';
import { People } from '../../../model-class/People';
import { PeopleServiceService } from '../../../service/people-service.service';
import { ActivatedRoute, Router } from "@angular/router";
import { DatepickerOptions } from 'ng2-datepicker';
import { DataServiceTokenStorageService } from '../../../service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../dialog/alertdialog/alertdialog.component';
import { Manager } from 'hammerjs';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  marked = true;
  showManager = false;
  useroletype: People[];
  jobtitle: People[];
  supervisor: People[];
  department: People[];
  EmployeeNumber;
  UserRoleTypeKey;
  FirstName: String;
  LastName: String;
  MiddleName: String;
  BirthDate: Date;
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
  HireDate: Date;
  // theCheckbox: any;
  JobTitleKey;
  SupervisorKey;
  DepartmentKey;
  temp_res;
  managerList;
  ManagerKey;
  roleTypeKey = 0;
  roleTypeKey1;
  supermark;
  role: String;
  name: String;
  employeekey;
  IsSupervisor;
  OrganizationID;
  checkFlag;
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
    addStyle: { 'font-size': '18px', 'width': '76%', 'border': '1px solid #ced4da', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
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
    addStyle: { 'font-size': '18px', 'width': '76%', 'border': '1px solid #ced4da', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };
  convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(- 2),
      day = ("0" + date.getDate()).slice(- 2);
    return [date.getFullYear(), mnth, day].join("-");
  };

  constructor(private route: ActivatedRoute, private PeopleServiceService: PeopleServiceService, private router: Router, private dst: DataServiceTokenStorageService, private dialog: MatDialog) { }

  // Function to save the employee details
  createEmployee() {
    this.checkFlag = true;
    var manKey; var superKey;
    var IsSupervisor;
    if (!(this.EmployeeNumber) || !(this.EmployeeNumber.trim())) {
      // alert("Employee Number is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Employee Number is not provided !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    if (!(this.UserRoleTypeKey)) {
      // alert("User Role Type is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'User Role Type is not provided !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    if (this.showManager === true && !(this.ManagerKey)) {
      // alert("Manager is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Manager is not provided !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    else {
      manKey = -1;
    }




    if (this.UserRoleTypeKey == 3 && this.ManagerKey) {
      manKey = this.ManagerKey;
      superKey = this.ManagerKey;
    }
    else if (this.UserRoleTypeKey == 5 && this.ManagerKey) {
      manKey = this.ManagerKey;
    }
    else {
      manKey = -1;
    }

    if (this.UserRoleTypeKey == 5) {
      IsSupervisor = 1;
    }
    else {
      IsSupervisor = 0;
    }
    if (!(this.FirstName) || !(this.FirstName.trim())) {
      // alert("First Name is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'First Name is not provided !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    if (!(this.LastName) || !(this.LastName.trim())) {
      // alert("Last Name is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Last Name is not provided !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    if (!(this.Gender)) {
      this.Gender = null;
    }
    if (!(this.PrimaryPhone) || !(this.PrimaryPhone.trim())) {
      // alert("Primary Phone is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Primary Phone is not provided !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    if (!(this.HireDate)) {
      // alert("Hire Date is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Hire Date is not provided !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    if (!(this.JobTitleKey)) {
      // alert("Job Title is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Job Title is not provided !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    if (!(this.DepartmentKey)) {
      // alert("Department is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Department is not provided !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    var BD;
    var currentDate = this.convert_DT(new Date());

    if (!(this.BirthDate)) {
      // BD = this.convert_DT(new Date());
      BD = '1990-01-01';
    }
    else {
      BD = this.convert_DT(this.BirthDate);
    }
    var HD = this.convert_DT(this.HireDate);
    if (BD > currentDate) {
      // alert("Wrong BirthDate !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Wrong BirthDate !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    // if (HD > currentDate) {
    //   alert("Wrong Hire Date !");
    //   return;
    // }
    if (HD < BD) {
      // alert("Hire Date must be greater than birth date !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Hire Date must be greater than birth date !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }

    //Author: Prakash Code Starts for Employee Calendar Starts Here

    // if (!this.idscheduler_exception) {
    //   this.idscheduler_exception = null;
    //   this.idmaster_exception_weekend = null;
    // }

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

    this.EmployeeNumber = this.EmployeeNumber.trim();
    this.FirstName = this.FirstName.trim();
    this.LastName = this.LastName.trim();
    this.PrimaryPhone = this.PrimaryPhone.trim();
    if (this.MiddleName) {
      this.MiddleName = this.MiddleName.trim();
    }
    if (this.AddressLine1) {
      this.AddressLine1 = this.AddressLine1.trim();
    }
    if (this.AddressLine2) {
      this.AddressLine2 = this.AddressLine2.trim();
    }
    if (this.City) {
      this.City = this.City.trim();
    }
    if (this.State) {
      this.State = this.State.trim();
    }
    if (this.Country) {
      this.Country = this.Country.trim();
    }
    if (this.ZipCode) {
      this.ZipCode = this.ZipCode.trim();
    }
    if (this.AlternatePhone) {
      this.AlternatePhone = this.AlternatePhone.trim();
    }

    this.PeopleServiceService.checkEmpNumber(this.EmployeeNumber, this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        if (data[0].count > 0) {
          // alert("Employee Number already exists");
          const dialogRef = this.dialog.open(AlertdialogComponent, {
            data: {
              message: 'Employee Number already exists !',
              buttonText: {
                cancel: 'Done'
              }
            },
          });
          this.checkFlag = false;
        }
        else {

          var str = "";
          str = this.FirstName + '' + this.LastName;
          this.PeopleServiceService.createEmployeebyAdmin(this.EmployeeNumber, manKey, this.FirstName, this.LastName, this.MiddleName, BD, this.Gender, this.AddressLine1, this.City, this.AddressLine2, this.State, this.Country, this.PrimaryPhone, this.ZipCode, this.AlternatePhone, this.EmailID, HD, this.JobTitleKey, this.DepartmentKey, this.employeekey, this.OrganizationID, IsSupervisor, superKey)
            // this.start_sun_hour, this.start_sun_min, this.start_sun_format, this.start_mon_hour, this.start_mon_min, this.start_mon_format, this.start_tue_hour, this.start_tue_min, this.start_tue_format, this.start_wed_hour, this.start_wed_min, this.start_wed_format, this.start_thu_hour, this.start_thu_min, this.start_thu_format, this.start_fri_hour, this.start_fri_min, this.start_fri_format, this.start_sat_hour, this.start_sat_min, this.start_sat_format, this.end_sun_hour, this.end_sun_min, this.end_sun_format, this.end_mon_hour, this.end_mon_min, this.end_mon_format, this.end_tue_hour, this.end_tue_min, this.end_tue_format, this.end_wed_hour, this.end_wed_min, this.end_wed_format, this.end_thu_hour, this.end_thu_min, this.end_thu_format, this.end_fri_hour, this.end_fri_min, this.end_fri_format, this.end_sat_hour, this.end_sat_min, this.end_sat_format, this.idscheduler_exception, this.idmaster_exception_weekend, this.idemployeegrouping)
            .subscribe((data22: any[]) => {
              this.temp_res = data22;
              // alert("Employee Created !");
              // code to call alert starts
              const dialogRef = this.dialog.open(AlertdialogComponent, {
                data: {
                  message: 'Employee Created !',
                  buttonText: {
                    cancel: 'Done'
                  }
                },
              });
              // code to run remaining portion after we click done button of alert
              dialogRef.afterClosed().subscribe(dialogResult => {
                this.checkFlag = false;
                var empKey = this.temp_res.EmployeeKey;
                this.router.navigate(['AdminDashboard', { outlets: { AdminOut: ['setUserLoginAdmin', empKey, str, this.UserRoleTypeKey] } }]);
              });
              // code to call alert ends
            });
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

    this.OrganizationID = '';
    this.UserRoleTypeKey = '';
    this.Gender = '';
    this.JobTitleKey = '';
    this.DepartmentKey = '';
    this.UserRoleTypeKey = '';
    this.ManagerKey = '';

    this.checkFlag = false;
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

    // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.employeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();
    this.HireDate = new Date(Date.now());
    // this.isemployeecalendar = profile.isemployeecalendar;//Author: Prakash for Checking Whether the organization uses Calendar or not

    // to call the useroletype
    this.PeopleServiceService
      .getUserRoleType(this.OrganizationID)
      .subscribe((data: any[]) => {
        this.useroletype = data;

        for (var i = 0; i < data.length; i++) {
          if (data[i].UserRoleName == "Employee") {
            this.roleTypeKey = data[i].UserRoleTypeKey;
          }
          if (data[i].UserRoleName == "Supervisor") {
            this.roleTypeKey1 = data[i].UserRoleTypeKey;
          }
        }

      });

    // to call the JobTitle
    this.PeopleServiceService
      .getJobTitleforadmindd(this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.jobtitle = data;
      });
    // to call the supervisor
    this.PeopleServiceService
      .getSuperVisor(this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.supervisor = data;
      });
    // to call the department
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

  // function to call Manager/supervisor list or both based on usertype selected
  selectUserType(userType) {
    if (userType == this.roleTypeKey1) {
      this.showManager = true;
      this.supermark = false;
      this.PeopleServiceService
        .getmanagersForEmp(this.employeekey, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.managerList = data;
        });
    } else if (userType == this.roleTypeKey) {
      this.showManager = true;
      this.supermark = true;
      this.PeopleServiceService
        .getmanagersForEmp(this.employeekey, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.managerList = data;
        });
      this.PeopleServiceService
        .getSuperVisor(this.employeekey, this.OrganizationID)
        .subscribe((data: People[]) => {
          this.supervisor = data;
        });
    } else {
      this.showManager = false;
      this.supermark = false;
    }
  }
}
