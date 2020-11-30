import { Component, OnInit } from '@angular/core';
import { People } from '../../../model-class/People';
import { ActivatedRoute, Router } from "@angular/router";
import { PeopleServiceService } from '../../../service/people-service.service';
import { DatepickerOptions } from 'ng2-datepicker';
@Component({
  selector: 'app-edit-employee-details-admin',
  templateUrl: './edit-employee-details-admin.component.html',
  styleUrls: ['./edit-employee-details-admin.component.scss']
})
export class EditEmployeeDetailsAdminComponent implements OnInit {
  marked = true;
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
  managerKey: Number;
  delete_EmpKey: Number;
  employeedetailstable: People[];
  managerList;
  useroletyp;

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  statusFlag;
  remark;
  showManager;
  supermark;
  useroletype;

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

  editEmployee(EmployeeNumber, UserRoleTypeKey, FirstName, LastName, MiddleName, BD, Gender, AddressLine1, City, AddressLine2, State, Country, PrimaryPhone, ZipCode, AlternatePhone, EmailID, EmployeeStatusKey, HD, JobTitleKey, DepartmentKey, ManagerKey, SupervisorKey) {
    // , start_sun_hour, start_sun_min, start_sun_format, start_mon_hour, start_mon_min, start_mon_format, start_tue_hour, start_tue_min, start_tue_format, start_wed_hour, start_wed_min, start_wed_format, start_thu_hour, start_thu_min, start_thu_format, start_fri_hour, start_fri_min, start_fri_format, start_sat_hour, start_sat_min, start_sat_format, end_sun_hour, end_sun_min, end_sun_format, end_mon_hour, end_mon_min, end_mon_format, end_tue_hour, end_tue_min, end_tue_format, end_wed_hour, end_wed_min, end_wed_format, end_thu_hour, end_thu_min, end_thu_format, end_fri_hour, end_fri_min, end_fri_format, end_sat_hour, end_sat_min, end_sat_format, idscheduler_exception, idmaster_exception_weekend,idemployeegrouping
    var manKey;
    var superKey;

    if (!EmployeeNumber || !EmployeeNumber.trim()) {
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


    if (this.showManager === true && !(ManagerKey)) {
      alert("Manager is not provided !");
      return;
    }
    else {
      manKey = -1;
    }
    if (UserRoleTypeKey == 3 && ManagerKey) {
      manKey = ManagerKey;
      superKey = ManagerKey;
    }
    else if (UserRoleTypeKey == 5 && ManagerKey) {
      manKey = ManagerKey;
    }
    else {
      manKey = -1;
    }

    

    var birthdt;
    var currentDate = this.convert_DT(new Date());

    if (!(BD)) {
      birthdt = this.convert_DT(new Date());
    }
    else {
      birthdt = this.convert_DT(BD);
    }
    var hiredt = this.convert_DT(HD)
    if (birthdt > currentDate) {
      alert("Wrong Birth Date !");
      return;
    }
    // if (hiredt > currentDate) {
    //   alert("Wrong Hire Date !");
    //   return;
    // }
    if (HD < BD) {
      alert("Hire Date must be greater than birth date !");
      return;
    }
    // if (this.editempdtails.UserRoleTypeKey == 3) {
    //   manKey = this.employeekey;
    // }
    // else {
    //   manKey = -1;
    // }

    EmployeeNumber = EmployeeNumber.trim();
    FirstName = FirstName.trim();
    LastName = LastName.trim();
    PrimaryPhone = PrimaryPhone.trim();
    if (MiddleName) {
      MiddleName = MiddleName.trim();
    }
    if (AddressLine1) {
      AddressLine1 = AddressLine1.trim();
    }
    if (AddressLine2) {
      AddressLine2 = AddressLine2.trim();
    }
    if (City) {
      City = City.trim();
    }
    if (State) {
      State = State.trim();
    }
    if (Country) {
      Country = Country.trim();
    }
    if (ZipCode) {
      ZipCode = ZipCode.trim();
    }
    if (AlternatePhone) {
      AlternatePhone = AlternatePhone.trim();
    }

    this.PeopleServiceService.UpdateEmployeeDetailsbyManager(this.employeekey, manKey, this.empk$, this.OrganizationID, EmployeeNumber, UserRoleTypeKey, FirstName, LastName, MiddleName, birthdt, Gender, AddressLine1, City, AddressLine2, State, Country, PrimaryPhone, ZipCode, AlternatePhone, EmailID, EmployeeStatusKey, hiredt, superKey, JobTitleKey, DepartmentKey, this.remark)
      // , start_sun_hour, start_sun_min, start_sun_format, start_mon_hour, start_mon_min, start_mon_format, start_tue_hour, start_tue_min, start_tue_format, start_wed_hour, start_wed_min, start_wed_format, start_thu_hour, start_thu_min, start_thu_format, start_fri_hour, start_fri_min, start_fri_format, start_sat_hour, start_sat_min, start_sat_format, end_sun_hour, end_sun_min, end_sun_format, end_mon_hour, end_mon_min, end_mon_format, end_tue_hour, end_tue_min, end_tue_format, end_wed_hour, end_wed_min, end_wed_format, end_thu_hour, end_thu_min, end_thu_format, end_fri_hour, end_fri_min, end_fri_format, end_sat_hour, end_sat_min, end_sat_format, idscheduler_exception, idmaster_exception_weekend,idemployeegrouping)
      .subscribe((data: Array<any>) => {
        alert("Employee Updated !");
        this.router.navigate(['AdminDashboard', { outlets: { AdminOut: ['viewEmployeeAdmin'] } }]);
      });

  }

  deleteEmployee() {

    this.PeopleServiceService
      .DeleteEmployeeDetailsbyManager(this.delete_EmpKey, this.OrganizationID, this.employeekey)
      .subscribe((data: Array<any>) => {
        alert("Employee Deleted !");
        this.router.navigate(['AdminDashboard', { outlets: { AdminOut: ['viewEmployeeAdmin'] } }]);
      });
  }
  goBack() {
    this.router.navigate(['AdminDashboard', { outlets: { AdminOut: ['viewEmployeeAdmin'] } }]);
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

    this.PeopleServiceService.EditEmployeeDetailsbyManager(this.empk$, this.OrganizationID).subscribe((data: Array<any>) => {
      this.editempdtails = data[0];
      this.BirthDate = new Date(this.editempdtails.BirthDate);
      this.HireDate = new Date(this.editempdtails.HireDate);
      this.managerKey = this.editempdtails.ManagerKey;
      this.useroletype = this.editempdtails.UserRoleName;

      if (this.editempdtails.EmployeeStatusKey != 1 && this.editempdtails.EmployeeStatusKey != "") {
        this.statusFlag = true;
        this.remark = this.editempdtails.Remark;;
      }
      if (this.useroletype == "Employee") {
        this.showManager = true;
        this.supermark = true;
        this.PeopleServiceService
          .getSupervisorListforDropdown(this.employeekey, this.OrganizationID)
          .subscribe((data: People[]) => {
            this.supervisor = data;
          });

        this.PeopleServiceService
          .getmanagersForEmp(this.employeekey, this.OrganizationID)
          .subscribe((data: any[]) => {
            this.managerList = data;
          });
      } else if (this.useroletype == "Supervisor") {
        this.showManager = true;
        this.PeopleServiceService
          .getmanagersForEmp(this.employeekey, this.OrganizationID)
          .subscribe((data: any[]) => {
            this.managerList = data;
          });
      }

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
      .getUserRoleTypesa(this.OrganizationID)
      .subscribe((data: People[]) => {
        this.useroletyp = data;
      });
  }
  toggleVisibility(e) {
    if (e.target.checked) {
      this.marked = false;
    } else {
      this.marked = true;
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

  selectUserType(userType) {
    if (userType == 5) {
      this.showManager = true;
      this.supermark = false;
      this.PeopleServiceService
        .getmanagersForEmp(this.employeekey, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.managerList = data;
        });
    } else if (userType == 3) {
      this.showManager = true;
      this.supermark = true;
      this.PeopleServiceService
        .getmanagersForEmp(this.employeekey, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.managerList = data;
        });
      this.PeopleServiceService
        .getSupervisorListforDropdown(this.employeekey, this.OrganizationID)
        .subscribe((data: People[]) => {
          this.supervisor = data;
        });
    } else {
      this.showManager = false;
      this.supermark = false;
    }
  }
}
