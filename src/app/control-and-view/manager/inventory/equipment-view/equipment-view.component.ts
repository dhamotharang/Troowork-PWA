import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { InventoryService } from '../../../../service/inventory.service';
import { Inventory } from '../../../../model-class/Inventory';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";

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
  loading:boolean;
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

  //validation starts ..... @rodney
  regexStr = '^[a-zA-Z0-9_ ]*$';
  @Input() isAlphaNumeric: boolean;
  constructor(private formBuilder: FormBuilder, private inventoryService: InventoryService, private el: ElementRef) { }
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
    this.loading=true;
    this.pageNo = +this.pageNo - 1;
    this.inventoryService
      .getEquipmentList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.equipments = data;
        this.loading=false;
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
    this.loading=true;
    this.pageNo = +this.pageNo + 1;
    this.inventoryService
      .getEquipmentList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.equipments = data;
        this.loading=false;
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

    var value=SearchValue.trim();

    if (value.length >= 3) {
      this.inventoryService
        .SearchEquipment(value, this.OrganizationID).subscribe((data: Inventory[]) => {
          this.equipments = data;
          this.showHide2 = false;
          this.showHide1 = false;
        });
    } else if (value.length == 0) {
      if((value.length == 0) &&(SearchValue.length == 0) )
      {
     this.loading = true;
      }
      this.inventoryService
        .getEquipmentList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
        .subscribe((data: Inventory[]) => {
          this.equipments = data;
          this.loading=false;
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
  }

  deleteEquipments() {
    this.inventoryService
      .DeleteEquipment(this.delete_EquipKey, this.employeekey, this.OrganizationID).subscribe(() => {
        alert("Equipment deleted successfully...");
        this.loading=true;
        this.inventoryService
          .getEquipmentList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
          .subscribe((data: Inventory[]) => {
            this.equipments = data;
            if (this.equipments[0].totalItems > this.itemsPerPage) {
              this.loading=false;
              this.showHide2 = true;
              this.showHide1 = false;
            }
            else if (this.equipments[0].totalItems <= this.itemsPerPage) {
              this.showHide2 = false;
              this.showHide1 = false;
            }
          });
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
    this.loading=true;
    this.inventoryService
      .getEquipmentList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.equipments = data;
        this.loading=false;
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
