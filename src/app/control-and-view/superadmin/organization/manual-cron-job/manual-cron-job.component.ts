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

  cronJobMST() {
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
     });
  }

  cronJobCST() {
    this.organizationService.cronJob_CST().subscribe((data: any[]) => { 
      alert("CronJob-CST executed successfully");
    });
  }

  ngOnInit() {
  }

}
