import { Component, OnInit } from '@angular/core';
import { Inventory } from '../../../model-class/Inventory';
import { InventoryService } from '../../../service/inventory.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from "@angular/router";

@Component({
  selector: 'app-create-department',
  templateUrl: './create-department.component.html',
  styleUrls: ['./create-department.component.scss']
})
export class CreateDepartmentComponent implements OnInit {
  dept: Inventory[];
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

  constructor(private fb: FormBuilder, private inventoryServ: InventoryService, private router: Router) { }

  addDepartment(DepartmentName) {

    if (!(DepartmentName) || !(DepartmentName.trim())) {
      alert("Please provide a Department Name");
    }

    else {
      DepartmentName = DepartmentName.trim();
      this.inventoryServ.checkForNewDepartment(DepartmentName, this.employeekey, this.OrganizationID).subscribe((data: Inventory[]) => {
        this.dept = data;
        if (data.length > 0) {
          alert("Department already present");
        }
        else if (data.length == 0) {
          this.inventoryServ.addDepartment(DepartmentName, this.employeekey, this.OrganizationID).subscribe(res => {
            alert("Department created successfully");
            this.router.navigate(['AdminDashboard', { outlets: { AdminOut: ['ViewDepartment'] } }]);
          });
        }
      });
    }
  }
  goBack() {
    this.router.navigate(['AdminDashboard', { outlets: { AdminOut: ['ViewDepartment'] } }]);
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
}
