import { Component, ViewChild, AfterViewInit, ChangeDetectorRef, OnInit } from "@angular/core";
import { DayPilot, DayPilotSchedulerComponent, DayPilotModalComponent } from "daypilot-pro-angular";
import { } from "daypilot-pro-angular";
// import { CreatePWAComponent } from "./create-pwa.component";
// import { EditPWAComponent } from "./edit-pwa.component";
import { SchedulingService } from '../../../../service/scheduling.service';
import { PeopleServiceService } from '../../../../service/people-service.service';
import { ModalDirective } from 'angular-bootstrap-md';
import { DatepickerOptions } from 'ng2-datepicker';
import { ResponsiveService } from 'src/app/service/responsive.service';
import { DataServiceTokenStorageService } from "src/app/service/DataServiceTokenStorage.service";
import { Validators, FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { DataPWAService, CreateEventParams, EventData, UpdateEventParams } from "./data-pwa.service";
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';
import { ConfirmationdialogComponent, ConfirmDialogModel } from '../../../dialog/confirmationdialog/confirmationdialog.component';

@Component({
  selector: 'schedulerPWA-component',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerPWAComponent implements AfterViewInit {
  filterpopupAppear: boolean;
  isMobile: boolean;
  highlightcellcolor: any;
  highlightcellid: any;
  constructor(private ds: DataPWAService, private fb: FormBuilder, private cdr: ChangeDetectorRef, private peopleServ: PeopleServiceService, private SchedulingService: SchedulingService, private responsiveService: ResponsiveService, private dst: DataServiceTokenStorageService, private dialog: MatDialog) {
    this.date = new Date();
    this.date1 = new Date();
    this.Range = 'Month';

    this.form = this.fb.group({
      name: ["", Validators.required],
      start: ["", this.dateTimeValidator(this.dateFormat)],
      end: ["", [Validators.required, this.dateTimeValidator(this.dateFormat)]],
      resource: ["", Validators.required]
    });
  }
  @ViewChild("modal") modal: DayPilotModalComponent;
  @ViewChild("modal1") modal1: DayPilotModalComponent;
  @ViewChild("scheduler") scheduler: DayPilotSchedulerComponent;
  // @ViewChild("create") create: CreatePWAComponent;
  // @ViewChild("edit") edit: EditPWAComponent;
  @ViewChild('basicModal') basicModal: ModalDirective;
  clipboard: DayPilot.Event[] = [];
  autoCopy: boolean;

  events: any[] = [];
  date;
  date1;
  Range;
  role: String;
  empList;
  //other variables
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  name1;
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
  loading: boolean;
  expand;
  popupAppear;

  copied_event;
  filter = {
    text: [],
    eventsOnly: false
  };
  dropdownSettings1;
  dateList;
  fromdate;
  amCountList;
  pmCountList;
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
    addStyle: { 'font-size': '18px', 'width': '85%', 'background-color': 'white', 'border': '1px solid #ced4da', 'border-radius': '0.25rem', 'z-index': '99' }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };
  options1: DatepickerOptions = {
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
            // alert("Can't delete an employee group... !!!! ");
            const dialogRef = this.dialog.open(AlertdialogComponent, {
              data: {
                message: "Can't delete an employee group... !!!! ",
                buttonText: {
                  cancel: 'Done'
                }
              },
            });
          } else if (row.IsShift == 0) {
            const message = "Do you really want to delete " + row.name + " from the employee group " + row.Description + " ?";
            const dialogData = new ConfirmDialogModel("DELETE", message);
            const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
              maxWidth: "400px",
              data: dialogData
            });

            dialogRef.afterClosed().subscribe(dialogResult => {
              if (dialogResult) {
                this.SchedulingService.deleteEmpFromEmpGroup(row.id, this.OrganizationID).subscribe((data: any[]) => {
                  this.SchedulingService
                    .empCalendarDetails(this.Range, this.convert_DT(this.date), this.OrganizationID)
                    .subscribe((data: any[]) => {
                      this.events = data;
                      if (this.events.length > 0) {
                        this.SchedulingService.employeesForScheduler('Manager', this.employeekey, this.OrganizationID)
                          .subscribe((data: any[]) => {
                            this.config.resources = data;
                          });
                      }
                      else {
                        const dialogRef = this.dialog.open(AlertdialogComponent, {
                          data: {
                            message: "Please add employees in schedule Group !!!!! ",
                            buttonText: {
                              cancel: 'Done'
                            }
                          },
                        });
                      }
                    });
                });
              }
            });
            // var k = confirm("Do you really want to delete " + row.name + " from the employee group " + row.Description + " ?");
            // if (k) {
            //   this.loading = true;
            //   this.SchedulingService.deleteEmpFromEmpGroup(row.id, this.OrganizationID).subscribe((data: any[]) => {
            //     // alert("Employee removed from Employee Group successfully.....");
            //     this.SchedulingService
            //       .empCalendarDetails(this.Range, this.convert_DT(this.date), this.OrganizationID)
            //       .subscribe((data: any[]) => {
            //         this.events = data;
            //         this.loading = false;
            //         if (this.events.length > 0) {
            //           this.SchedulingService.employeesForScheduler('Manager', this.employeekey, this.OrganizationID)
            //             .subscribe((data: any[]) => {

            //               this.config.resources = data;
            //             });
            //         }
            //         else {
            //           alert("Please add employees in schedule Group !")
            //         }
            //       });
            //   });
            // }
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
    cellDuration: 100,
    cellWidth: 128,
    cellWidthSpec: 'Auto',
    cellWidthMin: 62,
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
    tapAndHoldTimeout: 200,
    eventTapAndHoldHandling: 'ContextMenu',
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
            // this.create.show(args.source.data)
            this.createshow(args.source.data);
          }
        },
        {
          text: "Edit", onClick: args => {
            this.ds.setData(this.Range, this.date);
            console.log(args);
            console.log(args.source);

            this.scheduler.control.multiselect.clear();
            console.log(this.scheduler.events);
            if (this.highlightcellid && (this.highlightcellid !== args.source.data.id)) {
              for (var i = 0; i < this.scheduler.events.length; i++) {
                if (this.scheduler.events[i].id == this.highlightcellid) {
                  this.scheduler.events[i].backColor = this.highlightcellcolor;
                }
              }
            }
            // this.scheduler.control.multiselect.add(args.e);
            console.log(args);
            this.highlightcellid = args.source.data.id;
            this.highlightcellcolor = args.source.data.backColor;
            args.source.data.backColor = "grey";

            this.editshow(args.source).then(data1 => {

            });
          }
        },
        // {
        //   text: "Copy",
        //   onClick: args => {
        //     // this.copied_event = args.source.data;
        //     // this.clipboard = args.source.data.ScheduleName;
        //     let selected = this.scheduler.control.multiselect.events();
        //     this.clipboard = selected.sort((e1, e2) => e1.start().getTime() - e2.start().getTime());
        //     // this.clipboard = [args.source];

        //   }
        // }
      ]
    }),

    // contextMenuSelection: new DayPilot.Menu({
    //   onShow: args => {
    //     let noItemsInClipboard = this.clipboard.length === 0;
    //     args.menu.items[0].disabled = noItemsInClipboard;
    //   },
    //   items: [
    //     {
    //       text: "Paste",
    //       onClick: args => {
    //         if (this.clipboard.length === 0) {
    //           return;
    //         }
    //         let targetStart = args.source.start;
    //         let targetResource = args.source.resource;
    //         let firstStart = this.clipboard[0].start();

    //         this.clipboard.forEach(e => {


    //           let offset = new DayPilot.Duration(firstStart, e.start());
    //           // let duration = e.duration();
    //           let start = targetStart.addTime(offset);

    //           let obj = {
    //             resourceEmployee: targetResource,
    //             start: start,
    //             ScheduleNameKey: e.data.ScheduleNameKey,
    //             MetaEmp: this.employeekey,
    //             OrganizationID: this.OrganizationID
    //           };
    //           this.loading = true;
    //           this.SchedulingService.SchedulerEventCreate(obj).subscribe(data => {
    //             this.loading = false;
    //             this.empCalendarActivities();
    //             // this.clipboard = "";
    //           });
    //         });
    //       }
    //     }
    //   ]
    // }),

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
      this.createshow(args);
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
      const copy = args.ctrl || args.meta;
      console.log(copy);
      if (copy) {
        args.preventDefault();
        args.multimove.forEach(item => {
          console.log(item);

          let obj = {
            resourceEmployee: item.resource,
            start: this.convert_DT(item.start.value),
            ScheduleNameKey: item.event.data.ScheduleNameKey,
            MetaEmp: this.employeekey,
            OrganizationID: this.OrganizationID
          };

          // this.loading = true;
          this.SchedulingService.SchedulerEventCreate(obj).subscribe(data => {
            // this.loading = false;
            this.empCalendarActivities();
          });
          this.scheduler.control.scrollToResource(item.resource);
          this.scheduler.control.multiselect.clear();
        });
      }
      else {
        let obj = {
          resourceEmployee: this.MovingToEmpKey,
          start: this.MovingToDate,
          ScheduleNameKey: args.e.data.ScheduleNameKey,
          MetaEmp: this.employeekey,
          OrganizationID: this.OrganizationID
        };

        // this.loading = true;
        this.SchedulingService.SchedulerEventCreate(obj).subscribe(data => {
          this.SchedulingService.SchedulerEventDelete(args.e.data.Assignment_CalenderID, this.employeekey, this.OrganizationID).subscribe(data => {
            // this.loading = false;
            this.empCalendarActivities();
            this.scheduler.control.multiselect.clear();
          });
        });
      }
    },
    onEventRightClick: args => {
      this.scheduler.control.multiselect.clear();
      console.log(this.scheduler.events);
      if (this.highlightcellid && (this.highlightcellid !== args.e.data.id)) {
        for (var i = 0; i < this.scheduler.events.length; i++) {
          if (this.scheduler.events[i].id == this.highlightcellid) {
            this.scheduler.events[i].backColor = this.highlightcellcolor;
          }
        }
      }
      // this.scheduler.control.multiselect.add(args.e);
      console.log(args);
      this.highlightcellid = args.e.data.id;
      this.highlightcellcolor = args.e.data.backColor;
      args.e.data.backColor = "grey";
    },
    onEventMoving: args => {

      this.MovingFromEmpKey = args.e.data.resource;
      this.MovingToEmpKey = args.resource;

      this.MovingToDate = this.convert_DT(args.end.value);
      this.MovingFromDate = this.convert_DT(args.e.data.start);
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
      // if (args.header.level === 1) {
      //   args.header.html = "Week " + args.header.html;
      // }
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
    this.filterpopupAppear = false;
    this.popupAppear = false;
    // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.employeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();
    var from = this.scheduler.control.visibleStart();
    var to = this.scheduler.control.visibleEnd();
    this.ds.getEvents(from, to).subscribe(result => {
      this.events = result;
    });
    this.config.resources = [];

    this.Range = this.ds.getType();
    this.date = this.ds.getDate();
    this.date1 = this.ds.getDate();
    this.ViewType();

    this.dropdownSettings1 = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
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
          // alert("Please add employees in schedule Group !")
          const dialogRef = this.dialog.open(AlertdialogComponent, {
            data: {
              message: "Please add employees in schedule Group ! !!!!! ",
              buttonText: {
                cancel: 'Done'
              }
            },
          });
        }
      });

    this.curDate = this.convert_DT(new Date());

    this.SchedulingService
      .employeesForSchedulerDropdown_PWA('Manager', this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.empList = data;
      });


    this.SchedulingService
      .getAllSchedulingNames(this.employeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.scheduleNameList = data;
      });

    this.onResize();
    this.responsiveService.checkWidth();

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
        // {
        //   "groupBy": "Week",
        // },
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
      this.config.cellDuration = 100;
      this.config.cellWidth = 128;
      this.config.cellWidthSpec = 'Auto';
      this.config.cellWidthMin = 62;
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
        // {
        //   "groupBy": "Week",
        // },
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
      this.config.cellDuration = 100;
      this.config.cellWidth = 128;
      this.config.cellWidthSpec = 'Auto';
      this.config.cellWidthMin = 62;
      this.config.days = 7;
      this.config.startDate = this.convert_DT(this.date);
      this.config.allowMultiSelect = true;
      this.config.allowMultiMove = true;
      this.config.eventClickHandling = "Select";
      this.config.multiMoveVerticalMode = "All";
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
    // this.loading = true;
    this.SchedulingService
      .empCalendarDetails(this.Range, this.convert_DT(this.date), this.OrganizationID)
      .subscribe((data: any[]) => {
        this.events = data;
        // this.loading = false;
      });
  }
  //new change for row filtering. starts....
  changeText(text) {
    this.filter.text = text;
  }

  changeWithEvents(val) {
    this.filter.eventsOnly = val;
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
            employeeKeList.push(employeeKeListObj[j].id);
          }
        }
        EmployeeKeyString = employeeKeList.join(',');
      }
    }
    // this.loading = true;
    this.SchedulingService
      .rowFiltering(EmployeeKeyString, this.filter.eventsOnly, this.Range, this.convert_DT(this.date), this.OrganizationID)
      .subscribe((data: any[]) => {
        this.config.resources = data;
        // this.loading = false;
      });

    this.date1 = this.date;
  }

  clearFilter() {
    this.filter.text = null;
    this.filter.eventsOnly = false;
    this.applyFilter();
    return false;
  }
  //new change for row filtering. ends....

  testme(obj) {

    this.SchedulingService.SchedulerEventCreate(obj).subscribe(data => {
      return Promise.resolve(this.empCalendarActivities());
    });
  }

  filterpopup() {
    if (this.filterpopupAppear == false) {
      this.filterpopupAppear = true;
      // document.getElementById('popupSection').style.display = 'block';

    }
    else {
      this.filterpopupAppear = false;
      // document.getElementById('popupSection').style.display = 'none';
    }
  }
  onResize() {
    this.responsiveService.getMobileStatus().subscribe(isMobile => {
      this.isMobile = isMobile;
    });
  }

  // CREATE starts
  form: FormGroup;
  dateFormat = "MM/dd/yyyy h:mm tt";
  name: any = "new Event";
  resources: any[];
  start;
  end;
  resource;

  BatchScheduleNameKey;
  ScheduleName;
  scheduleNameList;
  params;
  Date;

  options2: DatepickerOptions = {
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



  createshow(args: any) {

    this.resource = args.resource;
    this.BatchScheduleNameKey = '';
    this.Date = args.start;
    this.modal.show();
  }

  createSubmit() {
    if (!(this.BatchScheduleNameKey)) {
      // alert("Please provide Assignment Name !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: "Please provide Assignment Name !",
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => { return; });

    }

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
    this.testme(obj);
    this.modal.hide();
    // this.ds.setFocusEmp(this.resource);
    // this.ds.setExpandFlagNewComp(2);
    this.scheduler.control.scrollToResource(this.resource);
    // this.SchedulingService.SchedulerEventCreate(obj).subscribe(data => {
    //   this.ds.setExpandFlagNewComp(2);
    //   if (this.role == 'Manager') {
    //     this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['Scheduler'] } }]);
    //   } else if (this.role == 'Supervisor') {
    //     this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['Scheduler'] } }]);
    //   }
    // });
  }

  createCancel() {
    this.modal.hide();
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
  closed(args) {

    console.log("Closed");
  }
  // CREATE ends

  // EDIT starts

  event1: DayPilot.Event;

  //local variable
  ScheduleNameEdit;
  BatchScheduleNameKeyEdit;
  DateEdit;
  AssignIDForDelete;
  scheduleOldKey;

  options3: DatepickerOptions = {
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


  editshow(ev: DayPilot.Event) {
    return new Promise<void>((resolve) => {
      this.event1 = ev;
      this.form.setValue({
        start: ev.start(),
        end: ev.end(),
        name: ev.text(),
        resource: ev.resource(),

      });
      this.AssignIDForDelete = ev.data.Assignment_CalenderID;
      this.BatchScheduleNameKeyEdit = ev.data.ScheduleNameKey;
      this.ScheduleNameEdit = ev.data.ScheduleName;
      this.DateEdit = ev.data.start;
      this.scheduleOldKey = ev.data.ScheduleNameKey;
      if (ev.data.moveDisabled != 1) {
        this.modal1.show();
      }
      resolve();
    });

  }

  dateChangeNeeded() {
    this.DateEdit = this.convert_DT(this.DateEdit);
  }

  submitEdit() {
    console.log(this.event1);
    var date = this.DateEdit;
    if (!(this.BatchScheduleNameKeyEdit)) {
      // alert("Please provide Assignment Name !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: "Please provide Assignment Name !",
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => { return; });
    }
    let obj = {
      resourceEmployee: this.event1.data.resource,
      start: date,
      ScheduleNameKey: this.BatchScheduleNameKeyEdit,
      MetaEmp: this.employeekey,
      OrganizationID: this.OrganizationID,
      Assignment_CalenderID: this.event1.data.Assignment_CalenderID
    };
    this.updateCall(obj);
    this.modal1.hide();
    // this.ds.setExpandFlagNewComp(3);
    // this.ds.setFocusEmp(this.event1.data.resource);
    // console.log(this.ds.getFocusEmp());
    this.scheduler.control.scrollToResource(this.event1.data.resource);
    // this.SchedulingService.SchedulerEventUpdate(obj).subscribe(data => {
    //   this.ds.setExpandFlagNewComp(3);
    //   if (this.role == 'Manager') {
    //     this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['Scheduler'] } }]);
    //     // } else if (this.role == 'Employee' && this.IsSupervisor == 1) {
    //   } else if (this.role == 'Supervisor') {
    //     this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['Scheduler'] } }]);
    //   }
    // });

    this.event1.data.start = date;
    this.event1.data.end = date;
    this.event1.data.resource;
    this.event1.data.text = this.ScheduleNameEdit;
    this.event1.data.ScheduleName = this.ScheduleNameEdit;
    this.event1.data.ScheduleNameKey = this.BatchScheduleNameKeyEdit;
  }

  cancel() {
    this.modal1.hide();
  }


  delete() {

    const message = `Are you sure !!  Do you want to delete`;
    const dialogData = new ConfirmDialogModel("DELETE", message);
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteCall(this.AssignIDForDelete, this.employeekey, this.OrganizationID);
        this.modal1.hide();
        this.scheduler.control.scrollToResource(this.event1.data.resource);
      }
    });


    // var confirmBox = confirm("Do you want to Delete ?");
    // if (confirmBox == true) {
    //   this.deleteCall(this.AssignIDForDelete, this.employeekey, this.OrganizationID);
    //   this.modal1.hide();
    //   // this.ds.setFocusEmp(this.event1.data.resource);
    //   this.scheduler.control.scrollToResource(this.event1.data.resource);
    //   // this.SchedulingService.SchedulerEventDelete(this.AssignIDForDelete, this.employeekey, this.OrganizationID).subscribe(data => {
    //   //   this.ds.setExpandFlagNewComp(3);
    //   //   if (this.role == 'Manager') {
    //   //     this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['Scheduler'] } }]);
    //   //     // } else if (this.role == 'Employee' && this.IsSupervisor == 1) {
    //   //   } else if (this.role == 'Supervisor') {
    //   //     this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['Scheduler'] } }]);
    //   //   }
    //   // });
    // }
  }


  setScheduleNameEdit() {
    for (var i = 0; i < this.scheduleNameList.length; i++) {

      if (parseInt(this.BatchScheduleNameKeyEdit) === this.scheduleNameList[i].BatchScheduleNameKey) {

        this.ScheduleNameEdit = this.scheduleNameList[i].ScheduleName;
      }
    }

  }

  updateCall(obj) {

    this.SchedulingService.SchedulerEventUpdate(obj).subscribe(data => {
      return Promise.resolve(this.empCalendarActivities());
    });
  }


  deleteCall(AssignIDForDelete, employeekey, OrganizationID) {

    this.SchedulingService.SchedulerEventDelete(AssignIDForDelete, employeekey, OrganizationID).subscribe(data => {
      return Promise.resolve(this.empCalendarActivities());
    });
  }
  // EDIT ends
}

