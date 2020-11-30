import { Component, OnInit, HostListener, Input, ElementRef } from '@angular/core';
import { SchedulingService } from '../../../../service/scheduling.service';

@Component({
  selector: 'app-scheduler-cronjob-manual',
  templateUrl: './scheduler-cronjob-manual.component.html',
  styleUrls: ['./scheduler-cronjob-manual.component.scss']
})
export class SchedulerCronjobManualComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  loading: boolean;
  disableFlag;
  curDate;
  nextschedulerDate;
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

  public convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");

  }
  constructor(private scheduleService: SchedulingService) { }

  createCJ() {
    this.scheduleService.getCountForAssignmentManualcreatecheck(this.curDate, this.OrganizationID)
      .subscribe((cdata: any) => {

        if (cdata[0].count > 0) {
          this.loading = true;
          this.scheduleService.createSchedulerCronjob(this.OrganizationID, this.curDate, this.employeekey)
            .subscribe(res => {
              this.loading = false;
              this.disableFlag = false;
              alert("Cronjobs created successfully");
            });
        }
        else {
          alert("Need 8 Weeks of Data to create");
        }
      });
  }

  deleteCJ() {
    this.loading = true;
    this.scheduleService.deleteSchedulerCronjob(this.OrganizationID, this.curDate, this.employeekey)
      .subscribe((data: any) => {
        this.loading = false;
        if (data[0].assignmentmastercount > 0) {
          this.disableFlag = false;
        } else if (data[0].assignmentmastercount == 0) {
          this.disableFlag = true;
        }

        this.scheduleService.getCountForAssignmentManualCronjob(this.OrganizationID).subscribe((data: any) => {
          console.log("Assignment Cron: " + data[0].count);

          if (data[0].count > 0) {
            this.scheduleService.getCountForAssignmentManualCronjobnextdate(this.OrganizationID).subscribe((data: any) => {
              console.log("Assignment Cron: " + this.convert_DT(data[0].nextdate));
              this.nextschedulerDate = this.convert_DT(data[0].nextdate);
            });
          }
        });
        alert("Cronjobs deleted successfully");
      });
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

    //token ends
    this.curDate = this.convert_DT(new Date());
    this.nextschedulerDate = this.curDate;
    this.scheduleService.getCountForDelete(this.OrganizationID, this.curDate).subscribe((data: any) => {
      if (data[0].count > 0) {
        this.disableFlag = false;
      } else if (data[0].count == 0) {
        this.disableFlag = true;
      }
    });
    this.scheduleService.getCountForAssignmentManualCronjob(this.OrganizationID).subscribe((data: any) => {
      console.log("Assignment Cron: " + data[0].count);

      if (data[0].count > 0) {
        this.scheduleService.getCountForAssignmentManualCronjobnextdate(this.OrganizationID).subscribe((data: any) => {
          console.log("Assignment Cron: " + this.convert_DT(data[0].nextdate));
          this.nextschedulerDate = this.convert_DT(data[0].nextdate);
        });
      }

    });

  }

}
