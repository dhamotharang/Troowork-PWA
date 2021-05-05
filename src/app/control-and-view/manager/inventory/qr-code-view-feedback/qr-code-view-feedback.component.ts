import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../../../service/inventory.service';
import { ActivatedRoute } from "@angular/router";
import { ConectionSettings } from '../../../../service/ConnectionSetting';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import { Location } from '@angular/common';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';

@Component({
  selector: 'app-qr-code-view-feedback',
  templateUrl: './qr-code-view-feedback.component.html',
  styleUrls: ['./qr-code-view-feedback.component.scss']
})
export class QrCodeViewFeedbackComponent implements OnInit {


  qrcode;
  roomKey$;
  roomdetails;
  roomdetailsnamelist;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;

  constructor(private route: ActivatedRoute, private inventoryService: InventoryService, private _location: Location, private dst: DataServiceTokenStorageService) {
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
      // doc.addPage();
      doc.autoTable({
        html: '#contentToConvert',
      });
      doc.save('FeedbackQRCode.pdf');
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

    this.inventoryService.getRoomDetailsList(this.roomKey$, this.OrganizationID).subscribe((data) => {
      this.roomdetails = data[0];
      // this.inventoryService.getTemplateDetailsForFeedback(this.OrganizationID).subscribe((data) => {
      //   var tempID = data[0];
      //   if(!tempID){
      //     tempID=[];
      //     tempID.TemplateID=0;
      //   }
        this.qrcode = ConectionSettings.AbsUrl + '/#/Reviews/' + this.roomdetails.FacilityKey + '/' + this.roomdetails.FloorKey + '/' + this.roomdetails.ZoneKey + '/' + this.roomdetails.RoomTypeKey + '/' + this.OrganizationID + '/' + this.roomKey$ ;
      // });
    });

    this.inventoryService.getRoomDetailsNamesList(this.roomKey$, this.OrganizationID).subscribe((data) => {
      this.roomdetailsnamelist = data[0];
    });
  }
  goBack() {
    this._location.back();
  }
}

