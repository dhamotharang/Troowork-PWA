import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../../service/inventory.service';
import { Inventory } from '../../../../model-class/Inventory';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
@Component({
  selector: 'app-zone-create',
  templateUrl: './zone-create.component.html',
  styleUrls: ['./zone-create.component.scss']
})
export class ZoneCreateComponent implements OnInit {
  building: Inventory[];
  floorName: Inventory[];
  FacilityKey;
  FloorName;
  ZoneName;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  FloorKey;
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

  addZone(FacilityKey, FloorName, ZoneName, FloorKey) {

    if (!(this.FacilityKey) || !(this.FacilityKey.trim())) {
      alert("Please Choose Building!");
      return;
    }
    if (!(this.FloorName) || !(this.FloorName.trim())) {
      alert("Please Choose Floor!");
      return;
    }
    if (!(this.ZoneName) || !(this.ZoneName.trim())) {
      alert("Please Enter Zone Name!");
      return;
    }

    this.ZoneName = this.ZoneName.trim();
    
    this.inventoryService.checkForZone(this.FacilityKey, this.FloorName, this.ZoneName, this.employeekey, this.OrganizationID).subscribe((data: Inventory[]) => {
      if (data.length > 0) {
        alert("Zone already present !");
      }
      else if (data.length == 0) {
        this.inventoryService.createZones(this.FacilityKey, this.FloorName, this.ZoneName, this.employeekey, this.OrganizationID)
          .subscribe((data: Inventory[]) => {
            alert("Zone created successfully");
            this._location.back();
          });
      }
    });


  }

  selectFloorfromBuildings(facKey) {
    this.inventoryService
      .getallFloorList(facKey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.floorName = data;
      });
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
      .getallBuildingList(this.employeekey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.building = data;
        this.FloorName = "";
        this.FacilityKey = "";
      });


  }
  goBack() {
    this._location.back();
  }
}
