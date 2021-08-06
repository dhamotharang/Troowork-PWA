import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { DocumentserviceService } from '../../../../service/documentservice.service';
import { Documents } from '../../../../model-class/Documents';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
// import {saveAs as importedSaveAs} from "file-saver";
// import { Http, ResponseContentType } from '@angular/http';
// import {  } from '../../../../../../uploads';
@Component({
  selector: 'app-view-documents',
  templateUrl: './view-documents.component.html',
  styleUrls: ['./view-documents.component.scss']
})
export class ViewDocumentsComponent implements OnInit {
  searchform: FormGroup;
  documentsList: Documents[];
  viewFolderDescriptionTable: Documents[];
  searchFlag: any;
  page: Number = 1;
  count: Number = 25;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  FormtypeId;
  loading: boolean;
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


  regexStr = '^[a-zA-Z0-9_ ]*$';
  @Input() isAlphaNumeric: boolean;
  constructor(private formBuilder: FormBuilder, private documentService: DocumentserviceService, private el: ElementRef, private dst: DataServiceTokenStorageService) { }
  @HostListener('keypress', ['$event']) onKeyPress(event) {
    return new RegExp(this.regexStr).test(event.key);
  }

  @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
    this.validateFields(event);
  }

  validateFields(event) {
    setTimeout(() => {

      this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^A-Za-z ]/g, '').replace(/\s/g, '');
      event.preventDefault();

    }, 100)
  }
  // Function to call recent uploads
  RecentUpdates() {
    this.documentService
      .getRecentUploads(this.page, this.count, this.employeekey, this.OrganizationID)
      .subscribe((data: Documents[]) => {
        this.searchFlag = true;
        this.viewFolderDescriptionTable = data;
      });
  }

  // Function for search 
  searchFNDN(SearchValue) {
    var value = SearchValue.trim();
    if (value.length >= 3) {
      this.documentService
        .SearchFileNameandDescName(this.OrganizationID, value).subscribe((data: Documents[]) => {
          this.viewFolderDescriptionTable = data;

        });
    }
    else if (value.length == 0) {
      if (!(this.FormtypeId)) {
        this.documentService
          .getRecentUploads(this.page, this.count, this.employeekey, this.OrganizationID)
          .subscribe((data: Documents[]) => {
            this.searchFlag = true;
            this.viewFolderDescriptionTable = data;
          });
      }
      else {
        this.documentService
          .getFileDetailsTablewithDropdown(this.FormtypeId, this.employeekey, this.OrganizationID).subscribe((data: Documents[]) => {
            this.searchFlag = true;
            this.viewFolderDescriptionTable = data;
          });
      }
    }
  }
  
  showFileDetailsTablebydropdown(formtype) {
    if (!(this.FormtypeId)) {
      this.documentService
        .getRecentUploads(this.page, this.count, this.employeekey, this.OrganizationID)
        .subscribe((data: Documents[]) => {
          this.searchFlag = true;
          this.viewFolderDescriptionTable = data;
        });
    }
    this.documentService
      .getFileDetailsTablewithDropdown(formtype, this.employeekey, this.OrganizationID).subscribe((data: Documents[]) => {
        this.searchFlag = true;
        this.viewFolderDescriptionTable = data;
      });
  }
  // downloadFile(){
  //   return this.http
  //   .get('https://jslim.net/path/to/file/download', {
  //     responseType: ResponseContentType.Blob
  //     // search:
  //   })
  //   .map(res => {
  //     return {
  //       filename: 'filename.pdf',
  //       data: res.blob()
  //     };
  //   })
  //   .subscribe(res => {
  //       var url = window.URL.createObjectURL(res.data);
  //       var a = document.createElement('a');
  //       document.body.appendChild(a);
  //       a.setAttribute('style', 'display: none');
  //       a.href = url;
  //       a.download = res.filename;
  //       a.click();
  //       window.URL.revokeObjectURL(url);
  //       a.remove(); // remove the element
  //     }, error => {
  //     }, () => {
  //     });
  // }

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
    this.documentService
      .getDocumentFolderNamesfordropdown(this.employeekey, this.OrganizationID)
      .subscribe((data: Documents[]) => {
        this.documentsList = data;
      });
    this.searchform = this.formBuilder.group({
      searchFileDescName: ['', Validators.required]
    });
  }

}
