import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Reports } from '../../../../model-class/reports';
import { ReportServiceService } from '../../../../service/report-service.service';
import { DatepickerOptions } from 'ng2-datepicker';
import { ChartOptions } from 'chart.js';
// import { Label } from 'ng2-charts';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';

@Component({
  selector: 'app-barchart-report',
  templateUrl: './barchart-report.component.html',
  styleUrls: ['./barchart-report.component.scss']
})
export class BarchartReportComponent implements OnInit {

  //////////////////////Author : Aswathy///////////////////////////////
  
  loading: boolean;// loading
  role: String;
  name: String;
  employeekey: Number;
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
  EmployeeKey;
  fromdate: Date;
  todate: Date;
  WorkorderTypeKey = [];
  showElement: boolean;
  viewBarchartReport = [];
  barvalues = [];
  downtimes = [];
  chartLabels = [];
  chartDatasets;
  barChartCol = [];
  chartColors = [];
  ChartOptions = [];
  tableflag = false;
  downtime;

  constructor(private fb: FormBuilder, private ReportServiceService: ReportServiceService) {
    // this.dashboardreport = fb.group({
    //   EmployeeKey: ['', Validators.required],
    //   EmployeeText: ['', Validators.required]
    // });
  }

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
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    //locale: frLocale,
    //minDate: new Date(Date.now()), // Minimal selectable date
    //maxDate: new Date(Date.now()),  // Maximal selectable date
    barTitleIfEmpty: 'Click to select a date',
    placeholder: 'Click to select a date', // HTML input placeholder attribute (default: '')
    addClass: '', // Optional, value to pass on to [ngClass] on the input field
    addStyle: { 'font-size': '18px', 'width': '125%', 'border': '1px solid #ced4da', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };

  title = 'Reusable charts sample';
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

  generateDowntimeReport(fromdate, EmployeeKey) {
    this.chartDatasets = [];
    this.data4 = [];
    this.data5 = [];
    this.chartLabels = [];
    this.downtimes = [];
    this.barvalues=[];
    if (!(this.EmployeeKey)) {
      alert("Please choose Employee!");
      return;
    }
    if (!fromdate) {
      alert("Please choose Date!");
      return;
    }
    this.loading = true;
    this.ReportServiceService
      .generateDowntimeReportService(this.convert_DT(fromdate), EmployeeKey, this.OrganizationID)
      .subscribe((data1: any) => {
        
        this.loading = false;
        if (data1.length > 0) {
          this.tableflag = true;

          this.barvalues = data1;
          this.downtime = 0;
          for (var i = 0; i < this.barvalues.length; i++) {
            this.downtime = this.downtime + parseInt(this.barvalues[i].DownTime);

            if ( parseInt(this.barvalues[i].DownTime) < 3) {
              this.barChartCol.push('SlateBlue')
            }
            else if ( parseInt(this.barvalues[i].DownTime) >= 3 &&  parseInt( this.barvalues[i].DownTime) < 7) {
              this.barChartCol.push('Yellow')
            }
            else if ( parseInt(this.barvalues[i].DownTime) >= 7) {
              this.barChartCol.push('Red')
            }
            // var test1=this.barvalues[i].checkin1;
            // var test2=this.barvalues[i].checkout1;
            // var status = test1 + " - " + test2;

            var status = i + 1;
            var downtimeval = this.barvalues[i].DownTime;
            this.data4 = ([status]);
            this.data5 = ([downtimeval]);
            this.chartLabels[i] = (this.data4);
            this.downtimes[i] = (this.data5);
          }
          console.log(this.chartLabels);
          console.log(this.downtimes);
          this.chartDatasets = [{ data: this.downtimes}];
          console.log(this.chartDatasets);
          this.chartColors = [
            {
              backgroundColor: this.barChartCol,
              borderColor: this.barChartCol,
              borderWidth: 2,
              hoverBackgroundColor: '#66CCFF',
              hoverBorderColor: '#66CCFF'
            }
          ];
        }
      });
  }
  // totaldowntime(){

  //   this.downtime=0;
  //   for(var i=0;i<this.barvalues.length;i++){
  //     this.downtime=this.downtime + this.barvalues[i].DownTime;
  //   }
  // }

  public chartType: string = 'bar';
  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      xAxes: [{
        // barPercentage: 0.5,
        // barThickness: 10,
        // categoryPercentage: 1.0,
        // barPercentage: 0.5,
        ticks: {
          beginAtZero: true,
          fontFamily: "'Open Sans Bold', sans-serif",
          fontSize: 12,
          // autoSkip: false,
          // maxRotation: 90,
          // minRotation: 90
        },
        scaleLabel: {
          display: true
        },
        // gridLines: {
        //   display: true,
        //   offsetGridLines: true
        // },
        // stacked: true
      }],
      yAxes: [{
        // barThickness: 100,
        // gridLines: {
        //     display: true,
        //     color: "#fff",
        //     zeroLineColor: "#fff",
        //     zeroLineWidth: 0
        // },
        ticks: {
          fontFamily: "'Open Sans Bold', sans-serif",
          fontSize: 12
        },
        stacked: true
      }]
    },
  };
  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }

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
    this.EmployeeKey = "";
    this.fromdate = new Date();
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;

    this.ReportServiceService
      .getallemployee(this.employeekey, this.OrganizationID)
      .subscribe((data: Reports[]) => {
        this.employeeoption = data;
      });
  }
}
