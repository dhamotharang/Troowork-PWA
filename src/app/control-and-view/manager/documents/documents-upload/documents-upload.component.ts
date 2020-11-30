import { Component, OnInit } from '@angular/core';
import { DocumentserviceService } from '../../../../service/documentservice.service';
import { Documents } from '../../../../model-class/Documents';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { ConectionSettings } from '../../../../service/ConnectionSetting';
const url = ConectionSettings.Url + '/upload_test';

@Component({
  selector: 'app-documents-upload',
  templateUrl: './documents-upload.component.html',
  styleUrls: ['./documents-upload.component.scss']
})

export class DocumentsUploadComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  fileCheck;
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

  documentsList: Documents[];
  FormtypeId;
  DescName: any;
  addUrl;

  public uploader: FileUploader = new FileUploader({ url: '', itemAlias: 'photo' });

  constructor(private documentService: DocumentserviceService) { }



  ngOnInit() {
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;

    this.FormtypeId = "";

    this.documentService
      .getDocumentFolderNamesfordropdown(this.employeekey, this.OrganizationID)
      .subscribe((data: Documents[]) => {
        this.documentsList = data;
      });

    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:uploaded:', item, status, response);
      alert('File uploaded successfully');
    };
  }
  FileSelected() {
    if (!(this.FormtypeId)) {
      alert("Please choose Document Folder");
      return;
    }
    if(this.DescName){
      this.DescName=this.DescName.trim();
    }
    this.addUrl = '?formtypeId=' + this.FormtypeId + '&formDesc=' + this.DescName + '&empkey=' + this.employeekey + '&OrganizationID=' + this.OrganizationID;
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      item.url = url + this.addUrl;
    }
    this.uploader.uploadAll();
  }
}
