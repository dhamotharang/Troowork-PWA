import { Component, OnInit } from '@angular/core';
import { Inventory } from '../../../../model-class/Inventory';
import { InventoryService } from '../../../../service/inventory.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';


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

  constructor(private fb: FormBuilder, private inventoryServ: InventoryService, private router: Router, private _location: Location, private dst: DataServiceTokenStorageService, private dialog: MatDialog) {
  }

  addFloorType(FloorTypeName) {
    this.checkFlag = true;
    if (FloorTypeName && !FloorTypeName.trim()) {
      // alert("Please Enter Floor Type Name!");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please Enter Floor Type Name!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    if (!FloorTypeName) {
      // alert("Please provide a Floor Type Name");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please provide a Floor Type Name!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
    } else {
      FloorTypeName = FloorTypeName.trim();
      this.inventoryServ.checkForNewFloorType(FloorTypeName, this.employeekey, this.OrganizationID).subscribe((data: Inventory[]) => {
        this.flrType = data;
        if (data.length > 0) {
          // alert("Floor Type already present");
          const dialogRef = this.dialog.open(AlertdialogComponent, {
            data: {
              message: 'Floor Type already present!',
              buttonText: {
                cancel: 'Done'
              }
            },
          });
          this.checkFlag = false;
        }
        else if (data.length == 0) {
          this.inventoryServ.addNewFloorType(FloorTypeName, this.employeekey, this.OrganizationID).subscribe(res => {
            // alert("FloorType created successfully");
            const dialogRef = this.dialog.open(AlertdialogComponent, {
              data: {
                message: 'FloorType created successfully',
                buttonText: {
                  cancel: 'Done'
                }
              },
            });
            dialogRef.afterClosed().subscribe(dialogResult => {
              this.checkFlag = false;
              this._location.back();
            });
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
  }
  goBack() {
    this._location.back();
  }

}
