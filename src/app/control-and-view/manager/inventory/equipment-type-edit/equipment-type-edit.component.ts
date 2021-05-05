import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { InventoryService } from '../../../../service/inventory.service';
// import { Inventory } from '../../../../model-class/Inventory';
import { Location } from '@angular/common';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';

@Component({
  selector: 'app-equipment-type-edit',
  templateUrl: './equipment-type-edit.component.html',
  styleUrls: ['./equipment-type-edit.component.scss']
})
export class EquipmentTypeEditComponent implements OnInit {
  equipTypeKey$: Object;
  equipType;

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
    this.route.params.subscribe(params => this.equipTypeKey$ = params.EquipTypeKey);
  }

  updateEquipmentType(equipTypeKey, equipType, equipTypeDesc) {

    this.checkFlag = true;
    if (!equipType || !equipType.trim()) {
      alert("Please provide a Equipment Type");
      this.checkFlag = false;
    } else if (!equipTypeDesc || !equipTypeDesc.trim()) {
      alert("Please provide a Equipment Type Description");
      this.checkFlag = false;
    } else {
      equipType = equipType.trim();
      equipTypeDesc = equipTypeDesc.trim();
      this.inventoryService.checkForNewEquipmentType(equipType, this.employeekey, this.OrganizationID).subscribe((data: Array<any>) => {
        this.equipType = data;
        if (this.equipType[0].count == 1) {
          alert("Equipment Type already present");
          this.checkFlag = false;
          this.inventoryService.getEquipmentTypeListEdit(this.equipTypeKey$, this.OrganizationID).subscribe((data: Array<any>) => {

            this.equipType = data[0];
            return;
          });

        }
        else {
          this.inventoryService.UpdateEquipmentType(equipType, equipTypeDesc, equipTypeKey, this.employeekey, this.OrganizationID).subscribe(res => {
            alert("Equipment Type  updated successfully");
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
    this.inventoryService.getEquipmentTypeListEdit(this.equipTypeKey$, this.OrganizationID).subscribe((data: any[]) => {


      this.equipType = data[0];
    });
  }
  goBack() {
    this._location.back();
  }
}
