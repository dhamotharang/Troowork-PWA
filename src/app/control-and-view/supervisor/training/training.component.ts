import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { People } from '../../../model-class/People';
import { PeopleServiceService } from '../../../service/people-service.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit {
 
  loading: boolean;
  viewmeeting: People[];
  searchform: FormGroup;
  role;
  IsSupervisor;
  name;
  employeekey;
  OrganizationID;
  regexStr = '^[a-zA-Z0-9_ ]*$';
  @Input() isAlphaNumeric: boolean;
  pageNo: Number = 1;
  itemsPerPage: Number = 25;
  showHide1: boolean;
  showHide2: boolean;
  pagination: Number;

  constructor(private formBuilder: FormBuilder, private el: ElementRef, private PeopleServiceService: PeopleServiceService) { }

  convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(- 2),
      day = ("0" + date.getDate()).slice(- 2);
    return [date.getFullYear(), mnth, day].join("-");
  };

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

  previousPage() {
    this.pageNo = +this.pageNo - 1;
    var curr_date = this.convert_DT(new Date());
    this.PeopleServiceService .getMeetingTrainingViewforemployee(this.pageNo, this.itemsPerPage, curr_date, this.employeekey, this.OrganizationID).subscribe((data: People[]) => {
      this.viewmeeting = data;
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
    var curr_date = this.convert_DT(new Date());
    this.PeopleServiceService .getMeetingTrainingViewforemployee(this.pageNo, this.itemsPerPage, curr_date, this.employeekey, this.OrganizationID).subscribe((data: People[]) => {
      this.viewmeeting = data;
      this.pagination = +this.viewmeeting[0].totalItems / (+this.pageNo * (+this.itemsPerPage));
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
  searchMeeting(SearchValue) {
    var value=SearchValue.trim();
    var curr_date = this.convert_DT(new Date());
    if (value.length >= 3){
    this.PeopleServiceService
      .SearchMeetingviewforemployee(value, this.employeekey, this.OrganizationID, curr_date).subscribe((data: People[]) => {
        this.viewmeeting = data;
        this.showHide2 = false;
        this.showHide1 = false;
      });
    }
    else if (value.length == 0) {
      if((value.length == 0) &&(SearchValue.length == 0) )
      {
     this.loading = true;
      }
      this.PeopleServiceService
      .SearchMeetingviewforemployee(value, this.employeekey, this.OrganizationID, curr_date).subscribe((data: People[]) => {
        this.viewmeeting = data;
        this.loading = false;
        if (this.viewmeeting[0].totalItems > this.itemsPerPage) {
          this.showHide2 = true;
          this.showHide1 = false;
        }
        else if (this.viewmeeting[0].totalItems <= this.itemsPerPage) {
          this.showHide2 = false;
          this.showHide1 = false;
        }
      });
    }
  };
  ngOnInit() {
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;

    var curr_date = this.convert_DT(new Date());
    this.PeopleServiceService
      .getMeetingTrainingViewforemployee(this.pageNo, this.itemsPerPage, curr_date, this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.viewmeeting = data;
        if (this.viewmeeting[0].totalItems > this.itemsPerPage) {
          this.showHide2 = true;
          this.showHide1 = false;
        }
        else if (this.viewmeeting[0].totalItems <= this.itemsPerPage) {
          this.showHide2 = false;
          this.showHide1 = false;
        }
      });

    this.searchform = this.formBuilder.group({
      SearchMeeting: ['', Validators.required]
    });
  }

}
