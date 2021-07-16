import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../../service/inventory.service';
import { Inventory } from '../../../../model-class/Inventory';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';


@Component({
  selector: 'app-room-edit',
  templateUrl: './room-edit.component.html',
  styleUrls: ['./room-edit.component.scss']
})
export class RoomEditComponent implements OnInit {

  roomKey$: Number;
  building: Inventory[];
  floorType: Inventory[];
  roomType: Inventory[];
  floor: Inventory[];
  zone: Inventory[];
  room;
  facKey;
  floorKey;
  zoneKey;
  roomTypeKey;
  floorTypeKey;
  ZoneName: String;
  roomkey;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  update_Room;
  unqBar;
  temp_room;
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
    this.route.params.subscribe(params => this.roomKey$ = params.RoomKey);
  }

  numberValid(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  selectFloorfromBuildings(facKey) {
    if (facKey) {
      this.facKey = facKey;
      this.floorTypeKey = "";
      this.floorKey = "";
      this.zoneKey = "";
      this.roomTypeKey = "";
      this.inventoryService
        .getallFloorList(facKey, this.OrganizationID)
        .subscribe((data: Inventory[]) => {
          this.floor = data;
          this.room.FloorKey = '';
        });
    }
  }

  selectZonefromFloor(flrKey) {
    this.floorKey = flrKey;
    this.floorTypeKey = "";
    this.zoneKey = "";
    this.roomTypeKey = "";
    this.inventoryService
      .getallZoneList(this.facKey, flrKey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.zone = data;
        this.room.ZoneKey = '';
      });
  }

  setZoneKey(zonekey) {
    this.zoneKey = zonekey;
  }
  setRoomType(roomTKey) {
    this.roomTypeKey = roomTKey;
  }
  setFloorType(flrTKey) {
    this.floorTypeKey = flrTKey;
  }
  setZoneName(zoneName) {
    this.ZoneName = zoneName;
  }

  updateRoom(RoomName, SquareFoot, Barcode) {
    this.checkFlag = true;
    if (!this.facKey) {
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
    } else if (!this.floorKey) {
      // alert("Floor name is not provided!");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Floor name is not provided!!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
    } else if (!this.floorTypeKey) {
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
    } else if (!this.zoneKey) {
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
    } else if (!this.roomTypeKey) {
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
    } else if (!RoomName || !RoomName.trim()) {
      // alert("Room name is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Room name is not provided !!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
    } else if (!SquareFoot || !String(SquareFoot).trim()) {
      // alert("Square foot is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Square foot is not provided !!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
    } else if (!Barcode || !Barcode.trim()) {
      // alert("Barcode is not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Barcode is not provided !!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
    }
    else {
      if (RoomName) {
        RoomName = RoomName.trim();
      }

      this.update_Room = {
        FacilityKey: this.facKey,
        FloorKey: this.floorKey,
        FloorTypeKey: this.floorTypeKey,
        ZoneKey: this.zoneKey,
        RoomTypeKey: this.roomTypeKey,
        RoomKey: this.roomKey$,
        area: SquareFoot,
        RoomName: RoomName,
        Barcode: Barcode,
        employeekey: this.employeekey,
        OrganizationID: this.OrganizationID
      };
      this.inventoryService
        .checkUniqueBarcode_Updation(Barcode, this.roomKey$, this.employeekey, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.unqBar = data;
          if (this.unqBar.Barcode != 0) {
            // alert("Barcode already exists !");
            const dialogRef = this.dialog.open(AlertdialogComponent, {
              data: {
                message: 'Barcode already exists !!',
                buttonText: {
                  cancel: 'Done'
                }
              },
            });
            this.checkFlag = false;
          }
          else if (this.temp_room != RoomName) {
            this.inventoryService
              .checkRoomName(this.facKey, this.floorKey, RoomName, this.OrganizationID)
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
                }
                else {
                  this.inventoryService.updateRoom(this.update_Room)
                    .subscribe(res => {
                      // alert("Room updated successfully");
                      const dialogRef = this.dialog.open(AlertdialogComponent, {
                        data: {
                          message: 'Room updated successfully',
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
          else {
            this.inventoryService.updateRoom(this.update_Room)
              .subscribe(res => {
                // alert("Room updated successfully");
                const dialogRef = this.dialog.open(AlertdialogComponent, {
                  data: {
                    message: 'Room updated successfully',
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
    this.inventoryService
      .getRoomDetailsList(this.roomKey$, this.OrganizationID)
      .subscribe((data: Array<any>) => {
        this.room = data[0];

        this.facKey = this.room.FacilityKey;
        this.floorTypeKey = this.room.FloorTypeKey;
        this.floorKey = this.room.FloorKey;
        this.zoneKey = this.room.ZoneKey;
        this.roomTypeKey = this.room.RoomTypeKey;

        this.temp_room = this.room.RoomName;
        this.inventoryService
          .getallFloorList(this.room.FacilityKey, this.OrganizationID)
          .subscribe((data: Inventory[]) => {
            this.floor = data;
          });
        this.inventoryService
          .getallZoneList(this.room.FacilityKey, this.room.FloorKey, this.OrganizationID)
          .subscribe((data: Inventory[]) => {
            this.zone = data;
          });
      });


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

  }
  goback() {
    this._location.back();
  }
  zoneChange() {
    this.roomTypeKey = '';
  }
}
