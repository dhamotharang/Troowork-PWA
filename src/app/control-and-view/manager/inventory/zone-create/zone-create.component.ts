import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../../service/inventory.service';
import { Inventory } from '../../../../model-class/Inventory';
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from '@angular/common';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';

@Component({
  selector: 'app-zone-create',
  templateUrl: './zone-create.component.html',
  styleUrls: ['./zone-create.component.scss']
})
export class ZoneCreateComponent implements OnInit {
  building: Inventory[];
  floorName: Inventory[];
  FacilityKey;
  FloorName;
  ZoneName;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  FloorKey;
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
  constructor(private inventoryService: InventoryService, private router: Router, private _location: Location, private dst: DataServiceTokenStorageService, private dialog: MatDialog) { }
  // Function to add zone values
  addZone(FacilityKey, FloorName, ZoneName, FloorKey) {

    this.checkFlag = true;
    if (!(this.FacilityKey) || !(this.FacilityKey.trim())) {
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
    if (!(this.FloorName) || !(this.FloorName.trim())) {
      // alert("Please Choose Floor!");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please Choose Floor!!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    if (!(this.ZoneName) || !(this.ZoneName.trim())) {
      // alert("Please Enter Zone Name!");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please Enter Zone Name!!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }

    this.ZoneName = this.ZoneName.trim();

    this.inventoryService.checkForZone(this.FacilityKey, this.FloorName, this.ZoneName, this.employeekey, this.OrganizationID).subscribe((data: Inventory[]) => {
      if (data.length > 0) {
        // alert("Zone already present !");
        const dialogRef = this.dialog.open(AlertdialogComponent, {
          data: {
            message: 'Zone already present !!',
            buttonText: {
              cancel: 'Done'
            }
          },
        });
        this.checkFlag = false;
      }
      else if (data.length == 0) {
        this.inventoryService.createZones(this.FacilityKey, this.FloorName, this.ZoneName, this.employeekey, this.OrganizationID)
          .subscribe((data: Inventory[]) => {
            // alert("Zone created successfully");
            const dialogRef = this.dialog.open(AlertdialogComponent, {
              data: {
                message: 'Zone created successfully',
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

  selectFloorfromBuildings(facKey) {
    this.inventoryService
      .getallFloorList(facKey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.floorName = data;
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
        this.building = data;
        this.FloorName = "";
        this.FacilityKey = "";
      });


  }
  goBack() {
    this._location.back();
  }
}
