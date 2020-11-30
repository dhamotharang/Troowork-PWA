import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../../service/inventory.service';
import { Inventory } from '../../../../model-class/Inventory';
import { Router } from "@angular/router";
import { Location } from '@angular/common';

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

  constructor(private inventoryService: InventoryService, private router: Router, private _location: Location) { }

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

    if (!FacilityKey) {
      FacilityKey = null;
      alert("Building name is not provided !");
    } else if (!FloorKey) {
      FloorKey = null;
      alert("Floor name is not provided!");
    } else if (!FloorTypeKey) {
      FloorTypeKey = null;
      alert("FloorType is not provided !");
    } else if (!ZoneKey) {
      ZoneKey = null;
      alert("Zone name is not provided !");
    } else if (!RoomTypeKey) {
      RoomTypeKey = null;
      alert("RoomType is not provided !");
    } else if (!RoomName || !(RoomName.trim())) {
      RoomName = null;
      alert("Room name is not provided !");
    } else if (!SquareFoot ) {
      SquareFoot = null;
      alert("SquareFoot is not provided !");
    } else if (!Barcode ) {
      Barcode = null;
      alert("Barcode is not provided !");
    } else {
      if (RoomName) {
        RoomName = RoomName.trim();
      }
     
      this.inventoryService
        .checkNewRoom(FacilityKey, FloorKey, FloorTypeKey, ZoneKey, RoomTypeKey, RoomName, this.employeekey, this.OrganizationID)
        .subscribe((data: Inventory[]) => {
          if (data.length > 0) {
            alert("Room already present");
          } else {
            this.inventoryService
              .checkRoomBarcode(Barcode, this.employeekey, this.OrganizationID)
              .subscribe((data: Inventory[]) => {
                this.unqBar = data;
                if (this.unqBar.Barcode != 0) {
                  alert("Barcode already exists! Please enter a unique barcode.");
                } else {
                  this.inventoryService
                    .checkRoomName(FacilityKey, FloorKey, RoomName, this.OrganizationID)
                    .subscribe((data: Inventory[]) => {
                      if (data[0].count > 0) {
                        alert("Room Name already exists !");
                      } else {
                        this.inventoryService.addRoom(FacilityKey, FloorKey, FloorTypeKey, ZoneKey, RoomTypeKey, RoomName, SquareFoot, Barcode, this.employeekey, this.OrganizationID)
                          .subscribe(res => {
                            alert("Room created successfully");
                            this.inventoryService
                              .getBarcodeForRoom(this.employeekey, this.OrganizationID)
                              .subscribe((data: any[]) => {
                                this.Barcode = data[0];
                                this.temp_barcode = data[0];
                                this.RoomName = null;
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
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;

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
