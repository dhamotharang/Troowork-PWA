import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { InspectionService } from '../../../service/inspection.service';
import { Inspection } from '../../../model-class/Inspection';
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: 'app-viewinspctnbysprvsr',
  templateUrl: './viewinspctnbysprvsr.component.html',
  styleUrls: ['./viewinspctnbysprvsr.component.scss']
})
export class ViewinspctnbysprvsrComponent implements OnInit {

  loading: boolean;// loading

  inspectionordertable;
  searchform: FormGroup;
  fromdate: Date;
  todate: Date;
  regexStr = '^[a-zA-Z0-9_ ]*$';
  @Input() isAlphaNumeric: boolean;
  ins_Key: Number;
  role: String;
  name: String;
  toServeremployeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  checkflag: boolean;
  marked = false;
  checkValue = [];
  inspectionorderKey = [];
  deleteInspection;
  deletechkbox;
  //Variables for pagination

  pageNo: Number = 1;
  itemsPerPage: Number = 25;
  showHide1: boolean;
  showHide2: boolean;
  pagination: Number;

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

  constructor(private router: Router, private formBuilder: FormBuilder, private inspectionService: InspectionService, private el: ElementRef) { }

  @HostListener('keypress', ['$event']) onKeyPress(event) {
    return new RegExp(this.regexStr).test(event.key);
  }

  @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
    this.validateFields(event);
  }
  convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(- 2),
      day = ("0" + date.getDate()).slice(- 2);
    return [date.getFullYear(), mnth, day].join("-");
  };
  validateFields(event) {
    setTimeout(() => {

      this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^A-Za-z ]/g, '').replace(/\s/g, '');
      event.preventDefault();

    }, 100)
  }
  searchTL(SearchValue) {

    var value = SearchValue.trim();

    if (value.length > 2) {
      var curr_date = new Date(Date.now());
      var newdate = this.convert_DT(curr_date);
      this.inspectionService
        .SearchTemplateandLocationbysuprvsr(value, this.OrganizationID, this.toServeremployeekey, newdate).subscribe((data: Inspection[]) => {
          this.inspectionordertable = data;

        });
    }

    else if (value.length == 0) {
      if ((value.length == 0) && (SearchValue.length == 0)) {
        this.loading = true;
      }
      var curr_date = new Date(Date.now());
      var newdate = this.convert_DT(curr_date);
      this.inspectionService
        .getInspectionOrderTablewithCurrentDatefrsprvsr(newdate, this.toServeremployeekey, this.OrganizationID)
        .subscribe((data: Inspection[]) => {
          this.inspectionordertable = data;
          this.loading = false;
        });
    }

  }
  //functions for pagination

  nextPage() {
    this.loading = true;// loading
    var curr_date = this.convert_DT(Date.now());
    this.pageNo = +this.pageNo + 1;
    this.inspectionService
      .getInspectionOrderTablewithCurrentDatefrsprvsr(curr_date, this.toServeremployeekey, this.OrganizationID)
      .subscribe((data: Inspection[]) => {
        this.inspectionordertable = data;
        this.loading = false;// loading
        this.pagination = +this.inspectionordertable[0].totalItems / (+this.pageNo * (+this.itemsPerPage));
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
  previousPage() {
    this.loading = false;// loading
    var curr_date = this.convert_DT(new Date());
    this.pageNo = +this.pageNo - 1;
    this.inspectionService
      .getInspectionOrderTablewithCurrentDatefrsprvsr(curr_date, this.toServeremployeekey, this.OrganizationID)
      .subscribe((data: Inspection[]) => {
        this.inspectionordertable = data;
        this.loading = false;// loading
        if (this.pageNo == 1) {
          this.showHide2 = true;
          this.showHide1 = false;
        } else {
          this.showHide2 = true;
          this.showHide1 = true;
        }
      });
  }

  //functions for pagination 

  ngOnInit() {

    //token starts....
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.toServeremployeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;

    //token ends
    this.checkflag = false;
    var curr_date = this.convert_DT(Date.now());
    this.inspectionService
      .getInspectionOrderTablewithCurrentDatefrsprvsr(curr_date, this.toServeremployeekey, this.OrganizationID)
      .subscribe((data: Inspection[]) => {
        this.inspectionordertable = data;
      });
    this.searchform = this.formBuilder.group({
      SearchTL: ['', Validators.required]
    });
  }

  inspectionDetail(InspectionOrderKey) {
    this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['ViewInspectionManager', InspectionOrderKey] } }]);
  }

  // delete inspection..... starts

  toggleVisibility(e) {
    
    if (e.target.checked) {
      this.marked = true;
    } else {
      this.marked = false;
    }
  }
  //for deleting inspection
  checkBoxValueForDelete(index, CheckValue, inspectionorderkey) {
    
    this.checkValue[index] = CheckValue;
    this.inspectionorderKey[index] = inspectionorderkey;
    for (var i = 0; i < this.checkValue.length;) {
      if (this.checkValue[i] == true) {
        this.checkflag = true;
        return;
      }
      else {
        if (i == (this.checkValue.length - 1)) {
          this.checkValue = [];
          this.checkflag = false;
          return;
        }
        i++;
      }
    }
  }
  deleteInspectionOrder() {

    var deleteInspectionOrderList = [];
    var deleteInspectionOrderString;

    if (this.checkValue.length > 0) {
      for (var j = 0; j < this.checkValue.length; j++) {
        if (this.checkValue[j] === true)
          deleteInspectionOrderList.push(this.inspectionorderKey[j]);
      }
      deleteInspectionOrderString = deleteInspectionOrderList.join(',');
    }
    this.deleteInspection = {
      deleteInspectionOrderList: deleteInspectionOrderString,
      employeekey: this.toServeremployeekey,
      OrganizationID: this.OrganizationID
    };
    this.inspectionService//service for deleting inspection
      .delete_InspectionOrder(this.deleteInspection)
      .subscribe((data: any[]) => {
        this.inspectionordertable.deletechkbox = false;
        this.checkValue = [];
        this.checkflag = false;
        this.inspectionorderKey = [];
        alert("Inspection deleted successfully");
        var curr_date = this.convert_DT(new Date());
        this.inspectionService
          .getInspectionOrderTablewithCurrentDatefrsprvsr(curr_date, this.toServeremployeekey, this.OrganizationID)
          .subscribe((data: Inspection[]) => {
            this.inspectionordertable = data;
          });
        // this.filteringInspectionManagerByDate();

      });
  }
  // delete inspection ... ends.....

}
