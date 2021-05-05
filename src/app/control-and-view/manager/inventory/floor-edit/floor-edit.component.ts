import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from "@angular/router";
import { InventoryService } from '../../../../service/inventory.service';
import { Inventory } from '../../../../model-class/Inventory';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
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

  checkFlag;
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

  constructor(private route: ActivatedRoute, private inventoryService: InventoryService, private router: Router, private _location: Location, private dst: DataServiceTokenStorageService) {
    this.route.params.subscribe(params => this.facKey$ = params.Facility_Key);
    this.route.params.subscribe(params => this.floorKey$ = params.Floor_Key);
  }

  updateFloor(FacilityKey, FloorKey, FloorName, FloorDescription) {
    this.checkFlag = true;
    if (FacilityKey == "--Select--") {
      alert("Please Choose Building!");
      this.checkFlag = false;
      return;
    }
    else if (!FloorName || !FloorName.trim()) {
      alert("Please Enter Floor Name!");
      this.checkFlag = false;
      return;
    }
    else if (!FloorDescription || !FloorDescription.trim()) {
      alert("Please Enter Floor Description!");
      this.checkFlag = false;
      return;
    }
    else {
      FloorName = FloorName.trim();
      FloorDescription = FloorDescription.trim();

      this.inventoryService.CheckNewFloor(FacilityKey, FloorName, this.employeekey, this.OrganizationID).subscribe((data: Inventory[]) => {
        if (data[0].count > 0) {
          alert("Floor already present !");
          this.checkFlag = false;
          return;
        }
        else {
          this.inventoryService
            .UpdateFloor(FacilityKey, FloorKey, FloorName, FloorDescription, this.employeekey, this.OrganizationID)
            .subscribe((data: Inventory[]) => {
              alert("Floor updated successfully");
              this.checkFlag = false;
              this._location.back();
            });
        }
      });
    }
  }
  ngOnInit() {
       // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.employeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();
    this.checkFlag = false;
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
