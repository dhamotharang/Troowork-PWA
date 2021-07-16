import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Reports } from '../../../../model-class/reports';
import { ReportServiceService } from '../../../../service/report-service.service';
import { DatepickerOptions } from 'ng2-datepicker';
// import { ChartOptions } from 'chart.js';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
// import { ChartsModule } from 'ng2-charts';
// import 'chartjs-plugin-datalabels'

import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';
@Component({
  selector: 'app-employees-downtime-report',
  templateUrl: './employees-downtime-report.component.html',
  styleUrls: ['./employees-downtime-report.component.scss']
})
export class EmployeesDowntimeReportComponent implements OnInit {
  loading: boolean;// loading
  role: String;
  name: String;
  // employeekey = [];
  IsSupervisor: Number;
  OrganizationID: Number;
  employeeoption: Reports[];
  dashboardreport: FormGroup;
  // reporttable = [];
  data1: any[];
  data5: any[];
  data3: any[];
  sampledata1: any[];
  sampledata2: any[];
  data4: any[];
  elementId1: String;
  dropdownSettings = {};
  em_Key: number;
  Workorder_TypeKey: string;
  date1: string;
  date2: string;
  org_id: number;
  manager;
  EmployeeKey = [];
  employeekey: number;
  fromdate: Date;
  todate: Date;
  // WorkorderTypeKey = [];
  showElement: boolean;
  viewBarchartReport = [];
  barvalues = [];
  downtimes = [];
  // chartLabels = [];
  // chartDatasets;
  barChartCol = [];
  // chartColors = [];
  // ChartOptions = [];
  tableflag = false;
  employeeString;
  checkFlag;
  constructor(private fb: FormBuilder, private ReportServiceService: ReportServiceService, private dst: DataServiceTokenStorageService, private dialog: MatDialog) { }

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

  options: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2030,
    displayFormat: 'MM/DD/YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    firstCalendarDay: 0,
    barTitleIfEmpty: 'Click to select a date',
    placeholder: 'Click to select a date', // HTML input placeholder attribute (default: '')
    addClass: '', // Optional, value to pass on to [ngClass] on the input field
    addStyle: { 'font-size': '18px', 'width': '100%', 'border': '1px solid #ced4da', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };

  title = 'Downtime report employees based';
  public arr: Array<any> = [{}];
  public samplearr: Array<any> = [{}];

  public convert_DT(str) { //converting date to yyyy/mm/dd format
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  public date: Date = new Date(Date.now());

  // barchart code
  public chartType: string = 'bar';

  public chartDatasets: Array<any> = [];

  public chartLabels: Array<any> = [];

  public chartColors: Array<any> = [];

  generateDowntimeReport() {
    this.checkFlag = true;
    var employeeString;
    if (!(this.fromdate)) {
      // alert(" Please select from date");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please select from date!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
        return;
      });
    }
    if (!(this.todate)) {
      // alert(" Please select to date");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please select to date!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
        return;
      });
    }
    var timeDiff = Math.abs(this.fromdate.getTime() - this.todate.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if (diffDays > 7) {
      // alert("Select date between 7 days");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Select date between 7 days!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
        return;
      });
    }
    if (this.convert_DT(this.fromdate) > this.convert_DT(this.todate)) {
      // alert("Please check from Date & to date!");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please check from Date & to date!!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
        return;
      });
    }
    if ((this.convert_DT(this.fromdate) >= this.convert_DT(new Date())) || (this.convert_DT(this.todate) >= this.convert_DT(new Date()))) {
      // alert("Please provide date less than current date!");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please provide date less than current date!!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
        return;
      });
    }
    if (this.EmployeeKey.length == 0) {
      employeeString = null;
      // alert(" Please select atleast one employee");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please select atleast one employee!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
        return;
      });
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
    this.loading = true;
    this.tableflag = true;
    this.ReportServiceService
      .generateDowntimeWeeklyReport(this.convert_DT(this.fromdate), this.convert_DT(this.todate), employeeString, this.OrganizationID)
      .subscribe((data1: any) => {

        this.checkFlag = false;
        this.barvalues = data1;
        this.loading = false;
        // this.chartLabels = [];
        this.downtimes = [];

        for (var i = 0; i < this.barvalues.length; i++) {

          this.barChartCol.push('SlateBlue')

          // var status = this.barvalues[i].EmployeeName;
          var downtimeval = this.barvalues[i].downtime;
          this.data4 = ([i + 1]);
          this.data5 = ([downtimeval]);
          this.chartLabels[i] = i + 1;
          this.downtimes[i] = this.barvalues[i].downtime;
        }
        this.chartDatasets = [{ data: this.downtimes }];
        this.chartColors = [
          {
            backgroundColor: this.barChartCol,
            borderColor: this.barChartCol,
            borderWidth: 2,
            hoverBackgroundColor: '#66CCFF',
            hoverBorderColor: '#66CCFF'
          }
        ];

      });
  }
  // public barChartLegend = true;

  // public chartType: string = 'bar';
  // public barChartOptions: ChartOptions = {
  //   responsive: true,
  //   legend: {
  //     "display": true
  //   },
  //   tooltips: {
  //     "enabled": true
  //   },
  //   scales: {
  //     xAxes: [{
  //       gridLines: {
  //         display: true
  //       },
  //       // categoryPercentage: 1.0,
  //       // barPercentage: 0.5,
  //       ticks: {
  //         beginAtZero: true,
  //         fontFamily: "'Open Sans Bold', sans-serif",
  //         fontSize: 9,
  //         autoSkip: false,
  //         // maxRotation: 90,
  //         // minRotation: 90
  //       },
  //       scaleLabel: {
  //         display: true
  //       },
  //     }],
  //     yAxes: [{
  //       // barThickness: 100,
  //       display: true,
  //       gridLines: {
  //         display: true
  //       },
  //       ticks: {
  //         display: true,
  //         beginAtZero: true,
  //         fontFamily: "'Open Sans Bold', sans-serif",
  //         fontSize: 10
  //       },
  //       stacked: true
  //     }]
  //   },
  // };
  // public chartClicked(e: any): void { }
  // public chartHovered(e: any): void { }

  // barchart code ends

  //code for converting graph to pdf 

  public captureScreen() {
    const doc = new jspdf();
    var data = document.getElementById('part1');
    html2canvas(data).then(canvas => {
      const img = canvas.toDataURL('image/png');
      var imgWidth = 208;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      doc.addImage(img, 'PNG', 0, 0, imgWidth, imgHeight);
      doc.addPage();
      doc.autoTable({
        html: '#contentToConvert',
      });
      doc.save('graph.pdf');
    });
  }

  //code for converting graph to pdf ends

  ngOnInit() {
    this.loading = false;
    this.fromdate = new Date();
    this.todate = new Date();
    // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.employeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();

    this.checkFlag = false;
    this.ReportServiceService
      .getallemployee(this.employeekey, this.OrganizationID)
      .subscribe((data: Reports[]) => {
        this.employeeoption = data;
      });
    this.dropdownSettings = {//for multiselect dropdown
      singleSelection: false,
      idField: 'EmployeeKey',
      textField: 'EmployeeText',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };//
  }

}
