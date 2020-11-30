import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../../service/inventory.service';
import { Inventory } from '../../../../model-class/Inventory';
import { Router } from "@angular/router";

import { Location } from '@angular/common';

@Component({
  selector: 'app-room-type-create',
  templateUrl: './room-type-create.component.html',
  styleUrls: ['./room-type-create.component.scss']
})
export class RoomTypeCreateComponent implements OnInit {
  metricValues: Inventory[];
  showField1: boolean = false;
  showField2: boolean = false;
  MetricTypeValue;
  MetricKey;
  x: Array<any>;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  RoomTypeName;

  numberValid(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

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

  constructor(private inventoryService: InventoryService, private router: Router, private _location: Location) { }

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

  addRoomType(MetricType, RoomTypeName, MetricTypeValue) {
    RoomTypeName = RoomTypeName.trim();

    this.inventoryService
      .checkRoomType(RoomTypeName, this.employeekey, this.OrganizationID).subscribe((data: Inventory[]) => {
        if (data.length > 0) {
          alert("Room Type already present");
        }
        else if (data.length == 0) {
          if (!RoomTypeName || !RoomTypeName.trim()) {
            alert("Enter RoomType Name!");
          }
          // } else if (!MetricType) {
          //   alert("Enter MetricType!");
          // } else if (!MetricTypeValue ) {
          //   alert("Enter MetricTypeValue!");
          // } 
          else {
            this.inventoryService.addRoomType(RoomTypeName, MetricTypeValue, MetricType, this.employeekey, this.OrganizationID).subscribe(res => {
              alert("RoomType created successfully");
              this._location.back();
            });
          }
        }
      });
  }
  ngOnInit() {
    this.MetricKey = "";
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;
    this.inventoryService
      .getMetricValues(this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.metricValues = data;
      });
  }
  goBack() {
    this._location.back();
  }

}
