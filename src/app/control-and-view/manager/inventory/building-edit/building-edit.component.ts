import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from "@angular/router";
import { InventoryService } from '../../../../service/inventory.service';
import { Inventory } from '../../../../model-class/Inventory';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { Location } from '@angular/common';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';
import { ConfirmationdialogComponent, ConfirmDialogModel } from '../../../dialog/confirmationdialog/confirmationdialog.component';


@Component({
  selector: 'app-building-edit',
  templateUrl: './building-edit.component.html',
  styleUrls: ['./building-edit.component.scss']
})
export class BuildingEditComponent implements OnInit {
  facKey$: Object;
  build: Inventory[];
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

  constructor(private route: ActivatedRoute, private inventoryService: InventoryService, private router: Router, private _location: Location, private dst: DataServiceTokenStorageService, private dialog: MatDialog) {
    this.route.params.subscribe(params => this.facKey$ = params.Facility_Key);
  }

  updateBuilding(FacilityName, FacilityKey) {

    this.checkFlag = true;
    var type = 'facility';

    if (!(FacilityName) || !(FacilityName.trim())) {
      // alert("Please Enter Building Name!");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please Enter Building Name!!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    else {
      FacilityName = FacilityName.trim();
      this.inventoryService.CheckNewBuilding(FacilityName, type, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
        if (data.length > 0) {
          // alert("Building already present !");
          const dialogRef = this.dialog.open(AlertdialogComponent, {
            data: {
              message: 'Building already present !',
              buttonText: {
                cancel: 'Done'
              }
            },
          });
          this.checkFlag = false;
          return;
        }
        else {
          this.inventoryService.UpdateBuilding(FacilityName, FacilityKey, this.employeekey, this.OrganizationID)
            .subscribe((data: Inventory[]) => {
              // alert("Building updated successfully");
              const dialogRef = this.dialog.open(AlertdialogComponent, {
                data: {
                  message: 'Building updated successfully',
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
    this.inventoryService.EditFacility(this.facKey$, this.OrganizationID).subscribe((data: Inventory[]) => {
      this.build = data;
    });
  }
  goBack() {
    this._location.back();
  }
}


