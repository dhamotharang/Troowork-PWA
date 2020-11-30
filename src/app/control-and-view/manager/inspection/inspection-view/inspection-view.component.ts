import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { InspectionService } from '../../../../service/inspection.service';
import { Inspection } from '../../../../model-class/Inspection';
import { ActivatedRoute, Router } from "@angular/router";
import { DatepickerOptions } from 'ng2-datepicker';
@Component({
  selector: 'app-inspection-view',
  templateUrl: './inspection-view.component.html',
  styleUrls: ['./inspection-view.component.scss']
})
export class InspectionViewComponent implements OnInit {

  loading: boolean;// loading

  inspectionordertable: any;
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
  // adding properties and methods that will be used by the igxDatePicker

  public date: Date = new Date(Date.now());

  private dayFormatter = new Intl.DateTimeFormat('en', { weekday: 'long' });
  private monthFormatter = new Intl.DateTimeFormat('en', { month: 'long' });

  public formatter = (_: Date) => {
    return `You selected ${this.dayFormatter.format(_)}, ${_.getDate()} ${this.monthFormatter.format(_)}, ${_.getFullYear()}`;
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
  options: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2030,
    displayFormat: 'MM/DD/YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    //locale: frLocale,
    //minDate: new Date(Date.now()), // Minimal selectable date
    //maxDate: new Date(Date.now()),  // Maximal selectable date
    barTitleIfEmpty: 'Click to select a date',
    placeholder: 'Click to select a date', // HTML input placeholder attribute (default: '')
    addClass: '', // Optional, value to pass on to [ngClass] on the input field
    addStyle: { 'font-size': '18px', 'width': '97%', 'border': '1px solid #ced4da', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };
  validateFields(event) {
    setTimeout(() => {

      this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^A-Za-z ]/g, '').replace(/\s/g, '');
      event.preventDefault();

    }, 100)
  }

  //functions for pagination

  nextPage() {
    this.loading = true;// loading
    var curr_date = this.convert_DT(new Date());
    this.pageNo = +this.pageNo + 1;
    this.inspectionService
      .getInspectionOrderTablewithFromCurrentDateFilter(curr_date, this.pageNo, this.itemsPerPage, this.toServeremployeekey, this.OrganizationID)
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
    this.loading = true;// loading
    var curr_date = this.convert_DT(new Date());
    this.pageNo = +this.pageNo - 1;
    this.inspectionService
      .getInspectionOrderTablewithFromCurrentDateFilter(curr_date, this.pageNo, this.itemsPerPage, this.toServeremployeekey, this.OrganizationID)
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

  filteringInspectionManagerByDate() {
    this.showHide2 = false;
    this.showHide1 = false;
    if (this.todate && this.convert_DT(this.fromdate) > this.convert_DT(this.todate)) {
      this.todate = null;
      alert("Please check your Start Date!");
      return;
    }
    this.loading = true;// loading
    if (!this.fromdate) {
      var date1 = this.convert_DT(new Date());
    }
    else {
      date1 = this.convert_DT(this.fromdate);
    }
    if (!this.todate) {
      var date2 = date1;
    }
    else {
      date2 = this.convert_DT(this.todate);
    }
    // this.inspectionService
    //   .getInspectionOrderTablewithFromDateOnly(date1, this.pageNo, this.itemsPerPage, this.toServeremployeekey, this.OrganizationID)
    //   .subscribe((data: Inspection[]) => {
    //     this.inspectionordertable = data;
    //     if (!this.todate) {
    //       this.loading = false;// loading
    //     }
    //   });
    this.inspectionService
      .getInspectionOrderTablewithFromDateandToDateFilter(date1, date2, this.toServeremployeekey, this.OrganizationID)
      .subscribe((data: Inspection[]) => {
        this.inspectionordertable = data;
        this.loading = false;// loading
      });

  }
  searchTL(SearchValue) {
    var value = SearchValue.trim();
    if (!this.fromdate) {
      var date1 = this.convert_DT(new Date());
    }
    else {
      date1 = this.convert_DT(this.fromdate);
    }
    if (!this.todate) {
      var date2 = date1;
    }
    else {
      date2 = this.convert_DT(this.todate);
    }
    if (value.length > 2) {
      this.inspectionService
        .SearchTemplateandLocation(value, date1, date2, this.OrganizationID).subscribe((data: Inspection[]) => {
          this.inspectionordertable = data;

        });
    }
    else if (value.length == 0) {
      if ((value.length == 0) && (SearchValue.length == 0)) {
        this.loading = true;
      }
      var curr_date = this.convert_DT(new Date());
      this.inspectionService
        .getInspectionOrderTablewithFromCurrentDateFilter(curr_date, this.pageNo, this.itemsPerPage, this.toServeremployeekey, this.OrganizationID)
        .subscribe((data: Inspection[]) => {
          this.inspectionordertable = data;
          this.loading = false;// loading
        });
    }
  }
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
    this.loading = true;// loading
    this.fromdate = new Date();
    var curr_date = this.convert_DT(new Date());
    this.checkflag = false;

    this.inspectionService
      .getInspectionOrderTablewithFromCurrentDateFilter(curr_date, this.pageNo, this.itemsPerPage, this.toServeremployeekey, this.OrganizationID)
      .subscribe((data: Inspection[]) => {
        this.inspectionordertable = data;
        this.loading = false;// loading
        if (this.inspectionordertable[0].totalItems > this.itemsPerPage) {
          this.showHide2 = true;
          this.showHide1 = false;
        }
        else if (this.inspectionordertable[0].totalItems <= this.itemsPerPage) {
          this.showHide2 = false;
          this.showHide1 = false;
        }
        // 
      });
    this.searchform = this.formBuilder.group({
      SearchTL: ['', Validators.required]
    });
  }

  GoView(para) {
    this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['ViewInspectionManager', para] } }]);
  }
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
        this.filteringInspectionManagerByDate();

      });
  }
}
