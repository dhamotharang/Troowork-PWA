import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { InventoryService } from '../../../../service/inventory.service';
// import { Inventory } from '../../../../model-class/Inventory';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Location } from '@angular/common';

@Component({
  selector: 'app-room-type-update',
  templateUrl: './room-type-update.component.html',
  styleUrls: ['./room-type-update.component.scss']
})
export class RoomTypeUpdateComponent implements OnInit {
  rTypeKey$: Object;
  metricTypeList;
  metricType: String;
  metricTypeKey: Number;
  roomTypeList;
  showField1: boolean = false;
  showField2: boolean = false;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  MetricTypeValue;
  roomtypeval;
  metricType1;
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


  numberValid(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  constructor(private route: ActivatedRoute, private inventoryService: InventoryService, private router: Router, private _location: Location) {
    this.route.params.subscribe(params => this.rTypeKey$ = params.RoomTypeKey);
  }

  showFields(metricType) {
    {
      if (!metricType) {
        this.showField1 = false;
        this.showField2 = false;
      } else if (metricType === 'Default') {
        this.MetricTypeValue = 1;
        this.showField1 = false;
        this.showField2 = true;
      } else if (metricType === 'Custom') {
        this.MetricTypeValue = null;
        this.showField1 = false;
        this.showField2 = true;
      } else if (metricType === 'Minutes Per') {
        this.MetricTypeValue = null;
        this.showField1 = false;
        this.showField2 = true;
      }
    }
  }
  updateRoomType(RoomTypeName, MetricTypeValue1) {

    if (!this.metricType || this.metricType == "--Select--") {
      this.metricType = null;
      alert("Select a metric type !");
    }
    else if (!RoomTypeName || !RoomTypeName.trim()) {
      RoomTypeName = null;
      alert("RoomTypeName is not provided !");
    }
    else if (this.metricType != 'Default' && !MetricTypeValue1.trim()) {
      MetricTypeValue1 = null;
      alert("MetricTypeValue is not provided !");
    }
    // else if (MetricTypeValue1 && !MetricTypeValue1.trim()) {
    //   MetricTypeValue1 = null;
    //   alert("MetricTypeValue is not provided !");
    // }
    else {
      RoomTypeName = RoomTypeName.trim();
      this.inventoryService
        .getMetricValues(this.OrganizationID)
        .subscribe((data: any[]) => {
          this.metricTypeList = data;
          for (let i of this.metricTypeList) {
            if (i.MetricType === this.metricType) {
              this.metricTypeKey = i.MetricTypeKey;
            }
          }
        });
      // if (this.roomtypeval != RoomTypeName) {
      this.inventoryService.CheckRoomType(RoomTypeName, 'roomtype', this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
        if (data.length > 0) {
          alert("Room Type already present !");
          return;
        }
        else {
          this.inventoryService.updateRoomType(this.rTypeKey$, this.metricTypeKey, this.metricType, RoomTypeName, MetricTypeValue1, this.employeekey, this.OrganizationID)
            .subscribe(res => {
              alert("RoomType updated successfully");
              this._location.back();
            });
        }
      });
      // }
      // else {
      //   if (this.MetricTypeValue == MetricTypeValue1 && this.metricType == this.metricType1) {
      //     alert("No changes are made");
      //   } else {
      //     this.inventoryService.updateRoomType(this.rTypeKey$, this.metricTypeKey, this.metricType, RoomTypeName, MetricTypeValue1, this.employeekey, this.OrganizationID)
      //       .subscribe(res => {
      //         alert("RoomType updated successfully");
      //         this._location.back();
      //       });
      //   }
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

    this.inventoryService
      .EditRoomtTypeAutoGenerate(this.rTypeKey$, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.roomTypeList = data[0];
        this.roomtypeval = data[0].RoomTypeName;
        // this.MetricTypeValue = data[0].MetricTypeValue;
        this.MetricTypeValue = '1';
        // this.metricType = data[0].MetricType;
        this.metricType = 'default';
        this.metricType1 = data[0].MetricType;
        this.inventoryService
          .getMetricValues(this.OrganizationID)
          .subscribe((data: any[]) => {
            this.metricTypeList = data;
          });
      });
  }
  goBack() {
    this._location.back();
  }
}
