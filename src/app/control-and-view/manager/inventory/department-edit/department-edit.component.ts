import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { InventoryService } from '../../../../service/inventory.service';
import { Location } from '@angular/common';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
@Component({
  selector: 'app-department-edit',
  templateUrl: './department-edit.component.html',
  styleUrls: ['./department-edit.component.scss']
})
export class DepartmentEditComponent implements OnInit {
  deptKey$: Object;
  dept;


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
    this.route.params.subscribe(params => this.deptKey$ = params.DeptKey);
  }

  updateDepartment(DepartmentName) {
    this.checkFlag = true;

    if (!(DepartmentName) || !(DepartmentName.trim())) {
      alert("Please provide a Department Name");
      this.checkFlag = false;
    } else {
      DepartmentName = DepartmentName.trim();
      this.inventoryService.checkForNewDepartment(DepartmentName, this.employeekey, this.OrganizationID).subscribe((data: Array<any>) => {
        if (data.length > 0) {
          alert("Department already present");
          this.checkFlag = false;
        }
        else {
          this.inventoryService.UpdateDepartment(DepartmentName, this.deptKey$, this.employeekey, this.OrganizationID).subscribe(res => {
            alert("Department updated successfully");
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
    this.inventoryService.EditDepartment(this.deptKey$, this.OrganizationID).subscribe((data: any[]) => {

      this.dept = data[0];
    });
  }
  goBack() {
    this._location.back();
  }
}
