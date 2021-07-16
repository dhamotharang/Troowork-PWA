import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { DatepickerOptions } from 'ng2-datepicker';
import { WorkOrderServiceService } from '../../../../service/work-order-service.service';
import { SchedulingService } from '../../../../service/scheduling.service';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';

@Component({
  selector: 'app-view-service-request',
  templateUrl: './view-service-request.component.html',
  styleUrls: ['./view-service-request.component.scss']
})
export class ViewServiceRequestComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  EmployeeKey;

  fromdate;
  todate;
  requestdetails;
  vpto;

  curdate;
  curtime;
  EmployeeOption;

  checkFlag;

  loading: boolean;// loading

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
    addStyle: { 'font-size': '18px', 'width': '75%', 'border': '1px solid #ced4da', 'border-radius': '0.25rem' }, // Optional, value to pass to [ngStyle] on the input field
    fieldId: 'my-date-picker', // ID to assign to the input field. Defaults to datepicker-<counter>
    useEmptyBarTitle: false, // Defaults to true. If set to false then barTitleIfEmpty will be disregarded and a date will always be shown 
  };

  public convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
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

  constructor(private WorkOrderServiceService: WorkOrderServiceService, private SchedulingService: SchedulingService, private dst: DataServiceTokenStorageService, private dialog: MatDialog) { }

  ngOnInit() {

    this.loading = true;

    // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.employeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();

    this.checkFlag = false;

    this.fromdate = new Date(Date.now());
    this.todate = new Date(Date.now());


    // this.fromdate = this.convert_DT(this.fromdate);
    // this.todate = this.convert_DT(this.todate);


    this.vpto = {
      fromdate: this.fromdate,
      todate: this.todate,

      OrganizationID: this.OrganizationID,
      employeekey: this.employeekey
    };
    // this.PeopleServiceService.getRequestdetailsforManager(this.employeekey, this.OrganizationID)
    //   .subscribe((data) => {
    //     this.requestdetails = data;
    //   });

    this.WorkOrderServiceService.getviewWorkorderservicerequest(this.vpto)
      .subscribe((data) => {
        this.loading = false;
        this.requestdetails = data;
      });
    this.SchedulingService.getEmployeesForSchedulerReport(this.OrganizationID)
      .subscribe((data: any[]) => {
        this.EmployeeOption = data;
      });
  }

  viewserviceRequest() {

    if (!this.fromdate) {
      var date1 = this.convert_DT(new Date());
    }
    else {
      date1 = this.convert_DT(this.fromdate);
    }
    if (!this.todate) {
      var date2 = date1;
    }
    else {
      date2 = this.convert_DT(this.todate);
    }

    if (date2 && date1 > date2) {
      // alert("Please check your Start Date!");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Please check your Start Date!!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        return;
      });
    }

    // if ((todate) && (this.convert_DT(fromdate) > this.convert_DT(todate))) {
    //   todate = null;
    //   alert("Please check your Start Date!");
    //   return;
    // }
    else {
      this.loading = true;
      var fdate;
      var tdate;
      fdate = this.convert_DT(this.fromdate);
      tdate = this.convert_DT(this.todate);
      // this.fromdate = fdate;
      // this.todate = tdate;
      this.vpto = {
        fromdate: fdate,
        todate: tdate,
        OrganizationID: this.OrganizationID,
        employeekey: this.employeekey
      };

      this.WorkOrderServiceService.getviewWorkorderservicerequest(this.vpto)
        .subscribe((data) => {
          this.loading = false;
          this.requestdetails = data;
        });
    }
  }

  createworkorderbyservicerequest(servicerequestid, empKey) {
    this.loading = true;

    this.checkFlag = true;
    this.curdate = new Date(Date.now());

    var h = this.curdate.getHours();
    var mi = this.curdate.getMinutes();
    var s = this.curdate.getSeconds();

    this.curdate = this.convert_DT(this.curdate);
    this.curtime = h + ":" + mi + ":" + s;
    this.vpto = {
      date1: this.curdate,
      time1: this.curtime,
      servicerequestid: servicerequestid,
      OrganizationID: this.OrganizationID,
      employeekey: this.employeekey,
      CreateEmpKey: empKey
    };
    if (!empKey) {
      // alert("Employee not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Employee not provided !!',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      dialogRef.afterClosed().subscribe(dialogResult => {
        this.checkFlag = false;
        return;
      });
    }
    this.WorkOrderServiceService.generateWorkorderbyservicerequest(this.vpto)
      .subscribe((data: any[]) => {
        this.requestdetails = data;
        if (data.length > 0) {
          // alert("WorkOrder created successfully");
          const dialogRef = this.dialog.open(AlertdialogComponent, {
            data: {
              message: 'WorkOrder created successfully',
              buttonText: {
                cancel: 'Done'
              }
            },
          });
          dialogRef.afterClosed().subscribe(dialogResult => {
            this.checkFlag = false;
            this.viewserviceRequest();
          });
        }
      });

  }

}
