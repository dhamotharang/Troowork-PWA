import { Component, OnInit, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { InventoryService } from '../../../../service/inventory.service';
import { Inventory } from '../../../../model-class/Inventory';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
@Component({
  selector: 'app-zone-view',
  templateUrl: './zone-view.component.html',
  styleUrls: ['./zone-view.component.scss']
})
export class ZoneViewComponent implements OnInit {
  pageNo: Number = 1;
  showHide1: boolean;
  showHide2: boolean;
  pagination: Number;
  zone: Inventory[];
  searchform: FormGroup;
  loading: boolean;
  delete_faciKey: number;
  delete_floorKey: number;
  delete_zoneKey: number;
  itemsperPage: Number = 25;
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
  constructor(private formBuilder: FormBuilder, private inventoryService: InventoryService, private el: ElementRef, private dst: DataServiceTokenStorageService) { }
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
      .getZones(this.pageNo, this.itemsperPage, this.employeekey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.zone = data;
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
      .getZones(this.pageNo, this.itemsperPage, this.employeekey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.zone = data;
        this.loading = false;
        this.pagination = +this.zone[0].totalItems / (+this.pageNo * (+this.itemsperPage));
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


  searchZone(SearchValue) {

    var value = SearchValue.trim();

    if (value.length >= 3) {
      this.inventoryService
        .searchZone(value, this.OrganizationID).subscribe((data: Inventory[]) => {
          this.zone = data;
          this.showHide2 = false;
          this.showHide1 = false;
        });
    } else if (value.length == 0) {
      if ((value.length == 0) && (SearchValue.length == 0)) {
        this.loading = true;
      }
      this.inventoryService
        .getZones(this.pageNo, this.itemsperPage, this.employeekey, this.OrganizationID)
        .subscribe((data: Inventory[]) => {
          this.zone = data;
          this.loading = false;
          if (this.zone[0].totalItems > this.itemsperPage) {
            this.showHide2 = true;
            this.showHide1 = false;
          }
          else if (this.zone[0].totalItems <= this.itemsperPage) {
            this.showHide2 = false;
            this.showHide1 = false;
          }
        });
    }
  };

  deleteZoneValuePass(FacilityKey, FloorKey, ZoneKey) {
    this.delete_faciKey = FacilityKey;
    this.delete_floorKey = FloorKey;
    this.delete_zoneKey = ZoneKey;
  }

  deleteZone() {
    this.checkFlag = true;
    this.inventoryService
      .DeleteZone(this.delete_faciKey, this.delete_floorKey, this.delete_zoneKey, this.employeekey, this.OrganizationID).subscribe(res => {
        alert("Zone deleted successfully");
        this.checkFlag = false;
        this.loading = true;
        this.inventoryService
          .getZones(this.pageNo, this.itemsperPage, this.employeekey, this.OrganizationID)
          .subscribe((data: Inventory[]) => {
            this.zone = data;
            this.loading = false;
            if (this.zone[0].totalItems > this.itemsperPage) {
              this.showHide2 = true;
              this.showHide1 = false;
            }
            else if (this.zone[0].totalItems <= this.itemsperPage) {
              this.showHide2 = false;
              this.showHide1 = false;
            }
          });

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
    this.loading = true;
    this.checkFlag = false;
    this.inventoryService
      .getZones(this.pageNo, this.itemsperPage, this.employeekey, this.OrganizationID)
      .subscribe((data: Inventory[]) => {
        this.zone = data;
        this.loading = false;
        if (this.zone[0].totalItems > this.itemsperPage) {
          this.showHide2 = true;
          this.showHide1 = false;
        }
        else if (this.zone[0].totalItems <= this.itemsperPage) {
          this.showHide2 = false;
          this.showHide1 = false;
        }
      });

    this.searchform = this.formBuilder.group({
      SearchZone: ['', Validators.required]
    });
  }
}
