import { Component, OnInit } from '@angular/core';
import { InspectionService } from '../../../service/inspection.service';
import { Inspection } from '../../../model-class/Inspection';
import { DatepickerOptions } from 'ng2-datepicker';
@Component({
  selector: 'app-createinspection',
  templateUrl: './createinspection.component.html',
  styleUrls: ['./createinspection.component.scss']
})
export class CreateinspectionComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  Building;
  Floor;
  Zone;
  Employee;
  RoomType;
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

  marked = false;
  templateName: Inspection[];
  auditor: Inspection[];
  employee: Inspection[];
  building: Inspection[];
  floors: Inspection[];
  zone: Inspection[];
  room: Inspection[];
  roomtype: Inspection[];
  facikey: Number;
  TemplateID;
  SupervisorKey;
  fromdate: Date;
  todate: Date;
  theCheckbox: any;
  time1: any;
  RoomKey;

  // adding properties and methods that will be used by the igxDatePicker

  public date: Date = new Date(Date.now());

  // private dayFormatter = new Intl.DateTimeFormat('en', { weekday: 'long' });
  // private monthFormatter = new Intl.DateTimeFormat('en', { month: 'long' });

  // public formatter = (_: Date) => {
  //   return `${this.dayFormatter.format(_)}, ${_.getDate()} ${this.monthFormatter.format(_)}, ${_.getFullYear()}`;
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
    addStyle: { 'font-size': '18px', 'width': '75%', 'border': '1px solid #ced4da', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };
  convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(- 2),
      day = ("0" + date.getDate()).slice(- 2);
    return [date.getFullYear(), mnth, day].join("-");
  };


  constructor(private inspectionService: InspectionService) { }

  selectFloorfromBuildings(facKey) {
    this.facikey = facKey;
    if (facKey) {
      this.inspectionService
        .getallFloorNames(facKey, this.OrganizationID)
        .subscribe((data: Inspection[]) => {

          this.floors = data;
        });
    }
    else {
      this.Floor = '';
    }
  }
  selectZoneRoomRoomtypefromFloor(flkey) {
    this.inspectionService
      .getallZones(this.facikey, flkey, this.OrganizationID)
      .subscribe((data: Inspection[]) => {

        this.zone = data;
      });
    this.inspectionService
      .getallRooms(this.facikey, flkey, this.OrganizationID)
      .subscribe((data: Inspection[]) => {

        this.room = data;
      });
    this.inspectionService
      .getallRoomType(this.facikey, flkey, this.OrganizationID)
      .subscribe((data: Inspection[]) => {

        this.roomtype = data;
      });
  }

  selectroomtypefromZone(Zone, Floor) {
    if (Zone) {
      if (Floor) {
        this.inspectionService
          .roomtypeByFacility_Floor_zone(this.Building, Floor, Zone, this.OrganizationID).subscribe((data: any[]) => {
            this.roomtype = data;
          });
        this.inspectionService
          .roomByFacility_Floor_zone(this.Building, Floor, Zone, this.OrganizationID).subscribe((data: any[]) => {
            this.room = data;
          });

      }
      else {
        this.inspectionService.roomtypeByFacility_Zone(this.Building, Zone, this.OrganizationID).subscribe((data: any[]) => {
          this.roomtype = data;

        });
        this.inspectionService.roomByFacility_Zone(this.Building, Zone, this.OrganizationID).subscribe((data: any[]) => {
          this.room = data;

        });
      }

    }
    else {
      this.selectZoneRoomRoomtypefromFloor(this.Floor);
      this.RoomType = '';
      this.RoomKey = '';
    }
  }

  // To get Rooms by applying different combination of filters. 
  selectroomfromRoomtype(RoomType, ZoneKey) {

    if (RoomType) {

      if (this.Floor) {
        if (ZoneKey) {
          this.inspectionService.roomByFacility_Floor_Zone_RoomType(this.Building, this.Floor, ZoneKey, RoomType, this.OrganizationID).subscribe((data: any[]) => {
            this.room = data;
          });

        }
        else {
          this.inspectionService.roomByFacility_Floor_RoomType(this.Building, this.Floor, RoomType, this.OrganizationID).subscribe((data: any[]) => {
            this.room = data;
          });

        }
      }
      else if (ZoneKey) {
        this.inspectionService.roomByFacility_Zone_RoomType(this.Building, ZoneKey, RoomType, this.OrganizationID).subscribe((data: any[]) => {
          this.room = data;
        });
      }
      else {
        this.inspectionService.roomByFacility_RoomType(this.Building, RoomType, this.OrganizationID).subscribe((data: any[]) => {
          this.room = data;
        });

      }

    }
  }
  createInspection() {


    var t = new Date();
    var t = new Date();
    var y = t.getFullYear();
    var m = t.getMonth();
    var d = t.getDate();
    var h = t.getHours();
    var mi = t.getMinutes();
    var s = t.getSeconds();

    var today_DT = this.convert_DT(new Date());
    //  this.Timetemp= new Date().getHours() + ':' + new Date().getMinutes();
    var p = "";
    p = today_DT + " " + h + ":" + mi + ":" + s;

    if (!this.Employee) {
      this.Employee = - 1;
    }
    if (!this.fromdate) {
      var dateFrom = this.convert_DT(new Date());
    }
    else {
      if (this.convert_DT(this.fromdate) < this.convert_DT(new Date())) {
        alert("Date can't be less than current date");
        return;
      } else {
        dateFrom = this.convert_DT(this.fromdate);
      }
    }
    if (!this.todate) {
      var date2 = dateFrom;
    }
    else {
      if (this.convert_DT(this.todate) < dateFrom) {
        alert("To date can't be less than start date");
        return;
      } else {
        date2 = this.convert_DT(this.todate);
      }
    }
    if (!this.TemplateID) {
      alert("Template Name is not provided");
    }
    else if (!this.Building) {
      alert("Building should be selected");
    }
    else if (!this.Floor) {
      alert("Floor should be provided");
    }
    else if (!this.RoomKey && !this.RoomType) {
      alert("Room or Room Type should be provided");
      return;
    }
    else if (!this.time1) {
      alert("Time should be provided");
    }
    else if (!(this.SupervisorKey)) {
      alert("Auditor should be provided");
    }
    else if (this.convert_DT(date2) < this.convert_DT(dateFrom)) {
      alert("Please check your start date!");
    }
    else {


      var q = this.time1.getHours();
      var q1 = this.time1.getMinutes();
      var newTime = q + ":" + q1;

      var roomlistObj = [];
      var roomlist = [];
      //  ;
      roomlistObj = this.room;
      var roomString;
      if (this.RoomKey) {
        roomString = this.RoomKey;
      }
      else {
        if (roomlistObj) {
          for (var j = 0; j < roomlistObj.length; j++) {
            roomlist.push(roomlistObj[j].RoomKey);
          }
          roomString = roomlist.join(',');
        }
        else {
          alert('Room has no value');
          return;
        }
      }
      this.RoomKey = roomString;
      if (roomlistObj.length === 0) {
        alert('Room is not provided');
        return;
      }


      this.inspectionService.createInspections(this.TemplateID, this.SupervisorKey, dateFrom, date2, this.theCheckbox, newTime, this.RoomKey, this.Employee, this.employeekey, this.OrganizationID, p).subscribe(res => {
        alert("Successfully Added");
        this.TemplateID = "";
        this.fromdate = null;
        this.todate = null;
        this.SupervisorKey = this.employeekey;
        this.Building = "";
        this.Floor = "";
        this.Zone = "";
        this.RoomKey = "";
        this.theCheckbox = false;
        this.marked = false;
        this.time1 = null;
        this.Employee = "";
        this.RoomType = "";
      });
    }
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

    this.fromdate = new Date();
    this.TemplateID = "";
    this.Building = "";
    this.Floor = "";
    this.Zone = "";
    this.RoomKey = "";
    this.Employee = "";
    this.RoomType = "";

    this.inspectionService
      .getTemplateName(this.employeekey, this.OrganizationID)
      .subscribe((data: Inspection[]) => {

        this.templateName = data;
      });
    this.inspectionService
      .getAuditorName(this.employeekey, this.OrganizationID)
      .subscribe((data: Inspection[]) => {

        this.auditor = data;
        this.SupervisorKey = this.employeekey;
      });
    this.inspectionService
      .getEmployeeName(this.employeekey, this.OrganizationID)
      .subscribe((data: Inspection[]) => {

        this.employee = data;
      });
    this.inspectionService
      .getBuildingName(this.employeekey, this.OrganizationID)
      .subscribe((data: Inspection[]) => {

        this.building = data;
      });
  }
  toggleVisibility(e) {
    if (e.target.checked) {
      this.marked = true;
    } else {
      this.marked = false;
    }
  }
}
