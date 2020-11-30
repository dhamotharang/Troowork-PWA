
import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { People } from '../../../../model-class/People';
import { PeopleServiceService } from '../../../../service/people-service.service';
import { Router } from "@angular/router";
import { DatepickerOptions } from 'ng2-datepicker';
import { debug } from 'util';

@Component({
  selector: 'app-meeting-training-create',
  templateUrl: './meeting-training-create.component.html',
  styleUrls: ['./meeting-training-create.component.scss']
})
export class MeetingTrainingCreateComponent implements OnInit {
  jobTitle: People[];
  empList: People[];
  event: People[];
  supervisor: People[];
  dropdownSettings1 = {};
  dropdownSettings2 = {};
  managerList;
  Manager;
  EventType;
  eventHost: String;
  Venue: String;
  mtngDate;
  time1: any;
  time2: any;
  Notes: String;
  JobTitle;
  Supervisor = [];
  Employee = [];
  date1: String;
  t1 = [];
  superVsrKey: Number = 0;
  jobTleKey: Number = 0;

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  DepartmentKey;
  Event_Type;
  Event_Name;
  Description;
  addnewEvent;
  newMeet;
  department;


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

  to24Hour(str) {
    var tokens = /([10]?\d):([0-5]\d) ([ap]m)/i.exec(str);
    if (tokens === null) {
      return null;
    }
    if (tokens[3].toLowerCase() === 'pm' && tokens[1] !== '12') {
      tokens[1] = '' + (12 + (+tokens[1]));
    } else if (tokens[3].toLowerCase() === 'am' && tokens[1] === '12') {
      tokens[1] = '00';
    }
    return tokens[1] + ':' + tokens[2];
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
    addStyle: { 'font-size': '18px', 'width': '48.8%', 'border': '1px solid #ced4da', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };

  constructor(private peopleServ: PeopleServiceService, private router: Router) { }

  selectEmpsDropDown() {
    if ((this.jobTleKey > 0) && (this.superVsrKey > 0)) {
      this.peopleServ
        .getSupervisorJobtitleEmployeesList(this.jobTleKey, this.superVsrKey, this.employeekey, this.OrganizationID)
        .subscribe((data: People[]) => {
          this.Employee = data;
        });
    } else if ((this.jobTleKey > 0) && (this.superVsrKey == 0)) {
      this.peopleServ
        .getJobtitleEmployeesList(this.jobTleKey, this.employeekey, this.OrganizationID)
        .subscribe((data: People[]) => {
          this.Employee = data;
        });
    }
    else if ((this.jobTleKey == 0) && (this.superVsrKey > 0)) {
      this.peopleServ
        .getSupervisorEmployeesList(this.superVsrKey, this.employeekey, this.OrganizationID)
        .subscribe((data: People[]) => {
          this.Employee = data;
        });
    }
    else if ((this.jobTleKey == 0) && (this.superVsrKey == 0)) {
      this.Employee = [];
    }

  }
  //Pooja's code for selecting employees with jobtitle,Supervisor and department filter starts
  selectEmp() {
    var Mang;
    if (!(this.JobTitle)) {
      this.JobTitle = null;
    }
    if (this.Manager.length == 0) {
      Mang = null;
    }
    else {
      var ManagerList = [];
      var ManagerListObj = this.Manager;

      if (ManagerListObj.length > 0) {
        if (ManagerListObj) {
          for (var j = 0; j < ManagerListObj.length; j++) {
            ManagerList.push(ManagerListObj[j].ManagerKey);
          }
        }
        Mang = ManagerList.join(',');
      }
    }
    if (!(this.DepartmentKey)) {
      this.DepartmentKey = null;
    }


    this.peopleServ.selectEmpWithJobTSprvsrAndDept(this.employeekey, this.OrganizationID, this.JobTitle, Mang, this.DepartmentKey)
      .subscribe((data: any[]) => {
        this.empList = data;
      });
  }
  //Pooja's code for selecting employees with jobtitle,Supervisor and department filter ends

  // selectEmpOfJobTitle(jobKey) {
  //   this.jobTleKey = jobKey;
  //   this.selectEmpsDropDown();
  // }
  // selectEmpOfSupervisor(supervisorKey) {
  //   this.superVsrKey = supervisorKey;
  //   this.selectEmpsDropDown();
  // }
  addMeetingTrainingEvent() {
    ;
    if (!this.time1) {
      alert("Start Time is not provided");
      return;
    }
    if (!this.time2) {
      alert("End Time is not provided");
      return;
    }

    else {
      var time1 = new Date(this.time1);
      var time2 = new Date(this.time2);
      var curTime = new Date();
      var timediff = +time2 - +time1;

      if (timediff < 0) {
        alert("Start Time can't be after End Time");
        return;
      }

    }

    if (!this.EventType || !this.EventType.trim()) {
      alert("Select  meeting/training/event to continue");
      return;
    }
    if (!this.eventHost || !this.eventHost.trim()) {
      alert("Eventhost is not provided");
      return;
    }
    // if (!this.Venue || !this.Venue.trim()) {
    //   alert("Venue is not provided");
    //   return;
    // }

    if (this.eventHost) {
      this.eventHost=this.eventHost.trim();
    }
    if (this.Venue) {
      this.Venue=this.Venue.trim();
    }
    if (this.Employee.length == 0) {
      alert("Employee is not selected");
      return;
    }

    var curDate = this.convert_DT(new Date());

    if (!this.mtngDate) {
      var newDate = this.convert_DT(new Date());
    }
    else {
      newDate = this.convert_DT(this.mtngDate);
    }


    var EmployeeKeyString;
    if (this.Employee.length == 0) {
      EmployeeKeyString = null;
    }
    else {
      var employeeKeList = [];
      var employeeKeListObj = this.Employee;
      if (employeeKeListObj.length > 0) {
        if (employeeKeListObj) {
          for (var j = 0; j < employeeKeListObj.length; j++) {
            employeeKeList.push(employeeKeListObj[j].EmployeeKey);
          }
        }
        EmployeeKeyString = employeeKeList.join(',');
      }
    }
    var q = this.time1.getHours();
    var q1 = this.time1.getMinutes();
    var newTime = q + ":" + q1;

    var q2 = this.time2.getHours();
    var q3 = this.time2.getMinutes();
    var newTime1 = q2 + ":" + q3;
    if (this.Notes) {
      this.Notes = this.Notes.trim()
    }
    this.peopleServ
      .addMeetingTraining(this.EventType, this.eventHost, this.Venue, newTime, newTime1, this.Notes, EmployeeKeyString, newDate, this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        alert('Meeting/Training is successfully created !');
        this.EventType = null;
        this.eventHost = null;
        this.Venue = null;
        this.mtngDate = null;
        this.time1 = null;
        this.time2 = null;
        this.Notes = null;
        this.JobTitle = null;
        this.Supervisor = [];
        this.Employee = [];
        this.Manager=[];

        this.superVsrKey = 0;
        this.jobTleKey = 0;
        this.DepartmentKey = null;

        this.peopleServ
          .getJobTitleList(this.employeekey, this.OrganizationID)
          .subscribe((data: People[]) => {
            this.jobTitle = data;
          });

        this.peopleServ
          .getallEmployeesList(this.employeekey, this.OrganizationID)
          .subscribe((data: People[]) => {
            this.empList = data;
          });

        // this.peopleServ
        //   .getSupervisorList(this.employeekey, this.OrganizationID)
        //   .subscribe((data: People[]) => {
        //     this.supervisor = data;
        //   });
        this.peopleServ
        .getmanagersForEmp(this.employeekey, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.managerList = data;
        });
        this.peopleServ
          .getallEventList(this.employeekey, this.OrganizationID)
          .subscribe((data: People[]) => {
            this.event = data;
          });
      });


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
    this.newMeet = true;
    this.mtngDate = new Date();
    this.DepartmentKey = "";
    this.EventType = "";
    this.JobTitle = "";

    this.peopleServ
      .getJobTitleList(this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.jobTitle = data;
      });

    this.peopleServ
      .getallEmployeesList(this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.empList = data;
      });

    // this.peopleServ
    //   .getSupervisorList(this.employeekey, this.OrganizationID)
    //   .subscribe((data: People[]) => {
    //     this.supervisor = data;
    //   });
    this.peopleServ
    .getmanagersForEmp(this.employeekey, this.OrganizationID)
    .subscribe((data: any[]) => {
      this.managerList = data;
    });
    // Pooja's code for Department dropdown starts
    this.peopleServ
      .getDepartment(this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.department = data;
      });
    // Pooja's code for Department dropdown ends
    this.peopleServ
      .getallEventList(this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.event = data;
      });
    // Pooja's code for Supervisor Multiselect dropdown starts
    this.dropdownSettings2 = {
      singleSelection: false,
      idField: 'ManagerKey',
      textField: 'ManagerName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };
    // Pooja's code for Supervisor Multiselect dropdown ends
    this.dropdownSettings1 = {
      singleSelection: false,
      idField: 'EmployeeKey',
      textField: 'EmployeeText',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

  }
  refreshValues() {
    this.peopleServ
      .getallEventList(this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.event = data;
      });
  }
  addNewMeeting() {
    var eventType;
    if (this.Event_Type || this.Event_Type.trim()) {
      eventType = this.Event_Type.trim();
    }
    else {
      eventType = null;
      alert("Event Type is not provided !");
      return;
    }
    var eventName;
    if (this.Event_Name || this.Event_Name.trim()) {
      eventName = this.Event_Name.trim();
    }
    else {
      eventName = null;
      alert("Event Name is not provided !");
      return;
    }
    var eventDescription;
    if (this.Description || this.Description.trim()) {
      eventDescription = this.Description.trim();
    }
    else {
      eventDescription = null;
    }
    this.peopleServ.checkEventDuplicate(eventType, eventName, this.OrganizationID).subscribe((data: any[]) => {
      if (data[0].count == 0) {
        this.addnewEvent = {
          ActionKey: null,
          EmployeeKey: this.employeekey,
          EventDescription: eventDescription,
          EventName: eventName,
          EventType: eventType,
          OrganizationID: this.OrganizationID,
          eventDescription: eventDescription,
          eventName: eventName,
          eventType: eventType
        };

        this.peopleServ
          .addMeetinTraingByNewEvent(this.addnewEvent)
          .subscribe((data: People[]) => {
            this.event = data;
            alert("New Event is Successfully created")
            this.Event_Name = null;
            this.Event_Type = null;
            this.Description = null;
          });
      } else {
        alert("Entered event already exists...!!!");
        return false;
      }
    });

  }

}
