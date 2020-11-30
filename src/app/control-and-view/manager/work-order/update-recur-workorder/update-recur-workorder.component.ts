import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { workorder } from '../../../../model-class/work-order';
import { WorkOrderServiceService } from '../../../../service/work-order-service.service';
import { ActivatedRoute, Router } from "@angular/router";
import { DatepickerOptions } from 'ng2-datepicker';//for datepicker
@Component({
  selector: 'app-update-recur-workorder',
  templateUrl: './update-recur-workorder.component.html',
  styleUrls: ['./update-recur-workorder.component.scss']
})
export class UpdateRecurWorkorderComponent implements OnInit {
  WO_Key: object;
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
  floorvalue;
  WOEditList;
  isPhotoRequired: any;
  isBarcodeRequired: any;
  marked = false;
  dateValue: Date;
  showEqTypes = false;
  WorkorderNotes;
  workordertypekey;
  FacilityKey;
  FloorKey;
  ZoneKey;
  RoomTypeKey;
  RoomKey;
  PriorityKey;
  EquipmentTypeKey;
  EquipmentKey;
  EmployeeKey;
  timeValue;
  deleteWO;
  date1;
  wot;
  notes;
  facilityString;
  zone;
  eqp_key;
  shift;
  priority;
  isRecurring;
  isrecurring; // for setting bit value 1 or 0
  startDT;
  endDT;
  workTime;
  dailyRecc_gap; // dailyreccuringGap
  is_PhotoRequired;
  is_BarcodeRequired;
  occurenceinstance;
  Times;
  RoomNameList;
  intervaltype;
  repeatinterval;
  occursonday;
  keepActive;
  keep_active;
  GpsSnapShot;
  Gps_SnapShot;
  workorderCreation;
  timetable = { times: [] };
  monthlyDays = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];//for selecting day of a month in recurring option(on gap of dropdown)
  recurringFrequency = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];//for selecting a month in recurring option
  weekDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];//monthly recurring- for selecting day of week
  weekPosition = [{ id: 'First', value: '1' }, { id: 'Second', value: '2' }, { id: 'Third', value: '3' }, { id: 'Fourth', value: '4' }, { id: 'Fifth', value: '5' }, { id: 'Last', value: '-1' }];//for seleting week position in monthly recurring 
  dailyrecurring;
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
  weeklyrecurring;
  monthlyrecurring;
  monthlyreccradio1;
  monthlyreccradio2;
  emp_key;

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  //token decoding function
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

  constructor(private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private WorkOrderServiceService: WorkOrderServiceService) {
    this.route.params.subscribe(params => this.WO_Key = params.WorkorderKey);
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
    addStyle: {'font-size':'18px','width':'100%', 'border': '1px solid #ced4da','border-radius': '0.25rem'}, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };
    //converting date from GMT to yyyy/mm/dd
  convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(- 2),
      day = ("0" + date.getDate()).slice(- 2);
    return [date.getFullYear(), mnth, day].join("-");
  };
  //function for converting time to AM/PM format
  tConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1);  // Remove full string match value
      time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }
  ngOnInit() {
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;

    this.OrganizationID = profile.OrganizationID;
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
    this.WorkOrderServiceService//getting workorder edit details
      .getWO_edit(this.WO_Key, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.WOEditList = data[0];
        if(this.WOEditList.KeepActive==1){
          this.keepActive=true;
        }
        else{
          this.keepActive=false;
        }
        if(this.WOEditList.IsSnapshot==1){
          this.GpsSnapShot=true;
        }
        else{
          this.GpsSnapShot=false;
        }
        this.Times = this.tConvert(this.WOEditList.WorkorderTimes);
        this.WorkOrderServiceService//for getting all building names
          .getallFloor(this.WOEditList.FacilityKey, this.OrganizationID)
          .subscribe((data: any[]) => {
            this.FloorList = data;
          });
        this.WorkOrderServiceService//service for getting zones
          .getzone_facilityfloor(this.WOEditList.FloorKey, this.WOEditList.FacilityKey, this.OrganizationID)
          .subscribe((data: any[]) => {
            this.zonelist = data;
          });
        this.WorkOrderServiceService//service for getting roomtype lists
          .getroomType_facilityfloor(this.WOEditList.FloorKey, this.WOEditList.FacilityKey, this.OrganizationID)
          .subscribe((data: any[]) => {
            this.RoomTypeList = data;
          });
        this.WorkOrderServiceService//service for getting roomlist
          .getRoom_facilityfloor(this.WOEditList.FloorKey, this.WOEditList.FacilityKey, this.OrganizationID)
          .subscribe((data: any[]) => {
            this.RoomList = data;
          });

        if (this.WOEditList.EquipmentKey == -1) {
          this.showEqTypes = false;
          this.FloorKey = this.WOEditList.FloorKey;
          this.RoomTypeKey = this.WOEditList.RoomTypeKey;
          this.ZoneKey = this.WOEditList.ZoneKey;
          this.RoomKey = this.WOEditList.RoomKey;
          this.RoomNameList = this.WOEditList.RoomText;
        }
        else {
          this.showEqTypes = true;
          this.RoomTypeKey = "";

          this.WorkOrderServiceService
            .getFloor(this.WO_Key, this.OrganizationID)
            .subscribe((data: any[]) => {

              this.floorvalue = parseInt(data[0].FloorKeyList);
              this.FloorKey = this.floorvalue;
              this.WorkOrderServiceService//service for getting all equipment type list
                .getallEquipment(this.WOEditList.FacilityKey, this.floorvalue, this.OrganizationID)
                .subscribe((data: any[]) => {
                  this.EquipmentTypeList = data;
                  this.EquipmentTypeKey = this.WOEditList.EquipmentTypeKey;
                });
              this.WorkOrderServiceService//service for getting all equipment name list
                .getEquipment_typechange(this.WOEditList.EquipmentTypeKey, this.WOEditList.FacilityKey, this.floorvalue, this.OrganizationID)
                .subscribe((data: any[]) => {
                  this.EquipmentList = data;
                  this.EquipmentKey = this.WOEditList.EquipmentKey;
                });
            });

        }
        if (this.WOEditList.IsPhotoRequired == 1) {
          this.isPhotoRequired = true;
        }
        else {
          this.isPhotoRequired = false;
        }
        if (this.WOEditList.IsBarcodeRequired == 1) {
          this.isBarcodeRequired = true;
        }
        else {
          this.isBarcodeRequired = false;
        }
        if (this.WOEditList.IsReccurring == 1) {
          this.isRecurring = true;
          if (this.WOEditList.IntervalType == 'd') {

            this.dailyrecurring = true;
            this.monthlyrecurring = false;
            this.weeklyrecurring = false;
            this.DailyrecurringGap = this.WOEditList.OccurrenceInterval;
            if (this.DailyrecurringGap == 0) {
              this.DailyrecurringGap = "";
            }
            this.WorkorderStartDate = new Date(this.WOEditList.WorkorderDate);
            this.WorkorderEndDate = new Date(this.WOEditList.WorkorderEndDate);
            var count = [];
            var WorkorderTime = [];
            var ocurraOntime = this.WOEditList.WorkorderTimes;
            var y = this.WOEditList.WorkorderTimes;
            count = y.split(',');
            this.dailyFrequency = count.length;
            if (count.length > 0) {

              this.timetable = { times: [] };
              this.timetable.times = [];
              var arr = [];
              //converting time from hh:mm format to display on time picker
              for (var i = 0; i < count.length; i++) {
                this.timetable.times.push('');
                var test = count[i].split(":");
                var cur_time = new Date(Date.now());
                var today = new Date(cur_time.getFullYear(), cur_time.getMonth(), cur_time.getDate(), test[0], test[1], 0);

                arr.push(today);
                this.timetable.times[i] = arr[i];
              }

            }

          }
          if (this.WOEditList.IntervalType == 'w') {

            this.weeklyrecurring = true;
            this.dailyrecurring = false;
            this.monthlyrecurring = false;
            var days = [];
            var x = this.WOEditList.OccurrenceDayInstance;
            days = x.split(',');
            for (var i = 0; i <= days.length; i++) {
              if (days[i] == 'su') {
                this.weektable_one = true;
              }
              else if (days[i] == 'mo') {
                this.weektable_two = true;
              } else if (days[i] == 'tu') {
                this.weektable_three = true;
              } else if (days[i] == 'we') {
                this.weektable_four = true;
              } else if (days[i] == 'th') {
                this.weektable_five = true;
              } else if (days[i] == 'fr') {
                this.weektable_six = true;
              } else if (days[i] == 'sa') {
                this.weektable_seven = true;
              }
            }

            this.WorkorderStartDate = new Date(this.WOEditList.WorkorderDate);
            this.WorkorderEndDate = new Date(this.WOEditList.WorkorderEndDate);
            var cur_time = new Date(Date.now());
            var timeValue1 = this.WOEditList.WorkorderTime;
            var test = timeValue1.split(":");
            var today = new Date(cur_time.getFullYear(), cur_time.getMonth(), cur_time.getDate(), test[0], test[1], 0);
            this.Time_weekly = today;
          }
          if (this.WOEditList.IntervalType == 'm') {
            this.monthlyrecurring = true;
            this.weeklyrecurring = false;
            this.dailyrecurring = false;
            if (data[0].OccurrenceDayOfWeek) {
              this.monthlyreccradio2 = true;
              this.monthlyreccradio1 = false;
              var tempInstance = data[0].OccurrenceDayInstance;
              if (tempInstance == 'mo') {
                this.day2 = 'Mon';
              } else if (tempInstance == 'tu') {
                this.day2 = 'Tue';
              } else if (tempInstance == 'we') {
                this.day2 = 'Wed';
              } else if (tempInstance == 'th') {
                this.day2 = 'Thu';
              } else if (tempInstance == 'fr') {
                this.day2 = 'Fri';
              } else if (tempInstance == 'sa') {
                this.day2 = 'Sat';
              } else if (tempInstance == 'su') {
                this.day2 = 'Sun';
              }
              this.pos2  = data[0].OccurrenceDayOfWeek;
              // if (tempInstanceWeekDay == 1) {
              //   this.pos2 = 'First';
              // }
              // if (tempInstanceWeekDay == 2) {
              //   this.pos2 = 'Second';
              // }
              // if (tempInstanceWeekDay == 3) {
              //   this.pos2 = 'Third';
              // }
              // if (tempInstanceWeekDay == 4) {
              //   this.pos2 = 'Fourth';
              // }
              // if (tempInstanceWeekDay == 5) {
              //   this.pos2 = 'Fifth';
              // }
              // if (tempInstanceWeekDay == -1) {
              //   this.pos2 = 'Last';
              // }
              this.month2 =this.WOEditList.OccurrenceInterval;
              var cur_time = new Date(Date.now());
              var timeValue1 = this.WOEditList.WorkorderTime;
              var test = timeValue1.split(":");
              var today = new Date(cur_time.getFullYear(), cur_time.getMonth(), cur_time.getDate(), test[0], test[1], 0);
              this.Time_monthly = today;
              this.WorkorderStartDate = new Date(this.WOEditList.WorkorderDate);
              this.WorkorderEndDate = new Date(this.WOEditList.WorkorderEndDate);
            }
            else {
              this.monthlyreccradio2 = false;
              this.monthlyreccradio1 = true;

              this.day1 = this.WOEditList.OccurrenceDayInstance;
              this.month1 = this.WOEditList.OccurrenceInterval;
              var cur_time = new Date(Date.now());
              var timeValue1 = this.WOEditList.WorkorderTime;
              var test = timeValue1.split(":");
              var today = new Date(cur_time.getFullYear(), cur_time.getMonth(), cur_time.getDate(), test[0], test[1], 0);
              this.Time_monthly = today;
              this.WorkorderStartDate = new Date(this.WOEditList.WorkorderDate);
              this.WorkorderEndDate = new Date(this.WOEditList.WorkorderEndDate);

            }

          }
        }

        this.workordertypekey = this.WOEditList.WorkorderTypeKey;
        this.FacilityKey = this.WOEditList.FacilityKey;
        if (this.WOEditList.PriorityKey) {
          this.PriorityKey = this.WOEditList.PriorityKey;
        }
        this.WorkorderNotes = this.WOEditList.WorkorderNotes;
        if (this.WOEditList.EmployeeKey) {
          this.EmployeeKey = this.WOEditList.EmployeeKey;
        }
        if (this.EmployeeKey == -1) {
          this.EmployeeKey = "";
        }
      });

    this.WorkOrderServiceService//service for getting all facility
      .getallFacility(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.facilitylist = data;
      });
    this.WorkOrderServiceService//service for getting all workordertype list
      .getallworkorderType(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.workorderTypeList = data;
      });
    this.WorkOrderServiceService//service for getting all priority list
      .getallPriority(this.OrganizationID)
      .subscribe((data: any[]) => {
        this.priorityList = data;
      });
    this.WorkOrderServiceService//service for getting all employee names
      .getallEmployee(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.EmployeeOption = data;
      });
  }
  //function called on checkbox value change
  toggleVisibility(e) {
    if (e.target.checked) {
      this.marked = true;
    } else {
      this.marked = false;
    }
  }
  getEquiment(floor_key, facility_key) {//getting equipment based on facility key,floor key
    if (floor_key && facility_key) {
      this.WorkOrderServiceService
        .getallEquipment(facility_key, floor_key, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.EquipmentTypeList = data;
          this.EquipmentList = data;
          this.EquipmentKey = "";
          this.EquipmentTypeKey = ""
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
        .getallFloor(facilityName, this.OrganizationID)
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
          .getzone_facilityfloor(floor, facility, this.OrganizationID)
          .subscribe((data: any[]) => {
            this.zonelist = data;
            this.ZoneKey = "";
          });
        this.WorkOrderServiceService//service for getting roomtype lists
          .getroomType_facilityfloor(floor, facility, this.OrganizationID)
          .subscribe((data: any[]) => {
            this.RoomTypeList = data;
            this.RoomTypeKey = "";
          });
        this.WorkOrderServiceService//service for getting roomlist
          .getRoom_facilityfloor(floor, facility, this.OrganizationID)
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
        .getRoomtype_zone_facilityfloor(zone, floor, facility, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.RoomTypeList = data;
          this.RoomTypeKey = "";
        });
      this.WorkOrderServiceService//service for getting roomlist
        .getRoom_zone_facilityfloor(zone, floor, facility, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.RoomList = data;
          this.RoomKey = "";
        });
    }
    else {
      this.RoomTypeKey = "";
      this.RoomKey = "";
      this.getZoneRoomTypeRoom(this.FloorKey,this.FacilityKey);
    }
  }
  getRoom(roomtype, zone, facility, floor) {//get room based on zone,facility,floor,roomtype
    if (roomtype && zone && facility && floor) {
      this.WorkOrderServiceService//service for getting roomlist
        .getRoom_Roomtype_zone_facilityfloor(roomtype, zone, floor, facility, this.OrganizationID)
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
        .getEquipment_typechange(equip_type, facility, floor, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.EquipmentList = data;
          this.EquipmentKey = "";
        });
    }
    else {
      this.EquipmentKey = "";
    }
  }
  //function for deleting workorder
  DeleteWO() {
    this.deleteWO = {
      workorderkey: this.WO_Key,
      OrganizationID: this.OrganizationID
    };
    this.WorkOrderServiceService
      .deleteCurrent_WO(this.deleteWO)
      .subscribe((data: any[]) => {
        alert("Work-order deleted successfully");
        this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewWorkOrder'] } }]);
      });
  }
  //function callen on radiobutton value change
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
    this.pos2="";
    this.day2="";
    this.month2="";
  }
  monthlyreccradio2_change() {
    this.monthlyreccradio1 = false;
    this.monthlyreccradio2 = true;
    this.day1="";
    this.month1="";
  }
  //
  //function called on updatewo
  UpdateWO() {
    if (this.showEqTypes === false) {
      this.createWorkorder1(); //function called on updatewo without equipment
      console.log('Equipment***Not');

    } else {
      this.createWorkorder2();//function called on updatewo with equipment

    }
  }
  createWorkorder1() {//function called on updatewo without equipment
    if (!this.workordertypekey) {
      alert("Please select work-order type!");
    }
    else if (!this.FacilityKey) {
      alert("Please select building!");
    }
    else if (!this.FloorKey) {
      alert("Please select floor!");
    }
    else if ((this.WorkorderEndDate) && (this.convert_DT(this.WorkorderStartDate) >this.convert_DT(this.WorkorderEndDate))) {
      alert("Please check your start date!");

    }
    else if (this.isRecurring == true) {
      if (this.dailyrecurring == false && this.weeklyrecurring == false && this.monthlyrecurring == false) {
        alert("Recurring Period is not provided !");
      }
      if (this.dailyrecurring == true) {
        if (!this.WorkorderEndDate) {
          alert("Please provide end date!");
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
        else if (!this.WorkorderEndDate) {
          alert("Please provide end date!");
        }
        else {
          this.withoutequip_wo();
        }
      }
      else if (this.monthlyrecurring == true) {
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
        else if (!this.WorkorderEndDate) {
          alert("Please provide end date!");
        }
        else {
          this.withoutequip_wo();
        }
      }

    }
  }
  //function called on updatewo without equipment
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
    if (this.workordertypekey) {
      this.wot = this.workordertypekey;
    } else {
      this.wot = null;
    }
    if (this.WorkorderNotes) {
      this.notes = this.WorkorderNotes.trim();
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
    }
    else if (this.RoomNameList) {
      roomsString = this.RoomNameList;
    }
    else {
      if (roomlistObj) {
        for (var j = 0; j < roomlistObj.length; j++) {
          roomList.push(roomlistObj[j].RoomKey);
        }
        roomsString = roomList.join(',');
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
    }
    else if (this.RoomNameList) {
      roomsString = this.RoomNameList;
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
      this.emp_key = this.EmployeeKey;
    } else {
      this.emp_key = - 1;
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
    if (this.isRecurring == false) {
      this.isrecurring = 0;
    }
    else if (this.isRecurring == true && this.dailyrecurring == true) {
      this.intervaltype = 'd';
      this.isrecurring = 1;
    } else if (this.isRecurring == true && this.weeklyrecurring == true) {
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
    } else if (this.isRecurring == true && this.monthlyrecurring == true) {
      this.intervaltype = 'm';
      this.isrecurring = 1;
    }
    if (this.isRecurring == false) {
      if (this.dateValue) {
        this.startDT = this.convert_DT(this.dateValue);
      } else {
        this.startDT = this.convert_DT(new Date());
      }
      this.endDT = this.startDT;
    }
    else {
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
    }
    var timeDiff = Math.abs(this.WorkorderEndDate.getTime() - this.WorkorderStartDate.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    
      if( this.intervaltype == 'w' && diffDays <7){
        alert("Please Select One week Date Range!");
        return;
      }
      if( this.intervaltype == 'm' && diffDays <31){
        alert("Please Select One month Date Range!");
        return;
      }

    if (this.isRecurring == false) {
      console.log(this.timeValue);
      if (this.timeValue) {
        this.workTime = this.timeValue.getHours() + ':' + this.timeValue.getMinutes();
      } else {
        this.workTime = new Date().getHours() + ':' + new Date().getMinutes();
      }
    } else if (this.isRecurring == true && this.dailyrecurring == true) {
      var timeset = [];
      var timeset_corr = [];
      timeset = this.timetable.times;
      for (var i = 0; i < timeset.length; i++) {
        timeset_corr.push(timeset[i].getHours() + ':' + timeset[i].getMinutes());
      }

      this.workTime = timeset_corr.join(',');
      if (!(this.DailyrecurringGap)) {
        this.rep_interval =1;
      }
      else {
        this.rep_interval = (parseInt(this.DailyrecurringGap) + 1);
      }
    }
    else if (this.isRecurring == true && this.weeklyrecurring == true) {
      if (this.Time_weekly) {
        this.workTime = this.Time_weekly.getHours() + ':' + this.Time_weekly.getMinutes();
      }
      else {
        alert("Please Enter Time!");
      }
    } else if (this.isRecurring == true && this.monthlyrecurring == true) {
      if (this.Time_monthly) {
        this.workTime = this.Time_monthly.getHours() + ':' + this.Time_monthly.getMinutes();
      }
      else {
        alert("Please Enter Time!");
      }
      if (this.monthlyreccradio1 == true) {
        this.occurs_on = this.day1;
        this.rep_interval = (this.month1) ? parseInt(this.month1)+1 : 1;
      }
      else if (this.monthlyreccradio2 == true) {
        this.occurs_on = this.day2;
        this.rep_interval = (this.month2) ? parseInt(this.month2)+1 : 1;
        this.occurs_type = this.pos2;
        switch (this.occurs_on) {
          case 'Sun':
            this.occurs_on = 'su';
            break;
          case 'Mon':
            this.occurs_on = "mo";
            break;
          case 'Tue':
            this.occurs_on = "tu";
            break;
          case 'Wed':
            this.occurs_on = "we";
            break;
          case 'Thu':
            this.occurs_on = "th";
            break;
          case 'Fri':
            this.occurs_on = "fr";
            break;
          case 'Sat':
            this.occurs_on = "sa";
            break;
        }
      }
    }
    if( this.keepActive ==true){
      this.keep_active=1;
    }
    else{
       this.keep_active=0;
     }

     if( this.GpsSnapShot ==true){
      this.Gps_SnapShot=1;
     }
      else{
       this.Gps_SnapShot=0;
     }
    this.workorderCreation = {
      occursontime: this.workTime,
      workorderkey: - 99,
      workordertypekey: this.wot,
      workordernote: this.notes,
      equipmentkey: this.eqp_key,
      roomkeys: roomsString.toString(),
      facilitykeys: facilityString.toString(),
      floorkeys: floorString.toString(),
      zonekeys: zoneString.toString(),
      roomtypekeys: roomtypeString.toString(),
      employeekey: this.emp_key,
      priority: this.priority,
      fromdate: this.startDT,
      todate: this.endDT,
      isbar: this.is_BarcodeRequired,
      isphoto: this.is_PhotoRequired,
      metaupdatedby: this.employeekey,
      OrganizationID: this.OrganizationID,
      intervaltype: this.intervaltype, // char(1),/*d for day, w for week, m for month*/
      repeatinterval: this.rep_interval,
      occursonday: this.occurs_on,
      occurstype: this.occurs_type,
      keepActive:this.keep_active,
      IsSnapshot:this.Gps_SnapShot
    };
    this.WorkOrderServiceService.addWorkOrderWithOutEqup(this.workorderCreation).subscribe((data: any[]) => {//service for updating current workorder
      this.deleteWO = {
        workorderkey: this.WO_Key,
        OrganizationID: this.OrganizationID
      };
      this.WorkOrderServiceService//service for updating existing workorder
        .deleteCurrent_WO(this.deleteWO)
        .subscribe((data: any[]) => {
          alert("Work-order updated successfully");
          this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewWorkOrder'] } }]);
        });
    });
  }
  //function called on updatewo with equipment
  createWorkorder2() {
    if (!this.workordertypekey) {
      alert("Please select work-order type!");
    }
    else if (!this.FacilityKey) {
      alert("Please select building!");
    }
    else if (!this.FloorKey) {
      alert("Please select floor!");
    }
    else if (this.showEqTypes == true && !(this.EquipmentTypeKey)) {
      alert("Please select equipment type!");
    }
    else if ((this.WorkorderEndDate) && (this.convert_DT(this.WorkorderStartDate) >this.convert_DT(this.WorkorderEndDate))) {
      alert("Please check your start date!");

    }
    else if (this.isRecurring == true) {
      if (this.dailyrecurring == false && this.weeklyrecurring == false && this.monthlyrecurring == false) {
        alert("Recurring Period is not provided !");
      }
      if (this.dailyrecurring == true) {
        if (!this.WorkorderEndDate) {
          alert("Please provide end date!");
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
        else if (!this.WorkorderEndDate) {
          alert("Please provide end date!");
        }
        else {
          this.withequip_wo();
        }
      }
      else if (this.monthlyrecurring == true) {
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
        else if (!this.WorkorderEndDate) {
          alert("Please provide end date!");
        }
        else {
          this.withequip_wo();
        }
      }

    }
  }
  //function called on updatewo with equipment
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

    if (this.workordertypekey) {
      this.wot = this.workordertypekey;
    } else {
      this.wot = null;

    }
    if (this.WorkorderNotes) {
      this.notes = this.WorkorderNotes.trim();
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
      if (EquListObj) {
        for (var j = 0; j < EquListObj.length; j++) {
          equList.push(EquListObj[j].EquipmentKey);
        }
        this.eqp_key = equList.join(',');
      }
    }
    if (this.EmployeeKey) {
      this.emp_key = this.EmployeeKey;
    } else {
      this.emp_key = - 1;
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
    if (this.isRecurring == false) {
      this.isrecurring = 0;
    }
    else if (this.isRecurring == true && this.dailyrecurring == true) {
      this.intervaltype = 'd';
      this.isrecurring = 1;
    } else if (this.isRecurring == true && this.weeklyrecurring == true) {
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
    else if (this.isRecurring == true && this.monthlyrecurring == true) {
      this.intervaltype = 'm';
      this.isrecurring = 1;
    }
    if (this.isRecurring == false) {
      if (this.dateValue) {
        this.startDT = this.convert_DT(this.dateValue);
      } else {
        this.startDT = this.convert_DT(new Date());
      }
      this.endDT = this.startDT;
    }
    else {
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
    }
    var timeDiff = Math.abs(this.WorkorderEndDate.getTime() - this.WorkorderStartDate.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
    
      if( this.intervaltype == 'w' && diffDays <7){
        alert("Please Select One week Date Range!");
        return;
      }
      if( this.intervaltype == 'm' && diffDays <31){
        alert("Please Select One month Date Range!");
        return;
      }
    if (this.isRecurring == false) {
      if (this.timeValue) {
        this.workTime = this.timeValue.getHours() + ':' + this.timeValue.getMinutes();
      } else {
        this.workTime = new Date().getHours() + ':' + new Date().getMinutes();
      }
    } else if (this.isRecurring == true && this.dailyrecurring == true) {
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
        this.rep_interval = (parseInt(this.DailyrecurringGap) + 1);
      }
    } else if (this.isRecurring == true && this.weeklyrecurring == true) {
      this.workTime = this.Time_weekly.getHours() + ':' + this.Time_weekly.getMinutes();
    } else if (this.isRecurring == true && this.monthlyrecurring == true) {
      this.workTime = this.Time_monthly.getHours() + ':' + this.Time_monthly.getMinutes();
      if (this.monthlyreccradio1 == true) {
        this.occurs_on = this.day1;
        this.rep_interval = (this.month1) ? parseInt(this.month1)+1 : 1;
      }
      else if (this.monthlyreccradio2 == true) {
        this.occurs_on = this.day2;
        this.rep_interval = (this.month2) ? parseInt(this.month2)+1 : 1;
        this.occurs_type = this.pos2;
        switch (this.occurs_on) {
          case 'Sun':
            this.occurs_on = 'su';
            break;
          case 'Mon':
            this.occurs_on = "mo";
            break;
          case 'Tue':
            this.occurs_on = "tu";
            break;
          case 'Wed':
            this.occurs_on = "we";
            break;
          case 'Thu':
            this.occurs_on = "th";
            break;
          case 'Fri':
            this.occurs_on = "fr";
            break;
          case 'Sat':
            this.occurs_on = "sa";
            break;
        }
      }
    }
    if( this.keepActive ==true){
      this.keep_active=1;
    }
    else{
       this.keep_active=0;
     }

     if( this.GpsSnapShot ==true){
      this.Gps_SnapShot=1;
     }
      else{
       this.Gps_SnapShot=0;
     }

    this.workorderCreation = {
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
      employeekey: this.emp_key,
      priority: this.priority,
      fromdate: this.startDT,
      todate: this.endDT,
      isbar: this.is_BarcodeRequired,
      isphoto: this.is_PhotoRequired,
      metaupdatedby: this.employeekey,
      OrganizationID: this.OrganizationID,
      intervaltype: this.intervaltype, // char(1),/*d for day, w for week, m for month*/
      repeatinterval: this.rep_interval,
      occursonday: this.occurs_on,
      occurstype: this.occurs_type,
      keepActive:this.keep_active,
      IsSnapshot:this.Gps_SnapShot
    };
    this.WorkOrderServiceService.addWorkOrderEqup(this.workorderCreation).subscribe((data: any[]) => {//service for updating current workorder
      this.deleteWO = {
        workorderkey: this.WO_Key,
        OrganizationID: this.OrganizationID
      };
      this.WorkOrderServiceService//service for deleting existing workorder
        .deleteCurrent_WO(this.deleteWO)
        .subscribe((data: any[]) => {
          alert("Work-order updated successfully");
          this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewWorkOrder'] } }]);
        });
    });
  }
   //for time picker (daily recurring)
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
  goBack(){
    this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewWorkOrder'] } }]);
  }
}


