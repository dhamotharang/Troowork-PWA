import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { DocumentserviceService } from '../../../../service/documentservice.service';
import { Documents } from '../../../../model-class/Documents';
@Component({
  selector: 'app-documentfolder-view',
  templateUrl: './documentfolder-view.component.html',
  styleUrls: ['./documentfolder-view.component.scss']
})
export class DocumentfolderViewComponent implements OnInit {
  pageNo: Number = 1;
  itemsPerPage: Number = 25;
  showHide1: boolean;
  showHide2: boolean;
  pagination: Number;
  loading: boolean;
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

  searchform: FormGroup;
  documents: Documents[];
  delete_foldKey: number;
  //validation starts ..... @Pooja
  regexStr = '^[a-zA-Z0-9_ ]*$';
  @Input() isAlphaNumeric: boolean;
  constructor(private formBuilder: FormBuilder, private documentService: DocumentserviceService, private el: ElementRef) { }
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

  //validation ends ..... @Pooja

  searchDocumentFolder(SearchValue) {
    var value=SearchValue.trim();
    if (value.length >= 3) {
    this.documentService
      .SearchDocFolder(this.OrganizationID, value).subscribe((data: Documents[]) => {
        this.documents = data;
      });
    }
    else if (value.length == 0) {
      if ((value.length == 0) && (SearchValue.length == 0)) {
        this.loading = true;
      }
      this.documentService
      .getDocumentFoldersDataTable(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
      .subscribe((data: Documents[]) => {
        this.documents = data;
        this.loading=false;
      });

    }
  };
  deleteFolder() {

    this.documentService
      .DeleteDocFolder(this.delete_foldKey, this.OrganizationID).subscribe(() => {

        this.documentService
          .getDocumentFoldersDataTable(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
          .subscribe((data: Documents[]) => {
            this.documents = data;
          });

      });
  }
  deleteFolderPass(FormtypeId) {
    this.delete_foldKey = FormtypeId;
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

    this.documentService
      .getDocumentFoldersDataTable(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
      .subscribe((data: Documents[]) => {
        this.documents = data;
      });

    this.searchform = this.formBuilder.group({
      SearchDocFol: ['', Validators.required]
    });
  }

}
