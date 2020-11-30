import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { workorder } from '../../../../model-class/work-order';
import { WorkOrderServiceService } from '../../../../service/work-order-service.service';
import { DatepickerOptions } from 'ng2-datepicker';//for datepicker
@Component({
  selector: 'app-view-work-orders',
  templateUrl: './view-work-orders.component.html',
  styleUrls: ['./view-work-orders.component.scss']
})
export class ViewWorkOrdersComponent implements OnInit {
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
  //adding datepicker options
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
  loading: boolean;// loading
  EmployeeOption: workorder[];
  facilitylist: workorder[];
  scheduleList: workorder[];
  FloorList: workorder[];
  zonelist: workorder[];
  RoomTypeList: workorder[];
  workStatusList: workorder[];
  workorderTypeList;
  RoomList: workorder[];
  emp_key: number;
  org_id: number;
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
  DeleteWOList: workorder[];
  deleteWO;
  searchWorkorder;
  role: String;
  name: String;
  IsSupervisor: Number;
  pageno: Number = 1;
  items_perpage: Number = 25;
  showHide1: boolean;
  showHide2: boolean;
  pagination: Number;
  searchform: FormGroup;
  workorderCheckValue;
  checkflag: boolean;
  genFlag;
  SearchWo;
  KeepActiveFlag = 0;
  //code for special character restriction
  regexStr = '^[a-zA-Z0-9_ ]*$';
  @Input() isAlphaNumeric: boolean;

  latitude;
  longitude;
  basicModal1;

  constructor(private formBuilder: FormBuilder, private WorkOrderServiceService: WorkOrderServiceService, private el: ElementRef) { }
  //function for token decoding
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
  //

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
  //code for pagination
  previousPage() {
    // var on_date = this.convert_DT(new Date());
    this.pageno = +this.pageno - 1;
    // this.WorkOrderServiceService
    //   .getworkorder(on_date, this.emp_key, this.pageno, this.items_perpage, this.org_id)
    //   .subscribe((data: any[]) => {
    //     this.workorderList = data;
    //     for (var i = 0; i < this.workorderList.length; i++) {
    //       this.workorderList[i].workorderCheckValue = false;
    //     }
    this.loading = true;
    this.showHide1 = false;
    this.showHide2 = false;

    var fac_key;
    var floor_key;
    var zone_key;
    var roomtype_key;
    var room_key;
    var batch_key;
    var WOS_key;
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

    if (this.SearchWo) {
      var SearchWO = this.SearchWo.trim();
      if (SearchWO.length < 3) {
        SearchWO = null;
        this.SearchWo = null;
      }
    }
    else {
      SearchWO = null;
    }

    this.viewWorkOrder = {
      manager: this.emp_key,
      workorderStatusKey: WOS_key,
      workorderDate: from_date,
      workorderDate2: to_date,
      facilitykey: fac_key,
      roomTypeKey: roomtype_key,
      floorKey: floor_key,
      roomKey: room_key,
      zoneKey: zone_key,
      employeeKey: em_key,
      workorderTypeKey: wot_key,
      BatchScheduleNameKey: batch_key,
      OrganizationID: this.org_id,
      SearchWO: SearchWO,
      itemsPerPage: this.items_perpage,
      pageNo: this.pageno,
      keepactivef:this.KeepActiveFlag
    };
    this.WorkOrderServiceService//service for viewing wo when filter is applied
      .getWoFilter_pagination(this.viewWorkOrder)
      .subscribe((data: any[]) => {
        this.workorderList = data;
        this.loading = false;
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
    // var on_date = this.convert_DT(new Date());
    this.pageno = +this.pageno + 1;
    // this.WorkOrderServiceService
    //   .getworkorder(on_date, this.emp_key, this.pageno, this.items_perpage, this.org_id)
    //   .subscribe((data: any[]) => {
    //     this.workorderList = data;
    //     for (var i = 0; i < this.workorderList.length; i++) {
    //       this.workorderList[i].workorderCheckValue = false;
    //     }
    this.loading = true;
    this.showHide1 = false;
    this.showHide2 = false;

    var fac_key;
    var floor_key;
    var zone_key;
    var roomtype_key;
    var room_key;
    var batch_key;
    var WOS_key;
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

    if (this.SearchWo) {
      var SearchWO = this.SearchWo.trim();
      if (SearchWO.length < 3) {
        SearchWO = null;
        this.SearchWo = null;
      }
    }
    else {
      SearchWO = null;
    }

    this.viewWorkOrder = {
      manager: this.emp_key,
      workorderStatusKey: WOS_key,
      workorderDate: from_date,
      workorderDate2: to_date,
      facilitykey: fac_key,
      roomTypeKey: roomtype_key,
      roomKey: room_key,
      zoneKey: zone_key,
      employeeKey: em_key,
      workorderTypeKey: wot_key,
      BatchScheduleNameKey: batch_key,
      OrganizationID: this.org_id,
      floorKey: floor_key,
      SearchWO: SearchWO,
      itemsPerPage: this.items_perpage,
      pageNo: this.pageno,
      keepactivef:this.KeepActiveFlag
    };
    this.WorkOrderServiceService//service for viewing wo when filter is applied
      .getWoFilter_pagination(this.viewWorkOrder)
      .subscribe((data: any[]) => {
        this.workorderList = data;
        this.loading = false;
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
    this.emp_key = profile.employeekey;
    this.org_id = profile.OrganizationID;
    this.domain_name = 'workstatus';
    var on_date = this.convert_DT(new Date());
    this.WorkorderTypeKey = "";
    this.FacilityKey = "";
    this.FloorKey = "";
    this.ZoneKey = "";
    this.RoomTypeKey = "";
    this.RoomKey = "";
    this.EmployeeKey = "";
    this.WorkorderStatusKey = "";
    this.BatchScheduleNameKey = "";
    this.ondate = new Date(Date.now());
    this.genFlag = 0;
    this.KeepActiveFlag = 0;
    this.WorkOrderServiceService//service for getting facility names
      .getallFacility(this.emp_key, this.org_id)
      .subscribe((data: any[]) => {
        this.facilitylist = data;
      });
    this.WorkOrderServiceService//service for getting employee names
      .getallEmployeeName(this.emp_key, this.org_id)
      .subscribe((data: any[]) => {
        this.EmployeeOption = data;
      });
    this.WorkOrderServiceService//service for getting all schedule names
      .getallScheduleName(this.emp_key, this.org_id)
      .subscribe((data: any[]) => {
        this.scheduleList = data;
      });
    this.WorkOrderServiceService//service for getting all workstatus
      .getallworkStatus(this.domain_name, this.emp_key, this.org_id)
      .subscribe((data: any[]) => {
        this.workStatusList = data;
      });
    this.WorkOrderServiceService//service for getting all workordertype list
      .getallworkorderType(this.emp_key, this.org_id)
      .subscribe((data: any[]) => {
        this.workorderTypeList = data;
      });
    // this.WorkOrderServiceService//service for getting currentday workorders on pageload
    //   .getworkorder(on_date, this.emp_key, this.pageno, this.items_perpage, this.org_id)
    //   .subscribe((data: any[]) => {
    //     this.workorderList = data;
    //     this.loading = false;
    //     for (var i = 0; i < this.workorderList.length; i++) {
    //       this.workorderList[i].workorderCheckValue = false;
    //     }
    //     if (this.workorderList[0].totalItems > this.items_perpage) {
    //       this.showHide2 = true;
    //       this.showHide1 = false;
    //     }
    //     else if (this.workorderList[0].totalItems <= this.items_perpage) {
    //       this.showHide2 = false;
    //       this.showHide1 = false;
    //     }
    //   });
    this.viewWO_Filter();

    this.searchform = this.formBuilder.group({
      SearchWo: ['', Validators.required]
    });

  }

  genFlagActivate() {
    this.genFlag = 1;
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
        .getallFloor(facilityName, this.org_id)
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
    else {
      this.ZoneKey = "";
      this.RoomTypeKey = "";
      this.RoomKey = "";
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
  //function called when filter is applied
  viewWO_Filter() {
    if ((this.todate) && (this.convert_DT(this.ondate) > this.convert_DT(this.todate))) {
      alert("Please check your start date!");

    }
    else {
      this.loading = true;
      this.showHide1 = false;
      this.showHide2 = false;

      var fac_key;
      var floor_key;
      var zone_key;
      var roomtype_key;
      var room_key;
      var batch_key;
      var WOS_key;
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

      if (this.SearchWo) {
        var SearchWO = this.SearchWo.trim();
        if (SearchWO.length < 3) {
          SearchWO = null;
          this.SearchWo = null;
        }
      }
      else {
        SearchWO = null;
      }

      this.pageno = 1;

      this.viewWorkOrder = {
        manager: this.emp_key,
        workorderStatusKey: WOS_key,
        workorderDate: from_date,
        workorderDate2: to_date,
        facilitykey: fac_key,
        roomTypeKey: roomtype_key,
        roomKey: room_key,
        zoneKey: zone_key,
        employeeKey: em_key,
        workorderTypeKey: wot_key,
        BatchScheduleNameKey: batch_key,
        OrganizationID: this.org_id,
        floorKey: floor_key,
        SearchWO: SearchWO,
        itemsPerPage: this.items_perpage,
        pageNo: this.pageno,
        keepactivef:this.KeepActiveFlag
      };
      this.WorkOrderServiceService//service for viewing wo when filter is applied
        .getWoFilter_pagination(this.viewWorkOrder)
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
    }
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
  //function called on search
  // searchworkType_emp_room(search_value) {
  //   var value = search_value.trim();
  //   var fac_key;
  //   var floor_key;
  //   var zone_key;
  //   var roomtype_key;
  //   var room_key;
  //   var batch_key;
  //   var WOS_key;
  //   var em_key;
  //   var wot_key;
  //   var from_date;
  //   var to_date;
  //   if (!this.FacilityKey) {
  //     fac_key = null;

  //   }
  //   else {
  //     fac_key = this.FacilityKey
  //   }
  //   if (!this.FloorKey) {
  //     floor_key = null;

  //   }
  //   else {
  //     floor_key = this.FloorKey
  //   }
  //   if (!this.ZoneKey) {
  //     zone_key = null;

  //   }
  //   else {
  //     zone_key = this.ZoneKey
  //   }
  //   if (!this.RoomTypeKey) {
  //     roomtype_key = null;

  //   }
  //   else {
  //     roomtype_key = this.RoomTypeKey
  //   }
  //   if (!this.RoomKey) {
  //     room_key = null;

  //   }
  //   else {
  //     room_key = this.RoomKey
  //   }
  //   if (!this.BatchScheduleNameKey) {
  //     batch_key = null;

  //   }
  //   else {
  //     batch_key = this.BatchScheduleNameKey
  //   }
  //   if (!this.WorkorderStatusKey) {
  //     WOS_key = null;

  //   }
  //   else {
  //     WOS_key = this.WorkorderStatusKey
  //   }
  //   if (!this.EmployeeKey) {
  //     em_key = null;

  //   }
  //   else {
  //     em_key = this.EmployeeKey;
  //   }
  //   if (!this.WorkorderTypeKey) {
  //     wot_key = null;

  //   }
  //   else {
  //     wot_key = this.WorkorderTypeKey;
  //   }
  //   if (!this.ondate) {
  //     from_date = this.convert_DT(new Date());

  //   }
  //   else {
  //     from_date = this.convert_DT(this.ondate);
  //   }
  //   if (!this.todate) {
  //     to_date = from_date;

  //   }
  //   else {
  //     to_date = this.convert_DT(this.todate);
  //   }

  //   this.searchWorkorder = {
  //     manager: this.emp_key,
  //     workorderStatusKey: WOS_key,
  //     workorderDate: from_date,
  //     workorderDate2: to_date,
  //     facilitykey: fac_key,
  //     roomTypeKey: roomtype_key,
  //     roomKey: room_key,
  //     zoneKey: zone_key,
  //     employeekey: em_key,
  //     workorderTypeKey: wot_key,
  //     BatchScheduleNameKey: batch_key,
  //     OrganizationID: this.org_id,
  //     floorKey: floor_key,
  //     searchWO: value
  //   };
  //   if (value.length >= 3) {//service called only when searchvalue length>3
  //     this.WorkOrderServiceService
  //       .search_WO(this.searchWorkorder)
  //       .subscribe((data: any[]) => {

  //         this.workorderList = data;
  //         this.showHide2 = false;
  //         this.showHide1 = false;
  //       });
  //   }
  //   else if (value.length == 0) {//if length=0 the previous table is displayed
  //     if ((value.length == 0) && (search_value.length == 0)) {
  //       this.loading = true;
  //     }
  //     var on_date = this.convert_DT(new Date());
  //     this.WorkOrderServiceService
  //       .getworkorder(on_date, this.emp_key, this.pageno, this.items_perpage, this.org_id)
  //       .subscribe((data: any[]) => {
  //         this.workorderList = data;
  //         this.loading = false;
  //         if (this.workorderList[0].totalItems > this.items_perpage) {
  //           this.showHide2 = true;
  //           this.showHide1 = false;
  //         }
  //         else if (this.workorderList[0].totalItems <= this.items_perpage) {
  //           this.showHide2 = false;
  //           this.showHide1 = false;
  //         }
  //       });

  //   }
  // }

  //function for deleting multiple workorders checked
  deleteWorkOrdersPage() {

    var deleteWorkOrderList = [];
    var deleteWorkOrderString;

    if (this.checkValue.length > 0) {
      for (var j = 0; j < this.checkValue.length; j++) {
        if (this.checkValue[j] === true)
          deleteWorkOrderList.push(this.workorderKey[j]);
      }
      deleteWorkOrderString = deleteWorkOrderList.join(',');
    }
    this.deleteWO = {
      deleteWorkOrderString: deleteWorkOrderString,
      employeekey: this.emp_key,
      OrganizationID: this.org_id
    };
    this.WorkOrderServiceService//service for deleting workorders
      .delete_WO(this.deleteWO)
      .subscribe((data: any[]) => {
        this.workorderList.workorderCheckValue = false;
        this.checkValue = [];
        this.checkflag = false;
        this.workorderKey = [];
        alert("Work order deleted successfully");
        this.viewWO_Filter();

      });
  }

  passGpsValue(Latitude, Longitude) {

    this.latitude = parseFloat(Latitude);
    this.longitude = parseFloat(Longitude);

  }

  canceltheWorkorder(woKey) {

    var reason = prompt("Enter the reason for cancelling the workorder...");

    var t = new Date();
    var t = new Date();
    var y = t.getFullYear();
    var m = t.getMonth();
    var d = t.getDate();
    var h = t.getHours();
    var mi = t.getMinutes();
    var s = t.getSeconds();
    console.log(reason);

    var today_DT = this.convert_DT(new Date());
    var p = "";
    p = today_DT + " " + h + ":" + mi + ":" + s;

    if ((reason.trim())) {
      this.WorkOrderServiceService
        .setCancelWorkorder(woKey, reason, today_DT, p, this.emp_key, this.org_id)
        .subscribe((data: any[]) => {
          alert("Selected workorder has been cancelled");
          this.viewWO_Filter();
        });
    }
  }
}
