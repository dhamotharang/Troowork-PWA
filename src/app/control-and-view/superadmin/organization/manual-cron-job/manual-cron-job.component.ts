import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../../../service/organization.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-manual-cron-job',
  templateUrl: './manual-cron-job.component.html',
  styleUrls: ['./manual-cron-job.component.scss']
})
export class ManualCronJobComponent implements OnInit {

  constructor(private organizationService: OrganizationService) { }

  checkFlag;
  cronJobMST() {
    this.checkFlag = true;
    /*
    calling api from controller...
    */
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/cronjobMST').subscribe((data: any[]) => {
    //     console.log("Success.. MST");
    //   });

    this.organizationService.cronJob_MST().subscribe((data: any[]) => {
      alert("CronJob-MST executed successfully");
      this.checkFlag = false;
    });
  }

  cronJobCST() {

    this.checkFlag = true;
    this.organizationService.cronJob_CST().subscribe((data: any[]) => {
      alert("CronJob-CST executed successfully");
      this.checkFlag = false;
    });
  }

  ngOnInit() {
    this.checkFlag = false;
  }

}
