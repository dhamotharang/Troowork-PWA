import { Component, OnInit, HostListener, ElementRef, Input } from '@angular/core';
import { People } from '../../../../model-class/People';
import { PeopleServiceService } from '../../../../service/people-service.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-managelogincredentials',
  templateUrl: './managelogincredentials.component.html',
  styleUrls: ['./managelogincredentials.component.scss']
})
export class ManagelogincredentialsComponent implements OnInit {
  
  loginCreds;
  loading: boolean;
  pageNo: Number = 1;
  itemsPerPage: Number = 25;
  showHide1: boolean;
  showHide2: boolean;
  pagination: Number;
  searchform: FormGroup;
  SearchUser;
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

  constructor(private peopleServiceService: PeopleServiceService, private formBuilder: FormBuilder, private el: ElementRef) { }
  @Input() isAlphaNumeric: boolean;
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
    this.pageNo = +this.pageNo - 1;
    this.peopleServiceService.getLoginCredentialList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID).subscribe((data: People[]) => {
      this.loginCreds = data;
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
    this.peopleServiceService.getLoginCredentialList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID).subscribe((data: People[]) => {
      this.loginCreds = data;
      this.pagination = +this.loginCreds[0].totalItems / (+this.pageNo * (+this.itemsPerPage));
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

  searchUserList(searchKey) {
    var value=searchKey.trim();
    if (value.length >= 3){
    this.peopleServiceService.searchLoginCredsList(value, this.employeekey, this.OrganizationID).subscribe((data: People[]) => {
      this.loginCreds = data;
      this.showHide2 = false;
      this.showHide1 = false;
    });
  }
  else if (value.length == 0) {
    if((value.length == 0) &&(searchKey.length == 0) )
    {
   this.loading = true;
    }
    this.peopleServiceService.searchLoginCredsList(value, this.employeekey, this.OrganizationID).subscribe((data: People[]) => {
      this.loginCreds = data;
      this.loading = false;
      if (this.loginCreds[0].totalItems > this.itemsPerPage) {
        this.showHide2 = true;
        this.showHide1 = false;
      }
      else if (this.loginCreds[0].totalItems <= this.itemsPerPage) {
        this.showHide2 = false;
        this.showHide1 = false;
      }
    });
  }
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

    this.peopleServiceService.getLoginCredentialList(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID).subscribe((data: People[]) => {
      this.loginCreds = data;
      if (this.loginCreds[0].totalItems > this.itemsPerPage) {
        this.showHide2 = true;
        this.showHide1 = false;
      }
      else if (this.loginCreds[0].totalItems <= this.itemsPerPage) {
        this.showHide2 = false;
        this.showHide1 = false;
      }
    });

    this.searchform = this.formBuilder.group({
      SearchJobTitle: ['', Validators.required],
      SearchUser: ['', Validators.required]
    });
  }

}
