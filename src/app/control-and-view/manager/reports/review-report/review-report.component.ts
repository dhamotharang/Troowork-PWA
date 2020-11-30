import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Reports } from '../../../../model-class/reports';
import { ReportServiceService } from '../../../../service/report-service.service';
import { ExcelserviceService } from '../../../../service/excelservice.service';
import { DatepickerOptions } from 'ng2-datepicker';//for datepicker
import * as FileSaver from 'file-saver';//for excel
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

@Component({
  selector: 'app-review-report',
  templateUrl: './review-report.component.html',
  styleUrls: ['./review-report.component.scss']
})
export class ReviewReportComponent implements OnInit {
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  SupervisorKey;
  loading: boolean;// loading
  fromdate;
  todate;
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
  viewReport;
  public reportarray: Array<any> = [{
    Date: '', Room: '', Question: '', StarRating: ''
  }
  ];
  constructor(private fb: FormBuilder, private ReportServiceService: ReportServiceService, private excelService: ExcelserviceService) {
    this.inspectionreport = fb.group({
      SupervisorKey: ['', Validators.required],
      SupervisorText: ['', Validators.required]
    });
  }

  // function for exporting to excel 
  exportToExcel(): void {
    for (var i = 0; i < this.viewReport.length; i++) {
      var date1 = (this.viewReport[i].ReviewDate);
      var room = (this.viewReport[i].RoomName);
      var question = this.viewReport[i].Question;
      var rating = this.viewReport[i].ReviewValue;

      this.reportarray.push({ Date: date1, Room: room, Question: question, StarRating: rating })

    }
    var blob = new Blob([document.getElementById('exportable1').innerHTML], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(blob, "Feedback_Report.xls");
  }

  ngOnInit() {
    this.SupervisorKey = ""
    this.fromdate = new Date();
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;
    this.fromdate = new Date(Date.now());
    this.todate = new Date(Date.now());
  }
  //function for genaerating report
  generateInspectionReport(from_date, to_date) {
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
      alert("Please check your Start Date!");
      return;
    }
    this.loading = true;
    this.ReportServiceService
      .getReviewReportDetails(fromdate, todate, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.viewReport = data;
        for (var i = 0; i < this.viewReport.length; i++) {
          this.viewReport[i].ReviewDate = this.convert_DT(this.viewReport[i].ReviewDate);
        }
        this.loading = false;
      });

  }

}
