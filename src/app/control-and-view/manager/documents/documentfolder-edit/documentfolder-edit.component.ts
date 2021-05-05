import { Component, OnInit } from '@angular/core';
import { DocumentserviceService } from '../../../../service/documentservice.service';
import { Documents } from '../../../../model-class/Documents';
import { ActivatedRoute, Router } from "@angular/router";

import { Location } from '@angular/common';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
@Component({
  selector: 'app-documentfolder-edit',
  templateUrl: './documentfolder-edit.component.html',
  styleUrls: ['./documentfolder-edit.component.scss']
})
export class DocumentfolderEditComponent implements OnInit {
  folder;
  folder$: Object;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  initialFolder;
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


  constructor(private route: ActivatedRoute, private documentService: DocumentserviceService, private router: Router, private _location: Location, private dst: DataServiceTokenStorageService) {
    this.route.params.subscribe(params => this.folder$ = params.FormtypeId);
  }

  updateFolderName() {
    this.checkFlag = true;
    if (this.folder.FormType && !this.folder.FormType.trim()) {
      alert("Please Enter Document Folder Name!");
      this.checkFlag = false;
      return;
    }
    if (!this.folder.FormType) {
      alert("Document Folder Name not provided");
      this.checkFlag = false;
      return;
    }
    // else
    if (this.folder.FormType) {
      this.folder.FormType = this.folder.FormType.trim();
    }

    if (this.initialFolder === this.folder.FormType) {
      this.documentService.UpdateDocumentFolderName(this.folder$, this.folder.FormType, this.employeekey, this.OrganizationID)
        .subscribe((data: Documents[]) => {
          alert("Successfully Updated");
          this.checkFlag = false;
          this._location.back();
        });
    }
    else {
      this.documentService.checkforForms(this.folder.FormType, this.employeekey, this.OrganizationID)
        .subscribe((data: any[]) => {
          if (data[0].count == 0) {
            this.documentService.UpdateDocumentFolderName(this.folder$, this.folder.FormType, this.employeekey, this.OrganizationID)
              .subscribe((data: Documents[]) => {
                alert("Successfully Updated");
                this.checkFlag = false;
                this._location.back();
              });
          }
          else {
            alert("Document Folder Name already exists");
            this.checkFlag = false;
            return;
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

    this.documentService.EditDocFolderName(this.folder$, this.OrganizationID).subscribe((data: any[]) => {
      this.folder = data[0]
      this.initialFolder = data[0].FormType
    });
  }
  goBack() {
    this._location.back();
  }

}
