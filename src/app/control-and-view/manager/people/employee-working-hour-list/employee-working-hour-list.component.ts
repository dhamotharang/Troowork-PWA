import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { PeopleServiceService } from '../../../../service/people-service.service';
import { DatepickerOptions } from 'ng2-datepicker';
@Component({
  selector: 'app-employee-working-hour-list',
  templateUrl: './employee-working-hour-list.component.html',
  styleUrls: ['./employee-working-hour-list.component.scss']
})
export class EmployeeWorkingHourListComponent implements OnInit {
  loading;
  empk$;
  role: String;
  name: String;
  toServeremployeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  employeedetailstable;
  checkflag: boolean;
  calenderKey=[];
  checkValue = [];
  fromdate;
  todate;
  constructor(private route: ActivatedRoute,private PeopleServiceService: PeopleServiceService) { 
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
    addStyle: { 'font-size': '18px', 'width': '77%', 'border': '1px solid #ced4da', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };
  ngOnInit() {
 //token code
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.toServeremployeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;

    this.fromdate=new Date();
    this.checkflag = false;

   var toDate= new Date();
   var date= new Date();
   date.setDate(date.getDate() + 31);
   var startDT,endDT;
   startDT=this.convert_DT(toDate);
   endDT=this.convert_DT(date);
    
 this.loading=true;
    this.PeopleServiceService.getWorkingHourListForEmployee(startDT,endDT,this.empk$,this.OrganizationID)
      .subscribe((data: any[]) => {//inital page values
        this.employeedetailstable=data;
        this.loading=false;
      });
  }
  
  checkBoxValueForDelete(index, CheckValue, key) {//geting values for delete

    this.checkValue[index] = CheckValue;
    this.calenderKey[index] = key;
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
  
  deleteWorkingHour() {// delete service function

    var deleteWorkingHourList = [];
    var deleteWorkingHourString;

    if (this.checkValue.length > 0) {
      for (var j = 0; j < this.checkValue.length; j++) {
        if (this.checkValue[j] === true)
        deleteWorkingHourList.push(this.calenderKey[j]);
      }
      deleteWorkingHourString = deleteWorkingHourList.join(',');
    }
    let deleteWorkingHour = {
      deleteWorkingHour: deleteWorkingHourString,
      employeekey: this.toServeremployeekey,
      OrganizationID: this.OrganizationID
    };
    this.PeopleServiceService.deleteWorkingHours(deleteWorkingHour)
      .subscribe((data: any[]) => {
       alert("Working hours has been deleted !");
       if(!this.todate){
       var toDate= new Date();
        var date= new Date();
         date.setDate(date.getDate() + 31);
        var startDT,endDT;
        startDT=this.convert_DT(toDate);
        endDT=this.convert_DT(date);
       this.loading=true;
       this.PeopleServiceService.getWorkingHourListForEmployee(startDT,endDT,this.empk$,this.OrganizationID)
         .subscribe((data: any[]) => {//inital page values
           this.employeedetailstable=data;
           this.loading=false;
           this.calenderKey=[];
            this.checkValue = [];
            this.checkflag=false;
         });
        }
        else{
          this.DateFilter();
          this.checkflag=false;
        }  
      });
  }
  DateFilter(){//filter function
   
    var toDate= new Date();
    if(this.convert_DT(this.fromdate)<this.convert_DT(toDate)){
      alert("Please select current date or higher !");
      return;
    }   
    if(!(this.todate)){
      alert("To Date not provided !");
      return;
    }
    var timeDiff = Math.abs( this.fromdate.getTime() - this.todate.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    if(diffDays<31){
      alert("Please select 31 days gap !");
      return;
    }

    if(this.convert_DT(this.fromdate)>this.convert_DT(this.todate)){
      alert("Please check dates !");
      return;
    }
    
   
        let workingHourDateFilter={
          fromDate:this.convert_DT(this.fromdate),
          toDate:this.convert_DT(this.todate),
          empkey:this.empk$,
          OrganizationID: this.OrganizationID
        }
        this.loading=true;
        this.PeopleServiceService.workingHourDateFilter(workingHourDateFilter)
        .subscribe((data: any[]) => {
          this.employeedetailstable=data;
        this.loading=false;
        });
  }
}
