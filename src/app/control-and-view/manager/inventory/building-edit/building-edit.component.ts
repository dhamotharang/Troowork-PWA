import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from "@angular/router";
import { InventoryService } from '../../../../service/inventory.service';
import { Inventory } from '../../../../model-class/Inventory';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Location } from '@angular/common';

@Component({
  selector: 'app-building-edit',
  templateUrl: './building-edit.component.html',
  styleUrls: ['./building-edit.component.scss']
})
export class BuildingEditComponent implements OnInit {
  facKey$: Object;
  build: Inventory[];



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
  }

  updateBuilding(FacilityName, FacilityKey) {

    var type = 'facility';

    if (!(FacilityName) || !(FacilityName.trim())) {
      alert("Please Enter Building Name!");
      return;
    }
    else {
      FacilityName=FacilityName.trim();
      this.inventoryService.CheckNewBuilding(FacilityName, type, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
        if (data.length > 0) {
          alert("Building already present !");
          return;
        }
        else {
          this.inventoryService.UpdateBuilding(FacilityName, FacilityKey, this.employeekey, this.OrganizationID)
            .subscribe((data: Inventory[]) => {
              alert("Building updated successfully");
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

    this.inventoryService.EditFacility(this.facKey$, this.OrganizationID).subscribe((data: Inventory[]) => {
      this.build = data;
    });
  }
  goBack() {
    this._location.back();
  }
}


