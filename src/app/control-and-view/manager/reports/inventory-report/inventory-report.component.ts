import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { InventoryService } from '../../../../service/inventory.service';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { ReportServiceService } from '../../../../service/report-service.service';
import { ExcelserviceService } from '../../../../service/excelservice.service';
import * as FileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
@Component({
  selector: 'app-inventory-report',
  templateUrl: './inventory-report.component.html',
  styleUrls: ['./inventory-report.component.scss']
})
export class InventoryReportComponent implements OnInit {
  loading;
  viewInventoryReport;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  FloorKey = null;
  ZoneKey = null;
  FloorTypeKey = null;
  RoomTypeKey = null;
  RoomKey = null;
  FacilityKey = null;

  building: any;
  FloorList: any;
  floorTypeList: any;
  zonelist: any;
  RoomTypeList: any;
  RoomList: any;

  bldgKey = null;
  flrKey = null;
  zoneKey = null;
  rTypeKey = null;
  rKey = null;
  flrTypeKey = null;

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

  public reportarray: Array<any> = [{
    Building: '', Floor: '', Zone: '', RoomType: '', FloorType: '', RoomName: '', Area: '', UnitofArea: ''
  }
  ];

  constructor(private formBuilder: FormBuilder, private inventoryService: InventoryService, private el: ElementRef, private ReportServiceService: ReportServiceService, private excelService: ExcelserviceService) { }

  getFloorDisp(facilityName) { // onchanging the building
    if (!facilityName) {
      facilityName = null;
    }
    this.bldgKey = facilityName;
    this.ReportServiceService
      .getAllFloor(facilityName, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.FloorList = data;
        this.FloorKey = "";
        this.ZoneKey = "";
        this.RoomTypeKey = "";
        this.FloorTypeKey = "";
        // this.RoomKey = "";
      });
    this.ReportServiceService
      .getAllZone(facilityName, null, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.zonelist = data;
        this.ZoneKey = "";
        this.RoomTypeKey = "";
        this.FloorTypeKey = "";
        // this.RoomKey = "";
      });
    this.ReportServiceService
      .getAllFloorType(facilityName, null, null, null, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.floorTypeList = data;
        this.FloorTypeKey = "";
      });
    this.ReportServiceService
      .getAllRoomType(facilityName, null, null, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.RoomTypeList = data;
        this.RoomTypeKey = "";
      });
  }

  getZoneRoomTypeRoom(floor, facility) { //on changing the floor
    this.bldgKey = facility;
    this.flrKey = floor;
    console.log("flr..." + floor + " ..... bldg" + facility + " ..... org" + this.OrganizationID);
    if (floor) {
      this.ReportServiceService
        .getAllZone(facility, floor, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.zonelist = data;
          this.ZoneKey = "";
          this.RoomTypeKey = "";
          this.FloorTypeKey = "";
          this.RoomKey = "";
        });
      this.ReportServiceService
        .getAllFloorType(facility, floor, null, null, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.floorTypeList = data;
          this.FloorTypeKey = "";
        });
      this.ReportServiceService
        .getAllRoomType(facility, floor, null, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.RoomTypeList = data;
          this.RoomTypeKey = "";
        });
      // this.ReportServiceService
      //   .getAllRooms(facility, floor, null, null, null, this.OrganizationID)
      //   .subscribe((data: any[]) => {
      //     this.RoomList = data;
      //     this.RoomKey = ""
      //   });
    }
    if (!(this.FloorKey)) {
      this.FloorKey = '';
      this.ZoneKey = '';
      this.RoomTypeKey = '';
      this.FloorTypeKey = '';
      this.RoomKey = '';
    }
  }

  getRoomTypeRoom(zone, facility, floor) {// on changing zone
    this.bldgKey = facility;
    this.flrKey = floor;
    this.zoneKey = zone;
    console.log("zone..." + zone + "flr ..... " + floor + " bldg..... " + facility + "org ..... " + this.OrganizationID);
    if (facility && floor && zone) {
      this.ReportServiceService
        .getAllRoomType(facility, floor, zone, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.RoomTypeList = data;
          this.RoomTypeKey = "";
        });
      // this.ReportServiceService
      //   .getAllRooms(facility, floor, zone, null, null, this.OrganizationID)
      //   .subscribe((data: any[]) => {
      //     this.RoomList = data;
      //     this.RoomKey = ""
      //   });
      this.ReportServiceService
        .getAllFloorType(facility, floor, zone, null, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.floorTypeList = data;
          this.FloorTypeKey = "";
        });
    }
    if (!(this.ZoneKey)) {
      this.ZoneKey = '';
      this.RoomTypeKey = '';
      this.FloorTypeKey = '';
      this.RoomKey = '';
    }
  }

  getRoomFromRoomtype(roomtype, zone, facility, floor) {// on changing roomtype
    this.bldgKey = facility;
    this.flrKey = floor;
    this.zoneKey = zone;
    this.rTypeKey = roomtype;
    console.log("rtype..." + roomtype + "zone ..... " + zone + "flr ..... " + floor + "bldg ..... " + facility + "org ..... " + this.OrganizationID);
    if (facility && floor && zone && roomtype) {
      // this.ReportServiceService
      //   .getAllRooms(facility, floor, zone, null, roomtype, this.OrganizationID)
      //   .subscribe((data: any[]) => {
      //     this.RoomList = data;
      //     this.RoomKey = ""
      //   });
    }
    if (!(facility)) {
      facility = null;
    }
    if (!(floor)) {
      floor = null;
    }
    if (!(zone)) {
      zone = null;
    }
    if (!(roomtype)) {
      roomtype = null;
    }
    this.ReportServiceService
      .getAllFloorType(facility, floor, zone, roomtype, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.floorTypeList = data;
        this.FloorTypeKey = "";
      });
  }
  getRoomFromFloortype(floortype, roomtype, zone, facility, floor) {// on changing floortype
    this.bldgKey = facility;
    this.flrKey = floor;
    this.zoneKey = zone;
    this.rTypeKey = roomtype;
    console.log("rtype..." + roomtype + "zone ..... " + zone + "flr ..... " + floor + "bldg ..... " + facility + "org ..... " + this.OrganizationID);
    if (facility && floor && zone && roomtype) {
      // this.ReportServiceService
      //   .getAllRooms(facility, floor, zone, floortype, roomtype, this.OrganizationID)
      //   .subscribe((data: any[]) => {
      //     this.RoomList = data;
      //     this.RoomKey = ""
      //   });
    }
    if (!(facility)) {
      facility = null;
    }
    if (!(floor)) {
      floor = null;
    }
    if (!(zone)) {
      zone = null;
    }
    if (!(roomtype)) {
      roomtype = null;
    }
  }
  generateInventoryReport(FacilityKey, FloorKey, ZoneKey, RoomTypeKey, FloorTypeKey, RoomKey) {
    this.loading = true;
    if (FacilityKey) {
      if (!FloorKey) {
        FloorKey = null;
      }
      if (!RoomTypeKey) {
        RoomTypeKey = null;
      }
      if (!ZoneKey) {
        ZoneKey = null;
      }
      if (!FloorTypeKey) {
        FloorTypeKey = null;
      }
      if (!RoomKey) {
        RoomKey = null;
      }

      this.ReportServiceService
        .generateInventoryReportService(FacilityKey, FloorKey, ZoneKey, RoomTypeKey, FloorTypeKey, RoomKey, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.viewInventoryReport = data;
          this.loading = false;
        });
    }
  }

  exportToExcel(): void {
    //export room table to excel
    if (this.viewInventoryReport) {
      for (var i = 0; i < this.viewInventoryReport.length; i++) {
        this.reportarray.splice(i, 1);
        var facname = (this.viewInventoryReport[i].FacilityName);
        var flrname = (this.viewInventoryReport[i].FloorName);
        var zname = (this.viewInventoryReport[i].ZoneName);
        var rtype = (this.viewInventoryReport[i].RoomType);
        var ftype = (this.viewInventoryReport[i].FloorTypeName);
        var room = (this.viewInventoryReport[i].RoomName);
        var area = (this.viewInventoryReport[i].Area);
        var unit = (this.viewInventoryReport[i].UnitOfArea);

        if (this.viewInventoryReport[i]) {
          this.reportarray.push({ Building: facname, Floor: flrname, Zone: zname, Roomtype: rtype, FloorType: ftype, RoomName: room, Area: area, UnitofArea: unit })
        }

      }
      // if (this.Roomflag) {
      // this.excelService.exportAsExcelFile(this.reportarray, 'Barcode_Report');
      var blob = new Blob([document.getElementById('exportable').innerHTML], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(blob, "Inventory Report.xls");
      // }
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
    this.FloorKey="";
    this.ZoneKey="";
    this.RoomTypeKey="";
    this.FloorTypeKey="";
    this.inventoryService
      .getallBuildingList(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.building = data;
        this.FacilityKey = "";
      });
  }
  checkBuilding(){
  
    if(!(this.FacilityKey)){
      this.viewInventoryReport=[];
    }
  }
}
