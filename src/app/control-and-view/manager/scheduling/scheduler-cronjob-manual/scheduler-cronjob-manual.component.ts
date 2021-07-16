import { Component, OnInit, HostListener, Input, ElementRef } from '@angular/core';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { SchedulingService } from '../../../../service/scheduling.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';
import { ConfirmationdialogComponent, ConfirmDialogModel } from '../../../dialog/confirmationdialog/confirmationdialog.component';


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
  checkFlag;
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
  constructor(private scheduleService: SchedulingService, private dst: DataServiceTokenStorageService, private dialog: MatDialog) { }

  createCJ() {
    this.checkFlag = true;
    this.scheduleService.getCountForAssignmentManualcreatecheck(this.curDate, this.OrganizationID)
      .subscribe((cdata: any) => {

        if (cdata[0].count > 0) {
          this.loading = true;
          this.scheduleService.createSchedulerCronjob(this.OrganizationID, this.curDate, this.employeekey)
            .subscribe(res => {
              this.loading = false;
              this.disableFlag = false;
              // alert("Cronjobs created successfully");
              const dialogRef = this.dialog.open(AlertdialogComponent, {
                data: {
                  message: 'Cronjobs created successfully',
                  buttonText: {
                    cancel: 'Done'
                  }
                },
              });
              dialogRef.afterClosed().subscribe(dialogResult => {
                this.checkFlag = false;
              });
            });
        }
        else {
          // alert("Need 8 Weeks of Data to create");
          const dialogRef = this.dialog.open(AlertdialogComponent, {
            data: {
              message: 'Need 8 Weeks of Data to create!!!',
              buttonText: {
                cancel: 'Done'
              }
            },
          });
          dialogRef.afterClosed().subscribe(dialogResult => {
            this.checkFlag = false;
          });
        }
      });
  }

  deleteCJ() {

    const message = `Are you sure !!  Do you want to delete`;
    const dialogData = new ConfirmDialogModel("DELETE", message);
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      maxWidth: "400px",
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.loading = true;
        this.checkFlag = true;
        this.scheduleService.deleteSchedulerCronjob(this.OrganizationID, this.curDate, this.employeekey)
          .subscribe((data: any) => {
            this.loading = false;
            if (data[0].assignmentmastercount > 0) {
              this.disableFlag = false;
            } else if (data[0].assignmentmastercount == 0) {
              this.disableFlag = true;
            }

            this.scheduleService.getCountForAssignmentManualCronjob(this.OrganizationID).subscribe((data: any) => {

              if (data[0].count > 0) {
                this.scheduleService.getCountForAssignmentManualCronjobnextdate(this.OrganizationID).subscribe((data: any) => {
                  this.nextschedulerDate = this.convert_DT(data[0].nextdate);
                });
              }
            });
            // alert("Cronjobs deleted successfully");
            const dialogRef = this.dialog.open(AlertdialogComponent, {
              data: {
                message: 'Cronjobs deleted successfully',
                buttonText: {
                  cancel: 'Done'
                }
              },
            });
            dialogRef.afterClosed().subscribe(dialogResult => {
              this.checkFlag = false;
            });
          });
      }
    });

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

    //token ends
    this.checkFlag = false;
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

      if (data[0].count > 0) {
        this.scheduleService.getCountForAssignmentManualCronjobnextdate(this.OrganizationID).subscribe((data: any) => {
          this.nextschedulerDate = this.convert_DT(data[0].nextdate);
        });
      }

    });

  }

}
