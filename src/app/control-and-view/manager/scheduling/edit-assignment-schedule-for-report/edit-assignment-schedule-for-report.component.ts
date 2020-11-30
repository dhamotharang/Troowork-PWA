import { Component, OnInit } from '@angular/core';
import { SchedulingService } from '../../../../service/scheduling.service';
import { Scheduling } from '../../../../model-class/Schedulng';
import { ActivatedRoute, Router } from "@angular/router";
import { DatepickerOptions } from 'ng2-datepicker';
@Component({
  selector: 'app-edit-assignment-schedule-for-report',
  templateUrl: './edit-assignment-schedule-for-report.component.html',
  styleUrls: ['./edit-assignment-schedule-for-report.component.scss']
})
export class EditAssignmentScheduleForReportComponent implements OnInit {
  public intlDateTimeFormat = new Intl.DateTimeFormat() as any;
  public formatParts: boolean = this.intlDateTimeFormat.formatToParts;
  public date: Date = new Date(Date.now());
  public allViews;

  scheduleNameKey$: Object;
  time1;
  scheduleNameList: Scheduling[];
  scheduleDetails: Scheduling[];
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  empName: String = null;
  WorkorderNotes: String = null;
  workScheduleStartDate: Date = null;
  workScheduleEndDate: Date = null;
  dt: Date;
  BatchScheduleNameKey;
  startDT: any;
  endDT: any;
  WorkorderTypeKey;
  CreateDis;
  //for table view..... starts......
  totalMonTime: any = 0;
  totalTuesTime: any = 0;
  totalWedTime: any = 0;
  totalThuTime: any = 0;
  totalFriTime: any = 0;
  totalSatTime: any = 0;
  totalSunTime: any = 0;

  recurringFrequency = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  roomList: any[] = [];
  roomTempList: any[] = [];
  woList: any[] = [];
  scheduleUpdate;
  scheduleInsert;
  batchFlag: number = 0;
  executeFlag: number = 0;
  wotypeFlag: number = 0;
  //for table view..... ends......
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

  convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(- 2),
      day = ("0" + date.getDate()).slice(- 2);
    return [date.getFullYear(), mnth, day].join("-");
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
    addStyle: { 'font-size': '18px', 'width': '138%', 'border': '1px solid #ced4da', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };
  metricCal() {
    this.totalMonTime = 0;
    this.totalTuesTime = 0;
    this.totalWedTime = 0;
    this.totalThuTime = 0;
    this.totalFriTime = 0;
    this.totalSatTime = 0;
    this.totalSunTime = 0;
    for (var i = 0; i < this.roomList.length; i++) {


      if (this.roomList[i].dailyFrequency == 0 || !this.roomList[i].dailyFrequency) {
        this.roomList[i].dailyFrequency = '1';
      }
      if (this.roomList[i].check_mon == '1') {
        if (this.roomList[i].MetricType === 'Minutes Per') {
          this.totalMonTime = this.totalMonTime + (parseFloat(this.roomList[i].Minutes) * this.roomList[i].dailyFrequency);
        }
        else {
          this.totalMonTime = this.totalMonTime + (parseFloat(this.roomList[i].Minutes)* this.roomList[i].dailyFrequency);
        }
      }
      if (this.roomList[i].check_tue == '1') {
        if (this.roomList[i].MetricType === 'Minutes Per') {
          this.totalTuesTime = this.totalTuesTime + (parseFloat(this.roomList[i].Minutes) * this.roomList[i].dailyFrequency);
        }
        else {
          this.totalTuesTime = this.totalTuesTime + (parseFloat(this.roomList[i].Minutes) * this.roomList[i].dailyFrequency);
        }
      }
      if (this.roomList[i].check_wed == '1') {
        if (this.roomList[i].MetricType === 'Minutes Per') {
          this.totalWedTime = this.totalWedTime + (parseFloat(this.roomList[i].Minutes) * this.roomList[i].dailyFrequency);
        }
        else {
          this.totalWedTime = this.totalWedTime + (parseFloat(this.roomList[i].Minutes) * this.roomList[i].dailyFrequency);
        }
      }
      if (this.roomList[i].check_thu == '1') {
        if (this.roomList[i].MetricType === 'Minutes Per') {
          this.totalThuTime = this.totalThuTime + (parseFloat(this.roomList[i].Minutes) * this.roomList[i].dailyFrequency);
        }
        else {
          this.totalThuTime = this.totalThuTime + (parseFloat(this.roomList[i].Minutes) * this.roomList[i].dailyFrequency);
        }
      }
      if (this.roomList[i].check_fri == '1') {
        if (this.roomList[i].MetricType === 'Minutes Per') {
          this.totalFriTime = this.totalFriTime + (parseFloat(this.roomList[i].Minutes) * this.roomList[i].dailyFrequency);
        }
        else {
          this.totalFriTime = this.totalFriTime + (parseFloat(this.roomList[i].Minutes) * this.roomList[i].dailyFrequency);
        }
      }
      if (this.roomList[i].check_sat == '1') {
        if (this.roomList[i].MetricType === 'Minutes Per') {
          this.totalSatTime = this.totalSatTime + (parseFloat(this.roomList[i].Minutes) * this.roomList[i].dailyFrequency);
        }
        else {
          this.totalSatTime = this.totalSatTime + (parseFloat(this.roomList[i].Minutes)  * this.roomList[i].dailyFrequency);
        }
      }
      if (this.roomList[i].check_sun == '1') {
        if (this.roomList[i].MetricType === 'Minutes Per') {
          this.totalSunTime = this.totalSunTime + (parseFloat(this.roomList[i].Minutes) * this.roomList[i].dailyFrequency);
        }
        else {
          this.totalSunTime = this.totalSunTime + (parseFloat(this.roomList[i].Minutes) * this.roomList[i].dailyFrequency);
        }
      }

    }

    for (var i = 0; i < this.roomTempList.length; i++) {

      if (this.roomTempList[i].dailyFrequency == 0 || !this.roomTempList[i].dailyFrequency) {
        this.roomTempList[i].dailyFrequency = '1';
      }

      if (this.roomTempList[i].check_mon == '1') {
        if (this.roomTempList[i].MetricType === 'Minutes Per') {
          this.totalMonTime = this.totalMonTime + (parseFloat(this.roomTempList[i].Minutes) * this.roomTempList[i].dailyFrequency);
        }
        else {
          this.totalMonTime = this.totalMonTime + (parseFloat(this.roomTempList[i].Minutes) * this.roomTempList[i].dailyFrequency);
        }
      }
      if (this.roomTempList[i].check_tue == '1') {
        if (this.roomTempList[i].MetricType === 'Minutes Per') {
          this.totalTuesTime = this.totalTuesTime + (parseFloat(this.roomTempList[i].Minutes) * this.roomTempList[i].dailyFrequency);
        }
        else {
          this.totalTuesTime = this.totalTuesTime + (parseFloat(this.roomTempList[i].Minutes) * this.roomTempList[i].dailyFrequency);
        }
      }
      if (this.roomTempList[i].check_wed == '1') {
        if (this.roomTempList[i].MetricType === 'Minutes Per') {
          this.totalWedTime = this.totalWedTime + (parseFloat(this.roomTempList[i].Minutes) * this.roomTempList[i].dailyFrequency);
        }
        else {
          this.totalWedTime = this.totalWedTime + (parseFloat(this.roomTempList[i].Minutes) * this.roomTempList[i].dailyFrequency);
        }
      }
      if (this.roomTempList[i].check_thu == '1') {
        if (this.roomTempList[i].MetricType === 'Minutes Per') {
          this.totalThuTime = this.totalThuTime + (parseFloat(this.roomTempList[i].Minutes) * this.roomTempList[i].dailyFrequency);
        }
        else {
          this.totalThuTime = this.totalThuTime + (parseFloat(this.roomTempList[i].Minutes) * this.roomTempList[i].dailyFrequency);
        }
      }
      if (this.roomTempList[i].check_fri == '1') {
        if (this.roomTempList[i].MetricType === 'Minutes Per') {
          this.totalFriTime = this.totalFriTime + (parseFloat(this.roomTempList[i].Minutes) * this.roomTempList[i].dailyFrequency);
        }
        else {
          this.totalFriTime = this.totalFriTime + (parseFloat(this.roomTempList[i].Minutes) * this.roomTempList[i].dailyFrequency);
        }
      }
      if (this.roomTempList[i].check_sat == '1') {
        if (this.roomTempList[i].MetricType === 'Minutes Per') {
          this.totalSatTime = this.totalSatTime + (parseFloat(this.roomTempList[i].Minutes) * this.roomTempList[i].dailyFrequency);
        }
        else {
          this.totalSatTime = this.totalSatTime + (parseFloat(this.roomTempList[i].Minutes) * this.roomTempList[i].dailyFrequency);
        }
      }
      if (this.roomTempList[i].check_sun == '1') {
        if (this.roomTempList[i].MetricType === 'Minutes Per') {
          this.totalSunTime = this.totalSunTime + (parseFloat(this.roomTempList[i].Minutes) * this.roomTempList[i].dailyFrequency);
        }
        else {
          this.totalSunTime = this.totalSunTime + (parseFloat(this.roomTempList[i].Minutes) * this.roomTempList[i].dailyFrequency);
        }
      }

    }
  }

  constructor(private scheduleService: SchedulingService, private router: Router, private route: ActivatedRoute) {
    this.route.params.subscribe(params => this.scheduleNameKey$ = params.scheduleKey);
  }


  getScheduleDetails(scheduleKey) {
    this.BatchScheduleNameKey = scheduleKey;
    this.empName = null;
    this.WorkorderNotes = null;
    this.workScheduleStartDate = null;
    this.workScheduleEndDate = null;
    this.scheduleService
      .getSchedulingDetails(scheduleKey, this.employeekey, this.OrganizationID)
      .subscribe((data: Scheduling[]) => {
        this.scheduleDetails = data;
        this.empName = this.scheduleDetails[0].EmployeeName;
        this.WorkorderNotes = this.scheduleDetails[0].WorkorderNotes;
        if (this.scheduleDetails[0].workScheduleStartDate) {
          this.workScheduleStartDate = new Date(this.scheduleDetails[0].workScheduleStartDate);
        } else {
          this.workScheduleStartDate = new Date(Date.now());
        }

        if (this.scheduleDetails[0].workScheduleEndDate) {
          this.workScheduleEndDate = new Date(this.scheduleDetails[0].workScheduleEndDate);
        } else {
          this.workScheduleEndDate = new Date(Date.now());
        }
        var cur_time = new Date(Date.now());
        var timeValue1 = this.scheduleDetails[0].BatchScheduleTime;
        var test1 = timeValue1.split(":");
        var start = new Date(cur_time.getFullYear(), cur_time.getMonth(), cur_time.getDate(), test1[0], test1[1], 0);
        this.time1 = start;
      });
    this.scheduleService
      .getRoomDetailsForSchedule(scheduleKey, this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.roomList = data;
        for (var j = 0; j < this.roomList.length; j++) {

          for(var i=0;i<this.woList.length;i++){
            if (this.roomList[j].WorkorderTypeKey==this.woList[i].WorkorderTypeKey){
              
             if(this.woList[i].MetricType== 'Minutes Per')
             {
             this.roomList[j].Minutes=this.woList[i].MetricValue;
             console.log("Metric value::::"+this.woList[i].MetricValue);
           }
           else{
             this.roomList[j].Minutes=(this.woList[i].MetricValue*this.roomList[j].Area);
             console.log("Metric value::::"+this.woList[i].MetricValue);
             console.log("Area::::"+this.roomList[j].Area);
           }
            }
           }


          if (this.roomList[j].check_mon == 'true') {
            this.roomList[j].check_mon = 1;
          } else if (this.roomList[j].check_mon == 'false') {
            this.roomList[j].check_mon = 0;
          }

          if (this.roomList[j].check_tue == 'true') {
            this.roomList[j].check_tue = 1;
          } else if (this.roomList[j].check_tue == 'false') {
            this.roomList[j].check_tue = 0;
          }

          if (this.roomList[j].check_wed == 'true') {
            this.roomList[j].check_wed = 1;
          } else if (this.roomList[j].check_wed == 'false') {
            this.roomList[j].check_wed = 0;
          }

          if (this.roomList[j].check_thu == 'true') {
            this.roomList[j].check_thu = 1;
          } else if (this.roomList[j].check_thu == 'false') {
            this.roomList[j].check_thu = 0;
          }

          if (this.roomList[j].check_fri == 'true') {
            this.roomList[j].check_fri = 1;
          } else if (this.roomList[j].check_fri == 'false') {
            this.roomList[j].check_fri = 0;
          }

          if (this.roomList[j].check_sat == 'true') {
            this.roomList[j].check_sat = 1;
          } else if (this.roomList[j].check_sat == 'false') {
            this.roomList[j].check_sat = 0;
          }

          if (this.roomList[j].check_sun == 'true') {
            this.roomList[j].check_sun = 1;
          } else if (this.roomList[j].check_sun == 'false') {
            this.roomList[j].check_sun = 0;
          }

          this.roomList[j].dailyFrequency = this.roomList[j].dailyFrequency.toString();

        }
        this.metricCal();
      });
    this.scheduleService
      .getRoomofTempTableDetailsForSchedule(scheduleKey, this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.roomTempList = data;
        for (var j = 0; j < this.roomTempList.length; j++) {
          this.roomTempList[j].dailyFrequency = 1;
          this.roomTempList[j].KeepActive = 0;
        }
        this.metricCal();
      });
    // this.scheduleService
    //   .getallworkorderType(this.employeekey, this.OrganizationID)
    //   .subscribe((data: any[]) => {
    //     this.woList = data;
    //   });

    this.scheduleService
    .getallworkorderTypeNew(this.employeekey, this.OrganizationID)
    .subscribe((data: any[]) => {
      this.woList = data;
    });

  }

  selectAllMon() {
    for (var j = 0; j < this.roomList.length; j++) {
      this.roomList[j].check_mon = true;
    }
    for (var j = 0; j < this.roomTempList.length; j++) {
      this.roomTempList[j].check_mon = true;
    }
    this.metricCal();
  }
  selectAllTue() {
    for (var j = 0; j < this.roomList.length; j++) {
      this.roomList[j].check_tue = true;
    }
    for (var j = 0; j < this.roomTempList.length; j++) {
      this.roomTempList[j].check_tue = true;
    }
    this.metricCal();
  }
  selectAllWed() {
    for (var j = 0; j < this.roomList.length; j++) {
      this.roomList[j].check_wed = true;
    }
    for (var j = 0; j < this.roomTempList.length; j++) {
      this.roomTempList[j].check_wed = true;
    }
    this.metricCal();
  }
  selectAllThu() {
    for (var j = 0; j < this.roomList.length; j++) {
      this.roomList[j].check_thu = true;
    }
    for (var j = 0; j < this.roomTempList.length; j++) {
      this.roomTempList[j].check_thu = true;
    }
    this.metricCal();
  }
  selectAllFri() {
    for (var j = 0; j < this.roomList.length; j++) {
      this.roomList[j].check_fri = true;
    }
    for (var j = 0; j < this.roomTempList.length; j++) {
      this.roomTempList[j].check_fri = true;
    }
    this.metricCal();
  }
  selectAllSat() {
    for (var j = 0; j < this.roomList.length; j++) {
      this.roomList[j].check_sat = true;
    }
    for (var j = 0; j < this.roomTempList.length; j++) {
      this.roomTempList[j].check_sat = true;
    }
    this.metricCal();
  }
  selectAllSun() {
    for (var j = 0; j < this.roomList.length; j++) {
      this.roomList[j].check_sun = true;
    }
    for (var j = 0; j < this.roomTempList.length; j++) {
      this.roomTempList[j].check_sun = true;
    }
    this.metricCal();
  }
  selectAllPhoto() {
    for (var j = 0; j < this.roomList.length; j++) {
      this.roomList[j].photoReq = true;
    }
    for (var j = 0; j < this.roomTempList.length; j++) {
      this.roomTempList[j].photoReq = true;
    }
    this.metricCal();
  }
  selectAllBarcode() {
    for (var j = 0; j < this.roomList.length; j++) {
      this.roomList[j].barcodeReq = true;
    }
    for (var j = 0; j < this.roomTempList.length; j++) {
      this.roomTempList[j].barcodeReq = true;
    }
    this.metricCal();
  }

  selectAllKeepActive() {
    for (var j = 0; j < this.roomList.length; j++) {
      this.roomList[j].KeepActive = 1;
    }
    for (var j = 0; j < this.roomTempList.length; j++) {
      this.roomTempList[j].KeepActive = 1;
    }
  }

  selectAllSnapshot()
  {
    for (var j = 0; j < this.roomList.length; j++) {
      this.roomList[j].snapshot = 1;
    }
    for (var j = 0; j < this.roomTempList.length; j++) {
      this.roomTempList[j].snapshot = 1;
    }
  }

  selectAllcreateworkorder() {
    for (var j = 0; j < this.roomList.length; j++) {
      this.roomList[j].CreateWO = 1;
    }
    for (var j = 0; j < this.roomTempList.length; j++) {
      this.roomTempList[j].CreateWO = 1;
    }
  }

  createBatchReport() {
    this.CreateDis = true;
    this.wotypeFlag = 0;
    if (this.workScheduleStartDate) {
      // if (this.convert_DT(this.workScheduleStartDate) < this.convert_DT(new Date())) {
      //   alert("Start date can't be less than current date");
      //   this.CreateDis = false;
      //   return;
      // } else {
        this.startDT = this.convert_DT(this.workScheduleStartDate);
      // }
    } else {
      this.startDT = this.convert_DT(new Date());
    }

    if (this.workScheduleEndDate) {
      this.endDT = this.convert_DT(this.workScheduleEndDate);
    } else {
      this.endDT = this.convert_DT(new Date());
    }

    if (this.endDT < this.startDT) {
      alert("End Date can't be less than Start Date");
      this.CreateDis = false;
      return;
    }

    for (var i = 0; i < this.roomList.length; i++) {
      if (!this.roomList[i].WorkorderTypeKey) {
        this.wotypeFlag = this.wotypeFlag + 1;
      }
    }

    for (var j = 0; j < this.roomTempList.length; j++) {
      if (!this.roomTempList[j].WorkorderTypeKey) {
        this.wotypeFlag = this.wotypeFlag + 1;
      }
    }
    if (this.wotypeFlag > 0) {
      alert(" Select required workorder type for all rooms before submitting");
      this.CreateDis = false;
    }
    else if (this.wotypeFlag == 0) {
      //Updating the list of existing rooms in schedule.
      if (this.roomList.length > 0) {
        var workorderroomobj1 = [];
        var workorderkeyobj1 = [];
        var roomlistObj1 = [];
        var FrequencyObj1 = [];
        var monObj1 = [];
        var tueObj1 = [];
        var wedObj1 = [];
        var thuObj1 = [];
        var friObj1 = [];
        var satObj1 = [];
        var sunObj1 = [];
        var barObj1 = [];
        var photoObj1 = [];
        var keepObj1 = [];
        var snapObj1=[];
        var roomsString1;
        var roomList1 = [];
        var Frequency1;
        var MonCheck1;
        var TueCheck1;
        var WedCheck1;
        var ThuCheck1;
        var FriCheck1;
        var SatCheck1;
        var SunCheck1;
        var BarCheck1;
        var PhotCheck1;
        var KeepActive1;
        var Snapshot1;
        var workordertkey1;
        var workorderroomstring1;
        var createwoObj1 = [];
        var CreateWO1;
        var q = this.time1.getHours();
        var q1 = this.time1.getMinutes();
        var newTime = q + ":" + q1;
        for (var j = 0; j < this.roomList.length; j++) {

          workorderroomobj1.push(this.roomList[j].WorkOrderScheduleRoomID);
          workorderkeyobj1.push(this.roomList[j].WorkorderTypeKey);
          roomList1.push(this.roomList[j].RoomKey);
          FrequencyObj1.push(this.roomList[j].dailyFrequency);
          if (this.roomList[j].check_mon === true || this.roomList[j].check_mon == 1) {
            this.roomList[j].check_mon = true;
            monObj1.push(this.roomList[j].check_mon);
          }
          else {
            this.roomList[j].check_mon = false;
            monObj1.push(this.roomList[j].check_mon);
          }

          if (this.roomList[j].check_tue === true || this.roomList[j].check_tue == 1) {
            this.roomList[j].check_tue = true;
            tueObj1.push(this.roomList[j].check_tue);
          }
          else {
            this.roomList[j].check_tue = false;
            tueObj1.push(this.roomList[j].check_tue);
          }

          if (this.roomList[j].check_wed === true || this.roomList[j].check_wed == 1) {
            this.roomList[j].check_wed = true;
            wedObj1.push(this.roomList[j].check_wed);
          }
          else {
            this.roomList[j].check_wed = false;
            wedObj1.push(this.roomList[j].check_wed);
          }

          if (this.roomList[j].check_thu === true || this.roomList[j].check_thu == 1) {
            this.roomList[j].check_thu = true;
            thuObj1.push(this.roomList[j].check_thu);
          }
          else {
            this.roomList[j].check_thu = false;
            thuObj1.push(this.roomList[j].check_thu);
          }

          if (this.roomList[j].check_fri === true || this.roomList[j].check_fri == 1) {
            this.roomList[j].check_fri = true;
            friObj1.push(this.roomList[j].check_fri);
          }
          else {
            this.roomList[j].check_fri = false;
            friObj1.push(this.roomList[j].check_fri);
          }

          if (this.roomList[j].check_sat === true || this.roomList[j].check_sat == 1) {
            this.roomList[j].check_sat = true;
            satObj1.push(this.roomList[j].check_sat);
          }
          else {
            this.roomList[j].check_sat = false;
            satObj1.push(this.roomList[j].check_sat);
          }

          if (this.roomList[j].check_sun === true || this.roomList[j].check_sun == 1) {
            this.roomList[j].check_sun = true;
            sunObj1.push(this.roomList[j].check_sun);
          }
          else {
            this.roomList[j].check_sun = false;
            sunObj1.push(this.roomList[j].check_sun);
          }

          if (this.roomList[j].barcodeReq === true || this.roomList[j].barcodeReq === 1) {
            this.roomList[j].barcodeReq = true;
            barObj1.push(this.roomList[j].barcodeReq);
          }
          else {
            this.roomList[j].barcodeReq = false;
            barObj1.push(this.roomList[j].barcodeReq);
          }

          if (this.roomList[j].photoReq === true || this.roomList[j].photoReq === 1) {
            this.roomList[j].photoReq = true;
            photoObj1.push(this.roomList[j].photoReq);
          }
          else {
            this.roomList[j].photoReq = false;
            photoObj1.push(this.roomList[j].photoReq);
          }
          
// console.log(this.roomList[j].KeepActive+" ... "+j);
          if (this.roomList[j].KeepActive === true || this.roomList[j].KeepActive == 1) {
            this.roomList[j].KeepActive = true;
            keepObj1.push(this.roomList[j].KeepActive);
          }
          else {
            this.roomList[j].KeepActive = false;
            keepObj1.push(this.roomList[j].KeepActive);
          }
          if (this.roomList[j].snapshot === true || this.roomList[j].snapshot == 1) {
            this.roomList[j].snapshot = true;
            snapObj1.push(this.roomList[j].snapshot);
          }
          else {
            this.roomList[j].snapshot = false;
            snapObj1.push(this.roomList[j].snapshot);
          }

          if (this.roomList[j].CreateWO === true || this.roomList[j].CreateWO == 1) {
            this.roomList[j].CreateWO = true;
            createwoObj1.push(this.roomList[j].CreateWO);
          }
          else {
            this.roomList[j].CreateWO = false;
            createwoObj1.push(this.roomList[j].CreateWO);
          }
        }
        // console.log(keepObj1);
        roomsString1 = roomList1.join(',');
        Frequency1 = FrequencyObj1.join(',');
        MonCheck1 = monObj1.join(',');
        TueCheck1 = tueObj1.join(',');
        WedCheck1 = wedObj1.join(',');
        ThuCheck1 = thuObj1.join(',');
        FriCheck1 = friObj1.join(',');
        SatCheck1 = satObj1.join(',');
        SunCheck1 = sunObj1.join(',');
        BarCheck1 = barObj1.join(',');
        PhotCheck1 = photoObj1.join(',');
        KeepActive1 = keepObj1.join(','); 
        Snapshot1 = snapObj1.join(',');
        workordertkey1 = workorderkeyobj1.join(',');
        workorderroomstring1 = workorderroomobj1.join(',');
        CreateWO1 = createwoObj1.join(',');
        if(this.WorkorderNotes){
          this.WorkorderNotes=this.WorkorderNotes.trim();
        }
        this.scheduleUpdate = {
          workorderroomidlist: workorderroomstring1,
          roomList: roomsString1,
          frequency: Frequency1,
          monCheck: MonCheck1,
          tueCheck: TueCheck1,
          wedCheck: WedCheck1,
          thuCheck: ThuCheck1,
          friCheck: FriCheck1,
          satCheck: SatCheck1,
          sunCheck: SunCheck1,
          barCheck: BarCheck1,
          photCheck: PhotCheck1,
          snapshot:Snapshot1,
          keepActiveCheck: KeepActive1,
          workordertype: workordertkey1,
          empKey: this.employeekey,
          batchScheduleNameKey: this.BatchScheduleNameKey,
          WorkorderNotes: this.WorkorderNotes,
          OrganizationID: this.OrganizationID,
          fromdate: this.startDT,
          todate: this.endDT,
          scheduleTime: newTime,
          CreateWO:CreateWO1
        }
        this.scheduleService
          .setUpdateScheduleReport(this.scheduleUpdate).subscribe(res => {
            this.batchFlag = this.batchFlag + 1;
            this.reload();
          });
      }
      //Inserting the list of new rooms in schedule
      if (this.roomTempList.length > 0) {

        var temproomobj2 = [];
        var workorderkeyobj2 = [];
        var roomlistObj2 = [];
        var FrequencyObj2 = [];
        var monObj2 = [];
        var tueObj2 = [];
        var wedObj2 = [];
        var thuObj2 = [];
        var friObj2 = [];
        var satObj2 = [];
        var sunObj2 = [];
        var barObj2 = [];
        var photoObj2 = [];
        var keepObj2 = [];
        var snapObj2=[];
        var roomsString2;
        var roomList2 = [];
        var FRequency2;
        var MOnCheck2;
        var TUeCheck2;
        var WEdCheck2;
        var THuCheck2;
        var FRiCheck2;
        var SAtCheck2;
        var SUnCheck2;
        var BArCheck2;
        var PHotCheck2;
        var KeepActive2;
        var Snapshot2;
        var WOrkordertkey2;
        var TEmproomidobj2;
        var createwoObj2 = [];
        var CreateWO2;
        var q = this.time1.getHours();
        var q1 = this.time1.getMinutes();
        var newTime = q + ":" + q1;
        for (var j = 0; j < this.roomTempList.length; j++) {

          temproomobj2.push(this.roomTempList[j].Temp_workorderbatchscheduleroomID);
          workorderkeyobj2.push(this.roomTempList[j].WorkorderTypeKey);
          roomList2.push(this.roomTempList[j].RoomKey);
          FrequencyObj2.push(this.roomTempList[j].dailyFrequency);

          if (this.roomTempList[j].check_mon === true || this.roomTempList[j].check_mon == 1) {
            this.roomTempList[j].check_mon = true;
            monObj2.push(this.roomTempList[j].check_mon);
          }
          else {
            this.roomTempList[j].check_mon = false;
            monObj2.push(this.roomTempList[j].check_mon);
          }

          if (this.roomTempList[j].check_tue === true || this.roomTempList[j].check_tue == 1) {
            this.roomTempList[j].check_tue = true;
            tueObj2.push(this.roomTempList[j].check_tue);
          }
          else {
            this.roomTempList[j].check_tue = false;
            tueObj2.push(this.roomTempList[j].check_tue);
          }

          if (this.roomTempList[j].check_wed === true || this.roomTempList[j].check_wed == 1) {
            this.roomTempList[j].check_wed = true;
            wedObj2.push(this.roomTempList[j].check_wed);
          }
          else {
            this.roomTempList[j].check_wed = false;
            wedObj2.push(this.roomTempList[j].check_wed);
          }

          if (this.roomTempList[j].check_thu === true || this.roomTempList[j].check_thu == 1) {
            this.roomTempList[j].check_thu = true;
            thuObj2.push(this.roomTempList[j].check_thu);
          }
          else {
            this.roomTempList[j].check_thu = false;
            thuObj2.push(this.roomTempList[j].check_thu);
          }

          if (this.roomTempList[j].check_fri === true || this.roomTempList[j].check_fri == 1) {
            this.roomTempList[j].check_fri = true;
            friObj2.push(this.roomTempList[j].check_fri);
          }
          else {
            this.roomTempList[j].check_fri = false;
            friObj2.push(this.roomTempList[j].check_fri);
          }

          if (this.roomTempList[j].check_sat === true || this.roomTempList[j].check_sat == 1) {
            this.roomTempList[j].check_sat = true;
            satObj2.push(this.roomTempList[j].check_sat);
          }
          else {
            this.roomTempList[j].check_sat = false;
            satObj2.push(this.roomTempList[j].check_sat);
          }

          if (this.roomTempList[j].check_sun === true || this.roomTempList[j].check_sun == 1) {
            this.roomTempList[j].check_sun = true;
            sunObj2.push(this.roomTempList[j].check_sun);
          }
          else {
            this.roomTempList[j].check_sun = false;
            sunObj2.push(this.roomTempList[j].check_sun);
          }

          if (this.roomTempList[j].barcodeReq === true || this.roomTempList[j].barcodeReq == 1) {
            this.roomTempList[j].barcodeReq = true;
            barObj2.push(this.roomTempList[j].barcodeReq);
          }
          else {
            this.roomTempList[j].barcodeReq = false;
            barObj2.push(this.roomTempList[j].barcodeReq);
          }

          if (this.roomTempList[j].photoReq === true || this.roomTempList[j].photoReq == 1) {
            this.roomTempList[j].photoReq = true;
            photoObj2.push(this.roomTempList[j].photoReq);
          }
          else {
            this.roomTempList[j].photoReq = false;
            photoObj2.push(this.roomTempList[j].photoReq);
          }

          if (this.roomTempList[j].KeepActive === true || this.roomTempList[j].KeepActive == 1) {
            this.roomTempList[j].KeepActive = true;
            keepObj2.push(this.roomTempList[j].KeepActive);
          }
          else {
            this.roomTempList[j].KeepActive = false;
            keepObj2.push(this.roomTempList[j].KeepActive);
          }
          if (this.roomTempList[j].snapshot === true || this.roomTempList[j].snapshot == 1) {
            this.roomTempList[j].snapshot = true;
            snapObj2.push(this.roomTempList[j].snapshot);
          }
          else {
            this.roomTempList[j].snapshot = false;
            snapObj2.push(this.roomTempList[j].snapshot);
          }
          if (this.roomTempList[j].CreateWO === true || this.roomTempList[j].CreateWO == 1) {
            this.roomTempList[j].CreateWO = true;
            createwoObj2.push(this.roomTempList[j].CreateWO);
          }
          else {
            this.roomTempList[j].CreateWO = false;
            createwoObj2.push(this.roomTempList[j].CreateWO);
          }
        }
        roomsString2 = roomList2.join(',');
        FRequency2 = FrequencyObj2.join(',');
        MOnCheck2 = monObj2.join(',');
        TUeCheck2 = tueObj2.join(',');
        WEdCheck2 = wedObj2.join(',');
        THuCheck2 = thuObj2.join(',');
        FRiCheck2 = friObj2.join(',');
        SAtCheck2 = satObj2.join(',');
        SUnCheck2 = sunObj2.join(',');
        BArCheck2 = barObj2.join(',');
        PHotCheck2 = photoObj2.join(',');
        Snapshot2 = snapObj2.join(',');
        KeepActive2 = keepObj2.join(',');
        WOrkordertkey2 = workorderkeyobj2.join(',');
        TEmproomidobj2 = temproomobj2.join(',');
        CreateWO2=createwoObj2.join(',');
        if(this.WorkorderNotes){
          this.WorkorderNotes=this.WorkorderNotes.trim();
        }
        this.scheduleInsert = {
          temproomidlist: TEmproomidobj2,
          roomList: roomsString2,
          frequency: FRequency2,
          monCheck: MOnCheck2,
          tueCheck: TUeCheck2,
          wedCheck: WEdCheck2,
          thuCheck: THuCheck2,
          friCheck: FRiCheck2,
          satCheck: SAtCheck2,
          sunCheck: SUnCheck2,
          barCheck: BArCheck2,
          photCheck: PHotCheck2,
          snapshot:Snapshot2,
          keepActiveCheck: KeepActive2,
          workordertype: WOrkordertkey2,
          empKey: this.employeekey,
          batchScheduleNameKey: this.BatchScheduleNameKey,
          WorkorderNotes: this.WorkorderNotes,
          OrganizationID: this.OrganizationID,
          fromdate: this.startDT,
          todate: this.endDT,
          scheduleTime: newTime,
          CreateWO:CreateWO2
        }


        this.scheduleService
          .setInsertScheduleReport(this.scheduleInsert).subscribe(res => {
            this.batchFlag = this.batchFlag + 1;
            this.reload();
          });
      }
    }

  }
  reload() {
    // executeFlag
    if (this.roomList.length > 0 && this.roomTempList.length > 0) {
      if (this.batchFlag == 2) {
        this.executeFlag = 1;
      }
    } else if (this.roomList.length > 0 && this.roomTempList.length == 0) {
      if (this.batchFlag == 1) {
        this.executeFlag = 1;
      }
    } else if (this.roomList.length == 0 && this.roomTempList.length > 0) {
      if (this.batchFlag == 1) {
        this.executeFlag = 1;
      }
    }
    if (this.executeFlag == 1) {
      this.getScheduleDetails(this.BatchScheduleNameKey);
      alert("Assignment Created Sucessfully");
      this.CreateDis = false;
    }
  }
  ngOnInit() {
    //token starts....
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;
    this.CreateDis = false;
    //token ends
    this.WorkorderTypeKey = "";
    this.allViews = { day: false, month: true, year: true };
    this.scheduleService
      .getAllSchedulingNames(this.employeekey, this.OrganizationID)
      .subscribe((data: Scheduling[]) => {
        this.scheduleNameList = data;
      });

      this.scheduleService
      .getallworkorderTypeNew(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.woList = data;
      });

    //loading the Assignment where rooms were added/deleted in the earlier page

    this.BatchScheduleNameKey = this.scheduleNameKey$;
    this.empName = null;
    this.WorkorderNotes = null;
    this.workScheduleStartDate = null;
    this.workScheduleEndDate = null;
    this.scheduleService
      .getSchedulingDetails(this.scheduleNameKey$, this.employeekey, this.OrganizationID)
      .subscribe((data: Scheduling[]) => {
        this.scheduleDetails = data;
        this.empName = this.scheduleDetails[0].EmployeeName;
        this.WorkorderNotes = this.scheduleDetails[0].WorkorderNotes;
        if (this.scheduleDetails[0].workScheduleStartDate) {
          this.workScheduleStartDate = new Date(this.scheduleDetails[0].workScheduleStartDate);
        } else {
          this.workScheduleStartDate = new Date(Date.now());
        }

        if (this.scheduleDetails[0].workScheduleEndDate) {
          this.workScheduleEndDate = new Date(this.scheduleDetails[0].workScheduleEndDate);
        } else {
          this.workScheduleEndDate = new Date(Date.now());
        }
        var cur_time = new Date(Date.now());
        var timeValue1 = this.scheduleDetails[0].BatchScheduleTime;
        var test1 = timeValue1.split(":");
        var start = new Date(cur_time.getFullYear(), cur_time.getMonth(), cur_time.getDate(), test1[0], test1[1], 0);
        this.time1 = start;
      });
    this.scheduleService
      .getRoomDetailsForSchedule(this.scheduleNameKey$, this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.roomList = data;
        for (var j = 0; j < this.roomList.length; j++) {

          for(var i=0;i<this.woList.length;i++){
            if (this.roomList[j].WorkorderTypeKey==this.woList[i].WorkorderTypeKey){
             
             if(this.woList[i].MetricType== 'Minutes Per')
             {
             this.roomList[j].Minutes=this.woList[i].MetricValue;
           }
           else{
             this.roomList[j].Minutes=(this.woList[i].MetricValue*this.roomList[j].Area);
           }
            }
           }

          if (this.roomList[j].check_mon == 'true') {
            this.roomList[j].check_mon = 1;
          } else if (this.roomList[j].check_mon == 'false') {
            this.roomList[j].check_mon = 0;
          }

          if (this.roomList[j].check_tue == 'true') {
            this.roomList[j].check_tue = 1;
          } else if (this.roomList[j].check_tue == 'false') {
            this.roomList[j].check_tue = 0;
          }

          if (this.roomList[j].check_wed == 'true') {
            this.roomList[j].check_wed = 1;
          } else if (this.roomList[j].check_wed == 'false') {
            this.roomList[j].check_wed = 0;
          }

          if (this.roomList[j].check_thu == 'true') {
            this.roomList[j].check_thu = 1;
          } else if (this.roomList[j].check_thu == 'false') {
            this.roomList[j].check_thu = 0;
          }

          if (this.roomList[j].check_fri == 'true') {
            this.roomList[j].check_fri = 1;
          } else if (this.roomList[j].check_fri == 'false') {
            this.roomList[j].check_fri = 0;
          }

          if (this.roomList[j].check_sat == 'true') {
            this.roomList[j].check_sat = 1;
          } else if (this.roomList[j].check_sat == 'false') {
            this.roomList[j].check_sat = 0;
          }

          if (this.roomList[j].check_sun == 'true') {
            this.roomList[j].check_sun = 1;
          } else if (this.roomList[j].check_sun == 'false') {
            this.roomList[j].check_sun = 0;
          }

          this.roomList[j].dailyFrequency = this.roomList[j].dailyFrequency.toString();

        }
        this.metricCal();
      });
    this.scheduleService
      .getRoomofTempTableDetailsForSchedule(this.scheduleNameKey$, this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.roomTempList = data;
        for (var j = 0; j < this.roomTempList.length; j++) {
          this.roomTempList[j].dailyFrequency = 1;
          this.roomTempList[j].CreateWO=1;
        }
        this.metricCal();
      });
    // this.scheduleService
    //   .getallworkorderType(this.employeekey, this.OrganizationID)
    //   .subscribe((data: any[]) => {
    //     this.woList = data;
    //   });

     

  }
  CalMetric(index,list){
    
   
      if(list=='roomTempList')
      {
        for(var i=0;i<this.woList.length;i++){
     if (this.roomTempList[index].WorkorderTypeKey==this.woList[i].WorkorderTypeKey){
     
      //  this.roomTempList[index].Minutes=0;
      if(this.woList[i].MetricType== 'Minutes Per')
      {
      this.roomTempList[index].Minutes=this.woList[i].MetricValue;
      // console.log("Metric value::::"+this.woList[i].MetricValue);
    }
    else{
      this.roomTempList[index].Minutes=(this.woList[i].MetricValue*this.roomTempList[index].Area);
      // console.log("Metric value::::"+this.woList[i].MetricValue);
            //  console.log("Area::::"+this.roomTempList[index].Area);
    }
     }
    }
  }
 

   if(list=='roomList')
    {
      for(var i=0;i<this.woList.length;i++){
      if (this.roomList[index].WorkorderTypeKey==this.woList[i].WorkorderTypeKey){
       
       if(this.woList[i].MetricType== 'Minutes Per')
       {
       this.roomList[index].Minutes=this.woList[i].MetricValue;
      //  console.log("Metric value::::"+this.woList[i].MetricValue);
     }
     else{
       this.roomList[index].Minutes=(this.woList[i].MetricValue*this.roomList[index].Area);
      //  console.log("Metric value::::"+this.woList[i].MetricValue);
              // console.log("Area::::"+this.roomList[index].Area);
     }
      }
    }
    }
  }
}
