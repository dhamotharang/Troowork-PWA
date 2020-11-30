import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Reports } from '../../../../model-class/reports';
import { ReportServiceService } from '../../../../service/report-service.service';
import { ExcelserviceService } from '../../../../service/excelservice.service';

import * as FileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
@Component({
  selector: 'app-barcode-report',
  templateUrl: './barcode-report.component.html',
  styleUrls: ['./barcode-report.component.scss']
})
export class BarcodeReportComponent implements OnInit {
  loading: boolean;// loading
  Roomflag: any;
  Equipmentflag: any;
  facilitylist: Reports[];
  equipmenttypelist: Reports[];
  equipment: Reports[];
  floor: Reports[];
  zoneroom: Reports[];
  room: Reports[];
  viewBarcodeReport: Reports[];
  viewBarcodeEquipment: Reports[];

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

  FacilityKey;
  FloorKey;
  ZoneKey;
  RoomTypeKey;
  EquipmentTypeKey;
  EquipmentKey;
  newArray;

  public reportarray: Array<any> = [{
    RoomName: '', Barcode: '', Building: '', Floor: '', Zone: '', Roomtype: ''
  }
  ];

  public reportarray1: Array<any> = [{
    EquipmentName: '', Barcode: '', EquipmentType: ''
  }
  ];
  barcode: FormGroup;
  constructor(private fb: FormBuilder, private ReportServiceService: ReportServiceService, private excelService: ExcelserviceService) {
    this.barcode = fb.group({
      FacilityKey: ['', Validators.required],
      FacilityText: ['', Validators.required],
      EquipmentTypeKey: ['', Validators.required],
      EquipmentTypeText: ['', Validators.required],
      EquipmentTypeDescription: ['', Validators.required]

    });
  }
  ngOnInit() {
    this.FacilityKey = "";
    this.FloorKey = "";
    this.ZoneKey = "";
    this.RoomTypeKey = "";
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

    this.ReportServiceService
      .getBarcodeReport(this.employeekey, this.OrganizationID)
      .subscribe((data: Reports[]) => {
        this.facilitylist = data;
      });

    this.ReportServiceService.getEquipmentType(this.employeekey, this.OrganizationID)
      .subscribe((data: Reports[]) => {
        this.newArray = data.slice(0); //clone the array, or you'll end up with a new "None" option added to your "values" array on every digest cycle.
        this.newArray.unshift({ EquipmentTypeText: "Select All", EquipmentTypeKey: "-99" });
        this.equipmenttypelist = this.newArray;
        this.EquipmentTypeKey = "";
      });

    this.ReportServiceService
      .getEquipment(this.employeekey, this.OrganizationID)
      .subscribe((data: Reports[]) => {
        this.equipment = data;
        this.EquipmentKey = "";
      });



  }

  getFloorDisp(key) {
    if(key){
    this.ReportServiceService.getFloor(key, this.OrganizationID)
      .subscribe((data: Reports[]) => {
        this.floor = data;
        this.FloorKey = "";
      });
    }
    else{
      this.FloorKey='';
    }
  }
  getequipments(eqtypekey) {
    this.ReportServiceService.geteq_values('equipments', eqtypekey, this.OrganizationID)
      .subscribe((data: Reports[]) => {
        this.equipment = data;
        this.EquipmentKey = "";
      });
  }
  generateBarcodeReport(FacilityKey, FloorKey, RoomTypeKey, ZoneKey, EquipmentTypeKey, EquipmentKey) {
    if (!this.FacilityKey && !this.EquipmentTypeKey && !this.EquipmentKey) {
      alert("Please choose any filter");
    }
    else {
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

        this.ReportServiceService
          .generateBarcodeReportService(FacilityKey, FloorKey, RoomTypeKey, ZoneKey, this.employeekey, this.OrganizationID)
          .subscribe((data: Reports[]) => {
            this.Roomflag = true;
            this.Equipmentflag = false;
            this.viewBarcodeReport = data;
            this.loading = false;
          });
      }
      if (EquipmentTypeKey) {
        if (!EquipmentKey) {
          EquipmentKey = null;
        }
        this.ReportServiceService
          .generateBarcodeByEqupimenttype(EquipmentKey, EquipmentTypeKey, this.employeekey, this.OrganizationID)
          .subscribe((data: Reports[]) => {
            this.Roomflag = false;
            this.Equipmentflag = true;
            this.viewBarcodeEquipment = data;
            this.loading = false;
          });
      }

      if (EquipmentKey) {
        this.ReportServiceService
          .generateBarcodeByEqupiment(EquipmentKey, EquipmentTypeKey, this.employeekey, this.OrganizationID)
          .subscribe((data: Reports[]) => {
            this.Roomflag = false;
            this.Equipmentflag = true;
            this.viewBarcodeEquipment = data;
            this.loading = false;
          });
      }
    }
  }


  getZoneRoom(floorkey, fkey) {

    this.ReportServiceService
      .getZone(fkey, floorkey, this.OrganizationID)
      .subscribe((data: Reports[]) => {
        this.zoneroom = data;
        this.ZoneKey = "";
      });

    this.ReportServiceService
      .getRoomtype(fkey, floorkey, this.OrganizationID)
      .subscribe((data: Reports[]) => {
        this.room = data;
        this.RoomTypeKey = "";
      });


  }
  zoneChange(){
    this.RoomTypeKey='';
    
  }


  //export to excel 
  exportToExcel(): void {
    //export room table to excel
    if (this.viewBarcodeReport) {
      for (var i = 0; i < this.viewBarcodeReport.length; i++) {
        this.reportarray.splice(i, 1);
        var room_id = (this.viewBarcodeReport[i].RoomId);
        var barcode = (this.viewBarcodeReport[i].Barcode1);
        var facname = (this.viewBarcodeReport[i].FacilityName);
        var flrname = (this.viewBarcodeReport[i].FloorName);
        var zname = (this.viewBarcodeReport[i].ZoneName);
        var rtype = (this.viewBarcodeReport[i].RoomType);

        if (this.viewBarcodeReport[i]) {
          this.reportarray.push({ RoomName: room_id, Barcode: barcode, Building: facname, Floor: flrname, Zone: zname, Roomtype: rtype })
        }

      }
      if (this.Roomflag) {
        // this.excelService.exportAsExcelFile(this.reportarray, 'Barcode_Report');
        var blob = new Blob([document.getElementById('exportable').innerHTML], {
          type: EXCEL_TYPE
      });
      FileSaver.saveAs(blob, "Room_Report.xls");
      }
    }

    //export equipment table to excel
    if (this.viewBarcodeEquipment) {
      for (var i = 0; i < this.viewBarcodeEquipment.length; i++) {
        this.reportarray.splice(i, 1);
        var eq_name = (this.viewBarcodeEquipment[i].EquipmentName);
        var barcode = (this.viewBarcodeEquipment[i].Barcode1);
        var eq_type = (this.viewBarcodeEquipment[i].EquipmentType);

        if (this.viewBarcodeEquipment[i]) {
          this.reportarray1.push({ EquipmentName: eq_name, Barcode: barcode, EquipmentType: eq_type })
        }
      }
      if (this.Equipmentflag) {
        // this.excelService.exportAsExcelFile(this.reportarray1, 'reportsample');
        var blob = new Blob([document.getElementById('exportable1').innerHTML], {
          type: EXCEL_TYPE
      });
      FileSaver.saveAs(blob, "Equipment_Report.xls");
      }
    }

  }
}