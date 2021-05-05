import { Component, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
import { DayPilot, DayPilotModalComponent, } from "daypilot-pro-angular";
import { Validators, FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { DataPWAService, CreateEventParams } from "./data-pwa.service";
import { SchedulingService } from '../../../../service/scheduling.service';
import { DatepickerOptions } from 'ng2-datepicker';
import { ActivatedRoute, Router } from "@angular/router";
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';

@Component({
  selector: 'create-dialog',
  template: `
  <daypilot-modal #modal (close)="closed($event)">
  <div class="center">
      <h1 style="margin-bottom: 8%;
      margin-top: 5%;">Create Event</h1>
      <div class="row col-md-12">
          <div class="col-md-6">
              <span><label for="scheduling">Assignment Name: </label></span>
              <div>
                  <select style="background-color: #D4F4FF !important;" class="form-control" [(ngModel)]="BatchScheduleNameKey" (change)="setScheduleName()">
                      <option value="">--Select--</option>
                      <option *ngFor="let f of scheduleNameList" [value]="f.BatchScheduleNameKey">
                          {{f.ScheduleName}}
                      </option>
                  </select>
              </div>
         
              <label style="margin-top: 21%;">Date*</label>
              <ng-datepicker [options]="options" position="top-right" [(ngModel)]="Date"></ng-datepicker><br><br>
          </div>
      </div>
      <button (click)='submit()' [disabled]='checkFlag'>submit</button>
      <button (click)='cancel()'>close</button>
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
export class CreatePWAComponent implements OnInit {
  @ViewChild("modal") modal: DayPilotModalComponent;
  @Output() close = new EventEmitter();
  //schedule variales
  form: FormGroup;
  dateFormat = "MM/dd/yyyy h:mm tt";
  name = "new Event"
  resources: any[];
  start;
  end;
  resource;
  role: String;
  //other variables
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  BatchScheduleNameKey;
  ScheduleName;
  scheduleNameList;
  params;
  Date;
  checkFlag;
  constructor(private fb: FormBuilder, private ds: DataPWAService, private SchedulingService: SchedulingService, private router: Router, private dst: DataServiceTokenStorageService) {
    this.form = this.fb.group({
      name: ["", Validators.required],
      start: ["", this.dateTimeValidator(this.dateFormat)],
      end: ["", [Validators.required, this.dateTimeValidator(this.dateFormat)]],
      resource: ["", Validators.required]
    });

    // this.ds.getResources().subscribe(result => this.resources = result);

    this.router.routeReuseStrategy.shouldReuseRoute = function () {// code for Refresh
      return false;
    }

    this.router.events.subscribe((evt) => {

      // trick the Router into believing it's last link wasn't previously loaded
      this.router.navigated = false;
      // if you need to scroll back to top, here is the right place
      window.scrollTo(0, 0);

    });

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
  };
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

  show(args: any) {

    this.resource = args.resource;
    this.BatchScheduleNameKey = '';
    this.Date = args.start;
    this.modal.show();
  }

  submit() {

    this.checkFlag = true;
    // var currDate=new Date();
    // let data = this.form.getRawValue();
    if (!(this.BatchScheduleNameKey)) {
      alert("Please provide Assignment Name !");
      this.checkFlag = false;
      return;
    }
    // if(this.convert_DT(this.Date.value) < this.convert_DT(currDate)){
    //   alert("Please check date !");
    //   return;
    // }

    let params: CreateEventParams = {

      resource: this.resource,
      start: this.convert_DT(this.Date),
      end: this.convert_DT(this.Date),
      text: this.ScheduleName,
      ScheduleNameKey: this.BatchScheduleNameKey,
      ScheduleName: this.ScheduleName,
      backColor: "White",
      moveDisabled: false,
      bubbleHtml: this.ScheduleName
    };

    let obj = {
      resourceEmployee: this.resource,
      start: this.convert_DT(this.Date),
      ScheduleNameKey: this.BatchScheduleNameKey,
      MetaEmp: this.employeekey,
      OrganizationID: this.OrganizationID
    };
    // this.SchedulingService
    //   .scheduleEventCheckForCreate(this.convert_DT(this.Date), this.resource, this.OrganizationID)
    //   .subscribe((data: any[]) => {

    //     if (data[0].count == 0) {
    this.SchedulingService.SchedulerEventCreate(obj).subscribe(data => {
      this.checkFlag = false;
      // alert("Event has been Created !");

      // this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['SchedulerPWA'] } }]);
      this.ds.setExpandFlagNewComp(2);
      if (this.role == 'Manager') {
        this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['SchedulerPWA'] } }]);  // redirect to Manager
      } else if (this.role == 'Employee' && this.IsSupervisor == 1) {
        this.router.navigate(['/EmployeeDashboard', { outlets: { EmployeeOut: ['SchedulerPWA'] } }]); // redirect to Employee
      }
      else if (this.role == 'Supervisor') {
        this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['SchedulerPWA'] } }]);// redirect to supervisor
      }
    });

    // }
    // else {
    //   this.SchedulingService.SchedulerTimeRangeCheck(this.BatchScheduleNameKey, this.convert_DT(this.Date), this.resource, this.OrganizationID).subscribe(data => {
    //     if (data[0].count > 0) {
    //       this.SchedulingService.SchedulerEventCreate(obj).subscribe(data => {
    //         alert("Event has been Created !");

    //         // this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['SchedulerPWA'] } }]);

    //         if (this.role == 'Manager') {
    //           this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['SchedulerPWA'] } }]);
    //         // } else if (this.role == 'Employee' && this.IsSupervisor == 1) {
    //         }else if (this.role == 'Supervisor') {
    //           this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['SchedulerPWA'] } }]);
    //         }
    //       });

    //     }
    //     else {
    //       var confirmBox = confirm("Employee not working in this time range. Do you want to Create Schedule ?");
    //       if (confirmBox == true) {
    //         this.SchedulingService.SchedulerEventCreate(obj).subscribe(data => {
    //           alert("Event has been Created !");
    //           // this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['SchedulerPWA'] } }]);

    //           if (this.role == 'Manager') {
    //             this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['SchedulerPWA'] } }]);
    //           // } else if (this.role == 'Employee' && this.IsSupervisor == 1) {
    //           }else if (this.role == 'Supervisor') {
    //             this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['SchedulerPWA'] } }]);
    //           }

    //         });
    //       }
    //     }
    //   });
    // }

    // });

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
  setScheduleName() {
    for (var i = 0; i < this.scheduleNameList.length; i++) {

      if (parseInt(this.BatchScheduleNameKey) === this.scheduleNameList[i].BatchScheduleNameKey) {

        this.ScheduleName = this.scheduleNameList[i].ScheduleName;
      }
    }

  }
  ngOnInit() {

    //token starts....
        // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.employeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();
    this.checkFlag = false;
    this.SchedulingService
      .getAllSchedulingNames(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.scheduleNameList = data;
      });
  }
}
