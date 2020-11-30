import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportServiceService } from '../../../../service/report-service.service';
import { ExcelserviceService } from '../../../../service/excelservice.service';
import { DatepickerOptions } from 'ng2-datepicker';
import * as FileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
import { SchedulingService } from '../../../../service/scheduling.service';
import { debug } from 'util';
import { Scheduling } from 'src/app/model-class/Schedulng';

@Component({
  selector: 'app-scheduler-report',
  templateUrl: './scheduler-report.component.html',
  styleUrls: ['./scheduler-report.component.scss']
})
export class SchedulerReportComponent implements OnInit {
  loading: boolean;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;

  EmployeeKey = [];
  groupList;
  empList;
  empListForTable;
  dropdownSettings = {};
  Idemployeegrouping;
  fromdate;
  todate;
  schReport: Scheduling[];
  dateList;
  schedulerReport;
  newList;

  d1; d2; d3; d4; d5; d6; d7;
  schedulerReport1; schedulerReport2; schedulerReport3; schedulerReport4; schedulerReport5; schedulerReport6; schedulerReport7;

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

  // adding properties and methods that will be used by the igxDatePicker
  public date: Date = new Date(Date.now());

  options: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2030,
    displayFormat: 'MM/DD/YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    barTitleIfEmpty: 'Click to select a date',
    placeholder: 'Click to select a date', // HTML input placeholder attribute (default: '')
    addClass: '', // Optional, value to pass on to [ngClass] on the input field
    addStyle: { 'font-size': '18px', 'width': '100%', 'border': '1px solid #ced4da', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };

  constructor(private SchedulingService: SchedulingService, private ReportService: ReportServiceService, private Excelservice: ExcelserviceService) { }

  ngOnInit() {
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;
    this.fromdate = new Date();
    this.todate = new Date();
    this.loading = false;

    //Employee Group
    this.SchedulingService.SchedulerEmployeeGroupsForReport(this.OrganizationID)
      .subscribe((group: any[]) => {
        this.groupList = group;
      });
    this.Idemployeegrouping = "";
    //employee list
    this.SchedulingService.getAllEmployeesForSchedulerReport(this.OrganizationID)
      .subscribe((data: any[]) => {
        this.empList = data;
      });
    this.dropdownSettings = {//for multiselect dropdown
      singleSelection: false,
      idField: 'EmployeeKey',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  getEmployeeFromGroup(grpID) {
    if (!(grpID)) {
      grpID = 0;
    }
    this.SchedulingService.getEmployeesofEmpGroup(grpID, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.empList = data;
      });
  }

  generateSchedulerReport() {
    if (!(this.fromdate)) {
      alert("Please select the fromdate...");
      return;
    }
    this.loading = true;
    // if (!(this.todate)) {
    //   alert("Please select the todate...");
    //   return;
    // }
    // if (this.convert_DT(this.fromdate) > this.convert_DT(this.todate)) {
    //   alert("Please check from Date & to date!");
    //   return;
    // }
    // var timeDiff = Math.abs(this.fromdate.getTime() - this.todate.getTime());
    // var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    // if (diffDays > 14) {
    //   alert("Select date between 14 days");
    //   return;
    // }
    if (!(this.Idemployeegrouping)) {
      this.Idemployeegrouping = null;
    }
    var employeeString;
    if (this.EmployeeKey.length == 0) {
      employeeString = null;
    } else {
      var employeeList = [];
      var employeeListObj = this.EmployeeKey;
      if (employeeListObj.length > 0) {
        if (employeeListObj) {
          for (var j = 0; j < employeeListObj.length; j++) {
            employeeList.push(employeeListObj[j].EmployeeKey);
          }
        }
        employeeString = employeeList.join(',');
      }
    }

    // List for viewing employees and groups in table
    this.empListForTable = [];
    if (!(this.Idemployeegrouping) && this.EmployeeKey.length == 0) {
      this.empListForTable = this.empList;
    } else if (!(this.Idemployeegrouping) && this.EmployeeKey.length > 0) {
      var employeeListObj = this.EmployeeKey;
      if (employeeListObj.length > 0) {
        for (var l = 0; l < employeeListObj.length; l++) {
          for (var a = 0; a < this.empList.length; a++) {
            if (this.empList[a].EmployeeKey == employeeListObj[l].EmployeeKey) {
              this.empListForTable.push(this.empList[a]);
            }
          }
        }
      }
    } else if (this.Idemployeegrouping && this.EmployeeKey.length == 0) {
      this.empListForTable = this.empList;
    } else if (this.Idemployeegrouping && this.EmployeeKey.length > 0) {
      var employeeListObj = this.EmployeeKey;
      if (employeeListObj.length > 0) {
        for (var k = 0; k < employeeListObj.length; k++) {
          for (var b = 0; b < this.empList.length; b++) {
            if (this.empList[b].EmployeeKey == employeeListObj[k].EmployeeKey) {
              this.empListForTable.push(this.empList[b]);
            }
          }
        }
      }
    }
    //date iteration
    var flag = 0;
    this.SchedulingService
      .iteratedatesForReport(this.convert_DT(this.fromdate))
      .subscribe((data: any) => {
        this.dateList = data;
        if (this.dateList.length > 0) {
          this.d1 = this.dateList[0].rundate;
          this.d2 = this.dateList[1].rundate;
          this.d3 = this.dateList[2].rundate;
          this.d4 = this.dateList[3].rundate;
          this.d5 = this.dateList[4].rundate;
          this.d6 = this.dateList[5].rundate;
          this.d7 = this.dateList[6].rundate;

          this.SchedulingService.generateSchedulerReport(this.convert_DT(this.d1), this.convert_DT(this.d1), this.Idemployeegrouping, employeeString, this.OrganizationID)
            .subscribe((data: any) => {
              this.schedulerReport1 = data;
              flag = flag + 1;
              if (flag == 7) {
                this.bindListToOne();
              }
            });
          this.SchedulingService.generateSchedulerReport(this.convert_DT(this.d2), this.convert_DT(this.d2), this.Idemployeegrouping, employeeString, this.OrganizationID)
            .subscribe((data: any) => {
              this.schedulerReport2 = data;
              flag = flag + 1;
              if (flag == 7) {
                this.bindListToOne();
              }
            });
          this.SchedulingService.generateSchedulerReport(this.convert_DT(this.d3), this.convert_DT(this.d3), this.Idemployeegrouping, employeeString, this.OrganizationID)
            .subscribe((data: any) => {
              this.schedulerReport3 = data;
              flag = flag + 1;
              if (flag == 7) {
                this.bindListToOne();
              }
            });
          this.SchedulingService.generateSchedulerReport(this.convert_DT(this.d4), this.convert_DT(this.d4), this.Idemployeegrouping, employeeString, this.OrganizationID)
            .subscribe((data: any) => {
              this.schedulerReport4 = data;
              flag = flag + 1;
              if (flag == 7) {
                this.bindListToOne();
              }
            });
          this.SchedulingService.generateSchedulerReport(this.convert_DT(this.d5), this.convert_DT(this.d5), this.Idemployeegrouping, employeeString, this.OrganizationID)
            .subscribe((data: any) => {
              this.schedulerReport5 = data;
              flag = flag + 1;
              if (flag == 7) {
                this.bindListToOne();
              }
            });
          this.SchedulingService.generateSchedulerReport(this.convert_DT(this.d6), this.convert_DT(this.d6), this.Idemployeegrouping, employeeString, this.OrganizationID)
            .subscribe((data: any) => {
              this.schedulerReport6 = data;
              flag = flag + 1;
              if (flag == 7) {
                this.bindListToOne();
              }
            });
          this.SchedulingService.generateSchedulerReport(this.convert_DT(this.d7), this.convert_DT(this.d7), this.Idemployeegrouping, employeeString, this.OrganizationID)
            .subscribe((data: any) => {
              this.schedulerReport7 = data;
              flag = flag + 1;
              if (flag == 7) {
                this.bindListToOne();
              }
            });
        }
      });
    this.schReport = this.empListForTable;
    if (flag == 7) {
      this.bindListToOne();
    }

    // // Generating the report details for the table
    // // this.loading = true;
    // // var tableflag = 0;
    // this.SchedulingService
    //   .generateSchedulerReport(this.convert_DT(this.fromdate), this.convert_DT(this.todate), this.Idemployeegrouping, employeeString, this.OrganizationID)
    //   .subscribe((data: any) => {
    //     this.schedulerReport = data;
    //     // this.schedulerReport = [];
    //     // var workList = "";
    //     // tableflag = 0;
    //     // console.log("schedulerReport started");
   
    //     // for (var z = 0; z < this.schReport.length; z++) {
    //     //   if ((z + 1) == this.schReport.length) {
    //     //     workList = workList + this.schReport[z].text + "\n";
    //     //     this.schReport[z].text = workList;
    //     //     this.schedulerReport.push(this.schReport[z]);
    //     //   }

    //     //   else if ((z + 1) < this.schReport.length) {

    //     //     if (this.schReport[z].EmployeeKey != this.schReport[z + 1].EmployeeKey) {
    //     //       workList = workList + this.schReport[z].text + "\n";
    //     //       this.schReport[z].text = workList;
    //     //       workList = "";
    //     //       this.schedulerReport.push(this.schReport[z]);
    //     //     }
    //     //     else if (this.schReport[z].EmployeeKey == this.schReport[z + 1].EmployeeKey) {
    //     //       if (this.schReport[z].start != this.schReport[z + 1].start) {
    //     //         workList = workList + this.schReport[z].text + "\n";
    //     //         this.schReport[z].text = workList;
    //     //         workList = "";
    //     //         this.schedulerReport.push(this.schReport[z]);
    //     //       } else if (this.schReport[z].start == this.schReport[z + 1].start) {
    //     //         workList = workList + this.schReport[z].text + "\n";
    //     //       }
    //     //     }

    //     //   }
    //     // }
    
    //     // tableflag = tableflag + 1;
    //     // console.log("schedulerReport completed");
    //     // for (var h = 0; h < this.empListForTable.length; h++) {
    //     // this.newList[h].GroupName = this.empListForTable[h].Description;
    //     //   this.newList[h].EmployeeName = this.empListForTable[h].name;
    //     //   this.newList[h].EmployeeKey = this.empListForTable[h].EmployeeKey;
    //     //   console.log("i did " + h);
    //     //   for (var d = 0; d < this.dateList.length; d++) {
    //     //     for (var a = 0; a < this.schedulerReport.length; a++) {
    
    //     //       if ((this.schedulerReport[a].EmployeeKey === this.newList[h].EmployeeKey) && (this.schedulerReport[a].start === this.dateList[d].rundate)) {
    //     //         console.log(a + "i won " + d);
    //     //         this.newList[h].textdate = this.schedulerReport[a].start;
    //     //         this.newList[h].text = this.schedulerReport[a].text;
    //     //       }
    //     //     }
    //     //   }
    //     // }
    //     // console.log(this.newList);
    //     // console.log(this.dateList);
    //     // console.log(this.schedulerReport);
    //     // this.loading = false;
    //     // if (tableflag > 0) {
    //     // this.downloadexcel();
    //     // }
    //   });

  }
  bindListToOne() {
    for (var a = 0; a < this.schReport.length; a++) {
      this.schReport[a].groupName = this.empListForTable[a].Description;
      this.schReport[a].empName = this.empListForTable[a].name;

      this.schReport[a].date1 = this.schedulerReport1[a].start;
      this.schReport[a].textDescription1 = this.schedulerReport1[a].text;
      this.schReport[a].backColor1 = this.schedulerReport1[a].backColor;
      this.schReport[a].empColor = this.schedulerReport1[a].empColor;

      this.schReport[a].date2 = this.schedulerReport2[a].start;
      this.schReport[a].textDescription2 = this.schedulerReport2[a].text;
      this.schReport[a].backColor2 = this.schedulerReport2[a].backColor;
      this.schReport[a].empColor = this.schedulerReport2[a].empColor;

      this.schReport[a].date3 = this.schedulerReport3[a].start;
      this.schReport[a].textDescription3 = this.schedulerReport3[a].text;
      this.schReport[a].backColor3 = this.schedulerReport3[a].backColor;
      this.schReport[a].empColor = this.schedulerReport3[a].empColor;

      this.schReport[a].date4 = this.schedulerReport4[a].start;
      this.schReport[a].textDescription4 = this.schedulerReport4[a].text;
      this.schReport[a].backColor4 = this.schedulerReport4[a].backColor;
      this.schReport[a].empColor = this.schedulerReport4[a].empColor;

      this.schReport[a].date5 = this.schedulerReport5[a].start;
      this.schReport[a].textDescription5 = this.schedulerReport5[a].text;
      this.schReport[a].backColor5 = this.schedulerReport5[a].backColor;
      this.schReport[a].empColor = this.schedulerReport5[a].empColor;

      this.schReport[a].date6 = this.schedulerReport6[a].start;
      this.schReport[a].textDescription6 = this.schedulerReport6[a].text;
      this.schReport[a].backColor6 = this.schedulerReport6[a].backColor;
      this.schReport[a].empColor = this.schedulerReport6[a].empColor;

      this.schReport[a].date7 = this.schedulerReport7[a].start;
      this.schReport[a].textDescription7 = this.schedulerReport7[a].text;
      this.schReport[a].backColor7 = this.schedulerReport7[a].backColor;
      this.schReport[a].empColor = this.schedulerReport7[a].empColor;
    }
    if (!(this.Idemployeegrouping)) {
      this.Idemployeegrouping = "";
    }
    this.loading = false;
  }

  downloadexcel() {
    var blob = new Blob([document.getElementById('exportable').innerHTML], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(blob, "Scheduler_Report.xls");
  }

}
