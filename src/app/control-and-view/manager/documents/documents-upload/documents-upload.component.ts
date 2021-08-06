import { Component, OnInit } from '@angular/core';
import { DocumentserviceService } from '../../../../service/documentservice.service';
import { Documents } from '../../../../model-class/Documents';
import { FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { ConectionSettings } from '../../../../service/ConnectionSetting';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';
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
  // For file upload
  public uploader: FileUploader = new FileUploader({ url: '', itemAlias: 'photo' });

  constructor(private documentService: DocumentserviceService, private dst: DataServiceTokenStorageService, private dialog: MatDialog) { }



  ngOnInit() {
    // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.employeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();
    this.FormtypeId = "";
    // Call for document folder names
    this.documentService
      .getDocumentFolderNamesfordropdown(this.employeekey, this.OrganizationID)
      .subscribe((data: Documents[]) => {
        this.documentsList = data;
      });
    // file upload code starts...
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:uploaded:', item, status, response);
      // alert('File uploaded successfully');
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'File uploaded successfully... !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
    };
    // file upload code ends...
  }
  FileSelected() {
    if (!(this.FormtypeId)) {
      // alert("Please choose Document Folder");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please choose Document Folder... !',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      return;
    }
    if (this.DescName) {
      this.DescName = this.DescName.trim();
    }
    // file upload code starts...
    this.addUrl = '?formtypeId=' + this.FormtypeId + '&formDesc=' + this.DescName + '&empkey=' + this.employeekey + '&OrganizationID=' + this.OrganizationID;
    this.uploader.onBeforeUploadItem = (item) => {
      item.withCredentials = false;
      item.url = url + this.addUrl;
    }
    this.uploader.uploadAll();
    // file upload code ends...
  }
}
