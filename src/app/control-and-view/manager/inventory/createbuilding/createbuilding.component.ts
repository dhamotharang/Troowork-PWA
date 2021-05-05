import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreatebuildingService } from '../../../../service/createbuilding.service';
import { Inventory } from '../../../../model-class/Inventory';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';


@Component({
  selector: 'app-createbuilding',
  templateUrl: './createbuilding.component.html',
  styleUrls: ['./createbuilding.component.scss']
})
export class CreatebuildingComponent implements OnInit {


  createbuilding: FormGroup;

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;

  BuildingName;
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
  constructor(private router: Router, private fb: FormBuilder, private CreatebuildingService: CreatebuildingService, private _location: Location, private dst: DataServiceTokenStorageService) {

    this.createbuilding = fb.group({
      newbuildingName: ['', Validators.required]
    });
  }
  addBuilding(newbuildingName) {
    this.checkFlag = true;
    if (!(newbuildingName) || !(newbuildingName.trim())) {
      alert("Please Enter Building Name!");
      this.checkFlag = false;
      return;
    }

    newbuildingName = newbuildingName.trim();
    this.CreatebuildingService.checkNewBuilding(this.BuildingName, 'facility', this.employeekey, this.OrganizationID).subscribe((data: Inventory[]) => {
      if (data.length > 0) {
        alert("Building name already present !");
        this.checkFlag = false;
        return;
      }
      else {
        this.CreatebuildingService.createBuildings(newbuildingName, this.employeekey, this.OrganizationID)
          .subscribe((data: Inventory[]) => {
            alert("Building created successfully");
            this.checkFlag = false;
            this._location.back();
          });
      }
    });
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
  }
  goBack() {
    this._location.back();
  }
}
