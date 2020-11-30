import { Component, OnInit } from '@angular/core';
import { PeopleServiceService } from '../../../../service/people-service.service';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-employee-working-hour-emp-list-view',
  templateUrl: './employee-working-hour-emp-list-view.component.html',
  styleUrls: ['./employee-working-hour-emp-list-view.component.scss']
})
export class EmployeeWorkingHourEmpListViewComponent implements OnInit {

  constructor(private formBuilder: FormBuilder,private PeopleServiceService: PeopleServiceService) { }
  pageNo: Number = 1;
  itemsPerPage: Number = 25;
  showHide1: boolean;
  showHide2: boolean;
  pagination: Number;
  JobTitleKey;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  searchform: FormGroup;
  loading;
  employeedetailstable=[];
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

  ngOnInit() {
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;

    this.searchform = this.formBuilder.group({
      SearchEmpDetails: ['', Validators.required]
    });

    
    this.PeopleServiceService
      .AllEmployeeWorkingHourList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.employeedetailstable = data;
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
  nextPage() {
    this.pageNo = +this.pageNo + 1;
    this.PeopleServiceService.AllEmployeeWorkingHourList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
      this.employeedetailstable = data;
      this.pagination = +this.employeedetailstable[0].totalItems / (+this.pageNo * (+this.itemsPerPage));
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
    this.pageNo = +this.pageNo - 1;
    this.PeopleServiceService.AllEmployeeWorkingHourList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
      this.employeedetailstable = data;
      if (this.pageNo == 1) {
        this.showHide2 = true;
        this.showHide1 = false;
      } else {
        this.showHide2 = true;
        this.showHide1 = true;
      }
    });
  }
  searchEmployeeDetails(SearchValue) {
    var value = SearchValue.trim();
    if (value.length >= 3) {
      this.PeopleServiceService
        .searchAllEmployeeWorkingHourList(value, this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
          this.employeedetailstable = data;
          this.showHide2 = false;
          this.showHide1 = false;
        });
    } else if (value.length == 0) {
      this.PeopleServiceService
      .AllEmployeeWorkingHourList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.employeedetailstable = data;
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
}
