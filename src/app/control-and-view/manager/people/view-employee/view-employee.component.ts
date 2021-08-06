import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { People } from '../../../../model-class/People';
import { PeopleServiceService } from '../../../../service/people-service.service';
@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.scss']
})
export class ViewEmployeeComponent implements OnInit {
  jobtitle: People[];
  employeedetailstable: People[];
  searchform: FormGroup;

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
  loading: boolean;// loading
  statusFlag;
  employeestatus;
  EmployeeStatusKey;

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
  // getempdettablewithselectedJobtitle(seljobtitlevalue) {
  //   this.showHide2 = false;
  //   this.showHide1 = false;
  //   if (!(this.JobTitleKey)) {
  //     this.PeopleServiceService
  //       .getAllEmployeeDetails(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
  //       .subscribe((data: People[]) => {
  //         this.employeedetailstable = data;
  //         if (this.employeedetailstable[0].totalItems > this.itemsPerPage) {
  //           this.showHide2 = true;
  //           this.showHide1 = false;
  //         }
  //         else if (this.employeedetailstable[0].totalItems <= this.itemsPerPage) {
  //           this.showHide2 = false;
  //           this.showHide1 = false;
  //         }
  //       });
  //   }
  //   else {
  //     this.PeopleServiceService
  //       .getAllEmployeeDetailswithjobtitledropdown(seljobtitlevalue, this.employeekey, this.OrganizationID)
  //       .subscribe((data: People[]) => {
  //         this.employeedetailstable = data;
  //       });
  //   }
  // }
  // Function to search employee details
  searchEmployeeDetails(SearchValue) {
    var value = SearchValue.trim();
    if (value.length >= 3) {
      this.PeopleServiceService
        .searchResultOfEmployeedetailsTable(value, this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID).subscribe((data: People[]) => {
          this.employeedetailstable = data;
          this.showHide2 = false;
          this.showHide1 = false;
        });
    } else if (value.length == 0) {

      if ((value.length == 0) && (SearchValue.length == 0)) {
        this.loading = true;
      }
      if (this.JobTitleKey) {
        this.PeopleServiceService
          .getAllEmployeeDetailswithjobtitledropdown(this.JobTitleKey, this.employeekey, this.OrganizationID)
          .subscribe((data: People[]) => {
            this.employeedetailstable = data;
            this.loading = false;
          });
      } else {
        this.PeopleServiceService.getAllEmployeeDetails(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID).subscribe((data: People[]) => {
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
    this.JobTitleKey = "";
    this.EmployeeStatusKey = "";

    this.PeopleServiceService
      .getJobTitleforadmindd(this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.jobtitle = data;
      });
    this.PeopleServiceService
      .getAllEmployeeDetails(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
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
    this.PeopleServiceService
      .getEmployeeStatusListforDropdown(this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.employeestatus = data;
      });
    this.searchform = this.formBuilder.group({
      SearchEmpDetails: ['', Validators.required]
    });
  }

  previousPage() {
    this.pageNo = +this.pageNo - 1;
    this.PeopleServiceService.getAllEmployeeDetails(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID).subscribe((data: People[]) => {
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
  nextPage() {
    this.pageNo = +this.pageNo + 1;
    this.PeopleServiceService.getAllEmployeeDetails(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID).subscribe((data: People[]) => {
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

  getempdettblwithslctdJbtitleNempStatus() {
    this.showHide2 = false;
    var jkey;
    var eskey;
    if (!(this.JobTitleKey)) {
      jkey = null;
    }
    else {
      jkey = this.JobTitleKey;
    }
    if (!(this.EmployeeStatusKey)) {
      eskey = null;
    }
    else {
      eskey = this.EmployeeStatusKey;
    }
    this.PeopleServiceService
      .getempdettblwithslctdJbtitleNempStatus(jkey, eskey, this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.employeedetailstable = data;
      });
    if ((!(this.JobTitleKey)) && (!(this.EmployeeStatusKey))) {
      this.PeopleServiceService
        .getAllEmployeeDetails(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
        .subscribe((data: People[]) => {
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
