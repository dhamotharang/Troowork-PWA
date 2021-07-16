import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { InventoryService } from '../../../../service/inventory.service';
import { Inventory } from '../../../../model-class/Inventory';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';
import { ConfirmationdialogComponent, ConfirmDialogModel } from '../../../dialog/confirmationdialog/confirmationdialog.component';

@Component({
  selector: 'app-equipment-view',
  templateUrl: './equipment-view.component.html',
  styleUrls: ['./equipment-view.component.scss']
})
export class EquipmentViewComponent implements OnInit {
  pageNo: Number = 1;
  itemsPerPage: Number = 25;
  showHide1: boolean;
  showHide2: boolean;
  pagination: Number;
  equipments: Inventory[];
  delete_EquipKey: number;
  searchform: FormGroup;
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
  previousPage() {
    this.loading = true;
    this.pageNo = +this.pageNo - 1;
    this.inventoryService
      .getEquipmentList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.equipments = data;
        this.loading = false;
        if (this.pageNo == 1) {
          this.showHide2 = true;
          this.showHide1 = false;
        } else {
          this.showHide2 = true;
          this.showHide1 = true;
        }
      });
  }

  nextPage() {
    this.loading = true;
    this.pageNo = +this.pageNo + 1;
    this.inventoryService
      .getEquipmentList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.equipments = data;
        this.loading = false;
        this.pagination = +this.equipments[0].totalItems / (+this.pageNo * (+this.itemsPerPage));
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

  searchEquipment(SearchValue) {

    var value = SearchValue.trim();

    if (value.length >= 3) {
      this.inventoryService
        .SearchEquipment(value, this.OrganizationID).subscribe((data: Inventory[]) => {
          this.equipments = data;
          this.showHide2 = false;
          this.showHide1 = false;
        });
    } else if (value.length == 0) {
      if ((value.length == 0) && (SearchValue.length == 0)) {
        this.loading = true;
      }
      this.inventoryService
        .getEquipmentList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
        .subscribe((data: Inventory[]) => {
          this.equipments = data;
          this.loading = false;
          if (this.equipments[0].totalItems > this.itemsPerPage) {
            this.showHide2 = true;
            this.showHide1 = false;
          }
          else if (this.equipments[0].totalItems <= this.itemsPerPage) {
            this.showHide2 = false;
            this.showHide1 = false;
          }
        });
    }
  }

  deleteEquipPass(EquipKey) {
    this.delete_EquipKey = EquipKey;
    const message = `Are you sure !!  Do you want to delete`;
    const dialogData = new ConfirmDialogModel("DELETE", message);
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.checkFlag = true;
        this.inventoryService
          .DeleteEquipment(this.delete_EquipKey, this.employeekey, this.OrganizationID).subscribe(() => {
            // alert("Equipment deleted successfully...");
            const dialogRef = this.dialog.open(AlertdialogComponent, {
              data: {
                message: 'Equipment deleted successfully...',
                buttonText: {
                  cancel: 'Done'
                }
              },
            });
            dialogRef.afterClosed().subscribe(dialogResult => {
              this.checkFlag = false;
              this.loading = true;
              this.inventoryService
                .getEquipmentList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
                .subscribe((data: Inventory[]) => {
                  this.equipments = data;
                  if (this.equipments[0].totalItems > this.itemsPerPage) {
                    this.loading = false;
                    this.showHide2 = true;
                    this.showHide1 = false;
                  }
                  else if (this.equipments[0].totalItems <= this.itemsPerPage) {
                    this.loading = false;
                    this.showHide2 = false;
                    this.showHide1 = false;
                  }
                });
            });
          });
      } else {
        this.checkFlag = false;
      }
    });
  }

  // deleteEquipments() {
  //   this.checkFlag = true;
  //   this.inventoryService
  //     .DeleteEquipment(this.delete_EquipKey, this.employeekey, this.OrganizationID).subscribe(() => {
  //       alert("Equipment deleted successfully...");
  //       this.checkFlag = false;
  //       this.loading = true;
  //       this.inventoryService
  //         .getEquipmentList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
  //         .subscribe((data: Inventory[]) => {
  //           this.equipments = data;
  //           if (this.equipments[0].totalItems > this.itemsPerPage) {
  //             this.loading = false;
  //             this.showHide2 = true;
  //             this.showHide1 = false;
  //           }
  //           else if (this.equipments[0].totalItems <= this.itemsPerPage) {
  //             this.loading = false;
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
    this.inventoryService
      .getEquipmentList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.equipments = data;
        this.loading = false;
        if (this.equipments[0].totalItems > this.itemsPerPage) {
          this.showHide2 = true;
          this.showHide1 = false;
        }
        else if (this.equipments[0].totalItems <= this.itemsPerPage) {
          this.showHide2 = false;
          this.showHide1 = false;
        }
      });

    this.searchform = this.formBuilder.group({
      SearchEquipment: ['', Validators.required]
    });
  }

}
