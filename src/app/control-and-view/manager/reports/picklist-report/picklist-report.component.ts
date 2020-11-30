import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Reports } from '../../../../model-class/reports';
import { ReportServiceService } from '../../../../service/report-service.service';
import { ExcelserviceService } from '../../../../service/excelservice.service';
import { DatepickerOptions } from 'ng2-datepicker';//for datepicker
import { InspectionService } from '../../../../service/inspection.service';
import * as FileSaver from 'file-saver';//for excel
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

@Component({
  selector: 'app-picklist-report',
  templateUrl: './picklist-report.component.html',
  styleUrls: ['./picklist-report.component.scss']
})
export class PicklistReportComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  SupervisorKey;
  loading: boolean;// loading

  employeeList;
  templateNameList;
  TemplateName;
  Employee;
  // empNameForview;
  // templateNameForview;
  ReportType;
  fromdate;
  todate;
  showHide1: boolean;
  showHide2: boolean;
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

  //convert date to yyyy-mm-dd format
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
    maxDate: new Date(Date.now()),
    barTitleIfEmpty: 'Click to select a date',
    placeholder: 'Click to select a date', // HTML input placeholder attribute (default: '')
    addClass: '', // Optional, value to pass on to [ngClass] on the input field
    addStyle: { 'font-size': '18px', 'width': '100%', 'border': '1px solid #ced4da', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };
  viewinspectionReport;
  // viewinspectionReportSummary;
  public reportarray: Array<any> = [{}];
  constructor(private fb: FormBuilder, private ReportServiceService: ReportServiceService, private excelService: ExcelserviceService, private inspectionService: InspectionService) { }

  ngOnInit() {
    this.TemplateName = "";
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;

    this.showHide2 = false;
    this.showHide1 = false;

    this.inspectionService
      .getTemplateNameForPicklistReport(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.templateNameList = data;
      });

    this.fromdate = this.convert_DT(new Date());
    this.todate = this.convert_DT(new Date());

    this.inspectionService
      .getEmployeeNameForAuditReport(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.employeeList = data;
        this.Employee = 0;
      });
  }

  //function for genaerating report
  generateInspectionAuditReport(from_date, to_date, TemplateName, Employee, ReportType) {
    // var Template_Name;
    if (!TemplateName) {
      alert("Please select a Template Name");
      return false;
    }

    if (!from_date) {
      var fromdate1 = new Date();
    }
    else {
      fromdate1 = new Date(from_date);
    }

    if (!to_date) {
      var todate1 = fromdate1;
    }
    else {
      todate1 = new Date(to_date);
    }

    if (todate1 && fromdate1 > todate1) {
      todate1 = null;
      alert("Please check your Dates !");
      return;
    }

    fromdate1 = new Date(fromdate1.getFullYear(), fromdate1.getMonth(), 1);
    todate1 = new Date(todate1.getFullYear(), todate1.getMonth() + 1, 0);

    this.loading = true;
    this.ReportServiceService
      .getInspectionPickListReportDetails(this.convert_DT(fromdate1), this.convert_DT(todate1), TemplateName, Employee, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.viewinspectionReport = data;
        this.showHide1 = true;
        this.showHide2 = false;
        if (data.length > 0) {
          this.fromdate = this.convert_DT(fromdate1);
          this.todate = this.convert_DT(todate1);
        }
        this.loading = false;
      });
  }
  exportToExcel(): void {

    for (var i = 0; i < this.viewinspectionReport.length; i++) {
      var question = (this.viewinspectionReport[i].Question);
      var ins_year = (this.viewinspectionReport[i].InspectionYear);
      var ins_month = (this.viewinspectionReport[i].InspectionMonth);
      var tcount = (this.viewinspectionReport[i].TotalCount);
      var pcount = (this.viewinspectionReport[i].PassCount);
      var fcount = (this.viewinspectionReport[i].FailCount);
      var totalper = (this.viewinspectionReport[i].TotalPercentage);
      var pasper = (this.viewinspectionReport[i].PassPercentage);
      var failper = (this.viewinspectionReport[i].FailPercentage);

      this.reportarray.push({
        Question: question, InspectionYear: ins_year, InspectionMonth: ins_month, TotalCount: tcount, PassCount: pcount, FailCount: fcount, TotalPercentage: totalper, PassPercentage: pasper, FailPercentage: failper
      })

    }
    var blob = new Blob([document.getElementById('exportable1').innerHTML], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(blob, "Inspection-Picklist Report.xls");

  }
}
