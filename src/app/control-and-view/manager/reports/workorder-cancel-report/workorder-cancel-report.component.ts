import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Reports } from '../../../../model-class/reports';
import { WorkOrderServiceService } from '../../../../service/work-order-service.service';
import { ReportServiceService } from '../../../../service/report-service.service';
import { ExcelserviceService } from '../../../../service/excelservice.service';
import { DatepickerOptions } from 'ng2-datepicker';
import * as FileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

@Component({
  selector: 'app-workorder-cancel-report',
  templateUrl: './workorder-cancel-report.component.html',
  styleUrls: ['./workorder-cancel-report.component.scss']
})
export class WorkorderCancelReportComponent implements OnInit {
  loading: boolean;// loading
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

  public convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  } public date: Date = new Date(Date.now());

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


  fromdate: Date;
  facilitylist;
  floor;
  zoneroom;
  room;
  rooms;
  FacilityKey;
  emp;
  viewWorkorderReport;
  FloorKey;
  ZoneKey;
  RoomTypeKey;
  RoomKey;
  EmployeeKey;
  todate: Date;

  public workexcel: Array<any> = [{
    Employee: '', Room: '', Equipment: '', CancelledDateTime: '', CancelledReason: ''
  }];

  constructor(private fb: FormBuilder, private ReportServiceService: ReportServiceService, private excelService: ExcelserviceService, private WorkOrderServiceService: WorkOrderServiceService) { }

  ngOnInit() {
    this.FacilityKey = "";
    this.FloorKey = "";
    this.ZoneKey = "";
    this.RoomTypeKey = "";
    this.RoomKey = "";
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

    //facility
    this.ReportServiceService.getBarcodeReport(this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
      this.facilitylist = data;
    });

    this.ReportServiceService.getEmployee(this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
      this.emp = data;
    });
  }

  getFloorDisp(key) {
    if (key) {
      this.ReportServiceService.getFloor(key, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.floor = data;
        });
    }
    else {
      this.FloorKey = '';
    }
  }

  getZoneRoom(floorkey, fkey) {
    this.ReportServiceService.getZone(fkey, floorkey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.zoneroom = data;
      });

    this.ReportServiceService
      .getRoomtype(fkey, floorkey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.room = data;
      });

    this.ReportServiceService
      .getRoom(fkey, floorkey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.rooms = data;
      });

  }

  getRoomsName(zonekey, fkey, floorkey) {
    if (!zonekey && !fkey && !floorkey) {
      this.ReportServiceService
        .getRooms(fkey, floorkey, zonekey, this.employeekey, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.rooms = data;
        });
    }
    else {
      this.RoomTypeKey = "";
      this.RoomKey = "";
    }
  }

  generateWorkOrderReport(from_date, to_date, FacilityKey, FloorKey, RoomTypeKey, ZoneKey, RoomKey, EmployeeKey) {
    if ((to_date) && (this.convert_DT(from_date) > this.convert_DT(to_date))) {
      todate = null;
      alert("Please check your Start Date!");
      return;
    }
    else {
      var fromdate;
      this.loading = true;
      if (!FacilityKey) {
        FacilityKey = null;
      }
      if (!FloorKey) {
        FloorKey = null;
      }
      if (!RoomTypeKey) {
        RoomTypeKey = null;
      }
      if (!ZoneKey) {
        ZoneKey = null;
      }
      if (!RoomTypeKey) {
        RoomTypeKey = null;
      }
      if (!RoomKey) {
        RoomKey = null;
      }
      if (!EmployeeKey) {
        EmployeeKey = null;
      }

      var todate;
      if (!from_date) {
        fromdate = this.convert_DT(new Date());
      }
      else {
        fromdate = this.convert_DT(from_date);
      }
      if (!to_date) {
        todate = fromdate;
      }
      else {
        todate = this.convert_DT(to_date);
      }

      this.ReportServiceService
        .generateWorkOrderCancelledReportService(FacilityKey, FloorKey, RoomTypeKey, ZoneKey, fromdate, todate, RoomKey, EmployeeKey, this.employeekey, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.viewWorkorderReport = data;
          this.loading = false;
        });
    }
    // }
  }
  //export to excel 
  exportToExcel(): void {

    var blob = new Blob([document.getElementById('exportable1').innerHTML], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(blob, "Workorder_Cancelled_Report.xls");
  }
}
