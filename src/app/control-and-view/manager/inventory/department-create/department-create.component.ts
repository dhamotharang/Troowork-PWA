import { Component, OnInit } from '@angular/core';
import { Inventory } from '../../../../model-class/Inventory';
import { InventoryService } from '../../../../service/inventory.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from "@angular/router";
import { Location } from '@angular/common';
@Component({
  selector: 'app-department-create',
  templateUrl: './department-create.component.html',
  styleUrls: ['./department-create.component.scss']
})
export class DepartmentCreateComponent implements OnInit {
  dept;
  createbuilding: FormGroup;
  DepartmentName;
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

  constructor(private fb: FormBuilder, private inventoryServ: InventoryService, private router: Router, private _location: Location) { }

  addDepartment(DepartmentName) {
    if (!(DepartmentName) || !(DepartmentName.trim())) {
      alert("Please provide a Department Name");
      return;
    }
    else {
      DepartmentName=DepartmentName.trim();
      this.inventoryServ.checkForNewDepartment(DepartmentName, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
        this.dept = data;
        if (data.length > 0) {
          alert("Department already present");
        }
        else if (data.length == 0) {
          this.inventoryServ.addDepartment(DepartmentName, this.employeekey, this.OrganizationID).subscribe(res => {
            alert("Department created successfully");
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

