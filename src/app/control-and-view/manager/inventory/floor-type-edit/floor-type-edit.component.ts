import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { InventoryService } from '../../../../service/inventory.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-floor-type-edit',
  templateUrl: './floor-type-edit.component.html',
  styleUrls: ['./floor-type-edit.component.scss']
})
export class FloorTypeEDitComponent implements OnInit {
  flrTypeKey$: Object;
  flrType;
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
    this.route.params.subscribe(params => this.flrTypeKey$ = params.FloorTypeKey);
  }

  updateFloorType(FloorTypeName) {
    if (!FloorTypeName || !FloorTypeName.trim()) {
      alert("Please provide a FloorType Name");
    } else {
      FloorTypeName = FloorTypeName.trim();
      this.inventoryService.checkForNewFloorType(FloorTypeName, this.employeekey, this.OrganizationID).subscribe((data: Array<any>) => {
        if (data.length > 0) {
          alert("FloorType already present");
        }
        else {
          this.inventoryService.UpdateFloorType(FloorTypeName, this.flrTypeKey$, this.employeekey, this.OrganizationID).subscribe(res => {
            alert("FloorType updated successfully");
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

    this.inventoryService.EditFloorType(this.flrTypeKey$, this.OrganizationID).subscribe((data: any[]) => {
      this.flrType = data[0];
    });
  }
  goBack() {
    this._location.back();
  }
}
