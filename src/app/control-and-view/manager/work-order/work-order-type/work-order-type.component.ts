import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { workorder } from '../../../../model-class/work-order';
import { WorkOrderServiceService } from '../../../../service/work-order-service.service';

@Component({
  selector: 'app-work-order-type',
  templateUrl: './work-order-type.component.html',
  styleUrls: ['./work-order-type.component.scss']
})
export class WorkOrderTypeComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  pageno: Number = 1;
  items_perpage: Number = 25;
  showHide1: boolean;
  showHide2: boolean;
  pagination: Number;
  loading: boolean;// loading
  //decode token
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
  workorderTypeList;
  delete_WOType;
  wot_key;
  //special character restriction
  searchform: FormGroup;
  regexStr = '^[a-zA-Z0-9_ ]*$';
  @Input() isAlphaNumeric: boolean;
  constructor(private formBuilder: FormBuilder, private WorkOrderServiceService: WorkOrderServiceService, private el: ElementRef) { }
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
  //code for pagination
  previousPage() {
    this.pageno = +this.pageno - 1;
    this.WorkOrderServiceService
    .getall_workordertype(this.pageno, this.items_perpage, this.employeekey, this.OrganizationID)
    .subscribe((data: any[]) => {
      this.workorderTypeList = data;
        if (this.pageno == 1) {
          this.showHide2 = true;
          this.showHide1 = false;
        } else {
          this.showHide2 = true;
          this.showHide1 = true;
        }
      });
  }

  nextPage() {
    this.pageno = +this.pageno + 1;
    this.WorkOrderServiceService
    .getall_workordertype(this.pageno, this.items_perpage, this.employeekey, this.OrganizationID)
    .subscribe((data: any[]) => {
      this.workorderTypeList = data;
        this.pagination = +this.workorderTypeList[0].totalItems / (+this.pageno * (+this.items_perpage));
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
  //
  ngOnInit() {
    this.loading = true;
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;
    this.WorkOrderServiceService
      .getall_workordertype(this.pageno, this.items_perpage, this.employeekey, this.OrganizationID)//service for gettig all workorder type on pageload
      .subscribe((data: any[]) => {
        this.workorderTypeList = data;
        this.loading = false;
        if (this.workorderTypeList[0].totalItems > this.items_perpage) {
          this.showHide2 = true;
          this.showHide1 = false;
        }
        else if (this.workorderTypeList[0].totalItems <= this.items_perpage) {
          this.showHide2 = false;
          this.showHide1 = false;
        }
      });
    this.searchform = this.formBuilder.group({
      searchworkordertype: ['', Validators.required]
    });
  }
  //function called on search
  searchWOType(key) {
    var value = key.trim();
    if(value.length>=3)//if search key length>3 search service is called
    {
    this.WorkOrderServiceService
      .search_workordertype(this.OrganizationID, value)
      .subscribe((data: any[]) => {
        this.workorderTypeList = data;
        this.showHide2 = false;
          this.showHide1 = false;
      });
    }
    else if(value.length==0)//if search key length=0 original table is returned
    {
      if ((value.length == 0) && (key.length == 0)) {
        this.loading = true;
      }
      this.WorkOrderServiceService//service for loading current table
      .getall_workordertype(this.pageno, this.items_perpage, this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.workorderTypeList = data;
        this.loading=false;
        if (this.workorderTypeList[0].totalItems > this.items_perpage) {
          this.showHide2 = true;
          this.showHide1 = false;
        }
        else if (this.workorderTypeList[0].totalItems <= this.items_perpage) {
          this.showHide2 = false;
          this.showHide1 = false;
        }
      });
    }

  }
  //function to assign value of current wot(for delete)
  passWOT(key) {
    this.wot_key = key;
  }
  //function to delete current workordertype key
  deleteWOType() {
    this.loading = true;
    this.delete_WOType = {
      WorkorderTypeKey: this.wot_key,
      OrganizationID: this.OrganizationID
    };
    this.WorkOrderServiceService
      .DeleteWOT(this.delete_WOType).subscribe(() => {
        alert("Work-order type deleted successfully");
        this.WorkOrderServiceService
          .getall_workordertype(this.pageno, this.items_perpage, this.employeekey, this.OrganizationID)
          .subscribe((data: any[]) => {
            this.workorderTypeList = data;
            this.loading = false;
            if (this.workorderTypeList[0].totalItems > this.items_perpage) {
              this.showHide2 = true;
              this.showHide1 = false;
            }
            else if (this.workorderTypeList[0].totalItems <= this.items_perpage) {
              this.showHide2 = false;
              this.showHide1 = false;
            }
          });

      });
  }

}
