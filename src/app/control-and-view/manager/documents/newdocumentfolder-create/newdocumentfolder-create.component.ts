import { Component, OnInit } from '@angular/core';
import { DocumentserviceService } from '../../../../service/documentservice.service';
import { Documents } from '../../../../model-class/Documents';
import { Router } from '@angular/router';

import { Location } from '@angular/common';
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

  constructor(private documentService: DocumentserviceService, private router: Router, private _location: Location) { }

  addDocFold() {
    if (this.DocFolderName && !this.DocFolderName.trim()) {
      alert("Please Enter Document Folder Name!");
      return;
    }
    if (!this.DocFolderName) {
      alert("Document Folder Name not provided");
      return;
    }
    if(this.DocFolderName){
      this.DocFolderName=this.DocFolderName.trim();
    }
    //  else
    this.documentService.checkforForms(this.DocFolderName, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
      if (data[0].count == 0) {
        this.documentService.CreateNewDocumentFolder(this.DocFolderName, this.employeekey, this.OrganizationID).subscribe((data: Documents[]) => {
          alert("Successfully Added");
          this._location.back();
        });
      }
      else {
        alert("Document Folder Name already exists");
        return;
      }
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

  }

  goBack() {
    this._location.back();
  }

}
