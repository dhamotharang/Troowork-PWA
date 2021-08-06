import { Component, OnInit } from '@angular/core';
import { PeopleServiceService } from "../../../service/people-service.service";

import { DataServiceTokenStorageService } from '../../../service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../dialog/alertdialog/alertdialog.component';
import { ConfirmationdialogComponent, ConfirmDialogModel } from '../../dialog/confirmationdialog/confirmationdialog.component';
@Component({
  selector: 'app-trade-request-view',
  templateUrl: './trade-request-view.component.html',
  styleUrls: ['./trade-request-view.component.scss']
})
export class TradeRequestViewComponent implements OnInit {

  ////////Author :  Aswathy//////

  role: String;
  name: String;
  toServeremployeekey;
  IsSupervisor: Number;
  OrganizationID: Number;
  requestdetails;
  editflag;
  deleteRequestKey;
  OtherEmployeedetails;
  checkEmp;
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

  constructor(private PeopleServiceService: PeopleServiceService, private dst: DataServiceTokenStorageService, private dialog: MatDialog) { }

  // Function to delete the trade request

  deletePass(key) {
    this.deleteRequestKey = key;


    const message = `Are you sure !!  Do you want to delete`;
    const dialogData = new ConfirmDialogModel("DELETE", message);
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {

        this.checkFlag = true;
        this.PeopleServiceService.deleteTradeRequest(this.deleteRequestKey, this.toServeremployeekey)
          .subscribe((data) => {
            this.checkFlag = false;
            // alert('Trade Request Deleted Successfully');
            const dialogRef = this.dialog.open(AlertdialogComponent, {
              data: {
                message: 'Trade Request Deleted Successfully',
                buttonText: {
                  cancel: 'Done'
                }
              },
            });
            dialogRef.afterClosed().subscribe(dialogResult => {
              this.PeopleServiceService.getTradeRequestdetails(this.OrganizationID, this.toServeremployeekey).subscribe((data) => {
                this.requestdetails = data;
              });
            });
          });
      } else {
        this.checkFlag = false;
      }
    });
  }

  // deleteRequest() {
  //   this.checkFlag = true;
  //   this.PeopleServiceService.deleteTradeRequest(this.deleteRequestKey, this.toServeremployeekey)
  //     .subscribe((data) => {
  //       this.checkFlag = false;
  //       // alert('Trade Request Deleted Successfully');
  //       const dialogRef = this.dialog.open(AlertdialogComponent, {
  //         data: {
  //           message: 'Trade Request Deleted Successfully',
  //           buttonText: {
  //             cancel: 'Done'
  //           }
  //         },
  //       });
  //       dialogRef.afterClosed().subscribe(dialogResult => {
  //         this.PeopleServiceService.getTradeRequestdetails(this.OrganizationID, this.toServeremployeekey).subscribe((data) => {
  //           this.requestdetails = data;
  //         });
  //       });
  //     });
  // }
  ngOnInit() {

    // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.toServeremployeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();

    this.checkFlag = false;

    this.checkEmp = parseInt(this.toServeremployeekey);

    // call to get the trade details

    this.PeopleServiceService.getTradeRequestdetails(this.OrganizationID, this.toServeremployeekey).subscribe((data) => {
      this.requestdetails = data;
    });
  }
}
