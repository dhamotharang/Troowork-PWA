// @Author: Rodney
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { InventoryService } from '../../../../service/inventory.service';
import { Inventory } from '../../../../model-class/Inventory';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Location } from '@angular/common';

@Component({
  selector: 'app-zone-edit',
  templateUrl: './zone-edit.component.html',
  styleUrls: ['./zone-edit.component.scss']
})
export class ZoneEditComponent implements OnInit {
  facKey$: Object;
  floorKey$: Object;
  zoneKey$: Object;

  floorList: Inventory[] = [];
  buildingList: Inventory[] = [];
  zoneEditValues;
  zone: Inventory[];

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
    this.route.params.subscribe(params => this.facKey$ = params.Facility_Key);
    this.route.params.subscribe(params => this.floorKey$ = params.Floor_Key);
    this.route.params.subscribe(params => this.zoneKey$ = params.Zone_Key);
  }


  selectFloorfromBuildings(facKey) {
    this.inventoryService
      .getallFloorList(facKey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.floorList = data;
        this.zoneEditValues.FloorKey = "";
      });
  }

  updateZone(FacilityKey, FacilityName, FloorName, FloorKey, ZoneKey, ZoneName) {

    if (!(this.zoneEditValues.FacilityKey)) {
      alert("Please Choose Building!");
      return;
    }
    if (!(this.zoneEditValues.FloorKey)) {
      alert("Please Choose Floor!");
      return;
    }
    if (!(this.zoneEditValues.ZoneName) || !(this.zoneEditValues.ZoneName.trim())) {
      alert("Please Enter Zone Name!");
      return;
    }
    this.zoneEditValues.ZoneName = this.zoneEditValues.ZoneName.trim();
    ZoneName = ZoneName.trim();
    
    this.inventoryService.checkForZone(FacilityKey, FloorKey, ZoneName, this.employeekey, this.OrganizationID).subscribe((data: Inventory[]) => {
      this.zone = data;
      if (data.length > 0) {
        alert("Zone already present !");
      }
      else if (data.length == 0) {
        this.inventoryService.updateZone(FacilityKey, FacilityName, FloorName, FloorKey, ZoneKey, ZoneName, this.employeekey, this.OrganizationID)
          .subscribe(res => {
            alert("Zone updated successfully");
            this._location.back();
          });
      }
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

    //building list for dropdown
    this.inventoryService
      .getallBuildingList(this.employeekey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.buildingList = data;
      });

    // floor list for dropdown
    this.inventoryService
      .getallFloorList(this.facKey$, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.floorList = data;
      });
    //zone details
    this.inventoryService
      .EditZoneAutoGenerate(this.zoneKey$, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.zoneEditValues = data;
      });
  }
  goBack() {
    this._location.back();
  }
}
