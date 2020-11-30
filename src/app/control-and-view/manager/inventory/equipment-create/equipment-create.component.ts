import { Component, OnInit } from '@angular/core';
// import { Inventory } from '../../../../model-class/Inventory';
import { InventoryService } from '../../../../service/inventory.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { Location } from '@angular/common';

@Component({
  selector: 'app-equipment-create',
  templateUrl: './equipment-create.component.html',
  styleUrls: ['./equipment-create.component.scss']
})
export class EquipmentCreateComponent implements OnInit {
  dept;
  equipmentType;
  buildings;
  floors;
  FacKey: Number;
  EquipmentTypeDescription: String;
  barcode;
  FloorKey;
  FacilityKey;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  EquipmentTypeKey;
  EquipmentDescription; EquipmentName;
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

  constructor(private fb: FormBuilder, private inventoryService: InventoryService, private router: Router, private _location: Location) {

  }

  selectFloorfromBuildings(facKey) {
    this.FacKey = facKey;
    if (facKey) {
      this.inventoryService
        .getallFloorList(facKey, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.floors = data;
        });
    }
    else {
      this.FloorKey = '';
    }
  }
  floorValueSet(floorKey) {
    this.FloorKey = floorKey;
  }
  addEquipment(EquipmentName, EquipmentDescription, Barcode, EquipmentTypeKey) {

    if (!(EquipmentName) || !(EquipmentName.trim())) {
      alert("Please Enter Equipment Name!");
      return;
    }
    if (EquipmentTypeKey == '--Select--') {
      alert("Equipment Type Name is not provided");
      return;
    }
    if (!EquipmentTypeKey) {
      alert("Equipment Type Name is not provided");
    } else if (!EquipmentName) {
      alert("Equipment Name is not provided");
    } else if (!Barcode) {
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
      this.inventoryService.checkForNewEquipment(EquipmentTypeKey, EquipmentName, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
        this.dept = data;
        if (this.dept[0].count > 0) {
          alert("Equipment already present");
        }
        else if (this.dept[0].count == 0) {
          this.inventoryService.checkForNewEquipmentbarcode(Barcode, this.OrganizationID).subscribe((data: any[]) => {
            this.dept = data;
            if (this.dept[0].count > 0) {
              alert("Equipment Barcode already present");
            } else if (this.dept[0].count == 0) {
              this.inventoryService.addEquipment(EquipmentName, EquipmentDescription, Barcode, EquipmentTypeKey, this.FacKey, this.FloorKey, this.employeekey, this.OrganizationID)
                .subscribe(res => {
                  alert("Equipment created successfully");
                  this._location.back();
                });
            }
          });
        }
      });
    }
  }

  ngOnInit() {
    this.EquipmentTypeKey = "";
    this.FacilityKey = "";
    this.FloorKey = "";
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;

    this.inventoryService
      .getAllEquipmentType(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.equipmentType = data;
      });
    this.inventoryService
      .getBarcodeForEquipment(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.barcode = data[0];
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
