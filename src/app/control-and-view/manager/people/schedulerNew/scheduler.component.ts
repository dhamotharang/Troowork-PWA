import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, OnInit } from "@angular/core";
import { DayPilot, DayPilotSchedulerComponent, DayPilotModalComponent } from "daypilot-pro-angular";
import { } from "daypilot-pro-angular";
import { DataService } from "./data.service";
import { CreateComponent } from "./create.component";
import { EditComponent } from "./edit.component";
import { SchedulingService } from '../../../../service/scheduling.service';
import { PeopleServiceService } from '../../../../service/people-service.service';
import { ModalDirective } from 'angular-bootstrap-md';
import { DatepickerOptions } from 'ng2-datepicker';
@Component({
  selector: 'scheduler-component',
  template: `
  <img *ngIf="loading" src="../../../../../assets/img/loader.gif" style="margin-left: 35rem; width: 20%" />
<div *ngIf="!loading">
  <div style="margin-top: 1%;margin-bottom: 1%;">
    <div class="row col-md-12 ">
      <h4 style="margin-left: 42%;">EMPLOYEE SCHEDULER</h4>
    </div>
    <div class="row bg-info col-md-12" style="padding-top: 1%;padding-bottom: 1%;margin-left: 0%;">
      <div class="form-group col-md-3">
        <label>Date*</label>
        <ng-datepicker [options]="options" position="bottom-right" [(ngModel)]="date" style="z-index:1" (ngModelChange)="selecteddate();empCalendarActivities();"></ng-datepicker>
      </div>
      <div class="form-group col-md-3">
        <label>View Range*</label>
        <select [(ngModel)]="Range" (change)='ViewType();empCalendarActivities();' class="form-control col-sm-9 col-md-9 col-lg-9" [value]="value" style="background-color: #d4f4ff;">
          <option value="Week">Week</option>
          <option value="Month">Month</option>
        </select>
      </div>

      <div class="form-group col-md-3">
        <label>Search Employee:</label>
        <ng-multiselect-dropdown [placeholder]="'Select Employee'" defaultOpen="true" [data]="empList" [(ngModel)]="filter.text" [settings]="dropdownSettings1">
        </ng-multiselect-dropdown>
      </div>
      <div class="form-group col-md-3">
        <label for="eventsonly"><input type="checkbox" id="eventsonly" [ngModel]="filter.eventsOnly" (ngModelChange)="changeWithEvents($event)"> Don't show employees without assignments</label>
        &nbsp;
        <button (click)="clearFilter()">Clear</button>
        &nbsp;
        <button (click)="applyFilter()">Apply</button>
      </div>
    </div>
  </div>
  <daypilot-scheduler [config]="config" [events]="events" #scheduler></daypilot-scheduler>
</div>
<create-dialog #create (close)="createClosed($event)"></create-dialog>
<edit-dialog #edit (close)="editClosed($event)"></edit-dialog>
`,
  styles: [`
   p, body, td { font-family: Tahoma, Arial, Helvetica, sans-serif; font-size: 10pt; }
            body { padding: 0px; margin: 0px; background-color: #ffffff; }
            a { color: #1155a3; }
            .space { margin: 10px 0px 10px 0px; }   
            .header { background: #003267; background: linear-gradient(to right, #011329 0%,#00639e 44%,#011329 100%); padding:20px 10px; color: white; box-shadow: 0px 0px 10px 5px rgba(0,0,0,0.75); }
            .header a { color: white; }
            .header h1 a { text-decoration: none; }
            .header h1 { padding: 0px; margin: 0px; }
            .main { padding: 10px; margin-top: 10px; }
            .bg-info { background-color: #FFFFFF !important; }
            ::ng-deep.ngx-datepicker-position-bottom-right {z-index:1;}     
  `]
})
export class SchedulerComponent implements AfterViewInit {
  constructor(private ds: DataService, private cdr: ChangeDetectorRef, private peopleServ: PeopleServiceService, private SchedulingService: SchedulingService) {
    this.date = new Date();
    this.Range = 'Month';
  }
  @ViewChild("modal") modal: DayPilotModalComponent;
  @ViewChild("scheduler") scheduler: DayPilotSchedulerComponent;
  @ViewChild("create") create: CreateComponent;
  @ViewChild("edit") edit: EditComponent;
  @ViewChild('basicModal') basicModal: ModalDirective;
  clipboard: DayPilot.Event[] = [];
  autoCopy: boolean;

  events: any[] = [];
  date;
  Range;
  role: String;
  empList;
  //other variables
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  name;
  AllEmployeeList;
  MovingFromEmpKey;
  MovingToEmpKey;
  MovingToDate;
  MovingFromDate;
  FromEmp;
  ToEmp;

  curDate;
  nextschedulerDate;
  disableFlag;
  loading = false;;
  expand;
  copied_event;
  filter = {
    text: [],
    eventsOnly: false
  };
  dropdownSettings1;
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
    addStyle: { 'font-size': '18px', 'width': '85%', 'border': '1px solid #ced4da', 'border-radius': '0.25rem', 'z-index': '99' }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };
  menu: DayPilot.Menu = new DayPilot.Menu({
    items: [
      {
        text: "Delete", onClick: args => {
          let row = args.source.data;
          if (row.IsShift == 1) {
            alert("Can't delete an employee group... !!!! ");
          } else if (row.IsShift == 0) {
            var k = confirm("Do you really want to delete " + row.name + " from the employee group " + row.Description + " ?");
            console.log(k);
            if (k) {
              this.loading = true;
              this.SchedulingService.deleteEmpFromEmpGroup(row.id, this.OrganizationID).subscribe((data: any[]) => {
                // alert("Employee removed from Employee Group successfully.....");
                this.SchedulingService
                  .empCalendarDetails(this.Range, this.convert_DT(this.date), this.OrganizationID)
                  .subscribe((data: any[]) => {
                    this.events = data;
                    this.loading = false;
                    if (this.events.length > 0) {
                      this.SchedulingService.employeesForScheduler('Manager', this.employeekey, this.OrganizationID)
                        .subscribe((data: any[]) => {

                          this.config.resources = data;
                        });
                    }
                    else {
                      alert("Please add employees in schedule Group !")
                    }
                  });
              });
            }
          }
        }
      },
    ]
  });

  config: any = {
    timeHeaders: [
      {
        "groupBy": "Month"
      },
      {
        "groupBy": "Day",
        "format": "dddd"
      },

      {
        "groupBy": "Day",
        "format": "d"
      }
    ],

    // new features added.... starts
    crosshairType: "Full",
    allowMultiSelect: true,
    eventClickHandling: "Select",
    onEventSelect: args => {
      let selected = this.scheduler.control.multiselect.events();
      let onlyThis = !args.selected && !args.ctrl && !args.meta;
      if (selected.length > 0 && selected[0].resource() !== args.e.resource() && !onlyThis) {
        this.scheduler.control.message("You can only select events from the same row.");
        args.preventDefault();
      }
    },
    // onIncludeTimeCell: args => {
    //   if (args.cell.start.getDayOfWeek() === 0 || args.cell.start.getDayOfWeek() === 6) { // hide Saturdays, Sundays
    //     args.cell.visible = false;
    //   }
    // },
    // new features added.... ends
    scale: "Day",
    cellDuration: 120,
    cellWidth: 250,
    eventHeight: 30,
    days: DayPilot.Date.today().daysInMonth(),
    startDate: DayPilot.Date.today(),
    treeEnabled: true,
    treePreventParentUsage: true,
    EventMovingStartEndEnabled: true,

    bubble: new DayPilot.Bubble({
      animation: "fast",
      animated: false,
      onLoad: function (args) {
        var ev = args.source;
        args.async = true;  // notify manually using .loaded()

        // simulating slow server-side load
        setTimeout(function () {
          args.html = args.source.data.ScheduleName;
          args.loaded();
        }, 500);
      }
    }),
    timeRangeSelectedHandling: 'Hold',
    contextMenuResource: this.menu,
    contextMenu: new DayPilot.Menu({
      onShow: args => {
        if (!this.scheduler.control.multiselect.isSelected(args.source)) {
          this.scheduler.control.multiselect.clear();
          this.scheduler.control.multiselect.add(args.source);
        }
      },
      items: [
        // { text: "Edit", onClick: args => this.edit.show(args.source) },
        {
          text: "Create", onClick: args => {
            this.ds.setData(this.Range, this.date);
            this.create.show(args.source.data)
          }
        },
        {
          text: "Edit", onClick: args => {
            this.ds.setData(this.Range, this.date);
            console.log(args);
            console.log(this.Range);
            console.log(this.date);
            this.edit.show(args.source).then(data1 => {

            });
          }
        },
        {
          text: "Copy",
          onClick: args => {
            // this.copied_event = args.source.data;
            // this.clipboard = args.source.data.ScheduleName;
            let selected = this.scheduler.control.multiselect.events();
            this.clipboard = selected.sort((e1, e2) => e1.start().getTime() - e2.start().getTime());
            // this.clipboard = [args.source];
            console.log(this.clipboard);
            // console.log("this.copied_event");
            // console.log(this.copied_event);

          }
        }
      ]
    }),

    contextMenuSelection: new DayPilot.Menu({
      onShow: args => {
        let noItemsInClipboard = this.clipboard.length === 0;
        args.menu.items[0].disabled = noItemsInClipboard;
      },
      items: [
        {
          text: "Paste",
          onClick: args => {
            if (this.clipboard.length === 0) {
              return;
            }
            let targetStart = args.source.start;
            let targetResource = args.source.resource;
            let firstStart = this.clipboard[0].start();

            this.clipboard.forEach(e => {

              console.log("args paste");
              console.log(args);

              let offset = new DayPilot.Duration(firstStart, e.start());
              // let duration = e.duration();
              let start = targetStart.addTime(offset);

              let obj = {
                resourceEmployee: targetResource,
                start: start,
                ScheduleNameKey: e.data.ScheduleNameKey,
                MetaEmp: this.employeekey,
                OrganizationID: this.OrganizationID
              };
              console.log("obj");
              console.log(obj);
              this.loading = true;
              this.SchedulingService.SchedulerEventCreate(obj).subscribe(data => {
                this.loading = false;
                this.empCalendarActivities();
                // this.clipboard = "";
              });
            });
          }
        }
      ]
    }),

    onEventClicked: args => {
      // this.ds.setData(this.Range, this.date);
      // this.edit.show(args.e).then(data1 => {

      // this.empCalendarActivities();
      // });
    },
    onTimeRangeSelect: args => {

    },
    onTimeRangeSelected: args => {
      var checkDate = this.convert_DT(args.start.value)
      var empKey = args.resource;
      this.ds.setData(this.Range, this.date);
      this.create.show(args);
    },
    onEventMoved: args => {
    },

    onResourceCollapse: args => {
      this.ds.setExpandFlag();
      this.ds.setExpandData(args.resource.data.id, args.resource.data.expanded);
    },
    onResourceExpand: args => {
      this.ds.setExpandFlag();
      this.ds.setExpandData(args.resource.data.id, args.resource.data.expanded);
    },
    onEventMove: args => {

      let obj = {
        resourceEmployee: this.MovingToEmpKey,
        start: this.MovingToDate,
        ScheduleNameKey: args.e.data.ScheduleNameKey,
        MetaEmp: this.employeekey,
        OrganizationID: this.OrganizationID
      };

      this.loading = true;
      this.SchedulingService.SchedulerEventCreate(obj).subscribe(data => {
        this.SchedulingService.SchedulerEventDelete(args.e.data.Assignment_CalenderID, this.employeekey, this.OrganizationID).subscribe(data => {
          this.loading = false;
          this.empCalendarActivities();

        });
      });

    },
    onEventMoving: args => {

      this.MovingFromEmpKey = args.e.data.resource;
      this.MovingToEmpKey = args.resource;

      this.MovingToDate = this.convert_DT(args.end.value);
      this.MovingFromDate = this.convert_DT(args.e.data.start);
      console.log(" date :" + this.MovingToDate);
    },
    onEventResize: args => {
      args.cell.disabled = true;
    },
    onBeforeCellRender: args => {
      if (args.cell.start.getDayOfWeek() === 6 || args.cell.start.getDayOfWeek() === 0) {
        args.cell.backColor = "white";
        // args.cell.disabled = true;
      }
    },
    onBeforeTimeHeaderRender: args => {
      if (args.header.level === 1) {
        args.header.html = "Week " + args.header.html;
      }

      var dayOfWeek = args.header.start.getDayOfWeek();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        if (args.header.level > 1) {
          args.header.backColor = "orange";
        }
      }
    },
  };



  ngAfterViewInit(): void {
    var n = this.ds.clearExpandVal();

    //token starts....
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;

    var from = this.scheduler.control.visibleStart();
    var to = this.scheduler.control.visibleEnd();
    this.ds.getEvents(from, to).subscribe(result => {
      this.events = result;
    });
    this.config.resources = [];

    this.Range = this.ds.getType();
    this.date = this.ds.getDate();
    this.ViewType();

    this.dropdownSettings1 = {
      singleSelection: false,
      idField: 'EmployeeKey',
      textField: 'EmployeeText',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: true
    };

    this.loading = true;

    this.SchedulingService
      .empCalendarDetails(this.Range, this.convert_DT(this.date), this.OrganizationID)
      .subscribe((data: any[]) => {
        this.events = data;
        this.loading = false;
        if (this.events.length > 0) {
          this.SchedulingService.employeesForScheduler('Manager', this.employeekey, this.OrganizationID)
            .subscribe((data: any[]) => {
              if (n == 2 || n == 3) {
                this.expand = this.ds.getExpandData();
                for (var i = 0; i < this.expand.length; i++) {
                  var id = this.expand[i].ID;
                  for (var j = 0; j < data.length; j++) {
                    if (id === data[j].id) {
                      data[j].expanded = this.expand[i].Flag;
                    }
                  }
                }
                this.ds.setExpandFlag();
              }
              this.config.resources = data;
            });
        }
        else {
          alert("Please add employees in schedule Group !")
        }
      });

    this.curDate = this.convert_DT(new Date());

    this.peopleServ
      .getallEmployeesList(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.empList = data;
      });

  }

  createClosed(args) {
    if (args.result) {
      this.events.push(args.result);
      this.scheduler.control.message("Created.");
    }
    this.scheduler.control.clearSelection();
  }

  editClosed(args) {
    if (args.result) {
      this.scheduler.control.message("Updated");
    }
  }
  ViewType() {

    if (this.Range == 'Month') {
      this.config.timeHeaders = [
        {
          "groupBy": "Month",
        },
        {
          "groupBy": "Week",
        },
        {
          "groupBy": "Day",
          "format": "dddd"
        },

        {
          "groupBy": "Day",
          "format": "d"
        }
      ];
      this.config.scale = "Day";
      this.config.cellDuration = 120;
      this.config.cellWidth = 250;
      this.config.allowMultiSelect = true;
      this.config.eventClickHandling = "Select";
      this.config.days = DayPilot.Date.today().daysInMonth();
      if (this.date) {
        this.config.startDate = this.convert_DT(this.date);
      }
      else {
        this.config.startDate = DayPilot.Date.today();
      }
    } else if (this.Range == 'Week') {
      this.config.timeHeaders = [
        {
          "groupBy": "Month"
        },
        {
          "groupBy": "Week",
        },
        {
          "groupBy": "Day",
          "format": "dddd"
        },
        {
          "groupBy": "Day",
          "format": "d"
        }
      ];
      this.config.scale = "Day";
      this.config.cellDuration = 120;
      this.config.cellWidth = 250;
      this.config.days = 7;
      this.config.startDate = this.convert_DT(this.date);
      this.config.allowMultiSelect = true;
      this.config.eventClickHandling = "Select";
    }
  }
  selecteddate() {
    if (this.Range == 'Week') {
      var d = this.date;
      var day = d.getDay();
      var diff = d.getDate() - day + (day == 0 ? -6 : 2);
      var k = new Date(d.setDate(diff));
      this.config.startDate = this.convert_DT(k);
    }
    else {
      if (this.date) {
        this.config.startDate = this.convert_DT(this.date);
      }
      else {
        this.config.startDate = DayPilot.Date.today();
      }
    }
  }

  empCalendarActivities() {
    this.loading = true;
    this.SchedulingService
      .empCalendarDetails(this.Range, this.convert_DT(this.date), this.OrganizationID)
      .subscribe((data: any[]) => {
        this.events = data;
        this.loading = false;
      });
  }
  //new change for row filtering. starts....
  changeText(text) {
    this.filter.text = text;
  }

  changeWithEvents(val) {
    this.filter.eventsOnly = val;
    console.log(this.filter);
  }

  applyFilter() {
    var EmployeeKeyString = null;
    if (!(this.filter.text)) {
      EmployeeKeyString = null;
    }
    else {
      var employeeKeList = [];
      var employeeKeListObj = this.filter.text;
      if (employeeKeListObj.length > 0) {
        if (employeeKeListObj) {
          for (var j = 0; j < employeeKeListObj.length; j++) {
            employeeKeList.push(employeeKeListObj[j].EmployeeKey);
          }
        }
        EmployeeKeyString = employeeKeList.join(',');
      }
    }
    this.loading = true;
    this.SchedulingService
      .rowFiltering(EmployeeKeyString, this.filter.eventsOnly, this.Range, this.convert_DT(this.date), this.OrganizationID)
      .subscribe((data: any[]) => {
        this.config.resources = data;
        this.loading = false;
      });
  }

  clearFilter() {
    this.filter.text = null;
    this.filter.eventsOnly = false;
    this.applyFilter();
    return false;
  }
  //new change for row filtering. ends....
}

