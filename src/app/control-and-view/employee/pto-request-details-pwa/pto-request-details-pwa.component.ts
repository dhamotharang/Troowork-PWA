import { Component, OnInit } from '@angular/core';
import { PeopleServiceService } from "../../../service/people-service.service";
import { DatepickerOptions } from 'ng2-datepicker';
import { Router, ActivatedRoute } from "@angular/router";
import { ResponsiveService } from 'src/app/service/responsive.service';


@Component({
  selector: 'app-pto-request-details-pwa',
  templateUrl: './pto-request-details-pwa.component.html',
  styleUrls: ['./pto-request-details-pwa.component.scss']
})
export class PtoRequestDetailsPWAComponent implements OnInit {

  ////////Author :  Amritha//////

  role: String;
  name: String;
  toServeremployeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  requestdetails;
  editflag;
  ptorequestID$;
  isMobile: boolean;

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
    // barTitleIfEmpty: 'Click to select a date',
    // placeholder: 'Click to select a date', // HTML input placeholder attribute (default: '')
    addClass: 'form-control', // Optional, value to pass on to [ngClass] on the input field
    addStyle: { 'font-size': '18px', 'width': '75%', 'border': '1px solid #ced4da', 'background-color':'white', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };

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

  constructor(public PeopleServiceService: PeopleServiceService, private router: Router, private route: ActivatedRoute, private responsiveService: ResponsiveService) {
    this.route.params.subscribe(params => this.ptorequestID$ = params.requestID);
  }

  // goBack() {
  //   // this.router.navigate(['/EmployeeDashboard', { outlets: { EmployeeOut: ['ViewPtoRequest'] } }]);

  //   // if (this.role == 'Employee' && this.IsSupervisor == 0) {
  //   if (this.role == 'Employee') {
  //     this.router.navigate(['/EmployeeDashboard', { outlets: { EmployeeOut: ['PtoRequestViewPWA'] } }]);
  //     // } else if (this.role == 'Employee' && this.IsSupervisor == 1) {
  //   } else if (this.role == 'Supervisor') {
  //     this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['ViewPtoRequestVewPWA'] } }]);
  //   }
  // }

  cancelPTO() {
    this.PeopleServiceService.setcancelPTObyEmployee(this.ptorequestID$, this.toServeremployeekey, this.OrganizationID, this.convert_DT(new Date())).subscribe((data) => {
      alert("Request successfully cancelled by employee");
      if (this.role == 'Employee') {
        this.router.navigate(['/EmployeeDashboard', { outlets: { EmployeeOut: ['PtoRequestViewPWA'] } }]);
      } else if (this.role == 'Supervisor') {
        this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['PtoRequestViewPWA'] } }]);
      }
    });
  }


  ngOnInit() {

    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.toServeremployeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;
    this.editflag = false;

    this.PeopleServiceService. setgetRequestInfoforEmployee(this.ptorequestID$).subscribe((data) => {
      this.requestdetails = data[0];
    });
    this.onResize();
    this.responsiveService.checkWidth();
  }
  onResize() {
    this.responsiveService.getMobileStatus().subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }
}

