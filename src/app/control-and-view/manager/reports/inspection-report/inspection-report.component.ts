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
  selector: 'app-inspection-report',
  templateUrl: './inspection-report.component.html',
  styleUrls: ['./inspection-report.component.scss']
})
export class InspectionReportComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  SupervisorKey;
  loading: boolean;// loading
  templateNameList;
  TemplateName;

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
  //
  fromdate: Date;

  // adding properties and methods that will be used by the igxDatePicker
  public date: Date = new Date(Date.now());
  // private dayFormatter = new Intl.DateTimeFormat('en', { weekday: 'long' });
  // private monthFormatter = new Intl.DateTimeFormat('en', { month: 'long' });
  // public formatter = (_: Date) => {
  //   return `You selected ${this.dayFormatter.format(_)}, ${_.getDate()} ${this.monthFormatter.format(_)}, ${_.getFullYear()}`;

  // }
  //adding options to ng2 datepicker
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
    addStyle: { 'font-size': '18px', 'width': '100%', 'border': '1px solid #ced4da', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };
  //
  supervisoroptions: Reports[];
  inspectionreport: FormGroup;
  viewinspectionReport: Reports[];
  public reportarray: Array<any> = [{
    // Template: '', Date: '', Location: '', Auditor: '', Employee: '', Status: ''
  }
  ];
  constructor(private fb: FormBuilder, private ReportServiceService: ReportServiceService, private excelService: ExcelserviceService,private inspectionService: InspectionService) {
    this.inspectionreport = fb.group({
      SupervisorKey: ['', Validators.required],
      SupervisorText: ['', Validators.required]
    });
  }
  //function for exporting to excel 
  exportToExcel(): void {
    for (var i = 0; i < this.viewinspectionReport.length; i++) {
      var temp_name = (this.viewinspectionReport[i].TemplateName);
      var ins_date = (this.viewinspectionReport[i].InspectionDate);
      var locationname = this.viewinspectionReport[i].FacilityName.concat('-', this.viewinspectionReport[i].RoomId);
      var auditorname = this.viewinspectionReport[i].LastName.concat(',', this.viewinspectionReport[i].FirstName);
      var employeename = (this.viewinspectionReport[i].EmployeeName);
      if (this.viewinspectionReport[i].InspectionCompletedBy !== null) {
        var cur_status1 = 'Inspection Completed';
        this.reportarray.push({ template: temp_name, Date: ins_date, Location: locationname, Auditor: auditorname, Employee: employeename, Status: cur_status1 })
      }
      else {
        var cur_status2 = 'Inspection not Completed';
        this.reportarray.push({ Template: temp_name, Date: ins_date, Location: locationname, Auditor: auditorname, Employee: employeename, Status: cur_status2 })
      }
    }
    var blob = new Blob([document.getElementById('exportable1').innerHTML], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(blob, "inspection_Report.xls");
    // this.excelService.exportAsExcelFile(this.reportarray, 'Inspection_Report');
  }

  ngOnInit() {
    this.SupervisorKey = ""
    this.fromdate = new Date();
    this.TemplateName='';
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;


    this.ReportServiceService//service for getting supervisor names
      .getallAuditors(this.employeekey, this.OrganizationID)
      .subscribe((data: Reports[]) => {
        this.supervisoroptions = data;
      });
      this.inspectionService
      .getTemplateName(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.templateNameList = data;
      });
  }
  //function for genaerating report
  generateInspectionReport(from_date, to_date, SupervisorKey) {
    var Template_Name,Supervisor_Key;

    if (!from_date) {
      var fromdate = this.convert_DT(new Date());

    }
    else {
      fromdate = this.convert_DT(from_date);
    }
    if (!to_date) {
      var todate = fromdate;

    }
    else {
      todate = this.convert_DT(to_date);
    }

    if (todate && fromdate > todate) {
      todate = null;
      alert("Please check your Dates !");
      return;
    }
    if(this.TemplateName){
      Template_Name=this.TemplateName;
    }
    else{
      Template_Name=null;
    }
    if(SupervisorKey){
      Supervisor_Key=SupervisorKey;
    }
    else{
      Supervisor_Key=null;
    }
    let inspectData={
      fromdate:fromdate,
      todate:todate,
      TemplateName:Template_Name,
      SupervisorKey:Supervisor_Key,
      employeekey:this.employeekey,
      OrganizationID:this.OrganizationID
    }
    this.loading = true;
    this.ReportServiceService
        .getInspectionReportByAllFilter(inspectData)
        .subscribe((data: Reports[]) => {
          this.viewinspectionReport = data;
          this.loading = false;
      });
    // if (!SupervisorKey) {//inspection report for supervisorkey=null
    //   this.ReportServiceService
    //     .getinspectionreport_bydate(fromdate, todate, this.employeekey, this.OrganizationID)
    //     .subscribe((data: Reports[]) => {
    //       this.viewinspectionReport = data;
    //       this.loading = false;
    //     });
    // }
    // else {//inspection report for selected supervisor
    //   this.ReportServiceService
    //     .getinspectionreport(fromdate, todate, SupervisorKey, this.OrganizationID)
    //     .subscribe((data: Reports[]) => {
    //       this.viewinspectionReport = data;
    //       this.loading = false;
    //     });
    // }


  }

}