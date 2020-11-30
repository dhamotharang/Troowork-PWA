import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { workorder } from '../../../../model-class/work-order';
import { WorkOrderServiceService } from '../../../../service/work-order-service.service';
import { Router } from "@angular/router";
import { DatepickerOptions } from 'ng2-datepicker';//for datepicker
@Component({
  selector: 'app-create-batch-workorder',
  templateUrl: './create-batch-workorder.component.html',
  styleUrls: ['./create-batch-workorder.component.scss']
})
export class CreateBatchWorkorderComponent implements OnInit {
  EmployeeOption: workorder[];
  workorderTypeList: workorder[];
  facilitylist: workorder[];
  FloorList: workorder[];
  zonelist: workorder[];
  RoomTypeList: workorder[];
  RoomList: workorder[];
  priorityList: workorder[];
  EquipmentList: workorder[];
  EquipmentTypeList: workorder[];
  scheduleList: workorder[];
  emp_key: number;
  org_id: number;
  marked = false;
  FacilityKey;
  FloorKey;
  ZoneKey;
  RoomTypeKey;
  RoomKey;
  EquipmentTypeKey;
  EquipmentKey;
  PriorityKey;
  EmployeeKey;
  BatchScheduleNameKey;
  timeValue: any;
  dateValue: any;
  isPhotoRequired: any;
  isBarcodeRequired: any;
  WorkorderTypeKey;
  workorderNotes;
  showEqTypes = false;
  GpsSnapShot;
  Gps_SnapShot;


  // temp-variables
  wot;
  notes;
  facilityString;
  zone;
  eqp_key;
  shift;
  priority;
  isrecurring; // for setting bit value 1 or 0
  startDT;
  endDT;
  workTime;
  dailyRecc_gap; // dailyrecurringGap
  is_PhotoRequired;
  is_BarcodeRequired;
  occurenceinstance;
  addWOT;
  intervaltype;
  repeatinterval;
  occursonday;
  weeklyrecurring;
  monthlyrecurring
  dailyrecurring;

  workorderCreation;
  isRecurring = false;
  monthlyreccradio1;
  monthlyreccradio2;
  newType = false;
  //recurr variables
  monthlyDays = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];//for selecting day of a month in recurring option(on gap of dropdown)
  recurringFrequency = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];//for selecting a month in recurring option
  weekDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];//monthly recurring- for selecting day of week
  weekPosition = [{ id: 'First', value: '1' }, { id: 'Second', value: '2' }, { id: 'Third', value: '3' }, { id: 'Fourth', value: '4' }, { id: 'Fifth', value: '5' }, { id: 'Last', value: '-1' }];//for seleting week position in monthly recurring 
  timetable = { times: [] };//for daily recurring timepicker
  dailyFrequency;
  WorkorderStartDate;
  WorkorderEndDate;
  occurenceat;
  DailyrecurringGap;
  rep_interval = 1;
  occurs_on = null;
  weektable_one;
  weektable_two;
  weektable_three;
  weektable_four;
  weektable_five;
  weektable_six;
  weektable_seven;
  Time_weekly;
  Time_monthly;
  day1;
  month1;
  day2;
  month2;
  occurs_type;
  pos2;
  newworkordertypetext;
  role: String;
  name: String;
  IsSupervisor: Number;
  employeekey;
  rec1;
  //converting date from GMT to yyyy/mm/dd
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
  //adding datepicker option
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

  constructor(private router: Router, private WorkOrderServiceService: WorkOrderServiceService) { }
  url_base64_decode(str) {//token decoding function
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
  ngOnInit() {
    this.weeklyrecurring = false;
    this.monthlyrecurring = false;
    this.dailyrecurring = false;
    this.monthlyreccradio1 = false;
    this.monthlyreccradio2 = false;
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.emp_key = profile.employeekey;
    this.org_id = profile.OrganizationID;
    this.WorkorderTypeKey = "";
    this.BatchScheduleNameKey = "";
    this.FacilityKey = "";
    this.FloorKey = "";
    this.ZoneKey = "";
    this.RoomTypeKey = "";
    this.RoomKey = "";
    this.PriorityKey = "";
    this.EquipmentTypeKey = "";
    this.EquipmentKey = "";
    this.DailyrecurringGap = "";
    this.dailyFrequency = "";
    this.day1 = "";
    this.day2 = "";
    this.month1 = "";
    this.month2 = "";
    this.pos2 = "";
    this.WorkOrderServiceService//for getting all building names
      .getallFacility(this.emp_key, this.org_id)
      .subscribe((data: any[]) => {
        this.facilitylist = data;
      });
    this.WorkOrderServiceService//for getting all workordertypes
      .getallworkorderType(this.emp_key, this.org_id)
      .subscribe((data: any[]) => {
        var newArray = data.slice(0); //clone the array, or you'll end up with a new "None" option added to your "values" array on every digest cycle.
        newArray.unshift({ WorkorderTypeText: "Create New", WorkorderTypeKey: "-99" });
        this.workorderTypeList = newArray;
      });
    this.WorkOrderServiceService//for getting all priority names
      .getallPriority(this.org_id)
      .subscribe((data: any[]) => {
        this.priorityList = data;
      });
    this.WorkOrderServiceService//for getting schedulenames
      .getallScheduleName(this.emp_key, this.org_id)
      .subscribe((data: any[]) => {
        this.scheduleList = data;
      });
    this.WorkOrderServiceService//for getting employeenames
      .getallEmployee(this.emp_key, this.org_id)
      .subscribe((data: any[]) => {
        this.EmployeeOption = data;
      });

  }
  //function called on checkbox value change
  toggleVisibility_Equipment(e) {
    if (e.target.checked) {
      this.marked = true;
    } else {
      this.marked = false;
    }
  }
  toggleVisibility_Barcode(e) {
    if (e.target.checked) {
      this.marked = true;
    } else {
      this.marked = false;
    }
  }
  toggleVisibility_Recur(e) {
    if (e.target.checked) {
      this.marked = true;
    } else {
      this.marked = false;
    }
  }
  toggleVisibility_Photo(e) {
    if (e.target.checked) {
      this.marked = true;
    } else {
      this.marked = false;
    }
  }
  toggleVisibility(e) {
    if (e.target.checked) {
      this.marked = true;
    } else {
      this.marked = false;
    }
  }
  //
  //function called on radiobutton change
  dailyrecurringChange() {
    this.weeklyrecurring = false;
    this.monthlyrecurring = false;
    this.dailyrecurring = true;
  }
  weeklyrecurringChange() {
    this.weeklyrecurring = true;
    this.monthlyrecurring = false;
    this.dailyrecurring = false;
  }
  monthlyrecurringChange() {
    this.weeklyrecurring = false;
    this.monthlyrecurring = true;
    this.dailyrecurring = false;
  }
  monthlyreccradio1_change() {
    this.monthlyreccradio1 = true;
    this.monthlyreccradio2 = false;
    this.pos2 = "";
    this.day2 = "";
    this.month2 = "";
  }
  monthlyreccradio2_change() {
    this.monthlyreccradio1 = false;
    this.monthlyreccradio2 = true;
    this.day1 = "";
    this.month1 = "";
  }
  getEquiment(floor_key, facility_key) {//getting equipment based on facility key,floor key
    if (floor_key && facility_key) {
      this.WorkOrderServiceService
        .getallEquipment(facility_key, floor_key, this.org_id)
        .subscribe((data: any[]) => {
          this.EquipmentTypeList = data;
          this.EquipmentList = data;
          this.EquipmentKey = "";
          this.EquipmentTypeKey = "";
        });
    }
    else {
      this.EquipmentKey = "";
      this.EquipmentTypeKey = "";
    }
  }
  getFloorDisp(facilityName) {//getting floors for selected facility
    if (facilityName) {
      this.WorkOrderServiceService
        .getallFloor(facilityName, this.org_id)
        .subscribe((data: any[]) => {
          this.FloorList = data;
          this.FloorKey = "";
          this.ZoneKey = "";
          this.RoomTypeKey = "";
          this.RoomKey = "";
          this.EquipmentTypeKey = "";
          this.EquipmentKey = "";
        });
    }
    else {
      this.FloorKey = "";
      this.ZoneKey = "";
      this.RoomTypeKey = "";
      this.RoomKey = "";
      this.EquipmentTypeKey = "";
      this.EquipmentKey = "";
    }
  }
  getZoneRoomTypeRoom(floor, facility) {//getting zone,roomtype,room based on facility key,floor key
    if (floor && facility) {
      if ((this.FloorKey) && (this.showEqTypes == true)) {
        this.ZoneKey = -1;
        this.RoomTypeKey = -1;
        this.RoomKey = -1;
      }
      else {
        this.WorkOrderServiceService//service for getting zones
          .getzone_facilityfloor(floor, facility, this.org_id)
          .subscribe((data: any[]) => {
            this.zonelist = data;
            this.ZoneKey = "";
          });
        this.WorkOrderServiceService//service for getting roomtype lists
          .getroomType_facilityfloor(floor, facility, this.org_id)
          .subscribe((data: any[]) => {
            this.RoomTypeList = data;
            this.RoomTypeKey = "";
          });
        this.WorkOrderServiceService//service for getting roomlist
          .getRoom_facilityfloor(floor, facility, this.org_id)
          .subscribe((data: any[]) => {
            this.RoomList = data;
            this.RoomKey = "";
          });
      }
    }
    else {
      this.ZoneKey = "";
      this.RoomTypeKey = "";
      this.RoomKey = "";
      this.EquipmentTypeKey = "";
      this.EquipmentKey = "";
    }
  }
  getRoomTypeRoom(zone, facility, floor) {//get roomtype,room based on zone,facility,floor
    if (zone && facility && floor) {
      this.WorkOrderServiceService//service for getting roomtype lists
        .getRoomtype_zone_facilityfloor(zone, floor, facility, this.org_id)
        .subscribe((data: any[]) => {
          this.RoomTypeList = data;
          this.RoomTypeKey = "";
        });
      this.WorkOrderServiceService//service for getting roomlist
        .getRoom_zone_facilityfloor(zone, floor, facility, this.org_id)
        .subscribe((data: any[]) => {
          this.RoomList = data;
          this.RoomKey = "";
        });
    }
    else {
      this.RoomTypeKey = "";
      this.RoomKey = "";
      this.getZoneRoomTypeRoom(this.FloorKey, this.FacilityKey);
    }
  }
  getRoom(roomtype, zone, facility, floor) {//get room based on zone,facility,floor,roomtype
    if (roomtype && zone && facility && floor) {
      this.WorkOrderServiceService//service for getting roomlist
        .getRoom_Roomtype_zone_facilityfloor(roomtype, zone, floor, facility, this.org_id)
        .subscribe((data: any[]) => {
          this.RoomList = data;
          this.RoomKey = "";
        });
    }
    else {
      this.RoomKey = "";
    }
  }
  showEquipment_typechange(equip_type, facility, floor) {//for getting equipment names
    if (equip_type && facility && floor) {
      this.WorkOrderServiceService
        .getEquipment_typechange(equip_type, facility, floor, this.org_id)
        .subscribe((data: any[]) => {
          this.EquipmentList = data;
          this.EquipmentKey = "";
        });
    }
    else {
      this.EquipmentKey = "";
    }
  }
  getEmployee(schedulename) {//for getting employee for selected schedulename
    if (schedulename) {
      this.WorkOrderServiceService
        .getEmployee_scheduleNamae(schedulename, this.org_id)
        .subscribe((data: any[]) => {
          this.EmployeeKey = data[0].EmployeeKey;
        });
    }
    else {
      this.EmployeeKey = "  ";
    }
  }
  //function for creating workorder
  createWorkOrder() {
    if (this.showEqTypes === false) {
      this.createWorkorder1();//function for creating workorder without equipment
      console.log('Equipment***Not');

    } else {
      this.createWorkorder2();//function for creating workorder with equipment

    }
  }
  createWorkorder1() {

    if (!(this.BatchScheduleNameKey)) {
      alert("Please select schedule name!");
    }
    else if (!this.WorkorderTypeKey) {
      alert("Please select work-order type!");
    }
    else if (this.newType == true && !(this.newworkordertypetext)) {
      alert("Please enter work-order type!");
    } else if (this.newType == true && !(this.newworkordertypetext.trim())) {
      alert("Please enter work-order type!");
    }
    else if (!this.FacilityKey) {
      alert("Please select building!");
    }
    else if (!this.FloorKey) {
      alert("Please select floor!");
    }
    else if (!(this.WorkorderStartDate)) {
      alert("Please provide work-order start date!");
    }
    else if (!(this.WorkorderEndDate)) {
      alert("Please provide work-order end date!");
    } else if ((this.WorkorderEndDate) && (this.convert_DT(this.WorkorderStartDate) > this.convert_DT(this.WorkorderEndDate))) {
      alert("Please check your end date!");

    }
    else if (this.dailyrecurring == false && this.weeklyrecurring == false && this.monthlyrecurring == false) {
      alert("Please provide recurring Period!");
    }
    else if (this.dailyrecurring == true) {
      if (this.convert_DT(this.WorkorderStartDate) < this.convert_DT(new Date())) {
        alert("Start date is less than current date");
      }
      else if (!(this.dailyFrequency)) {
        alert("Please select frequency !");
      } else if (this.dailyFrequency) {
        for (var i = 0; i < this.dailyFrequency; i++) {
          if (!(this.timetable.times[i])) {
            alert("Please enter time values !");
          }
        }
        this.withoutequip_wo();
      }
    }
    else if (this.weeklyrecurring == true) {
      if (!(this.weektable_one) && !(this.weektable_two) && !(this.weektable_three) && !(this.weektable_four) && !(this.weektable_five) && !(this.weektable_six) && !(this.weektable_seven)) {
        alert("Please select atleast one day!");
      }
      else if (!this.Time_weekly) {
        alert("Please provide time!");
      }
      if (this.convert_DT(this.WorkorderStartDate) < this.convert_DT(new Date())) {
        alert("Start date is less than current date");
      }
      else {
        this.withoutequip_wo();
      }
    }
    else if (this.monthlyrecurring == true) {
      if (this.convert_DT(this.WorkorderStartDate) < this.convert_DT(new Date())) {
        alert("Start date is less than current date");
      }
      else if (this.monthlyreccradio1 == false && this.monthlyreccradio2 == false) {
        alert("Select a radio option from monthly reccuring !");
        return;
      }
      if (this.monthlyreccradio1 == true) {
        if (!(this.day1) || !(this.month1)) {
          alert("Provide entries for monthly recurring !");
          return;
        }

      }
      if (this.monthlyreccradio2 == true) {
        if (!(this.day2) || !(this.pos2) || !(this.month2)) {
          alert("Provide entries for monthly recurring !");
          return;
        }

      }
      if (!this.Time_monthly) {
        alert("Please provide time!");
      }
      else {
        this.withoutequip_wo();
      }
    }
  }
  //function for creating workorder without equipment
  withoutequip_wo() {
    var roomlistObj = [];
    var roomtypelistObj = [];
    var zonelistObj = [];
    var floorlistObj = [];
    var facilitylistObj = [];
    var facilityList = [];
    var roomList = [];
    var roomtypeList = [];
    var zoneList = [];
    var floorList = [];
    facilitylistObj = this.facilitylist;
    floorlistObj = this.FloorList;
    zonelistObj = this.zonelist;
    roomtypelistObj = this.RoomTypeList;
    roomlistObj = this.RoomList;
    this.intervaltype = '0'; // char(1),/*d for day, w for week, m for month*/
    this.repeatinterval = 1; // int,/*daily(every `2` days) weekly(every `1` week) monthly(every `3` months)*/
    this.occurenceinstance = null; // int,/*daily(3) weekly(null) monthly(null) monthly(1)*/
    this.occursonday = null;
    if (this.WorkorderTypeKey) {
      this.wot = this.WorkorderTypeKey;
    } else {
      this.wot = null;
    }
    if (this.workorderNotes) {
      this.notes = this.workorderNotes.trim();
    } else {
      this.notes = null;
    }
    if (this.FacilityKey) {

    }
    if (this.FloorKey) {
    }
    var roomsString;
    if (this.RoomKey) {
      roomsString = this.RoomKey;
    } else {
      // if (roomlistObj) {
      //   for (var j = 0; j < roomlistObj.length; j++) {
      //     roomList.push(roomlistObj[j].RoomKey);
      //   }
      //   roomsString = roomList.join(',');
      // } else {
      //   return;
      // }
      if (roomlistObj) {
        if (roomlistObj.length <= 100) {
          for (var j = 0; j < roomlistObj.length; j++) {
            roomList.push(roomlistObj[j].RoomKey);
          }
          roomsString = roomList.join(',');

        }
        else {
          alert("Limit for the maximum Batch workorders have reached. Maximum 100");
          return;
        }

      } else {
        return;
      }
    }
    var facilityString;
    if (this.FacilityKey) {
      facilityString = this.FacilityKey;
    } else {
      if (facilitylistObj) {
        for (var j = 0; j < facilitylistObj.length; j++) {
          facilityList.push(facilitylistObj[j].FacilityKey);
        }
        facilityString = facilityList.join(',');
      }
    }
    var floorString;
    if (this.FloorKey) {
      floorString = this.FloorKey;
    } else {
      if (floorlistObj) {
        for (var j = 0; j < floorlistObj.length; j++) {
          floorList.push(floorlistObj[j].FloorKey);
        }
        floorString = floorList.join(',');
      }
    }
    var zoneString;
    if (this.ZoneKey) {
      zoneString = this.ZoneKey;
    } else {
      this.zone = null;
      if (zonelistObj) {
        for (var j = 0; j < zonelistObj.length; j++) {
          zoneList.push(zonelistObj[j].ZoneKey);
        }
        zoneString = zoneList.join(',');
      }
    }
    var roomtypeString;
    if (this.RoomTypeKey) {
      roomtypeString = this.RoomTypeKey;
    } else {
      if (roomtypelistObj) {
        for (var j = 0; j < roomtypelistObj.length; j++) {
          roomtypeList.push(roomtypelistObj[j].RoomTypeKey);
        }
        roomtypeString = roomtypeList.join(',');
      }
    }
    if (this.EquipmentKey) {
      this.eqp_key = this.EquipmentKey;
    } else {
      this.eqp_key = - 1;
    }
    if (this.EmployeeKey) {
      this.employeekey = this.EmployeeKey;
    } else {
      this.employeekey = - 1;
    }
    if (this.ZoneKey) {
      this.zone = this.ZoneKey;
    } else {
      this.zone = null;

    }
    if (this.PriorityKey) {
      this.priority = this.PriorityKey;
    } else {
      this.priority = - 1;
    }
    if (this.isPhotoRequired) {
      this.is_PhotoRequired = 1;
    } else {
      this.is_PhotoRequired = 0;
    }
    if (this.isBarcodeRequired) {
      this.is_BarcodeRequired = 1;
    } else {
      this.is_BarcodeRequired = 0;
    }
    if (this.dailyrecurring == true) {
      this.intervaltype = 'd';
      this.isrecurring = 1;
    } else if (this.weeklyrecurring == true) {
      this.intervaltype = 'w';
      this.isrecurring = 1;
      var selectedWeekdays = [];
      if (this.weektable_one === true)
        selectedWeekdays.push('su');
      if (this.weektable_two === true)
        selectedWeekdays.push('mo');
      if (this.weektable_three === true)
        selectedWeekdays.push('tu');
      if (this.weektable_four === true)
        selectedWeekdays.push('we');
      if (this.weektable_five === true)
        selectedWeekdays.push('th');
      if (this.weektable_six === true)
        selectedWeekdays.push('fr');
      if (this.weektable_seven === true)
        selectedWeekdays.push('sa');
      this.occurs_on = selectedWeekdays.join(',');
    } else if (this.monthlyrecurring == true) {
      this.intervaltype = 'm';
      this.isrecurring = 1;
    }
    if (this.WorkorderStartDate) {
      this.startDT = this.convert_DT(this.WorkorderStartDate);
    } else {
      this.startDT = this.convert_DT(new Date());
    }
    if (this.WorkorderEndDate) {
      this.endDT = this.convert_DT(this.WorkorderEndDate);
    } else {
      this.endDT = this.convert_DT(new Date());
    }

    var timeDiff = Math.abs(this.WorkorderEndDate.getTime() - this.WorkorderStartDate.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (this.intervaltype == 'w' && diffDays < 7) {
      alert("Please Select One week Date Range!");
      return;
    }
    if (this.intervaltype == 'm' && diffDays < 31) {
      alert("Please Select One month Date Range!");
      return;
    }
    if (this.dailyrecurring == true) {
      var timeset = [];
      var timeset_corr = [];
      timeset = this.timetable.times;
      for (var i = 0; i < timeset.length; i++) {
        timeset_corr.push(timeset[i].getHours() + ':' + timeset[i].getMinutes());
      }

      this.workTime = timeset_corr.join(',');
      if (!(this.DailyrecurringGap)) {
        this.rep_interval = 1;
      }
      else {
        this.rep_interval = this.DailyrecurringGap;
      }
    }
    else if (this.weeklyrecurring == true) {
      if (this.Time_weekly) {
        this.workTime = this.Time_weekly.getHours() + ':' + this.Time_weekly.getMinutes();
      }
      else {
        alert("Please Enter Time!");
      }
    } else if (this.monthlyrecurring == true) {
      if (this.Time_monthly) {
        this.workTime = this.Time_monthly.getHours() + ':' + this.Time_monthly.getMinutes();
      }
      else {
        alert("Please Enter Time!");
      }
      if (this.monthlyreccradio1 == true) {
        this.occurs_on = this.day1;
        this.rep_interval = (this.month1) ? this.month1 : 1;
      }
      else if (this.monthlyreccradio2 == true) {

        this.occurs_on = this.day2;
        this.rep_interval = (this.month2) ? this.month2 : 1;
        this.occurs_type = this.pos2;
        switch (this.occurs_on) {
          case '0':
            this.occurs_on = 'su';
            break;
          case '1':
            this.occurs_on = "mo";
            break;
          case '2':
            this.occurs_on = "tu";
            break;
          case '3':
            this.occurs_on = "we";
            break;
          case '4':
            this.occurs_on = "th";
            break;
          case '5':
            this.occurs_on = "fr";
            break;
          case '6':
            this.occurs_on = "sa";
            break;
        }
      }
    }
    if (this.GpsSnapShot == true) {
      this.Gps_SnapShot = 1;
    }
    else {
      this.Gps_SnapShot = 0;
    }
    if (this.newType == true) {//checking for new workorder type
      if (this.newworkordertypetext) {
        this.WorkOrderServiceService
          .checkforcheckForWorkOrderType(this.newworkordertypetext, this.emp_key, this.org_id)//check if the workordertype is already existing
          .subscribe((data: any[]) => {
            if (data[0].count == 0) {//if the service returns count=0 means no such workordertype existing
              this.addWOT = {
                WorkorderType: this.newworkordertypetext,
                employeekey: this.emp_key,
                OrganizationID: this.org_id
              };
              this.WorkOrderServiceService//service for adding new workordertype
                .AddnewWOT(this.addWOT)
                .subscribe((data: any[]) => {
                  this.wot = data[0].WorkOrderTypeKey;
                  this.workorderCreation = {
                    scheduleKey: this.BatchScheduleNameKey,
                    occursontime: this.workTime,
                    workorderkey: - 99,
                    workordertypekey: this.wot,
                    workordernote: this.notes,
                    equipmentkey: this.eqp_key,
                    roomkeys: roomsString,
                    facilitykeys: facilityString,
                    floorkeys: floorString,
                    zonekeys: zoneString,
                    roomtypekeys: roomtypeString,
                    employeekey: this.employeekey,
                    priority: this.priority,
                    fromdate: this.startDT,
                    todate: this.endDT,
                    isbar: this.is_BarcodeRequired,
                    isphoto: this.is_PhotoRequired,
                    metaupdatedby: this.emp_key,
                    OrganizationID: this.org_id,
                    intervaltype: this.intervaltype, // char(1),/*d for day, w for week, m for month*/
                    repeatinterval: this.rep_interval,
                    occursonday: this.occurs_on,
                    occurstype: this.occurs_type,
                    IsSnapshot: this.Gps_SnapShot
                  };
                  this.WorkOrderServiceService.addworkorderSchedule(this.workorderCreation).subscribe(res => {
                    alert("Batch work-order created successfully");
                    if (this.role == 'Manager') {
                      this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewBatchWorkorder'] } }]);
                    }
                    // else if (this.role == 'Employee' && this.IsSupervisor == 1) {
                    else if (this.role == 'Supervisor') {
                      this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['ViewBatchWorkorder'] } }]);
                    }
                  });
                });
            }
          });
      }

    }
    else {//creating workorder for already existing workordertype
      this.workorderCreation = {
        scheduleKey: this.BatchScheduleNameKey,
        occursontime: this.workTime,
        workorderkey: - 99,
        workordertypekey: this.wot,
        workordernote: this.notes,
        equipmentkey: this.eqp_key,
        roomkeys: roomsString,
        facilitykeys: facilityString,
        floorkeys: floorString,
        zonekeys: zoneString,
        roomtypekeys: roomtypeString,
        employeekey: this.employeekey,
        priority: this.priority,
        fromdate: this.startDT,
        todate: this.endDT,
        isbar: this.is_BarcodeRequired,
        isphoto: this.is_PhotoRequired,
        metaupdatedby: this.emp_key,
        OrganizationID: this.org_id,
        intervaltype: this.intervaltype, // char(1),/*d for day, w for week, m for month*/
        repeatinterval: this.rep_interval,
        occursonday: this.occurs_on,
        occurstype: this.occurs_type,
        IsSnapshot: this.Gps_SnapShot
      };
      this.WorkOrderServiceService.addworkorderSchedule(this.workorderCreation).subscribe(res => {
        alert("Batch work-order created successfully");
        if (this.role == 'Manager') {
          this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewBatchWorkorder'] } }]);
        }
        // else if (this.role == 'Employee' && this.IsSupervisor == 1) {
        else if (this.role == 'Supervisor') {
          this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['ViewBatchWorkorder'] } }]);
        }
      });
    }
  }
  createWorkorder2() {
    if (!(this.BatchScheduleNameKey)) {
      alert("Please select schedule name!");
    }
    else if (!this.WorkorderTypeKey) {
      alert("Please select work-order type!");
    }
    else if (this.newType == true && !(this.newworkordertypetext)) {
      alert("Please enter work-order type!");
    } else if (this.newType == true && !(this.newworkordertypetext.trim())) {
      alert("Please enter work-order type!");
    }
    else if (!this.FacilityKey) {
      alert("Please select building!");
    }
    else if (!this.FloorKey) {
      alert("Please select floor!");
    }
    else if (!(this.WorkorderStartDate)) {
      alert("Please provide work-order start date!");
    }
    else if (!(this.WorkorderEndDate)) {
      alert("Please provide work-order end date!")
    }
    else if ((this.WorkorderStartDate) && this.convert_DT(this.WorkorderStartDate) < this.convert_DT(new Date())) {
      alert("Start date is less than current date");
    }
    else if ((this.WorkorderEndDate) && (this.convert_DT(this.WorkorderStartDate) > this.convert_DT(this.WorkorderEndDate))) {
      alert("Please check your end date!");

    }
    else if (this.showEqTypes == true && !(this.EquipmentTypeKey)) {
      alert("Please select equipment type!");
    }
    else if (this.dailyrecurring == false && this.weeklyrecurring == false && this.monthlyrecurring == false) {
      alert("Recurring Period is not provided !");
    }
    else if (this.dailyrecurring == true) {
      if (this.convert_DT(this.WorkorderStartDate) < this.convert_DT(new Date())) {
        alert("Start date is less than current date");
      }
      else if (!(this.dailyFrequency)) {
        alert("Please select frequency !");
      } else if (this.dailyFrequency) {
        for (var i = 0; i < this.dailyFrequency; i++) {
          if (!(this.timetable.times[i])) {
            alert("Please enter time values !");
          }
        }
        this.withequip_wo();
      }
    }
    else if (this.weeklyrecurring == true) {
      if (!(this.weektable_one) && !(this.weektable_two) && !(this.weektable_three) && !(this.weektable_four) && !(this.weektable_five) && !(this.weektable_six) && !(this.weektable_seven)) {
        alert("Please select atleast one day!");
      }
      else if (!this.Time_weekly) {
        alert("Please provide time!");
      }
      else if (this.convert_DT(this.WorkorderStartDate) < this.convert_DT(new Date())) {
        alert("Start date is less than current date");
      }
      else {
        this.withequip_wo();
      }
    }
    else if (this.monthlyrecurring == true) {
      if (this.convert_DT(this.WorkorderStartDate) < this.convert_DT(new Date())) {
        alert("Start date is less than current date");
        return;
      }

      if (this.monthlyreccradio1 == false && this.monthlyreccradio2 == false) {
        alert("Select a radio option from monthly reccuring !");
        return;
      }
      if (this.monthlyreccradio1 == true) {
        if (!(this.day1) || !(this.month1)) {
          alert("Provide entries for monthly recurring !");
          return;
        }

      }
      if (this.monthlyreccradio2 == true) {
        if (!(this.day2) || !(this.pos2) || !(this.month2)) {
          alert("Provide entries for monthly recurring !");
          return;
        }

      }
      if (!this.Time_monthly) {
        alert("Please provide time!");
      }
      else {
        this.withequip_wo();
      }
    }
  }
  //function for creating workorder withequip
  withequip_wo() {
    var roomlistObj = [];
    var roomtypelistObj = [];
    var zonelistObj = [];
    var floorlistObj = [];
    var facilitylistObj = [];
    var EquListObj = [];
    var facilityList = [];
    var roomList = [];
    var roomtypeList = [];
    var zoneList = [];
    var floorList = [];
    var equList = [];
    facilitylistObj = this.facilitylist;
    floorlistObj = this.FloorList;
    zonelistObj = this.zonelist;
    roomtypelistObj = this.RoomTypeList;
    roomlistObj = this.RoomList;
    EquListObj = this.EquipmentList;

    this.intervaltype = '0'; // char(1),/*d for day, w for week, m for month*/
    this.repeatinterval = 1; // int,/*daily(every `2` days) weekly(every `1` week) monthly(every `3` months)*/
    this.occurenceinstance = null; // int,/*daily(3) weekly(null) monthly(null) monthly(1)*/
    this.occursonday = null;

    if (this.WorkorderTypeKey) {
      this.wot = this.WorkorderTypeKey;
    } else {
      this.wot = null;

    }
    if (this.workorderNotes) {
      this.notes = this.workorderNotes.trim();
    } else {
      this.notes = null;
    }
    if (this.FacilityKey) {

    }
    if (this.FloorKey) {

    }
    var roomsString;
    roomsString = -1;
    var facilityString;
    if (this.FacilityKey) {
      facilityString = this.FacilityKey;
    } else {
      if (facilitylistObj) {
        for (var j = 0; j < facilitylistObj.length; j++) {
          facilityList.push(facilitylistObj[j].FacilityKey);
        }
        facilityString = facilityList.join(',');
      }
    }
    var floorString;
    if (this.FloorKey) {
      floorString = this.FloorKey;
    } else {
      if (floorlistObj) {
        for (var j = 0; j < floorlistObj.length; j++) {
          floorList.push(floorlistObj[j].FloorKey);
        }
        floorString = floorList.join(',');
      }
    }
    var zoneString;
    if (this.ZoneKey) {
      zoneString = this.ZoneKey;
    } else {
      this.zone = null;
      if (zonelistObj) {
        for (var j = 0; j < zonelistObj.length; j++) {
          zoneList.push(zonelistObj[j].ZoneKey);
        }
        zoneString = zoneList.join(',');
      }
    }
    var roomtypeString;
    if (this.RoomTypeKey) {
      roomtypeString = this.RoomTypeKey;
    } else {
      if (roomtypelistObj) {
        for (var j = 0; j < roomtypelistObj.length; j++) {
          roomtypeList.push(roomtypelistObj[j].RoomTypeKey);
        }
        roomtypeString = roomtypeList.join(',');
      }
    }
    if (this.EquipmentKey) {
      this.eqp_key = this.EquipmentKey;
    } else {
      this.eqp_key = - 1;
    }
    if (this.EquipmentKey) {
      this.eqp_key = this.EquipmentKey;
    } else {
      // if (EquListObj) {
      //   for (var j = 0; j < EquListObj.length; j++) {
      //     equList.push(EquListObj[j].EquipmentKey);
      //   }
      //   this.eqp_key = equList.join(',');
      // }
      if (EquListObj) {
        if (EquListObj.length <= 100) {
          for (var j = 0; j < EquListObj.length; j++) {
            equList.push(EquListObj[j].EquipmentKey);
          }
          this.eqp_key = equList.join(',');

        }
        else{
          alert("Limit for the maximum batch workorders have reached. Maximum 100");
          return;
        }

      } else {
        return;
      }
    }
    if (this.EmployeeKey) {
      this.employeekey = this.EmployeeKey;
    } else {
      this.employeekey = - 1;
    }
    if (this.ZoneKey) {
      this.zone = this.ZoneKey;
    } else {
      this.zone = null;

    }
    if (this.PriorityKey) {
      this.priority = this.PriorityKey;
    } else {
      this.priority = - 1;
    }
    if (this.isPhotoRequired) {
      this.is_PhotoRequired = 1;
    } else {
      this.is_PhotoRequired = 0;
    }
    if (this.isBarcodeRequired) {
      this.is_BarcodeRequired = 1;
    } else {
      this.is_BarcodeRequired = 0;
    }

    if (this.dailyrecurring == true) {
      this.intervaltype = 'd';
      this.isrecurring = 1;
    } else if (this.weeklyrecurring == true) {
      this.intervaltype = 'w';
      this.isrecurring = 1;
      var selectedWeekdays = [];
      if (this.weektable_one === true)
        selectedWeekdays.push('su');
      if (this.weektable_two === true)
        selectedWeekdays.push('mo');
      if (this.weektable_three === true)
        selectedWeekdays.push('tu');
      if (this.weektable_four === true)
        selectedWeekdays.push('we');
      if (this.weektable_five === true)
        selectedWeekdays.push('th');
      if (this.weektable_six === true)
        selectedWeekdays.push('fr');
      if (this.weektable_seven === true)
        selectedWeekdays.push('sa');
      this.occurs_on = selectedWeekdays.join(',');
    }
    else if (this.monthlyrecurring == true) {
      this.intervaltype = 'm';
      this.isrecurring = 1;
    }
    if (this.WorkorderStartDate) {
      this.startDT = this.convert_DT(this.WorkorderStartDate);
    } else {
      this.startDT = this.convert_DT(new Date());
    }
    if (this.WorkorderEndDate) {
      this.endDT = this.convert_DT(this.WorkorderEndDate);
    } else {
      this.endDT = this.convert_DT(new Date());
    }
    var timeDiff = Math.abs(this.WorkorderEndDate.getTime() - this.WorkorderStartDate.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (this.intervaltype == 'w' && diffDays < 7) {
      alert("Please Select One week Date Range!");
      return;
    }
    if (this.intervaltype == 'm' && diffDays < 31) {
      alert("Please Select One month Date Range!");
      return;
    }
    if (this.dailyrecurring == true) {
      var timeset = [];
      var timeset_corr = [];
      timeset = this.timetable.times;
      for (var i = 0; i < timeset.length; i++) {
        timeset_corr.push(timeset[i].getHours() + ':' + timeset[i].getMinutes());
      }

      this.workTime = timeset_corr.join(',');
      if (!(this.DailyrecurringGap)) {
        this.rep_interval = 1;
      }
      else {
        this.rep_interval = this.DailyrecurringGap;
      }
    } else if (this.weeklyrecurring == true) {
      this.workTime = this.Time_weekly.getHours() + ':' + this.Time_weekly.getMinutes();
    } else if (this.monthlyrecurring == true) {
      this.workTime = this.Time_monthly.getHours() + ':' + this.Time_monthly.getMinutes();
      if (this.monthlyreccradio1 == true) {
        this.occurs_on = this.day1;
        this.rep_interval = (this.month1) ? this.month1 : 1;
      }
      else if (this.monthlyreccradio2 == true) {
        this.occurs_on = this.day2;
        this.rep_interval = (this.month2) ? this.month2 : 1;
        this.occurs_type = this.pos2;
        switch (this.occurs_on) {
          case '0':
            this.occurs_on = 'su';
            break;
          case '1':
            this.occurs_on = "mo";
            break;
          case '2':
            this.occurs_on = "tu";
            break;
          case '3':
            this.occurs_on = "we";
            break;
          case '4':
            this.occurs_on = "th";
            break;
          case '5':
            this.occurs_on = "fr";
            break;
          case '6':
            this.occurs_on = "sa";
            break;
        }
      }
    }
    if (this.GpsSnapShot == true) {
      this.Gps_SnapShot = 1;
    }
    else {
      this.Gps_SnapShot = 0;
    }
    if (this.newType == true) {
      if (this.newworkordertypetext) {
        this.WorkOrderServiceService
          .checkforcheckForWorkOrderType(this.newworkordertypetext, this.emp_key, this.org_id)
          .subscribe((data: any[]) => {
            if (data[0].count == 0) {
              this.addWOT = {
                WorkorderType: this.newworkordertypetext,
                employeekey: this.emp_key,
                OrganizationID: this.org_id
              };
              this.WorkOrderServiceService
                .AddnewWOT(this.addWOT)
                .subscribe((data: any[]) => {
                  this.wot = data[0].WorkOrderTypeKey;
                  this.workorderCreation = {
                    scheduleKey: this.BatchScheduleNameKey,
                    occursontime: this.workTime,
                    workorderkey: - 99,
                    workordertypekey: this.wot,
                    workordernote: this.notes,
                    equipmentkey: this.eqp_key,
                    roomkeys: roomsString,
                    facilitykeys: facilityString,
                    floorkeys: floorString,
                    zonekeys: zoneString,
                    roomtypekeys: roomtypeString,
                    employeekey: this.employeekey,
                    priority: this.priority,
                    fromdate: this.startDT,
                    todate: this.endDT,
                    isbar: this.is_BarcodeRequired,
                    isphoto: this.is_PhotoRequired,
                    metaupdatedby: this.emp_key,
                    OrganizationID: this.org_id,
                    intervaltype: this.intervaltype, // char(1),/*d for day, w for week, m for month*/
                    repeatinterval: this.rep_interval,
                    occursonday: this.occurs_on,
                    occurstype: this.occurs_type,
                    IsSnapshot: this.Gps_SnapShot
                  };
                  this.WorkOrderServiceService.addworkorderSchedulewithEquipment(this.workorderCreation).subscribe(res => {
                    alert("Batch work-order created successfully");
                    if (this.role == 'Manager') {
                      this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewBatchWorkorder'] } }]);
                    }
                    // else if (this.role == 'Employee' && this.IsSupervisor == 1) {
                    else if (this.role == 'Supervisor') {
                      this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['ViewBatchWorkorder'] } }]);
                    }
                  });
                });
            }
          });
      }

    }
    else {
      this.workorderCreation = {
        scheduleKey: this.BatchScheduleNameKey,
        occursontime: this.workTime,
        workorderkey: - 99,
        workordertypekey: this.wot,
        workordernote: this.notes,
        equipmentkey: this.eqp_key,
        roomkeys: roomsString,
        facilitykeys: facilityString,
        floorkeys: floorString,
        zonekeys: zoneString,
        roomtypekeys: roomtypeString,
        employeekey: this.employeekey,
        priority: this.priority,
        fromdate: this.startDT,
        todate: this.endDT,
        isbar: this.is_BarcodeRequired,
        isphoto: this.is_PhotoRequired,
        metaupdatedby: this.emp_key,
        OrganizationID: this.org_id,
        intervaltype: this.intervaltype, // char(1),/*d for day, w for week, m for month*/
        repeatinterval: this.rep_interval,
        occursonday: this.occurs_on,
        occurstype: this.occurs_type,
        IsSnapshot: this.Gps_SnapShot
      };
      this.WorkOrderServiceService.addworkorderSchedulewithEquipment(this.workorderCreation).subscribe(res => {
        alert("Batch work-order created successfully");
        if (this.role == 'Manager') {
          this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewBatchWorkorder'] } }]);
        }
        // else if (this.role == 'Employee' && this.IsSupervisor == 1) {
        else if (this.role == 'Supervisor') {
          this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['ViewBatchWorkorder'] } }]);
        }
      });
    }

  }
  addFormField() {

    this.timetable.times = [];
    for (var i = 0; i < this.dailyFrequency; i++) {
      this.timetable.times.push('');
    }
  }
  change_values() {
    if ((this.FloorKey) && (this.showEqTypes == true)) {
      this.ZoneKey = -1;
      this.RoomTypeKey = -1;
      this.RoomKey = -1;
    }
    else {
      this.ZoneKey = "";
      this.RoomTypeKey = "";
      this.RoomKey = "";
      this.EquipmentTypeKey = "";
      this.EquipmentKey = "";
    }
  }
  checkfornewWOT(wot_key) {

    if (wot_key == '-99') {

      this.newType = true;
    }
  }
  GobacktoMenu() {
    this.newType = false;
    this.WorkorderTypeKey = "";
    this.newworkordertypetext = null;
  }
}
