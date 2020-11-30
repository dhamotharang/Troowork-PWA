import { Component, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
import { DayPilot, DayPilotModalComponent } from "daypilot-pro-angular";

import { Validators, FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { DataService, CreateEventParams, EventData, UpdateEventParams } from "./data.service";
import { SchedulingService } from '../../../../service/scheduling.service';
import { DatepickerOptions } from 'ng2-datepicker';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'edit-dialog',
  template: `
  <daypilot-modal #modal (close)="closed($event)">
  <div class="center">
  <h1 style="margin-bottom: 8%;
  margin-top: 5%;">Edit Event</h1>
      <div class="row col-md-12">
          <div class="col-md-6">
              <span><label for="scheduling">Assignment Name: </label></span>
              <div>
                  <select style="background-color: #D4F4FF !important;" class="form-control" [(ngModel)]="BatchScheduleNameKeyEdit" (change)="setScheduleNameEdit()">
                      <option value="">--Select--</option>
                      <option *ngFor="let f of scheduleNameList" [value]="f.BatchScheduleNameKey">
                          {{f.ScheduleName}}
                      </option>
                  </select>
              </div>
         
              <label style="margin-top: 21%;">Date*</label>
              <ng-datepicker [options]="options" position="top-right" [(ngModel)]="DateEdit" (ngModelChange)="dateChangeNeeded()"></ng-datepicker><br><br>
          </div>
      </div>
      <button (click)='submitEdit()'>Submit</button>
      <button (click)='cancel()'>close</button>      
      <button (click)='delete()'>Delete</button>
  </div>
</daypilot-modal>
  `,
  styles: [`
  .center {
    max-width: 800px;
    margin-left: auto;
    margin-right: auto;
  }
  .form-item {
    margin: 4px 0px;
  }
  `]
})
export class EditComponent implements OnInit {
  @ViewChild("modal") modal: DayPilotModalComponent;
  @Output() close = new EventEmitter();

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

  form: FormGroup;
  dateFormat = "MM/dd/yyyy h:mm tt";

  resources: any[];

  event: DayPilot.Event;

  //local variable
  ScheduleNameEdit;
  scheduleNameList;
  name;
  role;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  BatchScheduleNameKeyEdit;
  BatchScheduleNameKey;
  DateEdit;
  AssignIDForDelete;
  scheduleOldKey;
  constructor(private fb: FormBuilder, private ds: DataService, private SchedulingService: SchedulingService, private router: Router) {
    this.form = this.fb.group({
      name: ["", Validators.required],
      start: ["", this.dateTimeValidator(this.dateFormat)],
      end: ["", [Validators.required, this.dateTimeValidator(this.dateFormat)]],
      resource: ["", Validators.required]
    });

    this.ds.getResources().subscribe(result => this.resources = result);

    this.router.routeReuseStrategy.shouldReuseRoute = function () {// code for Refresh
      return false;
    }

    this.router.events.subscribe((evt) => {

      // trick the Router into believing it's last link wasn't previously loaded
      this.router.navigated = false;
      // if you need to scroll back to top, here is the right place
      //  window.scrollTo(0, 0);

    });
  }
  options: DatepickerOptions = {
    minYear: 1970,
    maxYear: 2030,
    displayFormat: 'MM/DD/YYYY',
    barTitleFormat: 'MMMM YYYY',
    dayNamesFormat: 'dd',
    firstCalendarDay: 0, // 0 - Sunday, 1 - Monday
    barTitleIfEmpty: 'Click to select a date',
    placeholder: 'Click to select a date', // HTML input placeholder attribute (default: '')
    addClass: '', // Optional, value to pass on to [ngClass] on the input field
    addStyle: { 'font-size': '18px', 'width': '102%', 'border': '1px solid #ced4da', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };
  convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(- 2),
      day = ("0" + date.getDate()).slice(- 2);
    return [date.getFullYear(), mnth, day].join("-");
  };

  show(ev: DayPilot.Event) {
    console.log(ev.data);
    return new Promise((resolve) => {
      this.event = ev;
      this.form.setValue({
        start: ev.start(),
        end: ev.end(),
        name: ev.text(),
        resource: ev.resource(),

      });
      // var currDate=new Date();
      this.AssignIDForDelete = ev.data.Assignment_CalenderID;
      this.BatchScheduleNameKeyEdit = ev.data.ScheduleNameKey;
      this.ScheduleNameEdit = ev.data.ScheduleName;
      this.DateEdit = ev.data.start;
      this.scheduleOldKey = ev.data.ScheduleNameKey;
      // if(this.DateEdit < this.convert_DT(currDate)){
      //   alert("Please check date !");
      //   return;
      // }
      if (ev.data.moveDisabled != 1) {
        this.modal.show();
      }
      resolve();
    });
  }

  dateChangeNeeded() {
    this.DateEdit = this.convert_DT(this.DateEdit);
    console.log("dateChangeNeeded... " + this.DateEdit);
  }
  
  submitEdit() {
    // var currDate=new Date();
    // let data = this.form.getRawValue();
    var date = this.DateEdit;
    if (!(this.BatchScheduleNameKeyEdit)) {
      alert("Please provide Assignment Name !");
      return;
    }
    // if(this.DateEdit < this.convert_DT(currDate)){
    //   alert("Please check date !");
    //   return;
    // }
    // modify the original object from [events] which is stored in event.data

    let obj = {
      resourceEmployee: this.event.data.resource,
      start: date,
      ScheduleNameKey: this.BatchScheduleNameKeyEdit,
      MetaEmp: this.employeekey,
      OrganizationID: this.OrganizationID,
      Assignment_CalenderID: this.event.data.Assignment_CalenderID
    };

    // this.SchedulingService.SchedulerTimeRangeCheck(this.BatchScheduleNameKeyEdit, this.convert_DT(this.event.data.start), this.event.data.resource, this.OrganizationID).subscribe(data => {
    //   if (data[0].count > 0) {
    this.SchedulingService.SchedulerEventUpdate(obj).subscribe(data => {
      // alert("Event has been Updated !");
      this.ds.setExpandFlagNewComp(3);
      // this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['Scheduler'] } }]);
      if (this.role == 'Manager') {
        this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['Scheduler'] } }]);
        // } else if (this.role == 'Employee' && this.IsSupervisor == 1) {
      } else if (this.role == 'Supervisor') {
        this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['Scheduler'] } }]);
      }
    });

    //   }
    //   else {
    //     var confirmBox = confirm("Employee not working in this time range. Do you want to Update Schedule ?");
    //     if (confirmBox == true) {
    //       this.SchedulingService.SchedulerEventUpdate(obj).subscribe(data => {
    //         alert("Event has been Updated !");

    //         // this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['Scheduler'] } }]);
    //         if (this.role == 'Manager') {
    //           this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['Scheduler'] } }]);
    //         // } else if (this.role == 'Employee' && this.IsSupervisor == 1) {
    //         }else if (this.role == 'Supervisor') {
    //           this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['Scheduler'] } }]);
    //         }
    //       });
    //     }
    //     else {
    //       this.BatchScheduleNameKeyEdit = this.scheduleOldKey
    //     }

    //   }

    // });
    // this.ds.updateEvent(this.event).subscribe(result => {
    //   this.modal.hide(result);
    // });
    this.event.data.start = date;
    this.event.data.end = date;
    this.event.data.resource;
    this.event.data.text = this.ScheduleNameEdit;
    this.event.data.ScheduleName = this.ScheduleNameEdit;
    this.event.data.ScheduleNameKey = this.BatchScheduleNameKeyEdit;
  }

  cancel() {
    this.modal.hide();
  }

  closed(args) {
    this.close.emit(args);
  }

  dateTimeValidator(format: string) {
    return function (c: FormControl) {
      let valid = !!DayPilot.Date.parse(c.value, format);
      return valid ? null : { badDateTimeFormat: true };
    };
  }

  delete() {
    var confirmBox = confirm("Do you want to Delete ?");
    if (confirmBox == true) {
      this.SchedulingService.SchedulerEventDelete(this.AssignIDForDelete, this.employeekey, this.OrganizationID).subscribe(data => {
        // alert("Sucessfully Deleted !");
        this.ds.setExpandFlagNewComp(3);
        // this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['Scheduler'] } }]);
        if (this.role == 'Manager') {
          this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['Scheduler'] } }]);
          // } else if (this.role == 'Employee' && this.IsSupervisor == 1) {
        } else if (this.role == 'Supervisor') {
          this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['Scheduler'] } }]);
        }
      });
    }
  }
  ngOnInit() {

    //token starts....
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;

    this.SchedulingService
      .getAllSchedulingNames(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.scheduleNameList = data;
      });
  }

  setScheduleNameEdit() {
    for (var i = 0; i < this.scheduleNameList.length; i++) {

      if (parseInt(this.BatchScheduleNameKeyEdit) === this.scheduleNameList[i].BatchScheduleNameKey) {

        this.ScheduleNameEdit = this.scheduleNameList[i].ScheduleName;
      }
    }

  }
}

