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
  selector: 'app-workorder-report',
  templateUrl: './workorder-report.component.html',
  styleUrls: ['./workorder-report.component.scss']
})
export class WorkorderReportComponent implements OnInit {
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
    addStyle: {'font-size':'18px','width':'100%', 'border': '1px solid #ced4da','border-radius': '0.25rem'}, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };
  

  fromdate: Date;
  facilitylist: Reports[];
  floor: Reports[];
  zoneroom: Reports[];
  room: Reports[];
  rooms: Reports[];
  FacilityKey;
  emp: Reports[];
  workstatus: Reports[];
  viewWorkorderReport: Reports[];
  FloorKey;
  ZoneKey;
  RoomTypeKey;
  RoomKey;
  EmployeeKey;
  WorkorderStatusKey;
  todate:Date;
  workorderTypeList;
  WorkorderTypeKey;

  public workexcel: Array<any> = [{
    WorkorderTypeName: '', DateandTime: '', Status: '', Employee: '', Room: '', Equipment: '', CheckinTime: '', CheckoutTime: '', Duration: '', DelayTime: '', Notes: ''
  }];

  constructor(private fb: FormBuilder, private ReportServiceService: ReportServiceService, private excelService: ExcelserviceService, private WorkOrderServiceService: WorkOrderServiceService) { }

  ngOnInit() {
    this.FacilityKey = "";
    this.FloorKey = "";
    this.ZoneKey = "";
    this.RoomTypeKey = "";
    this.RoomKey = "";
    this.EmployeeKey = "";
    this.WorkorderStatusKey = "";
    this.fromdate = new Date();
    this.WorkorderTypeKey='';
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;

    this.ReportServiceService.getBarcodeReport(this.employeekey, this.OrganizationID).subscribe((data: Reports[]) => {
      this.facilitylist = data;
    });


    this.ReportServiceService.getEmployee(this.employeekey, this.OrganizationID).subscribe((data: Reports[]) => {
      this.emp = data;
    });

    this.ReportServiceService.getWorkstatus(this.employeekey, this.OrganizationID).subscribe((data: Reports[]) => {
      this.workstatus = data;
    });
    this.WorkOrderServiceService//for getting all workordertypes
    .getallworkorderType(this.employeekey, this.OrganizationID)
    .subscribe((data: any[]) => {
      
      this.workorderTypeList = data;
    });
  }

  getFloorDisp(key) {
    if(key){
    this.ReportServiceService.getFloor(key, this.OrganizationID)
      .subscribe((data: Reports[]) => {
        this.floor = data;
      });
    }
    else{
      this.FloorKey='';
    }
  }

  getZoneRoom(floorkey, fkey) {
    this.ReportServiceService.getZone(fkey, floorkey, this.OrganizationID)
      .subscribe((data: Reports[]) => {
        this.zoneroom = data;
      });

    this.ReportServiceService
      .getRoomtype(fkey, floorkey, this.OrganizationID)
      .subscribe((data: Reports[]) => {
        this.room = data;
      });

      this.ReportServiceService
      .getRoom(fkey, floorkey, this.OrganizationID)
      .subscribe((data: Reports[]) => {
        this.rooms = data;
      });

  }

  getRoomsName(zonekey, fkey, floorkey) {
    if(!zonekey && !fkey && !floorkey){
    this.ReportServiceService
      .getRooms(fkey, floorkey, zonekey, this.employeekey, this.OrganizationID)
      .subscribe((data: Reports[]) => {
        this.rooms = data;
      });
    }
    else{
      this.RoomTypeKey = "";
      this.RoomKey = "";
    }
  }

  generateWorkOrderReport(from_date, to_date, FacilityKey, FloorKey, RoomTypeKey, ZoneKey, RoomKey, EmployeeKey, WorkorderStatusKey) {
    var WorkorderType_Key;
    if ((to_date) && (this.convert_DT(from_date) >this.convert_DT( to_date))) {
      todate = null;
      alert("Please check your Start Date!");
      return;
    }
    else
    {
      var fromdate;
    this.loading = true;
    if(!FacilityKey){
      FacilityKey=null;
     }
     if(!FloorKey){
      FloorKey=null;
     }
     if(!RoomTypeKey){
      RoomTypeKey=null;
     }
     if(!ZoneKey){
      ZoneKey=null;
     }
     if(!RoomTypeKey){
      RoomTypeKey=null;
     }
     if(!RoomKey){
      RoomKey=null;
     }
     if(!EmployeeKey){
      EmployeeKey=null;
     }
     if(!WorkorderStatusKey){
      WorkorderStatusKey=null;
     }
//     if (!(this.todate) ) {
     
//        var date1 = this.convert_DT(this.fromdate);
//        fromdate = this.convert_DT(from_date);
//        this.ReportServiceService
//       .generateWorkOrderReportServicewithdate(FacilityKey, FloorKey, RoomTypeKey, ZoneKey, fromdate, date1, RoomKey, EmployeeKey, WorkorderStatusKey, this.employeekey, this.OrganizationID)
//       .subscribe((data: Reports[]) => {
//         this.viewWorkorderReport = data;
//         this.loading = false;
//       });
//     }
// else{
      var todate;
      if(!from_date)
      {
        fromdate = this.convert_DT(new Date());
      }
      else
      {
        fromdate = this.convert_DT(from_date);
      }
      if(!to_date)
      {
        todate=fromdate;
      }
      else
      {
        todate = this.convert_DT(to_date);
      }
      if(this.WorkorderTypeKey){
        WorkorderType_Key=this.WorkorderTypeKey;
      }
      else{
        WorkorderType_Key=null;
      }
       this.ReportServiceService
      .generateWorkOrderReportService(FacilityKey, FloorKey, RoomTypeKey, ZoneKey, fromdate, todate, RoomKey, EmployeeKey, WorkorderStatusKey, this.employeekey, this.OrganizationID,WorkorderType_Key)
      .subscribe((data: Reports[]) => {
        this.viewWorkorderReport = data;
        this.loading = false;
      });
  }
  // }
  }
  //export to excel 
  exportToExcel(): void {

    for (var i = 0; i < this.viewWorkorderReport.length; i++) {
      this.workexcel.splice(i, 1);
      var Work_Type_Name = (this.viewWorkorderReport[i].WorkorderTypeName);

      var date_time = this.viewWorkorderReport[i].WorkorderDate.concat(' ',this.viewWorkorderReport[i].WorkorderTime);

      var Work_status = (this.viewWorkorderReport[i].WorkorderStatus);
      var employee = this.viewWorkorderReport[i].LastName.concat(',',this.viewWorkorderReport[i].FirstName);
      var room_id = (this.viewWorkorderReport[i].RoomId);
      if(room_id=='Dummy')
      {
        room_id='Refer notes';
      }
      var eq_name = (this.viewWorkorderReport[i].EquipmentName);
      var check_in = (this.viewWorkorderReport[i].checkin);
      var check_out = (this.viewWorkorderReport[i].checkout);
      var duration = (this.viewWorkorderReport[i].duration);
      var delay_time = (this.viewWorkorderReport[i].DelayTime);
      var work_notes = (this.viewWorkorderReport[i].WorkorderNotes); 

      if (this.viewWorkorderReport[i]) {
        this.workexcel.push({
          WorkorderTypeName: Work_Type_Name, 'Date and Time': date_time, Status: Work_status, Employee: employee, Room: room_id, Equipment: eq_name, CheckinTime: check_in, CheckoutTime: check_out, Duration: duration, DelayTime: delay_time, Notes: work_notes
        })
      }
    }
    // this.excelService.exportAsExcelFile(this.workexcel, 'Workorder_Report');
    var blob = new Blob([document.getElementById('exportable1').innerHTML], {
      type: EXCEL_TYPE
  });
  FileSaver.saveAs(blob, "Workorder_Report.xls");
  }
}
