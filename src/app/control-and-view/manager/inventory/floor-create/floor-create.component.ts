import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Inventory } from '../../../../model-class/Inventory';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InventoryService } from '../../../../service/inventory.service';
import { Location } from '@angular/common';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';

@Component({
  selector: 'app-floor-create',
  templateUrl: './floor-create.component.html',
  styleUrls: ['./floor-create.component.scss']
})
export class FloorCreateComponent implements OnInit {

  flooroptions: Inventory[];
  floorcreate: FormGroup;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  FacilityKey;
  FloorName; FloorDescription;
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

  constructor(private router: Router, private fb: FormBuilder, private inventoryService: InventoryService, private _location: Location, private dst: DataServiceTokenStorageService, private dialog: MatDialog) {

    this.floorcreate = fb.group({
      FacilityKey: ['', Validators.required],
      FloorName: ['', Validators.required],
      FloorDescription: ['', Validators.required]
    });
  }
  // Function to add floor details
  addFloor(FacilityKey, FloorName, FloorDescription) {
    this.checkFlag = true;
    if (!FacilityKey) {
      // alert("Please Choose Building!");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please Choose Building!!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    if (!FloorName || !FloorName.trim()) {
      // alert("Please Enter Floor Name!");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please Enter Floor Name!!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    if (!FloorDescription || !FloorDescription.trim()) {
      // alert("Please Enter Floor Description!");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please Enter Floor Description!!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }

    FloorName = FloorName.trim();
    FloorDescription = FloorDescription.trim();


    this.inventoryService.CheckNewFloor(FacilityKey, FloorName, this.employeekey, this.OrganizationID).subscribe((data: Inventory[]) => {
      if (data[0].count > 0) {
        // alert("Floor already present !");
        const dialogRef = this.dialog.open(AlertdialogComponent, {
          data: {
            message: 'Floor already present !!',
            buttonText: {
              cancel: 'Done'
            }
          },
        });
        this.checkFlag = false;
        return;
      }
      else {
        this.inventoryService.createFloors(FacilityKey, FloorName, FloorDescription, this.employeekey, this.OrganizationID)
          .subscribe((data: Inventory[]) => {
            // alert("Floor created successfully");
            const dialogRef = this.dialog.open(AlertdialogComponent, {
              data: {
                message: 'Floor created successfully',
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
    this.inventoryService
      .getallBuildingList(this.employeekey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.flooroptions = data;
        this.FacilityKey = ""
      });
  }

  goBack() {
    this._location.back();
  }

}
