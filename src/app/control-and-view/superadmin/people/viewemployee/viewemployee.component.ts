import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { People } from '../../../../model-class/People';
import { PeopleServiceService } from '../../../../service/people-service.service';
@Component({
  selector: 'app-viewemployee',
  templateUrl: './viewemployee.component.html',
  styleUrls: ['./viewemployee.component.scss']
})
export class ViewemployeeComponent implements OnInit {

  jobtitle: People[];
  employeedetailstable: People[];
  searchform: FormGroup;
  loading: boolean;// loading
  ManagerKey;
  JobTitleKey;
  manager: People[];

  //for pagination
  pageNo: Number = 1;
  itemsPerPage: Number = 25;
  showHide1: boolean;
  showHide2: boolean;
  pagination: Number;

  page: Number = 1;
  count: Number = 25;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  SearchEmpDetails;

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

  regexStr = '^[a-zA-Z0-9_ ]*$';
  @Input() isAlphaNumeric: boolean;

  constructor(private formBuilder: FormBuilder, private PeopleServiceService: PeopleServiceService, private el: ElementRef) { }

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
  getempdettablewithselectedddvsa() {
    this.pageNo = 1;
    if (!(this.ManagerKey)) {
      this.ManagerKey = null;
    }
    if (!(this.JobTitleKey)) {
      this.JobTitleKey = null;
    }
    this.loading = true;
    this.PeopleServiceService
      .getAllEmployeeDetailswithjobtitledropdownsa(this.OrganizationID, this.employeekey, this.JobTitleKey, this.ManagerKey, this.pageNo, this.count)
      .subscribe((data: People[]) => {
        this.employeedetailstable = data;
        this.loading = false;
        if (this.employeedetailstable[0].totalItems > this.itemsPerPage) {
          this.showHide2 = true;
          this.showHide1 = false;
        }
        else if (this.employeedetailstable[0].totalItems <= this.itemsPerPage) {
          this.showHide2 = false;
          this.showHide1 = false;
        }
      });
  }

  searchEmployeeDetails(SearchValue) {

    var value = SearchValue.trim();

    if (value.length >= 3) {
      this.PeopleServiceService
        .searchResultOfEmployeedetailsTable(value, this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
        .subscribe((data: People[]) => {
          this.employeedetailstable = data;
          this.showHide2 = false;
          this.showHide1 = false;
        });
    } else if (value.length == 0) {
      if ((value.length == 0) && (SearchValue.length == 0)) {
        this.loading = true;
      }
      this.PeopleServiceService
        .searchResultOfEmployeedetailsTable(value, this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
        .subscribe((data: People[]) => {
          this.employeedetailstable = data;
          this.loading = false;
          if (this.employeedetailstable[0].totalItems > this.itemsPerPage) {
            this.showHide2 = true;
            this.showHide1 = false;
          }
          else if (this.employeedetailstable[0].totalItems <= this.itemsPerPage) {
            this.showHide2 = false;
            this.showHide1 = false;
          }
        });
    }
  }
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

    this.ManagerKey = "";
    this.JobTitleKey = "";

    this.PeopleServiceService
      .getAllJobTitle(this.OrganizationID)
      .subscribe((data: People[]) => {
        this.jobtitle = data;
      });
    this.PeopleServiceService
      .getvaluesForManagerDropdowninSA(this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.manager = data;
      });

    this.PeopleServiceService
      .getAllEmployeeDetails(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.employeedetailstable = data;
        this.loading = false;
        if (this.employeedetailstable[0].totalItems > this.itemsPerPage) {
          this.showHide2 = true;
          this.showHide1 = false;
        }
        else if (this.employeedetailstable[0].totalItems <= this.itemsPerPage) {
          this.showHide2 = false;
          this.showHide1 = false;
        }
      });

    this.searchform = this.formBuilder.group({
      SearchEmpDetails: ['', Validators.required]
    });
  }

  previousPage() {
    this.loading = true;
    this.pageNo = +this.pageNo - 1;
    if (this.JobTitleKey || this.ManagerKey) {
      if (!(this.ManagerKey)) {
        this.ManagerKey = null;
      }
      if (!(this.JobTitleKey)) {
        this.JobTitleKey = null;
      }
      this.loading = true;
      this.PeopleServiceService
        .getAllEmployeeDetailswithjobtitledropdownsa(this.OrganizationID, this.employeekey, this.JobTitleKey, this.ManagerKey, this.pageNo, this.count)
        .subscribe((data: People[]) => {
          this.employeedetailstable = data;
          this.loading = false;
          if (this.pageNo == 1) {
            this.showHide2 = true;
            this.showHide1 = false;
          } else {
            this.showHide2 = true;
            this.showHide1 = true;
          }
        });
    } else {
      this.PeopleServiceService
        .getAllEmployeeDetails(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
        .subscribe((data: People[]) => {
          this.employeedetailstable = data;
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
  }
  nextPage() {
    this.loading = true;
    this.pageNo = +this.pageNo + 1;
    if (this.JobTitleKey || this.ManagerKey) {
      if (!(this.ManagerKey)) {
        this.ManagerKey = null;
      }
      if (!(this.JobTitleKey)) {
        this.JobTitleKey = null;
      }
      this.loading = true;
      this.PeopleServiceService
        .getAllEmployeeDetailswithjobtitledropdownsa(this.OrganizationID, this.employeekey, this.JobTitleKey, this.ManagerKey, this.pageNo, this.count)
        .subscribe((data: People[]) => {
          this.employeedetailstable = data;
          this.loading = false;
          this.pagination = + this.employeedetailstable[0].totalItems / (+this.pageNo * (+this.itemsPerPage));
          if (this.pagination > 1) {
            this.showHide2 = true;
            this.showHide1 = true;
          }
          else {
            this.showHide2 = false;
            this.showHide1 = true;
          }
        });
    } else {
      this.PeopleServiceService
        .getAllEmployeeDetails(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
        .subscribe((data: People[]) => {
          this.employeedetailstable = data;
          this.loading = false;
          this.pagination = + this.employeedetailstable[0].totalItems / (+this.pageNo * (+this.itemsPerPage));
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
  }
}
