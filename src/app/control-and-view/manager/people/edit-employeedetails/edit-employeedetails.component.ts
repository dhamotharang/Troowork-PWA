import { Component, OnInit } from '@angular/core';
import { People } from '../../../../model-class/People';
import { ActivatedRoute, Router } from "@angular/router";
import { PeopleServiceService } from '../../../../service/people-service.service';
import { DatepickerOptions } from 'ng2-datepicker';
@Component({
  selector: 'app-edit-employeedetails',
  templateUrl: './edit-employeedetails.component.html',
  styleUrls: ['./edit-employeedetails.component.scss']
})
export class EditEmployeedetailsComponent implements OnInit {
  marked = true;
  // promoted= false;
  firstName: Array<any>;
  lastName: Array<any>;
  MiddleName: Array<any>;
  employeestatus: People[];
  jobtitle: People[];
  department: People[];
  supervisor: People[];
  editempdtails;
  empk$: Object;
  BirthDate: Date;
  HireDate: Date;
  delete_EmpKey: Number;
  employeedetailstable: People[];

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  empNum;
  statusFlag;
  remark;
  userRoleType;
  userRoleTypes;
  managerList;
  //Author: Prakash Code Starts for Employee Calendar Starts Here

  // schedularcount = 0;

  // schedulerexception: People[];
  // exceptionweekend: People[];

  // sch_exception: People[];
  // idscheduler_exception;

  // sch_exception_weekend: People[];
  // idmaster_exception_weekend;

  // isemployeecalendar;

  // masterhour: People[];
  // masterminute: People[];

  // idemployeegrouping;

  employeegrouping: People[];

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

  editEmployee(EmployeeNumber, UserRoleTypeKey, FirstName, LastName, MiddleName, BD, Gender, AddressLine1, City, AddressLine2, State, Country, PrimaryPhone, ZipCode, AlternatePhone, EmailID, EmployeeStatusKey, HD, JobTitleKey, SupervisorKey, DepartmentKey, managerKey) {
    // start_sun_hour, start_sun_min, start_sun_format, start_mon_hour, start_mon_min, start_mon_format, start_tue_hour, start_tue_min, start_tue_format, start_wed_hour, start_wed_min, start_wed_format, start_thu_hour, start_thu_min, start_thu_format, start_fri_hour, start_fri_min, start_fri_format, start_sat_hour, start_sat_min, start_sat_format, end_sun_hour, end_sun_min, end_sun_format, end_mon_hour, end_mon_min, end_mon_format, end_tue_hour, end_tue_min, end_tue_format, end_wed_hour, end_wed_min, end_wed_format, end_thu_hour, end_thu_min, end_thu_format, end_fri_hour, end_fri_min, end_fri_format, end_sat_hour, end_sat_min, end_sat_format, idscheduler_exception, idmaster_exception_weekend,idemployeegrouping
    // this.schedularcount = 0;
    var manKey;
    var superKey;

    if (!(this.editempdtails.EmployeeNumber) || !EmployeeNumber.trim()) {
      alert("Employee Number is not provided !");
      return;
    }
    if (!(this.editempdtails.UserRoleTypeKey)) {
      alert("User Role Type is not provided !");
      return;
    }

    if (!(FirstName) || !(FirstName.trim())) {
      alert("First Name is not provided !");
      return;
    }
    if (!(LastName) || !(LastName.trim())) {
      alert("Last Name is not provided !");
      return;
    }
    if (!(this.editempdtails.Gender)) {
      Gender = null;
    }
    if (!(this.editempdtails.EmployeeStatusKey)) {
      alert("Employee Status is not provided !");
      return;
    }
    if (!(PrimaryPhone) || !(PrimaryPhone.trim())) {
      alert("Primary Phone is not provided !");
      return;
    }

    if ((EmployeeStatusKey != 1) && !(this.remark)) {
      alert("Remarks are not provided !");
      return;
    }
    if (!(this.HireDate)) {
      alert("Hire Date is not provided !");
      return;
    }
    if (!(this.editempdtails.JobTitleKey)) {
      alert("Job Title is not provided !");
      return;
    }
    if (!(this.editempdtails.DepartmentKey)) {
      alert("Department is not provided !");
      return;
    }
    var birthdt;
    var currentDate = this.convert_DT(new Date());

    if (!(this.BirthDate)) {
      birthdt = this.convert_DT(new Date());
    }
    else {
      birthdt = this.convert_DT(this.BirthDate);
    }
    var hiredt = this.convert_DT(this.HireDate);
    if (birthdt > currentDate) {
      alert("Wrong Birth Date !");
      return;
    }
    // if (hiredt > currentDate) {
    //   alert("Wrong Hire Date !");
    //   return;
    // }
    if (hiredt < birthdt) {
      alert("Hire Date must be greater than birth date !");
      return;
    }

    if (!(managerKey)) {
      alert("Manager is not provided !");
      return;
    }
    if(!SupervisorKey && this.editempdtails.UserRoleTypeKey == 3){
      SupervisorKey=this.employeekey;
    }
    if (this.editempdtails.UserRoleTypeKey == 3 && !(managerKey)) {
      manKey = this.employeekey;
    }
    else if (this.editempdtails.UserRoleTypeKey == 5 && !(managerKey)) {
      manKey = this.employeekey;
    }
    else {
      manKey = managerKey;
    }

    //Author: Prakash Code Starts for Employee Calendar Starts Here
    // if (start_sun_hour == '-1' && start_sun_min == '-1' && end_sun_hour == '-1' && end_sun_min == '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else if (start_sun_hour != '-1' && start_sun_min != '-1' && end_sun_hour != '-1' && end_sun_min != '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else {
    //   this.schedularcount++;
    //   alert('Values Missing in Sunday');
    //   return;
    // }

    // if (start_mon_hour == '-1' && start_mon_min == '-1' && end_mon_hour == '-1' && end_mon_min == '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else if (start_mon_hour != '-1' && start_mon_min != '-1' && end_mon_hour != '-1' && end_mon_min != '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else {
    //   this.schedularcount++;
    //   alert('Values Missing in Monday');
    //   return;
    // }

    // if (start_tue_hour == '-1' && start_tue_min == '-1' && end_tue_hour == '-1' && end_tue_min == '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else if (start_tue_hour != '-1' && start_tue_min != '-1' && end_tue_hour != '-1' && end_tue_min != '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else {
    //   this.schedularcount++;

    //   alert('Values Missing in Tuesday');
    //   return;
    // }

    // if (start_wed_hour == '-1' && start_wed_min == '-1' && end_wed_hour == '-1' && end_wed_min == '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else if (start_wed_hour != '-1' && start_wed_min != '-1' && end_wed_hour != '-1' && end_wed_min != '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else {
    //   this.schedularcount++;
    //   alert('Values Missing in Wednesday');
    //   return;
    // }

    // if (start_thu_hour == '-1' && start_thu_min == '-1' && end_thu_hour == '-1' && end_thu_min == '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else if (start_thu_hour != '-1' && start_thu_min != '-1' && end_thu_hour != '-1' && end_thu_min != '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else {
    //   this.schedularcount++;
    //   alert('Values Missing in Thursday');
    //   return;
    // }

    // if (start_fri_hour == '-1' && start_fri_min == '-1' && end_fri_hour == '-1' && end_fri_min == '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else if (start_fri_hour != '-1' && start_fri_min != '-1' && end_fri_hour != '-1' && end_fri_min != '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else {
    //   this.schedularcount++;
    //   alert('Values Missing in Friday');
    //   return;
    // }

    // if (start_sat_hour == '-1' && start_sat_min == '-1' && end_sat_hour == '-1' && end_sat_min == '-1') {
    //   this.schedularcount = this.schedularcount;
    // }
    // else if (start_sat_hour != '-1' && start_sat_min != '-1' && end_sat_hour != '-1' && end_sat_min != '-1') {
    //   this.schedularcount = this.schedularcount;
    // } else {
    //   this.schedularcount++;
    //   alert('Values Missing in Saturday');
    //   return;
    // }

    // var empNum ;
    // if (!idscheduler_exception) {
    //   idscheduler_exception = null;
    //   idmaster_exception_weekend = null;
    // }
    // if (this.schedularcount == 0) {
    if (this.empNum == this.editempdtails.EmployeeNumber) {
      this.PeopleServiceService.UpdateEmployeeDetailsbyManager(this.employeekey, manKey, this.empk$, this.OrganizationID, EmployeeNumber, UserRoleTypeKey, FirstName, LastName, MiddleName, birthdt, Gender, AddressLine1, City, AddressLine2, State, Country, PrimaryPhone, ZipCode, AlternatePhone, EmailID, EmployeeStatusKey, hiredt, SupervisorKey, JobTitleKey, DepartmentKey, this.remark).subscribe((data: People[]) => {
        // start_sun_hour, start_sun_min, start_sun_format, start_mon_hour, start_mon_min, start_mon_format, start_tue_hour, start_tue_min, start_tue_format, start_wed_hour, start_wed_min, start_wed_format, start_thu_hour, start_thu_min, start_thu_format, start_fri_hour, start_fri_min, start_fri_format, start_sat_hour, start_sat_min, start_sat_format, end_sun_hour, end_sun_min, end_sun_format, end_mon_hour, end_mon_min, end_mon_format, end_tue_hour, end_tue_min, end_tue_format, end_wed_hour, end_wed_min, end_wed_format, end_thu_hour, end_thu_min, end_thu_format, end_fri_hour, end_fri_min, end_fri_format, end_sat_hour, end_sat_min, end_sat_format, idscheduler_exception, idmaster_exception_weekend, idemployeegrouping
        alert("Updated Successfully!");
        // this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewEmployee'] } }]);
        if (this.role == 'Manager') {
          this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewEmployee'] } }]);
        }
        // else if (this.role == 'Employee' && this.IsSupervisor == 1) {
        else if (this.role == 'Supervisor') {
          this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['ViewEmployee'] } }]);
        }
      });
    }
    else {
      this.PeopleServiceService.CheckForEmployeenumber(this.editempdtails.EmployeeNumber, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
        if (data[0].count == 0) {
          var hiredt = this.convert_DT(this.BirthDate);
          this.PeopleServiceService.UpdateEmployeeDetailsbyManager(this.employeekey, manKey, this.empk$, this.OrganizationID, EmployeeNumber, UserRoleTypeKey, FirstName, LastName, MiddleName, birthdt, Gender, AddressLine1, City, AddressLine2, State, Country, PrimaryPhone, ZipCode, AlternatePhone, EmailID, EmployeeStatusKey, hiredt, SupervisorKey, JobTitleKey, DepartmentKey, this.remark)
            //  start_sun_hour, start_sun_min, start_sun_format, start_mon_hour, start_mon_min, start_mon_format, start_tue_hour, start_tue_min, start_tue_format, start_wed_hour, start_wed_min, start_wed_format, start_thu_hour, start_thu_min, start_thu_format, start_fri_hour, start_fri_min, start_fri_format, start_sat_hour, start_sat_min, start_sat_format, end_sun_hour, end_sun_min, end_sun_format, end_mon_hour, end_mon_min, end_mon_format, end_tue_hour, end_tue_min, end_tue_format, end_wed_hour, end_wed_min, end_wed_format, end_thu_hour, end_thu_min, end_thu_format, end_fri_hour, end_fri_min, end_fri_format, end_sat_hour, end_sat_min, end_sat_format, idscheduler_exception, idmaster_exception_weekend, idemployeegrouping
            .subscribe((data: People[]) => {
              alert("Updated Successfully!");
              // this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewEmployee'] } }]);
              if (this.role == 'Manager') {
                this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewEmployee'] } }]);
              }
              // else if (this.role == 'Employee' && this.IsSupervisor == 1) {
              else if (this.role == 'Supervisor') {
                this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['ViewEmployee'] } }]);
              }
            });
        }
        else {
          alert("Employee Number already exist !");
        }
      });
    }
    // }
    // else {
    //   alert('Weekly Schedule!');
    //   return;
    // }

    //Author: Prakash Code Starts for Employee Calendar Ends Here

  }

  deleteEmployee() {
    this.PeopleServiceService
      .DeleteEmployeeDetailsbyManager(this.delete_EmpKey, this.OrganizationID, this.employeekey).subscribe(res => {
        // this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewEmployee'] } }])
        if (this.role == 'Manager') {
          this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewEmployee'] } }]);
        }
        // else if (this.role == 'Employee' && this.IsSupervisor == 1) {
        else if (this.role == 'Supervisor') {
          this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['ViewEmployee'] } }]);
        }
      });
  }
  deleteEmpPass(empk$) {
    this.delete_EmpKey = empk$;
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
    // this.isemployeecalendar = profile.isemployeecalendar;//Author: Prakash for Checking Whether the organization uses Calendar or not


    this.PeopleServiceService.EditEmployeeDetailsbyManager(this.empk$, this.OrganizationID).subscribe((data: Array<any>) => {
      this.editempdtails = data[0];
      this.BirthDate = this.editempdtails.BirthDate;
      this.HireDate = this.editempdtails.HireDate;
      this.empNum = this.editempdtails.EmployeeNumber;
      if (this.editempdtails.EmployeeStatusKey != 1 && this.editempdtails.EmployeeStatusKey != "") {
        this.statusFlag = true;
        this.remark = this.editempdtails.Remark;
      }

      if (this.editempdtails.UserRoleName === "Employee") {
        this.marked = true;
      } else {
        this.marked = false;
      }
      //Author: Prakash Code Starts for Employee Calendar Starts Here

      // this.idemployeegrouping = this.editempdtails.EmployeeGroupID;

      // if (!(this.editempdtails.Idscheduler_exception)) {
      //   this.idscheduler_exception = '';
      //   this.idmaster_exception_weekend = '';
      // }
      // else {
      //   this.idscheduler_exception = this.editempdtails.Idscheduler_exception;
      //   this.idmaster_exception_weekend = this.editempdtails.Idmaster_exception_weekend;
      // }

      // if (!(this.editempdtails.start_sun_hour)) { this.editempdtails.start_sun_hour = '-1'; }
      // if (!(this.editempdtails.start_sun_min)) { this.editempdtails.start_sun_min = '-1'; }
      // if (!(this.editempdtails.start_sun_format)) { this.editempdtails.start_sun_format = 'AM'; }
      // if (!(this.editempdtails.start_mon_hour)) { this.editempdtails.start_mon_hour = '-1'; }
      // if (!(this.editempdtails.start_mon_min)) { this.editempdtails.start_mon_min = '-1'; }
      // if (!(this.editempdtails.start_mon_format)) { this.editempdtails.start_mon_format = 'AM'; }
      // if (!(this.editempdtails.start_tue_hour)) { this.editempdtails.start_tue_hour = '-1'; }
      // if (!(this.editempdtails.start_tue_min)) { this.editempdtails.start_tue_min = '-1'; }
      // if (!(this.editempdtails.start_tue_format)) { this.editempdtails.start_tue_format = 'AM'; }
      // if (!(this.editempdtails.start_wed_hour)) { this.editempdtails.start_wed_hour = '-1'; }
      // if (!(this.editempdtails.start_wed_min)) { this.editempdtails.start_wed_min = '-1'; }
      // if (!(this.editempdtails.start_wed_format)) { this.editempdtails.start_wed_format = 'AM'; }
      // if (!(this.editempdtails.start_thu_hour)) { this.editempdtails.start_thu_hour = '-1'; }
      // if (!(this.editempdtails.start_thu_min)) { this.editempdtails.start_thu_min = '-1'; }
      // if (!(this.editempdtails.start_thu_format)) { this.editempdtails.start_thu_format = 'AM'; }
      // if (!(this.editempdtails.start_fri_hour)) { this.editempdtails.start_fri_hour = '-1'; }
      // if (!(this.editempdtails.start_fri_min)) { this.editempdtails.start_fri_min = '-1'; }
      // if (!(this.editempdtails.start_fri_format)) { this.editempdtails.start_fri_format = 'AM'; }
      // if (!(this.editempdtails.start_sat_hour)) { this.editempdtails.start_sat_hour = '-1'; }
      // if (!(this.editempdtails.start_sat_min)) { this.editempdtails.start_sat_min = '-1'; }
      // if (!(this.editempdtails.start_sat_format)) { this.editempdtails.start_sat_format = 'AM'; }
      // if (!(this.editempdtails.end_sun_hour)) { this.editempdtails.end_sun_hour = '-1'; }
      // if (!(this.editempdtails.end_sun_min)) { this.editempdtails.end_sun_min = '-1'; }
      // if (!(this.editempdtails.end_sun_format)) { this.editempdtails.end_sun_format = 'AM'; }
      // if (!(this.editempdtails.end_mon_hour)) { this.editempdtails.end_mon_hour = '-1'; }
      // if (!(this.editempdtails.end_mon_min)) { this.editempdtails.end_mon_min = '-1'; }
      // if (!(this.editempdtails.end_mon_format)) { this.editempdtails.end_mon_format = 'AM'; }
      // if (!(this.editempdtails.end_tue_hour)) { this.editempdtails.end_tue_hour = '-1'; }
      // if (!(this.editempdtails.end_tue_min)) { this.editempdtails.end_tue_min = '-1'; }
      // if (!(this.editempdtails.end_tue_format)) { this.editempdtails.end_tue_format = 'AM'; }
      // if (!(this.editempdtails.end_wed_hour)) { this.editempdtails.end_wed_hour = '-1'; }
      // if (!(this.editempdtails.end_wed_min)) { this.editempdtails.end_wed_min = '-1'; }
      // if (!(this.editempdtails.end_wed_format)) { this.editempdtails.end_wed_format = 'AM'; }
      // if (!(this.editempdtails.end_thu_hour)) { this.editempdtails.end_thu_hour = '-1'; }
      // if (!(this.editempdtails.end_thu_min)) { this.editempdtails.end_thu_min = '-1'; }
      // if (!(this.editempdtails.end_thu_format)) { this.editempdtails.end_thu_format = 'AM'; }
      // if (!(this.editempdtails.end_fri_hour)) { this.editempdtails.end_fri_hour = '-1'; }
      // if (!(this.editempdtails.end_fri_min)) { this.editempdtails.end_fri_min = '-1'; }
      // if (!(this.editempdtails.end_fri_format)) { this.editempdtails.end_fri_format = 'AM'; }
      // if (!(this.editempdtails.end_sat_hour)) { this.editempdtails.end_sat_hour = '-1'; }
      // if (!(this.editempdtails.end_sat_min)) { this.editempdtails.end_sat_min = '-1'; }
      // if (!(this.editempdtails.end_sat_format)) { this.editempdtails.end_sat_format = 'AM'; }

      //Author: Prakash Code Starts for Employee Calendar Ends Here

    });

    this.PeopleServiceService
      .getEmployeeStatusListforDropdown(this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.employeestatus = data;
      });
    this.PeopleServiceService
      .getJobTitleListforDropdown(this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.jobtitle = data;
      });
    this.PeopleServiceService
      .getDeptListforDropdown(this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.department = data;
      });

    this.PeopleServiceService
      .getSupervisorListforDropdown(this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.supervisor = data;
      });

    this.PeopleServiceService
      .getUserRoletypeForManager(this.OrganizationID)
      .subscribe((data: any[]) => {
        this.userRoleType = data;
      });
    this.PeopleServiceService
      .getUserRoleType(this.OrganizationID)
      .subscribe((data: any[]) => {
        this.userRoleTypes = data;

      });
    this.PeopleServiceService
      .getallemployeegrouping(this.OrganizationID)
      .subscribe((data: People[]) => {
        this.employeegrouping = data;
      });

    this.PeopleServiceService
      .getmanagersForEmp(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.managerList = data;
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
    //Author: Prakash Code Starts for Employee Calendar Ends Here

  }

  // toggleVisibility(e) {
  //   if (e.target.checked) {
  //     this.marked = false;
  //   } else {
  //     this.marked = true;
  //   }
  // }
  GoBack() {
    // this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewEmployee'] } }]);
    if (this.role == 'Manager') {
      this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewEmployee'] } }]);
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

  selectUserType(ut) {
    if (ut == 3) {
      this.marked = true;
    } else {
      this.marked = false;
    }
    // console.log(this.marked);
  }
}
