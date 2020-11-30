import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { InventoryService } from '../../../../service/inventory.service';
import { Inventory } from '../../../../model-class/Inventory';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";

import {Location} from '@angular/common';

@Component({
  selector: 'app-floor-type-view',
  templateUrl: './floor-type-view.component.html',
  styleUrls: ['./floor-type-view.component.scss']
})
export class FloorTypeViewComponent implements OnInit {
  pageNo: Number = 1;
  itemsPerPage: Number = 25;
  showHide1: boolean;
  showHide2: boolean;
  pagination: Number;
  floorType: Inventory[];
  delete_FloorTypeKey: number;
  searchform: FormGroup;
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

  //validation starts ..... @rodney
  regexStr = '^[a-zA-Z0-9_ ]*$';
  @Input() isAlphaNumeric: boolean;
  constructor(private formBuilder: FormBuilder, private inventoryService: InventoryService, private el: ElementRef,private _location: Location) { }
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
      .getFloorTypeList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.floorType = data;
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
      .getFloorTypeList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.floorType = data;
        this.loading = false;
        this.pagination = +this.floorType[0].totalItems / (+this.pageNo * (+this.itemsPerPage));
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

  searchFloorType(SearchValue) {

    var value=SearchValue.trim();

    if (value.length >= 3) {
      this.inventoryService
        .SearchFloorType(value, this.OrganizationID).subscribe((data: Inventory[]) => {
          this.floorType = data;
          this.showHide2 = false;
          this.showHide1 = false;
        });
    } else if (value.length == 0) {
      if((value.length == 0) &&(SearchValue.length == 0) )
      {
     this.loading = true;
      }
      this.inventoryService
        .getFloorTypeList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
        .subscribe((data: Inventory[]) => {
          this.floorType = data;
          this.loading = false;
          if (this.floorType[0].totalItems > this.itemsPerPage) {
            this.showHide2 = true;
            this.showHide1 = false;
          }
          else if (this.floorType[0].totalItems <= this.itemsPerPage) {
            this.showHide2 = false;
            this.showHide1 = false;
          }
        });
    }
  }

  deleteFloorTypePass(FloorTypeKey) {
    this.delete_FloorTypeKey = FloorTypeKey;
  }

  deleteFloorType() {
    this.inventoryService
      .DeleteFloorType(this.delete_FloorTypeKey, this.employeekey, this.OrganizationID).subscribe(() => {
        alert("Floor Type deleted successfully...");
        this.loading = true;
        this.inventoryService
          .getFloorTypeList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
          .subscribe((data: Inventory[]) => {
            this.floorType = data;
            this.loading = false;
            if (this.floorType[0].totalItems > this.itemsPerPage) {
              this.showHide2 = true;
              this.showHide1 = false;
            }
            else if (this.floorType[0].totalItems <= this.itemsPerPage) {
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
    this.loading = true;
    this.inventoryService
      .getFloorTypeList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.floorType = data;
        this.loading = false;
        if (this.floorType[0].totalItems > this.itemsPerPage) {
          this.showHide2 = true;
          this.showHide1 = false;
        }
        else if (this.floorType[0].totalItems <= this.itemsPerPage) {
          this.showHide2 = false;
          this.showHide1 = false;
        }
      });

    this.searchform = this.formBuilder.group({
      SearchFloorType: ['', Validators.required]
    });
  }
  goBack(){
    this._location.back();
  }
}
