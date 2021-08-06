import { Component, OnInit } from '@angular/core';
import { People } from '../../../../model-class/People';
import { PeopleServiceService } from '../../../../service/people-service.service';
import { ActivatedRoute, Router } from "@angular/router";
import { DatepickerOptions } from 'ng2-datepicker';
import { DataServiceTokenStorageService } from '../../../../service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';
import { ConfirmationdialogComponent, ConfirmDialogModel } from '../../../dialog/confirmationdialog/confirmationdialog.component';
@Component({
  selector: 'app-editemployee',
  templateUrl: './editemployee.component.html',
  styleUrls: ['./editemployee.component.scss']
})
export class EditemployeeComponent implements OnInit {

  organization: People[];
  empk$: Object;
  editempdtailsbysa;
  useroletyp;
  manager: People[];
  department: People[];
  employeestatus: People[];
  marked = true;
  jobtitle: People[];
  BirthDate: Date;
  HireDate: Date;
  delete_EmpKey: Number;
  employeedetailstable: People[];
  Gender: String;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  useroletype;
  roleTypeKey;
  managerList;
  showManager;
  statusFlag;
  remark;
  supermark;
  supervisor;
  roleTypeKey1;
  checkFlag;
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
    addStyle: { 'font-size': '18px', 'width': '77%', 'border': '1px solid #ced4da', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
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
  managerKey: Number = 1;
  constructor(private route: ActivatedRoute, private PeopleServiceService: PeopleServiceService, private router: Router, private dst: DataServiceTokenStorageService, private dialog: MatDialog) {
    this.route.params.subscribe(params => this.empk$ = params.EmployeeKey);
  }
  toggleVisibility(e) {
    if (e.target.checked) {
      this.marked = false;
    } else {
      this.marked = true;
    }

  }
  // deleteEmployee() {
  //   this.checkFlag = true;
  //   this.PeopleServiceService
  //     .DeleteEmployeeDetailsbySuperadmin(this.delete_EmpKey, this.OrganizationID, this.employeekey).subscribe(res => {
  //       this.checkFlag = false;
  //       this.router.navigate(['/SuperadminDashboard', { outlets: { SuperAdminOut: ['Viewemployee'] } }]);
  //     });
  // }
  //  Function to delete and employee
  deleteEmpPass(empk$) {
    this.delete_EmpKey = empk$;
    this.checkFlag = true;
    const message = `Are you sure !!  Do you want to delete`;
    const dialogData = new ConfirmDialogModel("DELETE", message);
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.PeopleServiceService
          .DeleteEmployeeDetailsbySuperadmin(this.delete_EmpKey, this.OrganizationID, this.employeekey).subscribe(res => {
            this.checkFlag = false;
            this.router.navigate(['/SuperadminDashboard', { outlets: { SuperAdminOut: ['Viewemployee'] } }]);
          });
      } else {
        this.checkFlag = false;
      }
    });
  }
  //  Function to save the edited details of employee
  editEmployee(OrganizationID, UserRoleTypeKey, EmployeeNumber, ManagerKey, FirstName, LastName, MiddleName, BD, AddressLine1, City, AddressLine2, State, Country, PrimaryPhone, ZipCode, AlternatePhone, EmailID, EmployeeStatusKey, HD, JobTitleKey, DepartmentKey, Gender, SupervisorKey) {
    var manKey;
    var superKey;

    this.checkFlag = true;
    if (!(EmployeeNumber) || !(EmployeeNumber.trim())) {
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
    if (!(UserRoleTypeKey)) {
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

    if (!(FirstName) || !(FirstName.trim())) {
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
    if (!(LastName) || !(LastName.trim())) {
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
    if (!(Gender)) {
      Gender = null;
    }
    if (!(EmployeeStatusKey)) {
      // alert("Employee Status is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Employee Status is not provided !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    if (!(PrimaryPhone) || !(PrimaryPhone.trim())) {
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

    if ((EmployeeStatusKey != 1) && !(this.remark)) {
      // alert("Remarks are not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Remarks are not provided !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    if (!(HD)) {
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
    if (!(JobTitleKey)) {
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
    if (!(DepartmentKey)) {
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

    if (this.showManager === true && !(ManagerKey)) {
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

    if (!(this.BirthDate)) {
      birthdt = this.convert_DT(new Date());
    }
    else {
      birthdt = this.convert_DT(this.BirthDate);
    }
    var hiredt = this.convert_DT(HD)
    if (birthdt > currentDate) {
      // alert("Wrong Birth Date !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Wrong Birth Date !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    // if (hiredt > currentDate) {
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

    this.PeopleServiceService.UpdateEmployeeDetailsbySa(this.employeekey, manKey, superKey, this.empk$, OrganizationID,
      UserRoleTypeKey, EmployeeNumber, FirstName, LastName, MiddleName, birthdt, AddressLine1, City, AddressLine2,
      State, Country, PrimaryPhone, ZipCode, AlternatePhone, EmailID, EmployeeStatusKey, hiredt, JobTitleKey,
      DepartmentKey, Gender, this.remark)
      .subscribe((data: any[]) => {
        // alert("Successfully Updated !");
        const dialogRef = this.dialog.open(AlertdialogComponent, {
          data: {
            message: 'Successfully Updated !',
            buttonText: {
              cancel: 'Done'
            }
          },
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          this.checkFlag = false;
          this.router.navigate(['/SuperadminDashboard', { outlets: { SuperAdminOut: ['Viewemployee'] } }]);
        });
      });

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

  //  Function to call the manager and supervisor with respect to the user type selected
  selectUserType(userType, orgID) {
    if (userType == this.roleTypeKey1) {
      this.showManager = true;
      this.supermark = false;
      this.PeopleServiceService
        .getManagerForEmployeeForSuperAdmin(orgID)
        .subscribe((data: any[]) => {
          this.managerList = data;
        });
    } else if (userType == this.roleTypeKey) {
      this.showManager = true;
      this.supermark = true;
      this.PeopleServiceService
        .getManagerForEmployeeForSuperAdmin(orgID)
        .subscribe((data: any[]) => {
          this.managerList = data;
        });
      this.PeopleServiceService
        .getSuperVisor(this.employeekey, orgID)
        .subscribe((data: People[]) => {
          this.supervisor = data;
        });
    } else {
      this.showManager = false;
      this.supermark = false;
    }
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
    this.checkFlag = false;
    this.PeopleServiceService.EditEmployeeDetailsbySuperadmin(this.empk$, this.OrganizationID).subscribe((data: Array<any>) => {
      if (data.length > 0) {
        this.editempdtailsbysa = data[0];
        this.BirthDate = new Date(this.editempdtailsbysa.BirthDate);
        this.HireDate = new Date(this.editempdtailsbysa.HireDate);
        this.useroletype = this.editempdtailsbysa.UserRoleName;
        if (this.useroletype == "Employee") {
          this.showManager = true;
          this.supermark = true;
          this.PeopleServiceService
            .getManagerForEmployeeForSuperAdmin(this.editempdtailsbysa.OrganizationID)
            .subscribe((data: People[]) => {
              this.manager = data;
            });
          this.PeopleServiceService
            .getSuperVisor(this.employeekey, this.editempdtailsbysa.OrganizationID)
            .subscribe((data: People[]) => {
              this.supervisor = data;
            });
        } else if (this.useroletype == "Supervisor") {
          this.showManager = true;
          this.PeopleServiceService
            .getManagerForEmployeeForSuperAdmin(this.editempdtailsbysa.OrganizationID)
            .subscribe((data: People[]) => {

              this.manager = data;
            });
        }
        if (this.editempdtailsbysa.EmployeeStatusKey != 1 && this.editempdtailsbysa.EmployeeStatusKey != "") {
          this.statusFlag = true;
          this.remark = this.editempdtailsbysa.Remark;
        }


        this.PeopleServiceService.getJobTitleforadmindd(this.employeekey, this.OrganizationID).subscribe((data: People[]) => {
          this.jobtitle = data;
        });
        this.PeopleServiceService.getDepartment(this.employeekey, this.OrganizationID).subscribe((data: People[]) => {
          this.department = data;
        });


        this.PeopleServiceService
          .getManagerForEmployeeForSuperAdmin(this.editempdtailsbysa.OrganizationID)
          .subscribe((data: People[]) => {

            this.manager = data;
          });
      }
    });

    this.PeopleServiceService
      .getOrganizationDDforSuprAdmin(this.OrganizationID)
      .subscribe((data: People[]) => {

        this.organization = data;
      });
    this.PeopleServiceService
      .getUserRoleTypesa(this.OrganizationID)
      .subscribe((data: any[]) => {
        this.useroletyp = data;
        for (var i = 0; i < data.length; i++) {
          if (data[i].UserRoleName == "Employee") {
            this.roleTypeKey = data[i].UserRoleTypeKey;
          }
          if (data[i].UserRoleName == "Supervisor") {
            this.roleTypeKey1 = data[i].UserRoleTypeKey;
          }
        }
      });

    this.PeopleServiceService
      .getEmployeeStatusListforDropdowninSuperadmin(this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {

        this.employeestatus = data;
      });
  }
  goBack() {
    this.router.navigate(['/SuperadminDashboard', { outlets: { SuperAdminOut: ['Viewemployee'] } }]);
  }
  statusChanged(statusKey) {
    if (statusKey != 1 && statusKey != "") {
      this.statusFlag = true;
    }
    else {
      this.statusFlag = false;
    }
  }

  OrganizationChanged(orgID) {
    this.PeopleServiceService.getJobTitleforadmindd(this.employeekey, orgID).subscribe((data: People[]) => {
      this.jobtitle = data;
    });
    this.PeopleServiceService.getDepartment(this.employeekey, orgID).subscribe((data: People[]) => {
      this.department = data;
    });
  }
}
