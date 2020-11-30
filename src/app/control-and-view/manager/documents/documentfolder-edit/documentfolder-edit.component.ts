import { Component, OnInit } from '@angular/core';
import { DocumentserviceService } from '../../../../service/documentservice.service';
import { Documents } from '../../../../model-class/Documents';
import { ActivatedRoute, Router } from "@angular/router";

import { Location } from '@angular/common';
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


  constructor(private route: ActivatedRoute, private documentService: DocumentserviceService, private router: Router, private _location: Location) {
    this.route.params.subscribe(params => this.folder$ = params.FormtypeId);
  }

  updateFolderName() {
    if (this.folder.FormType && !this.folder.FormType.trim()) {
      alert("Please Enter Document Folder Name!");
      return;
    }
    if (!this.folder.FormType) {
      alert("Document Folder Name not provided");
      return;
    }
    // else
    if (this.folder.FormType) {
      this.folder.FormType = this.folder.FormType.trim();
    }

    if(this.initialFolder===this.folder.FormType){
      this.documentService.UpdateDocumentFolderName(this.folder$, this.folder.FormType, this.employeekey, this.OrganizationID)
      .subscribe((data: Documents[]) => {
        alert("Successfully Updated");
        this._location.back();
      });
    }
    else{ 
    this.documentService.checkforForms(this.folder.FormType, this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        if (data[0].count == 0) {
          this.documentService.UpdateDocumentFolderName(this.folder$, this.folder.FormType, this.employeekey, this.OrganizationID)
            .subscribe((data: Documents[]) => {
              alert("Successfully Updated");
              this._location.back();
            });
        }
        else {
          alert("Document Folder Name already exists");
          return;
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

    this.documentService.EditDocFolderName(this.folder$, this.OrganizationID).subscribe((data: any[]) => {
      this.folder = data[0]
      this.initialFolder=data[0].FormType
    });
  }
  goBack() {
    this._location.back();
  }

}
