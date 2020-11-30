import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreatebuildingService } from '../../../../service/createbuilding.service';
import { Inventory } from '../../../../model-class/Inventory';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';


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
  constructor(private router: Router, private fb: FormBuilder, private CreatebuildingService: CreatebuildingService, private _location: Location) {

    this.createbuilding = fb.group({
      newbuildingName: ['', Validators.required]
    });
  }
  addBuilding(newbuildingName) {
    if (!(newbuildingName) || !(newbuildingName.trim())) {
      alert("Please Enter Building Name!");
      return;
    }

    newbuildingName = newbuildingName.trim();
    this.CreatebuildingService.checkNewBuilding(this.BuildingName, 'facility', this.employeekey, this.OrganizationID).subscribe((data: Inventory[]) => {
      if (data.length > 0) {
        alert("Building name already present !");
        return;
      }
      else {
        this.CreatebuildingService.createBuildings(newbuildingName, this.employeekey, this.OrganizationID)
          .subscribe((data: Inventory[]) => {
            alert("Building created successfully");
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

  }
  goBack() {
    this._location.back();
  }
}
