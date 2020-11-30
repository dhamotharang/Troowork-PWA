import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { InventoryService } from '../../../../service/inventory.service';
// import { Inventory } from '../../../../model-class/Inventory';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Location } from '@angular/common';

@Component({
  selector: 'app-equipment-edit',
  templateUrl: './equipment-edit.component.html',
  styleUrls: ['./equipment-edit.component.scss']
})
export class EquipmentEditComponent implements OnInit {
  equipKey$: Object;
  equipEditList;
  FloorKey;
  FacKey: Number;
  equipmentType;
  buildings;
  floors;
  equipTypeKey: Number;
  dept;
  equipName;
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

  constructor(private route: ActivatedRoute, private inventoryService: InventoryService, private router: Router, private _location: Location) {
    this.route.params.subscribe(params => this.equipKey$ = params.EquipKey);
  }

  selectFloorfromBuildings(facKey) {
    this.FacKey = facKey;
    this.FloorKey = "";
    this.inventoryService
      .getallFloorList(facKey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.floors = data;
      });
  }
  setEquipmentTypeKey(equipmentTypeKey) {
    this.equipTypeKey = equipmentTypeKey;
  }
  floorValueSet(floorKey) {
    this.FloorKey = floorKey;
  }
  updateEquipment(EquipmentName, EquipmentDescription, EquipmentBarcode) {
    if (!(EquipmentName) || !(EquipmentName.trim())) {
      alert("Please Enter Equipment Name!");
      return;
    }
    if (!EquipmentBarcode) {
      alert("Please Enter Equipment Barcode!");
      return;
    }
    if (!this.equipTypeKey) {
      alert("Equipment Type is not provided");
    } else if (!EquipmentName) {
      alert("Equipment Name is not provided");
    } else if (!EquipmentBarcode) {
      alert("Equipment Barcode is not provided");
    } else if (!this.FacKey) {
      alert("Building is not provided");
    } else if (!this.FloorKey) {
      alert("Floor is not provided");
    } else {
      EquipmentName = EquipmentName.trim();
      if (!(EquipmentDescription) || !(EquipmentName.trim())) {
        EquipmentDescription = EquipmentDescription;
      }
      else {
        EquipmentDescription = EquipmentDescription.trim();
      }

      if (this.equipName != EquipmentName) {
        this.inventoryService.checkForNewEquipment(this.equipTypeKey, EquipmentName, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
          this.dept = data;
          if (this.dept[0].count > 0) {
            alert("Equipment already present");
          }
          else if (this.dept[0].count == 0) {

            this.inventoryService.updateEquipment(EquipmentName, EquipmentDescription, EquipmentBarcode, this.equipTypeKey, this.FacKey, this.FloorKey, this.equipKey$, this.employeekey, this.OrganizationID)
              .subscribe(res => {
                alert("Equipment updated successfully");
                this._location.back();
              });
          }

        });
      } else {

        this.inventoryService.updateEquipment(EquipmentName, EquipmentDescription, EquipmentBarcode, this.equipTypeKey, this.FacKey, this.FloorKey, this.equipKey$, this.employeekey, this.OrganizationID)
          .subscribe(res => {
            alert("Equipment updated successfully");
            this._location.back();
          });
      }
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
      .EditEquipmentAutoGenerate(this.equipKey$, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.equipEditList = data[0];
        this.equipName = data[0].EquipmentName;
        this.FacKey = data[0].FacilityKey;
        this.equipTypeKey = data[0].EquipmentTypeKey;
        console.log("...  facKey:" + this.FacKey);
        this.inventoryService
          .getallFloorList(data[0].FacilityKey, this.OrganizationID)
          .subscribe((data: any[]) => {
            this.floors = data;
            if (data.length > 0) { this.FloorKey = data[0].FloorKey; }
          });
      });
    this.inventoryService
      .getAllEquipmentType(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.equipmentType = data;
      });

    this.inventoryService
      .getallBuildingList(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.buildings = data;
      });

  }
  goBack() {
    this._location.back();
  }

}
