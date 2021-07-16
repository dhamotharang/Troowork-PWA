import { Component, OnInit } from '@angular/core';
import { Inventory } from '../../../model-class/Inventory';
import { InventoryService } from '../../../service/inventory.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from "@angular/router";

import { DataServiceTokenStorageService } from '../../../service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../dialog/alertdialog/alertdialog.component';
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

  constructor(private fb: FormBuilder, private inventoryServ: InventoryService, private router: Router, private dst: DataServiceTokenStorageService, private dialog: MatDialog) { }

  addDepartment(DepartmentName) {

    this.checkFlag = true;
    if (!(DepartmentName) || !(DepartmentName.trim())) {
      // alert("Please provide a Department Name");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please provide a Department Name !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
    }

    else {
      DepartmentName = DepartmentName.trim();
      this.inventoryServ.checkForNewDepartment(DepartmentName, this.employeekey, this.OrganizationID).subscribe((data: Inventory[]) => {
        this.dept = data;
        if (data.length > 0) {
          // alert("Department already present");
          const dialogRef = this.dialog.open(AlertdialogComponent, {
            data: {
              message: 'Department already present !',
              buttonText: {
                cancel: 'Done'
              }
            },
          });
          this.checkFlag = false;
        }
        else if (data.length == 0) {
          this.inventoryServ.addDepartment(DepartmentName, this.employeekey, this.OrganizationID).subscribe(res => {
            // alert("Department created successfully");
            const dialogRef = this.dialog.open(AlertdialogComponent, {
              data: {
                message: 'Department created successfully',
                buttonText: {
                  cancel: 'Done'
                }
              },
            });
            dialogRef.afterClosed().subscribe(dialogResult => {
              this.checkFlag = false;
              this.router.navigate(['AdminDashboard', { outlets: { AdminOut: ['ViewDepartment'] } }]);
            });
          });
        }
      });
    }
  }
  goBack() {
    this.router.navigate(['AdminDashboard', { outlets: { AdminOut: ['ViewDepartment'] } }]);
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
}
