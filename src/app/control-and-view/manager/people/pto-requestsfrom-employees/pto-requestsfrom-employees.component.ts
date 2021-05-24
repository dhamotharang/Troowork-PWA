import { Component, OnInit } from '@angular/core';
import { People } from '../../../../model-class/People';
import { PeopleServiceService } from "../../../../service/people-service.service";
import { ReportServiceService } from '../../../../service/report-service.service';
import { DatepickerOptions } from 'ng2-datepicker';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
@Component({
  selector: 'app-pto-requestsfrom-employees',
  templateUrl: './pto-requestsfrom-employees.component.html',
  styleUrls: ['./pto-requestsfrom-employees.component.scss']
})
export class PtoRequestsfromEmployeesComponent implements OnInit {

  //////////Authors : Aswathy///////

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  curr_date;
  startdate;
  enddate;
  assignment;
  comments;
  requestdetails;
  deleterequestKey;

  fromdate;
  todate;
  ptoStatus;

  dropdownSettings1 = {};
  dropdownSettings2 = {};
  dropdownSettings3 = {};
  managerList;
  Manager;
  Employee = [];
  empList: People[];
  EmployeeKeyString;

  shiftList;
  Shift;
  vpto;
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

  constructor(private ReportServiceService: ReportServiceService, private PeopleServiceService: PeopleServiceService, private dst: DataServiceTokenStorageService) { }

  ngOnInit() {

       // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.employeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();

    this.fromdate = new Date(Date.now());
    this.todate = new Date(Date.now());
    this.ptoStatus = '';
    this.Manager=[];
    this.Shift=[];

    this.fromdate = this.convert_DT(this.fromdate);
    this.todate = this.convert_DT(this.todate);

    var pstatus = null;
    this.EmployeeKeyString = null;

    this.vpto = {
      fromdate: this.fromdate,
      todate: this.todate,
      ptoStatus: pstatus,

      OrganizationID: this.OrganizationID,
      employeekey: this.employeekey,
      EmployeeKeyStr: this.EmployeeKeyString
    };
    // this.PeopleServiceService.getRequestdetailsforManager(this.employeekey, this.OrganizationID)
    //   .subscribe((data) => {
    //     this.requestdetails = data;
    //   });

    this.PeopleServiceService.getPTORequestdetailsforManager(this.vpto)
      .subscribe((data) => {
        this.requestdetails = data;
      });

    this.PeopleServiceService
      .getallEmployeesList_pto(this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.empList = data;
      });

    this.ReportServiceService.getShiftNameList(this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
      this.shiftList = data;
    });

    // this.peopleServ
    //   .getSupervisorList(this.employeekey, this.OrganizationID)
    //   .subscribe((data: People[]) => {
    //     this.supervisor = data;
    //   });
    this.PeopleServiceService
      .getmanagersForEmp_pto(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.managerList = data;
      });
    // Pooja's code for Supervisor Multiselect dropdown starts
    this.dropdownSettings2 = {
      singleSelection: false,
      idField: 'ManagerKey',
      textField: 'ManagerName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
    // Pooja's code for Supervisor Multiselect dropdown ends
    this.dropdownSettings1 = {
      singleSelection: false,
      idField: 'EmployeeKey',
      textField: 'EmployeeText',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.dropdownSettings3 = {
      singleSelection: false,
      idField: 'Master_shiftID',
      textField: 'ShiftName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

  }

  selectEmp() {
    var Mang;
    var Shif;

    if (this.Manager.length == 0) {
      Mang = null;
    }
    else {
      var ManagerList = [];
      var ManagerListObj = this.Manager;

      if (ManagerListObj.length > 0) {
        if (ManagerListObj) {
          for (var j = 0; j < ManagerListObj.length; j++) {
            ManagerList.push(ManagerListObj[j].ManagerKey);
          }
        }
        Mang = ManagerList.join(',');
      }
    }
    if (this.Shift.length == 0) {
      Shif = null;
    }
    else {
      var ShiftList = [];
      var ShiftListObj = this.Shift;

      if (ShiftListObj.length > 0) {
        if (ShiftListObj) {
          for (var j = 0; j < ShiftListObj.length; j++) {
            ShiftList.push(ShiftListObj[j].Master_shiftID);
          }
        }
        Shif = ShiftList.join(',');
      }
    }

    this.PeopleServiceService.selectEmpWithJobTSprvsrAndDept_pto(this.employeekey, this.OrganizationID, null, Mang, null, Shif)
      .subscribe((data: any[]) => {
        this.empList = data;
      });
  }

  public convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  viewpto(fromdate, todate, ptoStatus) {


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

      var pstatus;
      if (!ptoStatus) {
        pstatus = null;
      }
      else {
        pstatus = ptoStatus;
      }

      // var EmployeeKeyString;
      if (this.Employee.length == 0) {
        this.EmployeeKeyString = null;
      }
      else {
        var employeeKeList = [];
        var employeeKeListObj = this.Employee;
        if (employeeKeListObj.length > 0) {
          if (employeeKeListObj) {
            for (var j = 0; j < employeeKeListObj.length; j++) {
              employeeKeList.push(employeeKeListObj[j].EmployeeKey);
            }
          }
          this.EmployeeKeyString = employeeKeList.join(',');
        }
      }

      this.vpto = {
        fromdate: fdate,
        todate: tdate,
        ptoStatus: pstatus,

        OrganizationID: this.OrganizationID,
        employeekey: this.employeekey,
        EmployeeKeyStr: this.EmployeeKeyString
      };

      this.PeopleServiceService.getPTORequestdetailsforManager(this.vpto)
        .subscribe((data) => {
          this.requestdetails = data;
        });
    }
  }

}
