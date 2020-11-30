import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../../service/inventory.service';
import { ActivatedRoute } from "@angular/router";
import { ConectionSettings } from '../../../../service/ConnectionSetting';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import {Location} from '@angular/common';

@Component({
  selector: 'app-qr-code-view',
  templateUrl: './qr-code-view.component.html',
  styleUrls: ['./qr-code-view.component.scss']
})
export class QrCodeViewComponent implements OnInit {

      ////////Author :  Aswathy//////

  qrcode ;
  roomKey$;
  roomdetails;
  roomdetailsnamelist;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;

  constructor(private route: ActivatedRoute, private inventoryService: InventoryService,private _location: Location) {
    this.route.params.subscribe(params => this.roomKey$ = params.RoomKey);
  }

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

  public captureScreen() {
    const doc = new jspdf();
    var data = document.getElementById('part1');
    html2canvas(data).then(canvas => {
      const img = canvas.toDataURL('image/png');
      var imgWidth = 208;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      doc.addImage(img, 'PNG', 0, 0, imgWidth, imgHeight);
      doc.save('WOQRCode.pdf');
    });
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

    this.inventoryService.getRoomDetailsList(this.roomKey$,this.OrganizationID).subscribe((data) => {
      this.roomdetails = data[0];
        this.qrcode = ConectionSettings.AbsUrl+'/#/UserWorkRequest/'+this.roomdetails.FacilityKey+'/'+this.roomdetails.FloorKey+'/'+this.roomdetails.ZoneKey+'/'+this.roomdetails.RoomTypeKey+'/'+this.OrganizationID+'/'+this.roomKey$+'';
      });

    this.inventoryService.getRoomDetailsNamesList(this.roomKey$,this.OrganizationID).subscribe((data) => {
      this.roomdetailsnamelist = data[0];
    });
  }
  goBack(){
    this._location.back();
  }
}
