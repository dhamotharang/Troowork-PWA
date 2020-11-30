import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { workorder } from '../../../../model-class/work-order';
import { WorkOrderServiceService } from '../../../../service/work-order-service.service';
import { ActivatedRoute, Router } from "@angular/router";
import { DatepickerOptions } from 'ng2-datepicker';
@Component({
  selector: 'app-edit-work-order',
  templateUrl: './edit-work-order.component.html',
  styleUrls: ['./edit-work-order.component.scss']
})
export class EditWorkOrderComponent implements OnInit {
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  delete_curwo;
  loading;
  //for token decoding
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
  wot;
  notes;
  facilityString;
  zone;
  eqp_key;
  shift;
  priority;
  isReccuring;
  isrecurring; // for setting bit value 1 or 0
  startDT;
  endDT;
  workTime;
  dailyRecc_gap; // dailyreccuringGap
  is_PhotoRequired;
  is_BarcodeRequired;
  occurenceinstance;
  keepActive;
  keep_active;
  GpsSnapShot;
  Gps_SnapShot;

  intervaltype;
  repeatinterval;
  occursonday;
  emp_key;
  workorderCreation;
  timetable = { times: [] };//for daily recurring timepicker
  count = 0;
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
  ngOnInit() {
    this.loading=true;
    this.workordertypekey = "";
    this.FacilityKey = "";
    this.FloorKey = "";
    this.ZoneKey = "";
    this.RoomTypeKey = "";
    this.RoomKey = "";
    this.PriorityKey = "";
    this.EmployeeKey = "";
    this.EquipmentTypeKey = "";
    this.EquipmentKey = "";
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;

    this.WorkOrderServiceService
      .getWO_edit(this.WO_Key, this.OrganizationID)
      .subscribe((data: any[]) => {//service for getting edited work order detail
        this.WOEditList = data[0];
        this.loading=false;
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
        this.WorkOrderServiceService
          .getallFloor(this.WOEditList.FacilityKey, this.OrganizationID)
          .subscribe((data: any[]) => {//for getting all floor names
            this.FloorList = data;
          });
        this.WorkOrderServiceService
          .getzone_facilityfloor(this.WOEditList.FloorKey, this.WOEditList.FacilityKey, this.OrganizationID)
          .subscribe((data: any[]) => {//for getting all zone names
            this.zonelist = data;
          });
        this.WorkOrderServiceService
          .getroomType_facilityfloor(this.WOEditList.FloorKey, this.WOEditList.FacilityKey, this.OrganizationID)
          .subscribe((data: any[]) => {//service for getting roomtype lists
            this.RoomTypeList = data;
          });
        this.WorkOrderServiceService
          .getRoom_facilityfloor(this.WOEditList.FloorKey, this.WOEditList.FacilityKey, this.OrganizationID)
          .subscribe((data: any[]) => {//service for getting roomlist
            this.RoomList = data;
          });

        if (this.WOEditList.EquipmentKey == -1) {
          this.showEqTypes = false;
          this.FloorKey = this.WOEditList.FloorKey;
          this.RoomTypeKey = this.WOEditList.RoomTypeKey;
          this.ZoneKey = this.WOEditList.ZoneKey;
          this.RoomKey = this.WOEditList.RoomKey;
        }
        else {
          this.showEqTypes = true;
          this.RoomTypeKey = "";

          this.WorkOrderServiceService
            .getFloor(this.WO_Key, this.OrganizationID)
            .subscribe((data: any[]) => {

              this.floorvalue = parseInt(data[0].FloorKeyList);
              this.FloorKey = this.floorvalue;
              this.WorkOrderServiceService//service for getting equipment type list
                .getallEquipment(this.WOEditList.FacilityKey, this.floorvalue, this.OrganizationID)
                .subscribe((data: any[]) => {
                  this.EquipmentTypeList = data;
                });
              this.WorkOrderServiceService//service for getting equipment list
                .getEquipment_typechange(this.WOEditList.EquipmentTypeKey, this.WOEditList.FacilityKey, this.floorvalue, this.OrganizationID)
                .subscribe((data: any[]) => {
                  this.EquipmentList = data;
                });
            });
          this.EquipmentTypeKey = this.WOEditList.EquipmentTypeKey;
          this.EquipmentKey = this.WOEditList.EquipmentKey;
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
        this.dateValue = new Date(this.WOEditList.WorkorderDate);
        var date_time = this.dateValue;

        this.workordertypekey = this.WOEditList.WorkorderTypeKey;
        this.FacilityKey = this.WOEditList.FacilityKey;
        if (this.WOEditList.PriorityKey) {
          this.PriorityKey = this.WOEditList.PriorityKey;
        }
        this.WorkorderNotes = this.WOEditList.WorkorderNotes;

        this.EmployeeKey = this.WOEditList.EmployeeKey;
        if (this.EmployeeKey == -1) {
          this.EmployeeKey = "";
        }

        var cur_time = new Date(Date.now());

        var timeValue1 = this.WOEditList.WorkorderTime;
        var test = timeValue1.split(":");
        var today = new Date(cur_time.getFullYear(), cur_time.getMonth(), cur_time.getDate(), test[0], test[1], 0);
        this.timeValue = today;
      });

    this.WorkOrderServiceService//for getting all building names
      .getallFacility(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.facilitylist = data;
      });
    this.WorkOrderServiceService//for getting all workordertypes
      .getallworkorderType(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.workorderTypeList = data;
      });
    this.WorkOrderServiceService//for getting all priority names
      .getallPriority(this.OrganizationID)
      .subscribe((data: any[]) => {
        this.priorityList = data;
      });
    this.WorkOrderServiceService//for getting employeenames
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
  getEquiment(floor_key, facility_key) {//service for getting equipment based on facility & floor
    if (floor_key && facility_key) {
      this.WorkOrderServiceService
        .getallEquipment(facility_key, floor_key, this.OrganizationID)
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
   //function for updating workorder
  UpdateWO() {
    if (this.showEqTypes === false) {
      this.createWorkorder1();//function for updating workorder without equipment
      console.log('Equipment***Not');

    } else {
      this.createWorkorder2();//function for updating workorder with equipment
    }
  }
  createWorkorder1() {
    if (!this.workordertypekey) {
      alert("Please select work-order type!");
    }
    else if (!this.FacilityKey) {
      alert("Please select building!");
    }
    else if (!this.FloorKey) {
      alert("Please select floor!");
    }
    else if (!(this.timeValue)) {
      alert("Please provide time!");
    }
    else {
      var roomlistObj = [];
      var roomtypelistObj = [];
      var zonelistObj = [];
      var floorlistObj = [];
      var facilitylistObj = [];
      var facilityList = [];
      var roomList = [];
      var roomtypeList = [];
      var zoneList = [];
      var floorList = []; facilitylistObj = this.facilitylist;
      facilityList = [];
      roomList = [];
      roomtypeList = [];
      zoneList = [];
      floorList = [];
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
      } else {
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


      this.isReccuring = false;
      this.isrecurring = 0;

      if (this.dateValue) {
        this.startDT = this.convert_DT(this.dateValue);
      } else {
        this.startDT = this.convert_DT(new Date());
      }
      this.endDT = this.startDT;
    }
    if (this.timeValue) {
      this.workTime = this.timeValue.getHours() + ':' + this.timeValue.getMinutes();
    } else {
      this.workTime = new Date().getHours() + ':' + new Date().getMinutes();
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
      intervaltype: '0', // char(1),/*d for day, w for week, m for month*/
      repeatinterval: 1,
      occursonday: null,
      keepActive:this.keep_active,
      IsSnapshot:this.Gps_SnapShot
    };
    this.WorkOrderServiceService.addWorkOrderWithOutEqup(this.workorderCreation).subscribe((data: any[]) => {//service for updating workorder
      this.deleteWO = {
        workorderkey: this.WO_Key,
        OrganizationID: this.OrganizationID
      };
      this.WorkOrderServiceService//service for deleting current workorder after updating
        .deleteCurrent_WO(this.deleteWO)
        .subscribe((data: any[]) => {
          alert("Work-order updated successfully");
          this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewWorkOrder'] } }]);
        });
    });
  }
//function for creating workorder with equipment
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
    else if (!(this.timeValue)) {
      alert("Please provide time!");
    } else if (this.showEqTypes == true && !(this.EquipmentTypeKey)) {
      alert("Please select equipment type!");
    }
    else {
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
      facilityList = [];
      roomList = [];
      roomtypeList = [];
      zoneList = [];
      floorList = [];
      equList = [];
      floorlistObj = this.FloorList;
      zonelistObj = this.zonelist;
      roomtypelistObj = this.RoomTypeList;
      roomlistObj = this.RoomList;
      EquListObj = this.EquipmentList;

      this.intervaltype = '0';
      this.repeatinterval = 1;
      this.occurenceinstance = null;
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


      this.isReccuring = false;
      this.isrecurring = 0;

      if (this.dateValue) {
        this.startDT = this.convert_DT(this.dateValue);
      } else {

        this.startDT = this.convert_DT(new Date());
      }
      this.endDT = this.startDT;
      if (this.timeValue) {
        this.workTime = this.timeValue.getHours() + ':' + this.timeValue.getMinutes();
      } else {
        this.workTime = new Date().getHours() + ':' + new Date().getMinutes();
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
        intervaltype: '0', // char(1),/*d for day, w for week, m for month*/
        repeatinterval: 1,
        occursonday: null,
        keepActive:this.keep_active,
        IsSnapshot:this.Gps_SnapShot
      };
      this.WorkOrderServiceService.addWorkOrderEqup(this.workorderCreation).subscribe((data: any[]) => {//service for updating workorder
        this.deleteWO = {
          workorderkey: this.WO_Key,
          OrganizationID: this.OrganizationID
        };
        this.WorkOrderServiceService//service for deleting existing workorder after updating
          .deleteCurrent_WO(this.deleteWO)
          .subscribe((data: any[]) => {
            alert("Work-order updated successfully");
            this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewWorkOrder'] } }]);
          });
      });
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
