import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from "@angular/router";
import { InventoryService } from '../../../../service/inventory.service';
import { Inventory } from '../../../../model-class/Inventory';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Location } from '@angular/common';
@Component({
  selector: 'app-floor-edit',
  templateUrl: './floor-edit.component.html',
  styleUrls: ['./floor-edit.component.scss']
})
export class FloorEditComponent implements OnInit {
  facKey$: Object;
  floorKey$: Object;
  flooroptions: Inventory[];
  buildingList: Inventory[];

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
  }

  updateFloor(FacilityKey, FloorKey, FloorName, FloorDescription) {
    if (FacilityKey == "--Select--") {
      alert("Please Choose Building!");
      return;
    }
    else if (!FloorName || !FloorName.trim()) {
      alert("Please Enter Floor Name!");
      return;
    }
    else if (!FloorDescription || !FloorDescription.trim()) {
      alert("Please Enter Floor Description!");
      return;
    }
    else {
      FloorName = FloorName.trim();
      FloorDescription = FloorDescription.trim();

      this.inventoryService.CheckNewFloor(FacilityKey, FloorName, this.employeekey, this.OrganizationID).subscribe((data: Inventory[]) => {
        if (data[0].count > 0) {
          alert("Floor already present !");
          return;
        }
        else {
          this.inventoryService
            .UpdateFloor(FacilityKey, FloorKey, FloorName, FloorDescription, this.employeekey, this.OrganizationID)
            .subscribe((data: Inventory[]) => {
              alert("Floor updated successfully");
              this._location.back();
            });
        }
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

    this.inventoryService
      .getallBuildingList(this.employeekey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.buildingList = data;
      });
    this.inventoryService.EditFloorAutoGenerate(this.floorKey$, this.facKey$, this.OrganizationID).subscribe((data: Inventory[]) => {
      this.flooroptions = data;

    });
  }
  goBack() {
    this._location.back();
  }

}
