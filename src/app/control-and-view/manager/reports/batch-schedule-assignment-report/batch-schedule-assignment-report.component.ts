import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Reports } from '../../../../model-class/reports';
import { ReportServiceService } from '../../../../service/report-service.service';
import { ExcelserviceService } from '../../../../service/excelservice.service';
import * as FileSaver from 'file-saver';//for excel
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
@Component({
  selector: 'app-batch-schedule-assignment-report',
  templateUrl: './batch-schedule-assignment-report.component.html',
  styleUrls: ['./batch-schedule-assignment-report.component.scss']
})
export class BatchScheduleAssignmentReportComponent implements OnInit {
  loading: boolean;// loading
  bacthschedules: Reports[];
  reportarray: Reports[];
  ScheduleName: string;
  batchschedule: FormGroup;
  totalMonTime: number;
  totalTuesTime: number;
  totalWedTime: number;
  totalThuTime: number;
  totalFriTime: number;
  totalSatTime: number;
  totalSunTime: number;
  workorderNotes: string;
  BatchScheduleNameKey;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;

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


  public excelarray: Array<any> = [{
    // Building:'',	Floor:'',	Zone:'',	Room:'',	FloorType:'',	RoomType:'',	Minutes:'',	Frequency:'',	Monday:'',	Tuesday:'',	Wednesday:'',	Thursday:'',	Friday:'',	Saturday:'',	Sunday:''
  }
  ];
  constructor(private fb: FormBuilder, private ReportServiceService: ReportServiceService, private excelService: ExcelserviceService) {
    this.batchschedule = fb.group({
      BatchScheduleNameKey: ['', Validators.required],
      ScheduleName: ['', Validators.required]
    });
  }
  ngOnInit() {
    this.BatchScheduleNameKey="";
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;
    this.ReportServiceService//service for getting schedulename
      .getallbatchschedules(this.employeekey, this.OrganizationID)
      .subscribe((data: Reports[]) => {
        this.bacthschedules = data;
      });
  }
  getBatchSchedule(Workorder_ScheduleKey) {
    if(!Workorder_ScheduleKey)
    {
      alert("Please select schedule name");
    }
 else
 {
    this.loading = true;
    this.ReportServiceService
      .getScheduleAssignReport(Workorder_ScheduleKey, this.employeekey, this.OrganizationID)
      .subscribe((data: Reports[]) => {
        this.reportarray = data;
        this.loading = false;
        this.totalMonTime = 0;
        this.totalTuesTime = 0;
        this.totalWedTime = 0;
        this.totalThuTime = 0;
        this.totalFriTime = 0;
        this.totalSatTime = 0;
        this.totalSunTime = 0;
        if (this.reportarray) {
          this.workorderNotes = this.reportarray[0].WorkorderNotes;
        }

        for (var i = 0; i < this.reportarray.length; i++) {
          var count = [];
          if (this.reportarray[i].Mon == 'true') {
            if (this.reportarray[i].MetricType === 'Minutes Per') {
              this.totalMonTime = this.totalMonTime + ((this.reportarray[i].MetricValue) * this.reportarray[i].Frequency);
            }
            else {
              this.totalMonTime = this.totalMonTime + ((this.reportarray[i].MetricValue) * this.reportarray[i].Area) * this.reportarray[i].Frequency;
            }
          }
          if (this.reportarray[i].Tue == 'true') {
            if (this.reportarray[i].MetricType === 'Minutes Per') {
              this.totalTuesTime = this.totalTuesTime + ((this.reportarray[i].MetricValue) * this.reportarray[i].Frequency);
            }
            else {
              this.totalTuesTime = this.totalTuesTime + ((this.reportarray[i].MetricValue) * this.reportarray[i].Area) * this.reportarray[i].Frequency;
            }
          }
          if (this.reportarray[i].Wed == 'true') {
            if (this.reportarray[i].MetricType === 'Minutes Per') {
              this.totalWedTime = this.totalWedTime + ((this.reportarray[i].MetricValue) * this.reportarray[i].Frequency);
            }
            else {
              this.totalWedTime = this.totalWedTime + ((this.reportarray[i].MetricValue) * this.reportarray[i].Area) * this.reportarray[i].Frequency;
            }
          }
          if (this.reportarray[i].Thu == 'true') {
            if (this.reportarray[i].MetricType === 'Minutes Per') {
              this.totalThuTime = this.totalThuTime + ((this.reportarray[i].MetricValue) * this.reportarray[i].Frequency);
            }
            else {
              this.totalThuTime = this.totalThuTime + ((this.reportarray[i].MetricValue) * this.reportarray[i].Area) * this.reportarray[i].Frequency;
            }
          }
          if (this.reportarray[i].Fri == 'true') {
            if (this.reportarray[i].MetricType === 'Minutes Per') {
              this.totalFriTime = this.totalFriTime + ((this.reportarray[i].MetricValue) * this.reportarray[i].Frequency);
            }
            else {
              this.totalFriTime = this.totalFriTime + ((this.reportarray[i].MetricValue) * this.reportarray[i].Area) * this.reportarray[i].Frequency;
            }
          }
          if (this.reportarray[i].Sat == 'true') {
            if (this.reportarray[i].MetricType === 'Minutes Per') {
              this.totalSatTime = this.totalSatTime + ((this.reportarray[i].MetricValue) * this.reportarray[i].Frequency);
            }
            else {
              this.totalSatTime = this.totalSatTime + ((this.reportarray[i].MetricValue) * this.reportarray[i].Area) * this.reportarray[i].Frequency;
            }
          }
          if (this.reportarray[i].Sun == 'true') {
            if (this.reportarray[i].MetricType === 'Minutes Per') {
              this.totalSunTime = this.totalSunTime + ((this.reportarray[i].MetricValue) * this.reportarray[i].Frequency);
            }
            else {
              this.totalSunTime = this.totalSunTime + ((this.reportarray[i].MetricValue) * this.reportarray[i].Area) * this.reportarray[i].Frequency;
            }
          }
        }
      });
    }
  }
  exportToExcel(): void {//service for exporting to excel
    for (var i = 0; i < this.reportarray.length; i++) {
      var buildingname = this.reportarray[i].FacilityName;
      var floorname = this.reportarray[i].FloorName;
      var zon_name = this.reportarray[i].ZoneName;
      var roomnum = this.reportarray[i].RoomId;
      var floor_type = this.reportarray[i].FloorTypeName;
      var room_type = this.reportarray[i].RoomType;
      if (this.reportarray[i].MetricType === 'Minutes Per') {
        var minute = this.reportarray[i].MetricValue;
      }
      else {
        minute = ((this.reportarray[i].MetricValue) * (this.reportarray[i].Area));
      }
      var freq = this.reportarray[i].Frequency;
      if (this.reportarray[i].Mon == 'true') {
        var mondayvalue = 'X';
      }
      else {
        mondayvalue = ''
      }
      if (this.reportarray[i].Tue == 'true') {
        var tuesdayvalue = 'X';
      }
      else {
        tuesdayvalue = ''
      }
      if (this.reportarray[i].Wed == 'true') {
        var wednesdayvalue = 'X';
      }
      else {
        wednesdayvalue = ''
      }
      if (this.reportarray[i].Thu == 'true') {
        var thursdayvalue = 'X';
      }
      else {
        thursdayvalue = ''
      }
      if (this.reportarray[i].Fri == 'true') {
        var fridayvalue = 'X';
      }
      else {
        fridayvalue = ''
      }
      if (this.reportarray[i].Sat == 'true') {
        var saturdayvalue = 'X';
      }
      else {
        saturdayvalue = ''
      }
      if (this.reportarray[i].Sun == 'true') {
        var sundayvalue = 'X';
      }
      else {
        sundayvalue = ''
      }
      if (this.reportarray[i].IsPhotoRequired == 1) {
        var photovalue = 'X';
      }
      else {
        photovalue = ''
      }
      if (this.reportarray[i].IsBarcodeRequired == 1) {
        var barcodevalue = 'X';
      }
      else {
        barcodevalue = ''
      }

      this.excelarray.push({ '𝐁𝐮𝐢𝐥𝐝𝐢𝐧𝐠': buildingname, '𝐅𝐥𝐨𝐨𝐫': floorname, '𝐙𝐨𝐧𝐞': zon_name, '𝐑𝐨𝐨𝐦': roomnum, '𝐅𝐥𝐨𝐨𝐫𝐓𝐲𝐩𝐞': floor_type, '𝐑𝐨𝐨𝐦𝐓𝐲𝐩𝐞': room_type, '𝐌𝐢𝐧𝐮𝐭𝐞𝐬': minute, '𝐅𝐫𝐞𝐪𝐮𝐞𝐧𝐜𝐲': freq, '𝐌𝐨𝐧𝐝𝐚𝐲': mondayvalue, '𝐓𝐮𝐞𝐬𝐝𝐚𝐲': tuesdayvalue, '𝐖𝐞𝐝𝐧𝐞𝐬𝐝𝐚𝐲': wednesdayvalue, '𝐓𝐡𝐮𝐫𝐬𝐝𝐚𝐲': thursdayvalue, '𝐅𝐫𝐢𝐝𝐚𝐲': fridayvalue, '𝐒𝐚𝐭𝐮𝐫𝐝𝐚𝐲': saturdayvalue, '𝐒𝐮𝐧𝐝𝐚𝐲': sundayvalue, '𝐈𝐬𝐏𝐡𝐨𝐭𝐨𝐑𝐞𝐪𝐮𝐢𝐫𝐞𝐝': photovalue, '𝐈𝐬𝐁𝐚𝐫𝐜𝐨𝐝𝐞𝐑𝐞𝐪𝐮𝐢𝐫𝐞𝐝': barcodevalue })

    }
    this.excelarray.push('');
    this.excelarray.push({ '𝐁𝐮𝐢𝐥𝐝𝐢𝐧𝐠': 'Total Assigned daily minutes', '𝐌𝐨𝐧𝐝𝐚𝐲': this.totalMonTime, '𝐓𝐮𝐞𝐬𝐝𝐚𝐲': this.totalTuesTime, '𝐖𝐞𝐝𝐧𝐞𝐬𝐝𝐚𝐲': this.totalWedTime, '𝐓𝐡𝐮𝐫𝐬𝐝𝐚𝐲': this.totalThuTime, '𝐅𝐫𝐢𝐝𝐚𝐲': this.totalFriTime, '𝐒𝐚𝐭𝐮𝐫𝐝𝐚𝐲': this.totalSatTime, '𝐒𝐮𝐧𝐝𝐚𝐲': this.totalSunTime })
    // this.excelService.exportAsExcelFile(this.excelarray,'BatchscheduleAssignment_Report');
    var blob = new Blob([document.getElementById('exportable').innerHTML], {//converting html div content to excel
      type: EXCEL_TYPE
  });
  FileSaver.saveAs(blob, "BatchscheduleAssignment_Report.xls");
  }

}


