import { Component, OnInit, HostListener, ElementRef, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { People } from '../../../model-class/People';
import { PeopleServiceService } from '../../../service/people-service.service';

import { DataServiceTokenStorageService } from '../../../service/DataServiceTokenStorage.service';
@Component({
  selector: 'app-view-employee-admin',
  templateUrl: './view-employee-admin.component.html',
  styleUrls: ['./view-employee-admin.component.scss']
})
export class ViewEmployeeAdminComponent implements OnInit {
  jobtitle: People[];
  employeedetailstable: People[];
  searchform: FormGroup;
  JobTitleKey;
  managerList;
  ManagerKey;

  pageNo: Number = 1;
  itemsPerPage: Number = 25;
  showHide1: boolean;
  showHide2: boolean;
  pagination: Number;

  loading: boolean;// loading
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

  regexStr = '^[a-zA-Z0-9_ ]*$';
  @Input() isAlphaNumeric: boolean;

  constructor(private formBuilder: FormBuilder, private PeopleServiceService: PeopleServiceService, private el: ElementRef, private dst: DataServiceTokenStorageService) { }

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
  // Function to update employee list based on jobtitle/manager from dropdown
  getempdettablewithselectedJobtitle() {

    if (!(this.JobTitleKey) && !(this.ManagerKey)) {
      this.pageNo = 1;
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

    }
    else {
      if (!(this.JobTitleKey)) {
        this.JobTitleKey = null;
      }
      if (!(this.ManagerKey)) {
        this.ManagerKey = null;
      }
      this.loading = true;
      this.PeopleServiceService
        .getEmployeeByFilters(this.pageNo, this.itemsPerPage, this.JobTitleKey, parseInt(this.ManagerKey), this.employeekey, this.OrganizationID)
        .subscribe((data: People[]) => {
          this.employeedetailstable = data;
          this.showHide2 = false;
          this.showHide1 = false;
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
  // Function to search employee list
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
    }
    else if (value.length == 0) {
      if ((value.length == 0) && (SearchValue.length == 0)) {
        this.loading = true;
      }
      if (!(this.JobTitleKey) && !(this.ManagerKey)) {
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

      }
      else {
        if (!(this.JobTitleKey)) {
          this.JobTitleKey = null;
        }
        if (!(this.ManagerKey)) {
          this.ManagerKey = null;
        }
        this.PeopleServiceService
          .getEmployeeByFilters(this.pageNo, this.itemsPerPage, this.JobTitleKey, parseInt(this.ManagerKey), this.employeekey, this.OrganizationID)
          .subscribe((data: People[]) => {
            this.loading = false;
            this.employeedetailstable = data;
            this.showHide2 = false;
            this.showHide1 = false;
          });
      }
    }
  }
  ngOnInit() {
    this.JobTitleKey = '';
    this.ManagerKey = '';
    // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.employeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();
    this.loading = true;
    // call to get jobtitle list
    this.PeopleServiceService
      .getJobTitleforadmindd(this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.jobtitle = data;
      });
    // call to get employeedetails list
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

    // call to get manager list
    this.PeopleServiceService
      .getmanagersForEmp(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.managerList = data;
      });
  }

  // Function to go to the previous page of pagination
  previousPage() {
    this.loading = true;
    this.pageNo = +this.pageNo - 1;
    if (this.JobTitleKey || this.ManagerKey) {
      if (!(this.JobTitleKey)) {
        this.JobTitleKey = null;
      }
      if (!(this.ManagerKey)) {
        this.ManagerKey = null;
      }
      this.loading = true;
      this.PeopleServiceService
        .getEmployeeByFilters(this.pageNo, this.itemsPerPage, this.JobTitleKey, parseInt(this.ManagerKey), this.employeekey, this.OrganizationID)
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
    else {
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
  // Function to go to the next page of pagination
  nextPage() {
    this.loading = true;
    this.pageNo = +this.pageNo + 1;
    if (this.JobTitleKey || this.ManagerKey) {
      if (!(this.JobTitleKey)) {
        this.JobTitleKey = null;
      }
      if (!(this.ManagerKey)) {
        this.ManagerKey = null;
      }
      this.loading = true;
      this.PeopleServiceService
        .getEmployeeByFilters(this.pageNo, this.itemsPerPage, this.JobTitleKey, parseInt(this.ManagerKey), this.employeekey, this.OrganizationID)
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
    else {
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
