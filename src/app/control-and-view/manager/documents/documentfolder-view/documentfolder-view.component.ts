import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { DocumentserviceService } from '../../../../service/documentservice.service';
import { Documents } from '../../../../model-class/Documents';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationdialogComponent, ConfirmDialogModel } from '../../../dialog/confirmationdialog/confirmationdialog.component';
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

  searchform: FormGroup;
  documents: Documents[];
  delete_foldKey: number;
  //validation starts ..... @Pooja
  regexStr = '^[a-zA-Z0-9_ ]*$';
  @Input() isAlphaNumeric: boolean;
  constructor(private formBuilder: FormBuilder, private documentService: DocumentserviceService, private el: ElementRef, private dst: DataServiceTokenStorageService, private dialog: MatDialog) { }
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
    var value = SearchValue.trim();
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
          this.loading = false;
        });

    }
  };
  // deleteFolder() {

  //   this.checkFlag = true;
  //   this.documentService
  //     .DeleteDocFolder(this.delete_foldKey, this.OrganizationID).subscribe(() => {

  //       this.checkFlag = false;
  //       this.documentService
  //         .getDocumentFoldersDataTable(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
  //         .subscribe((data: Documents[]) => {
  //           this.documents = data;
  //         });

  //     });
  // }
  deleteFolderPass(FormtypeId) {
    this.delete_foldKey = FormtypeId;
    this.checkFlag = true;
    const message = `Are you sure !!  Do you want to delete`;
    const dialogData = new ConfirmDialogModel("DELETE", message);
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.documentService
          .DeleteDocFolder(this.delete_foldKey, this.OrganizationID).subscribe(() => {
            this.checkFlag = false;
            this.documentService
              .getDocumentFoldersDataTable(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
              .subscribe((data: Documents[]) => {
                this.documents = data;
              });
          });
      } else {
        this.checkFlag = false;
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
