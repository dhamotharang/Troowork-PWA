import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { workorder } from '../../../../model-class/work-order';
import { WorkOrderServiceService } from '../../../../service/work-order-service.service';

@Component({
  selector: 'app-view-batch-workorder',
  templateUrl: './view-batch-workorder.component.html',
  styleUrls: ['./view-batch-workorder.component.scss']
})
export class ViewBatchWorkorderComponent implements OnInit {
  //converting date from GMT to yyyy/mm/dd
  public convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");

  }

  // adding properties and methods that will be used by the igxDatePicker
  public date: Date = new Date(Date.now());
  private dayFormatter = new Intl.DateTimeFormat('en', { weekday: 'long' });
  private monthFormatter = new Intl.DateTimeFormat('en', { month: 'long' });
  public formatter = (_: Date) => {
    return `You selected ${this.dayFormatter.format(_)}, ${_.getDate()} ${this.monthFormatter.format(_)}, ${_.getFullYear()}`;

  }
  loading: boolean;// loading
  EmployeeOption: workorder[];
  facilitylist: workorder[];
  scheduleList: workorder[];
  FloorList: workorder[];
  zonelist: workorder[];
  RoomTypeList: workorder[];
  workStatusList: workorder[];
  workorderTypeList: workorder[];
  RoomList: workorder[];
  domain_name: string;
  workorderList;
  checkValue = [];
  FacilityKey;
  FloorKey;
  ZoneKey;
  RoomTypeKey;
  RoomKey;
  BatchScheduleNameKey;
  WorkorderStatusKey;
  EmployeeKey;
  WorkorderTypeKey;
  ondate: Date;
  todate: Date;
  viewWorkOrder;
  isRecurring = false;
  marked = false;
  workorderKey = [];
  searchWorkorder;

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  pageno: Number = 1;
  items_perpage: Number = 25;
  showHide1: boolean;
  showHide2: boolean;
  pagination: Number;

  checkflag: boolean;
  workorderschedulerCheckValue;
  deleteWO;
  //token decoding
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
  //code for special character restriction
  searchform: FormGroup;
  regexStr = '^[a-zA-Z0-9_ ]*$';
  @Input() isAlphaNumeric: boolean;
  constructor(private formBuilder: FormBuilder, private WorkOrderServiceService: WorkOrderServiceService, private el: ElementRef) { }
  @HostListener('keypress', ['$event']) onKeyPress(event) {
    return new RegExp(this.regexStr).test(event.key);
  }

  @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
    this.validateFields(event);
  }
  validateFields(event) {
    setTimeout(() => {

      this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^A-Za-z ]/g, '').replace(/\s/g, '');
      event.preventDefault();

    }, 100)

  }
  //for deleting workorder
  checkBoxValueForDelete(index, CheckValue, WorkorderKey) {
    this.checkValue[index] = CheckValue;
    this.workorderKey[index] = WorkorderKey;
    for (var i = 0; i < this.checkValue.length;) {
      if (this.checkValue[i] == true) {
        this.checkflag = true;
        return;
      }
      else {
        if (i == (this.checkValue.length - 1)) {
          this.checkValue = [];
          this.checkflag = false;
          return;
        }
        i++;
      }
    }
  }
  //code for pagination
  previousPage() {
    var on_date = this.convert_DT(new Date());
    this.pageno = +this.pageno - 1;
    this.WorkOrderServiceService
      .getBatchworkorder(on_date, this.employeekey, this.pageno, this.items_perpage, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.workorderList = data;
        for (var i = 0; i < this.workorderList.length; i++) {
          this.workorderList[i].workorderCheckValue = false;
        }
        if (this.pageno == 1) {
          this.showHide2 = true;
          this.showHide1 = false;
        } else {
          this.showHide2 = true;
          this.showHide1 = true;
        }
      });
  }

  nextPage() {
    var on_date = this.convert_DT(new Date());
    this.pageno = +this.pageno + 1;
    this.WorkOrderServiceService
      .getBatchworkorder(on_date, this.employeekey, this.pageno, this.items_perpage, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.workorderList = data;
        for (var i = 0; i < this.workorderList.length; i++) {
          this.workorderList[i].workorderCheckValue = false;
        }
        this.pagination = +this.workorderList[0].totalItems / (+this.pageno * (+this.items_perpage));
        if (this.pagination > 1) {
          this.showHide2 = true;
          this.showHide1 = true;
        }
        else {
          this.showHide2 = false;
          this.showHide1 = true;
        }
      });
  }
  //
  ngOnInit() {
    this.loading = true;
    this.checkflag = false;
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;
    this.domain_name = 'workstatus';
    this.FacilityKey = "";
    this.FloorKey = "";
    this.ZoneKey = "";
    this.RoomTypeKey = "";
    this.RoomKey = "";
    this.EmployeeKey = "";
    this.WorkorderTypeKey = "";
    this.BatchScheduleNameKey = "";

    var on_date = this.convert_DT(new Date());
    this.WorkOrderServiceService
      .getallFacility(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.facilitylist = data;
      });
    this.WorkOrderServiceService
      .getallEmployeeName(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.EmployeeOption = data;
      });
    this.WorkOrderServiceService
      .getallScheduleName(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.scheduleList = data;
      });
    this.WorkOrderServiceService
      .getallworkStatus(this.domain_name, this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.workStatusList = data;
      });
    this.WorkOrderServiceService
      .getallworkorderType(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.workorderTypeList = data;
      });
    this.WorkOrderServiceService
      .getBatchworkorder(on_date, this.employeekey, this.pageno, this.items_perpage, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.workorderList = data;
        this.loading = false;
        for (var i = 0; i < this.workorderList.length; i++) {
          this.workorderList[i].workorderCheckValue = false;
        }
        if (this.workorderList[0].totalItems > this.items_perpage) {
          this.showHide2 = true;
          this.showHide1 = false;
        }
        else if (this.workorderList[0].totalItems <= this.items_perpage) {
          this.showHide2 = false;
          this.showHide1 = false;
        }
      });

    this.searchform = this.formBuilder.group({
      SearchWo: ['', Validators.required]
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
  getFloorDisp(facilityName) {//getting floor based on facility
    if (facilityName) {
      this.WorkOrderServiceService
        .getallFloor(facilityName, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.FloorList = data;
          this.FloorKey = "";
        });
    }
    else {
      this.FloorKey = "";
      this.ZoneKey = "";
      this.RoomTypeKey = "";
      this.RoomKey = "";
    }
  }
  getZoneRoomTypeRoom(floor, facility) {//getting zone,roomtype,room based on facility key,floor key
    if (floor && facility) {
      this.WorkOrderServiceService//service for getting zones
        .getzone_facilityfloor(floor, facility, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.zonelist = data;
          this.ZoneKey = "";
        });
      this.WorkOrderServiceService//service for getting roomtype
        .getroomType_facilityfloor(floor, facility, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.RoomTypeList = data;
          this.RoomTypeKey = "";
        });
      this.WorkOrderServiceService//service for getting rooms
        .getRoom_facilityfloor(floor, facility, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.RoomList = data;
          this.RoomKey = "";
        });
    }
    else {
      this.ZoneKey = "";
      this.RoomTypeKey = "";
      this.RoomKey = "";
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
      this.getZoneRoomTypeRoom(this.FloorKey, this.FacilityKey);
    }
  }
  getRoom(roomtype, zone, facility, floor) {//get room based on zone,facility,floor,roomtype
    if (roomtype && zone && facility && floor) {
      this.WorkOrderServiceService
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
  //function called to view wo while applying filter
  viewWO_Filter() {
    if ((this.todate) && (this.convert_DT(this.ondate) > this.convert_DT(this.todate))) {
      alert("Please check your start date!");

    }
    else {
      var fac_key;
      var floor_key;
      var zone_key;
      var roomtype_key;
      var room_key;
      var WOS_key;
      var batch_key;
      var em_key;
      var wot_key;
      var from_date;
      var to_date;
      this.loading = true;
      if (!this.FacilityKey) {
        fac_key = null;

      }
      else {
        fac_key = this.FacilityKey
      }
      if (!this.FloorKey) {
        floor_key = null;

      }
      else {
        floor_key = this.FloorKey
      }
      if (!this.ZoneKey) {
        zone_key = null;

      }
      else {
        zone_key = this.ZoneKey
      }
      if (!this.RoomTypeKey) {
        roomtype_key = null;

      }
      else {
        roomtype_key = this.RoomTypeKey
      }
      if (!this.RoomKey) {
        room_key = null;

      }
      else {
        room_key = this.RoomKey
      }
      if (!this.BatchScheduleNameKey) {
        batch_key = null;

      }
      else {
        batch_key = this.BatchScheduleNameKey
      }
      if (!this.WorkorderStatusKey) {
        WOS_key = null;

      }
      else {
        WOS_key = this.WorkorderStatusKey
      }
      if (!this.EmployeeKey) {
        em_key = null;

      }
      else {
        em_key = parseInt(this.EmployeeKey);
      }
      if (!this.WorkorderTypeKey) {
        wot_key = null;

      }
      else {
        wot_key = this.WorkorderTypeKey;
      }
      if (!this.ondate) {
        from_date = this.convert_DT(new Date());

      }
      else {
        from_date = this.convert_DT(this.ondate);
      }
      if (!this.todate) {
        to_date = from_date;

      }
      else {
        to_date = this.convert_DT(this.todate);
      }
      this.viewWorkOrder = {
        manager: this.employeekey,
        workorderStatusKey: WOS_key,
        workorderDate: from_date,
        workorderDate2: to_date,
        facilitykey: fac_key,
        roomTypeKey: roomtype_key,
        roomKey: room_key,
        zoneKey: zone_key,
        employeeKey: em_key,
        workorderTypeKey: wot_key,
        batchScheduleNameKey: batch_key,
        OrganizationID: this.OrganizationID,
        floorKey: floor_key
      };
      this.WorkOrderServiceService//service called to view batchworkorder on filter
        .getBatchWoFilter(this.viewWorkOrder)
        .subscribe((data: any[]) => {
          this.workorderList = data;
          this.showHide2 = false;
          this.showHide1 = false;
          this.loading = false;

        });
    }
  }
  //function called on search
  searchBatchWo(search_value) {
    var value = search_value.trim();
    var fac_key;
    var floor_key;
    var zone_key;
    var roomtype_key;
    var room_key;
    var WOS_key;
    var batch_key;
    var em_key;
    var wot_key;
    var from_date;
    var to_date;
    if (!this.FacilityKey) {
      fac_key = null;

    }
    else {
      fac_key = this.FacilityKey
    }
    if (!this.FloorKey) {
      floor_key = null;

    }
    else {
      floor_key = this.FloorKey
    }
    if (!this.ZoneKey) {
      zone_key = null;

    }
    else {
      zone_key = this.ZoneKey
    }
    if (!this.RoomTypeKey) {
      roomtype_key = null;

    }
    else {
      roomtype_key = this.RoomTypeKey
    }
    if (!this.RoomKey) {
      room_key = null;

    }
    else {
      room_key = this.RoomKey
    }
    if (!this.BatchScheduleNameKey) {
      batch_key = null;

    }
    else {
      batch_key = this.BatchScheduleNameKey
    }
    if (!this.WorkorderStatusKey) {
      WOS_key = null;

    }
    else {
      WOS_key = this.WorkorderStatusKey
    }
    if (!this.EmployeeKey) {
      em_key = null;

    }
    else {
      em_key = this.EmployeeKey;
    }
    if (!this.WorkorderTypeKey) {
      wot_key = null;

    }
    else {
      wot_key = this.WorkorderTypeKey;
    }
    if (!this.ondate) {
      from_date = this.convert_DT(new Date());

    }
    else {
      from_date = this.convert_DT(this.ondate);
    }
    if (!this.todate) {
      to_date = from_date;

    }
    else {
      to_date = this.convert_DT(this.todate);
    }
    this.searchWorkorder = {
      manager: this.employeekey,
      workorderStatusKey: WOS_key,
      workorderDate: from_date,
      workorderDate2: to_date,
      facilitykey: fac_key,
      roomTypeKey: roomtype_key,
      roomKey: room_key,
      zoneKey: zone_key,
      employeekey: em_key,
      workorderTypeKey: wot_key,
      BatchScheduleNameKey: batch_key,
      OrganizationID: this.OrganizationID,
      floorKey: floor_key,
      searchWO: value
    };
    if (value.length >= 3) {//service called only when searchvalue length>3
      this.WorkOrderServiceService
        .search_Batch_WO(this.searchWorkorder)
        .subscribe((data: any[]) => {
          this.workorderList = data;
          this.showHide2 = false;
          this.showHide1 = false;
        });
    }
    else if (value.length == 0) {//if length=0 the previous table is displayed
      if ((value.length == 0) && (search_value.length == 0)) {
        this.loading = true;
      }
      var on_date = this.convert_DT(new Date());
      this.WorkOrderServiceService
        .getBatchworkorder(on_date, this.employeekey, this.pageno, this.items_perpage, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.workorderList = data;
          this.loading = false;
          if (this.workorderList[0].totalItems > this.items_perpage) {
            this.showHide2 = true;
            this.showHide1 = false;
          }
          else if (this.workorderList[0].totalItems <= this.items_perpage) {
            this.showHide2 = false;
            this.showHide1 = false;
          }
        });
    }
  }
  //function for deleting multiple batchworkorders checked
  deletebatchWorkOrdersPage() {

    var deletebatchWorkOrderList = [];
    var deletebatchWorkOrderString;

    if (this.checkValue.length > 0) {
      for (var j = 0; j < this.checkValue.length; j++) {
        if (this.checkValue[j] === true)
          deletebatchWorkOrderList.push(this.workorderKey[j]);
      }
      deletebatchWorkOrderString = deletebatchWorkOrderList.join(',');
    }
    this.deleteWO = {
      deletebatchWorkOrderString: deletebatchWorkOrderString,
      employeekey: this.employeekey,
      OrganizationID: this.OrganizationID
    };
    this.WorkOrderServiceService//service for deleting workorders
      .delete_batchWO(this.deleteWO)
      .subscribe((data: any[]) => {
        this.workorderList.workorderCheckValue = false;
        this.checkValue = [];
        this.checkflag = false;
        this.workorderKey = [];
        alert("Batch Work order deleted successfully");
        this.viewWO_Filter();
      });
  }
}
