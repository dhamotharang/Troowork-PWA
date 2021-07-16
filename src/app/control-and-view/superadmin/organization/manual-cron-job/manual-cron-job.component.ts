import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../../../service/organization.service';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';

@Component({
  selector: 'app-manual-cron-job',
  templateUrl: './manual-cron-job.component.html',
  styleUrls: ['./manual-cron-job.component.scss']
})
export class ManualCronJobComponent implements OnInit {

  constructor(private organizationService: OrganizationService, private dialog: MatDialog) { }

  checkFlag;
  cronJobMST() {
    this.checkFlag = true;
    /*
    calling api from controller...
    */
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/cronjobMST').subscribe((data: any[]) => {
    //   });

    this.organizationService.cronJob_MST().subscribe((data: any[]) => {
      // alert("CronJob-MST executed successfully");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'CronJob-MST executed successfully',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
    });
  }

  cronJobCST() {

    this.checkFlag = true;
    this.organizationService.cronJob_CST().subscribe((data: any[]) => {
      // alert("CronJob-CST executed successfully");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'CronJob-CST executed successfully',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
    });
  }

  ngOnInit() {
    this.checkFlag = false;
  }

}
