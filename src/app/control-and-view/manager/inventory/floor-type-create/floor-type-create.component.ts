import { Component, OnInit } from '@angular/core';
import { Inventory } from '../../../../model-class/Inventory';
import { InventoryService } from '../../../../service/inventory.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { Location } from '@angular/common';

@Component({
  selector: 'app-floor-type-create',
  templateUrl: './floor-type-create.component.html',
  styleUrls: ['./floor-type-create.component.scss']
})
export class FloorTypeCreateComponent implements OnInit {
  flrType: Inventory[];

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  FloorTypeName;
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

  constructor(private fb: FormBuilder, private inventoryServ: InventoryService, private router: Router, private _location: Location) {
  }

  addFloorType(FloorTypeName) {
    if (FloorTypeName && !FloorTypeName.trim()) {
      alert("Please Enter Floor Type Name!");
      return;
    }
    if (!FloorTypeName) {
      alert("Please provide a Floor Type Name");
    } else {
      FloorTypeName = FloorTypeName.trim();
      this.inventoryServ.checkForNewFloorType(FloorTypeName, this.employeekey, this.OrganizationID).subscribe((data: Inventory[]) => {
        this.flrType = data;
        if (data.length > 0) {
          alert("Floor Type already present");
        }
        else if (data.length == 0) {
          this.inventoryServ.addNewFloorType(FloorTypeName, this.employeekey, this.OrganizationID).subscribe(res => {
            alert("FloorType created successfully");
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

  }
  goBack() {
    this._location.back();
  }

}
