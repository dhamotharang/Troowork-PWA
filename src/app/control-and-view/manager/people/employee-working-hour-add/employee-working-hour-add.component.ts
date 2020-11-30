import { Component, OnInit } from '@angular/core';
import { PeopleServiceService } from '../../../../service/people-service.service';
import { ActivatedRoute, Router } from "@angular/router";
import { SchedulingService } from '../../../../service/scheduling.service';
import { DatepickerOptions } from 'ng2-datepicker';
import { Location } from '@angular/common';
@Component({
  selector: 'app-employee-working-hour-add',
  templateUrl: './employee-working-hour-add.component.html',
  styleUrls: ['./employee-working-hour-add.component.scss']
})
export class EmployeeWorkingHourAddComponent implements OnInit {
  empk$;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  empList;
  loading;
  employee_Key;
  date;
  StartTime;
  EndTime;
  constructor(private peopleServiceService: PeopleServiceService, private router: Router,private route: ActivatedRoute,private _location: Location) {
    this.route.params.subscribe(params => this.empk$ = params.EmployeeKey);
   }
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
  convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(- 2),
      day = ("0" + date.getDate()).slice(- 2);
    return [date.getFullYear(), mnth, day].join("-");
  }
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
    addStyle: { 'font-size': '18px', 'width': '190%', 'border': '1px solid #ced4da', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };

  ngOnInit() {
    var token = localStorage.getItem('token');//token set
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;

    this.peopleServiceService.getallEmployeesList(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.empList = data;
      });
      this.employee_Key=this.empk$;
  }
  create(){
    var cuDate=new Date();
    if(!this.date){
      alert("Date not provided !");
      return;
    }
    if( this.convert_DT(this.date)<this.convert_DT(cuDate)){
      alert("please select current date or higher !");
      return;
    }
    if(!this.StartTime){
      alert("Start Time not provided !");
      return;
    }
    if(!this.EndTime){
      alert("End Time not provided !");
      return;
    }
    
    var q = this.EndTime.getHours();
    var q1 = this.EndTime.getMinutes();
    var endTime = q + ":" + q1;

    var q2 = this.StartTime.getHours();
    var q3 = this.StartTime.getMinutes();   
    var startTime = q2 + ":" + q3;
    let obj={
      date:this.convert_DT(this.date),
      startTime:startTime,
      endTime:endTime,
      CreEmp:this.employee_Key,
      metaCreate:this.employeekey,
      OrganizationID:this.OrganizationID
    }
    this.peopleServiceService.createEmpWorkingHour(obj)
    .subscribe((data: any[]) => {
      this.empList = data;
      alert("Working Hour has been created !");
      this._location.back();
    });
  }
  goBack(){
    this._location.back();
  }
}
