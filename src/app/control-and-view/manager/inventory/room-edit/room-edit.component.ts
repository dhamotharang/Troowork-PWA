import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../../service/inventory.service';
import { Inventory } from '../../../../model-class/Inventory';
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from '@angular/common';

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

  constructor(private route: ActivatedRoute, private inventoryService: InventoryService, private router: Router, private _location: Location) {
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
    if (!this.facKey) {
      alert("Building name is not provided !");
    } else if (!this.floorKey) {
      alert("Floor name is not provided!");
    } else if (!this.floorTypeKey) {
      alert("FloorType is not provided !");
    } else if (!this.zoneKey) {
      alert("Zone name is not provided !");
    } else if (!this.roomTypeKey) {
      alert("RoomType is not provided !");
    } else if (!RoomName || !RoomName.trim()) {
      alert("Room name is not provided !");
    } else if (!SquareFoot || !String(SquareFoot).trim()) {
      alert("Square foot is not provided !");
    } else if (!Barcode || !Barcode.trim()) {
      alert("Barcode is not provided !");
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
            alert("Barcode already exists !");
          }
          else if (this.temp_room != RoomName) {
            this.inventoryService
              .checkRoomName(this.facKey, this.floorKey, RoomName, this.OrganizationID)
              .subscribe((data: Inventory[]) => {
                if (data[0].count > 0) {
                  alert("Room Name already exists !");
                }
                else {
                  this.inventoryService.updateRoom(this.update_Room)
                    .subscribe(res => {
                      alert("Room updated successfully");
                      this._location.back();
                    });
                }
              });
          }
          else {
            this.inventoryService.updateRoom(this.update_Room)
              .subscribe(res => {
                alert("Room updated successfully");
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
