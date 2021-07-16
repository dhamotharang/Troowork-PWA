import { Component, OnInit } from '@angular/core';
import { DocumentserviceService } from '../../../../service/documentservice.service';
import { Documents } from '../../../../model-class/Documents';
import { Router } from '@angular/router';

import { Location } from '@angular/common';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';
@Component({
  selector: 'app-newdocumentfolder-create',
  templateUrl: './newdocumentfolder-create.component.html',
  styleUrls: ['./newdocumentfolder-create.component.scss']
})
export class NewdocumentfolderCreateComponent implements OnInit {

  DocFolderName: any;

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

  constructor(private documentService: DocumentserviceService, private router: Router, private _location: Location, private dst: DataServiceTokenStorageService, private dialog: MatDialog) { }

  addDocFold() {
    this.checkFlag = true;
    if (this.DocFolderName && !this.DocFolderName.trim()) {
      // alert("Please Enter Document Folder Name!");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please Enter Document Folder Name!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    if (!this.DocFolderName) {
      // alert("Document Folder Name not provided");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Document Folder Name not provided',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      return;
    }
    if (this.DocFolderName) {
      this.DocFolderName = this.DocFolderName.trim();
    }
    //  else
    this.documentService.checkforForms(this.DocFolderName, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
      if (data[0].count == 0) {
        this.documentService.CreateNewDocumentFolder(this.DocFolderName, this.employeekey, this.OrganizationID).subscribe((data: Documents[]) => {
          // alert("Successfully Added");
          const dialogRef = this.dialog.open(AlertdialogComponent, {
            data: {
              message: 'Successfully Added',
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
      else {
        // alert("Document Folder Name already exists");
        const dialogRef = this.dialog.open(AlertdialogComponent, {
          data: {
            message: 'Document Folder Name already exists',
            buttonText: {
              cancel: 'Done'
            }
          },
        });
        this.checkFlag = false;
        return;
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

  }

  goBack() {
    this._location.back();
  }

}
