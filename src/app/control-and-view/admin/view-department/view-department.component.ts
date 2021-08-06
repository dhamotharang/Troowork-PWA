import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { InventoryService } from '../../../service/inventory.service';
import { Inventory } from '../../../model-class/Inventory';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";

import { DataServiceTokenStorageService } from '../../../service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationdialogComponent, ConfirmDialogModel } from '../../dialog/confirmationdialog/confirmationdialog.component';
@Component({
  selector: 'app-view-department',
  templateUrl: './view-department.component.html',
  styleUrls: ['./view-department.component.scss']
})
export class ViewDepartmentComponent implements OnInit {
  pageNo: Number = 1;
  itemsPerPage: Number = 25;
  showHide1: boolean;
  showHide2: boolean;
  pagination: Number;
  departments: Inventory[];
  delete_DeptKey: number;
  searchform: FormGroup;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  loading: boolean;// loading
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

  // Function to go to the previous page of pagination of department list
  previousPage() {
    this.pageNo = +this.pageNo - 1;
    this.inventoryService
      .getDepartmentList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.departments = data;
        if (this.pageNo == 1) {
          this.showHide2 = true;
          this.showHide1 = false;
        } else {
          this.showHide2 = true;
          this.showHide1 = true;
        }
      });
  }

  // Function to go to the next page of pagination of department list
  nextPage() {
    this.pageNo = +this.pageNo + 1;
    this.inventoryService
      .getDepartmentList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.departments = data;
        this.pagination = +this.departments[0].totalItems / (+this.pageNo * (+this.itemsPerPage));
        if (this.pagination > 1) {
          this.showHide2 = true;
          this.showHide1 = true;
        }
        else {
          this.showHide2 = false;
          this.showHide1 = true;
        }
      });
  }
  //validation starts ..... @rodney
  regexStr = '^[a-zA-Z0-9_ ]*$';
  @Input() isAlphaNumeric: boolean;
  constructor(private formBuilder: FormBuilder, private inventoryService: InventoryService, private el: ElementRef, private dst: DataServiceTokenStorageService, private dialog: MatDialog) { }
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

  //validation ends ..... @rodney
  // Function to search from the department list
  searchDepartment(SearchValue) {
    var value = SearchValue.trim();
    if (value.length >= 3) {
      this.inventoryService
        .SearchDepartment(value, this.OrganizationID).subscribe((data: Inventory[]) => {
          this.departments = data;
          this.showHide2 = false;
          this.showHide1 = false;
        });
    } else if (value.length == 0) {
      if ((value.length == 0) && (SearchValue.length == 0)) {
        this.loading = true;
      }
      this.inventoryService
        .getDepartmentList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
        .subscribe((data: Inventory[]) => {
          this.departments = data;
          this.loading = false;
          if (this.departments[0].totalItems > this.itemsPerPage) {
            this.showHide2 = true;
            this.showHide1 = false;
          }
          else if (this.departments[0].totalItems <= this.itemsPerPage) {
            this.showHide2 = false;
            this.showHide1 = false;
          }
        });
    }
  }

  // Function to delete the department
  deleteDeptPass(DeptKey) {
    this.delete_DeptKey = DeptKey;
    this.checkFlag = true;
    const message = `Are you sure !!  Do you want to delete`;
    const dialogData = new ConfirmDialogModel("DELETE", message);
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.inventoryService
          .DeleteDepartment(this.delete_DeptKey, this.OrganizationID).subscribe(() => {
            this.checkFlag = false;
            this.inventoryService
              .getDepartmentList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
              .subscribe((data: Inventory[]) => {
                this.departments = data;
                if (this.departments[0].totalItems > this.itemsPerPage) {
                  this.showHide2 = true;
                  this.showHide1 = false;
                }
                else if (this.departments[0].totalItems <= this.itemsPerPage) {
                  this.showHide2 = false;
                  this.showHide1 = false;
                }
              });
          });
      } else {
        this.checkFlag = false;
      }
    });
  }

  // deleteDepartment() {
  //   this.inventoryService
  //     .DeleteDepartment(this.delete_DeptKey, this.OrganizationID).subscribe(() => {
  //       this.checkFlag = false;
  //       this.inventoryService
  //         .getDepartmentList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
  //         .subscribe((data: Inventory[]) => {
  //           this.departments = data;
  //           if (this.departments[0].totalItems > this.itemsPerPage) {
  //             this.showHide2 = true;
  //             this.showHide1 = false;
  //           }
  //           else if (this.departments[0].totalItems <= this.itemsPerPage) {
  //             this.showHide2 = false;
  //             this.showHide1 = false;
  //           }
  //         });
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
    this.loading = true;
    this.checkFlag = false;
    // Call to get the department list
    this.inventoryService
      .getDepartmentList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.departments = data;
        this.loading = false;
        if (this.departments[0].totalItems > this.itemsPerPage) {
          this.showHide2 = true;
          this.showHide1 = false;
        }
        else if (this.departments[0].totalItems <= this.itemsPerPage) {
          this.showHide2 = false;
          this.showHide1 = false;
        }
      });

    this.searchform = this.formBuilder.group({
      SearchDepartment: ['', Validators.required]
    });
  }
}
