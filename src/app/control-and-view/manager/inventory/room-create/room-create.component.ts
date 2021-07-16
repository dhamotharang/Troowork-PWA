import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../../service/inventory.service';
import { Inventory } from '../../../../model-class/Inventory';
import { Router } from "@angular/router";
import { Location } from '@angular/common';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';


@Component({
  selector: 'app-room-create',
  templateUrl: './room-create.component.html',
  styleUrls: ['./room-create.component.scss']
})
export class RoomCreateComponent implements OnInit {
  building: Inventory[];
  FaciKey: Number;
  FloorKey;
  floor: Inventory[];
  zone: Inventory[];
  floorType: Inventory[];
  roomType: Inventory[];
  Barcode;
  FacilityKey;
  FloorTypeKey;
  ZoneKey;
  RoomTypeKey;
  RoomName;
  SquareFoot;
  temp_barcode;
  unqBar;
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

  constructor(private inventoryService: InventoryService, private router: Router, private _location: Location, private dst: DataServiceTokenStorageService, private dialog: MatDialog) { }

  numberValid(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  selectFloorfromBuildings(facKey) {
    this.FaciKey = facKey;
    if (facKey) {
      this.inventoryService
        .getallFloorList(facKey, this.OrganizationID)
        .subscribe((data: Inventory[]) => {
          this.floor = data;
        });
    }
    else {
      this.FloorKey = '';
    }
  }

  selectZonefromFloor(flrKey) {
    this.FloorKey = flrKey;
    this.inventoryService
      .getallZoneList(this.FaciKey, flrKey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.zone = data;
      });
  }
  addRoom(FacilityKey, FloorKey, FloorTypeKey, ZoneKey, RoomTypeKey, RoomName, SquareFoot, Barcode) {

    this.checkFlag = true;
    if (!FacilityKey) {
      FacilityKey = null;
      // alert("Building name is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Building name is not provided !!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
    } else if (!FloorKey) {
      FloorKey = null;
      // alert("Floor name is not provided!");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Floor name is not provided!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
    } else if (!FloorTypeKey) {
      FloorTypeKey = null;
      // alert("FloorType is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'FloorType is not provided !!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
    } else if (!ZoneKey) {
      ZoneKey = null;
      // alert("Zone name is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Zone name is not provided !!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
    } else if (!RoomTypeKey) {
      RoomTypeKey = null;
      // alert("RoomType is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'RoomType is not provided !!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
    } else if (!RoomName || !(RoomName.trim())) {
      RoomName = null;
      // alert("Room name is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Room name is not provided !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
    } else if (!SquareFoot) {
      SquareFoot = null;
      // alert("SquareFoot is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'SquareFoot is not provided !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
    } else if (!Barcode) {
      Barcode = null;
      // alert("Barcode is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Barcode is not provided ',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
    } else {
      if (RoomName) {
        RoomName = RoomName.trim();
      }

      this.inventoryService
        .checkNewRoom(FacilityKey, FloorKey, FloorTypeKey, ZoneKey, RoomTypeKey, RoomName, this.employeekey, this.OrganizationID)
        .subscribe((data: Inventory[]) => {
          if (data.length > 0) {
            // alert("Room already present");
            const dialogRef = this.dialog.open(AlertdialogComponent, {
              data: {
                message: 'Room already present!',
                buttonText: {
                  cancel: 'Done'
                }
              },
            });
            this.checkFlag = false;
          } else {
            this.inventoryService
              .checkRoomBarcode(Barcode, this.employeekey, this.OrganizationID)
              .subscribe((data: Inventory[]) => {
                this.unqBar = data;
                if (this.unqBar.Barcode != 0) {
                  // alert("Barcode already exists! Please enter a unique barcode.");
                  const dialogRef = this.dialog.open(AlertdialogComponent, {
                    data: {
                      message: 'Barcode already exists! Please enter a unique barcode.!',
                      buttonText: {
                        cancel: 'Done'
                      }
                    },
                  });
                  this.checkFlag = false;
                } else {
                  this.inventoryService
                    .checkRoomName(FacilityKey, FloorKey, RoomName, this.OrganizationID)
                    .subscribe((data: Inventory[]) => {
                      if (data[0].count > 0) {
                        // alert("Room Name already exists !");
                        const dialogRef = this.dialog.open(AlertdialogComponent, {
                          data: {
                            message: 'Room Name already exists !!',
                            buttonText: {
                              cancel: 'Done'
                            }
                          },
                        });
                        this.checkFlag = false;
                      } else {
                        this.inventoryService.addRoom(FacilityKey, FloorKey, FloorTypeKey, ZoneKey, RoomTypeKey, RoomName, SquareFoot, Barcode, this.employeekey, this.OrganizationID)
                          .subscribe(res => {
                            // alert("Room created successfully");
                            const dialogRef = this.dialog.open(AlertdialogComponent, {
                              data: {
                                message: 'Room created successfully',
                                buttonText: {
                                  cancel: 'Done'
                                }
                              },
                            });
                            dialogRef.afterClosed().subscribe(dialogResult => {
                              this.checkFlag = false;
                              this.inventoryService
                                .getBarcodeForRoom(this.employeekey, this.OrganizationID)
                                .subscribe((data: any[]) => {
                                  this.Barcode = data[0];
                                  this.temp_barcode = data[0];
                                  this.RoomName = null;
                                });
                            });
                          });
                      }
                    });
                }
              });
          }
        });
    }


  }
  ngOnInit() {
    this.FacilityKey = "";
    this.FloorTypeKey = "";
    this.FloorKey = "";
    this.RoomTypeKey = "";
    this.ZoneKey = "";
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
      });
    this.inventoryService
      .getallFloorTypeList(this.employeekey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.floorType = data;
      });
    this.inventoryService
      .getallRoomTypeList(this.employeekey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.roomType = data;
      });
    this.inventoryService
      .getBarcodeForRoom(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.Barcode = data[0];
        this.temp_barcode = data[0];
      });
  }
  clearall() {
    this.FacilityKey = '';
    this.FloorKey = '';
    this.FloorTypeKey = '';
    this.RoomTypeKey = '';
    this.ZoneKey = '';
    this.RoomName = '';
    this.SquareFoot = '';
    this.Barcode = this.temp_barcode;

  }
  goBack() {
    this._location.back();
  }
  zoneChange() {
    this.RoomTypeKey = '';
  }
}
