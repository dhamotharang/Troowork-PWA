import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../../../service/organization.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-cron-job',
  templateUrl: './view-cron-job.component.html',
  styleUrls: ['./view-cron-job.component.scss']
})
export class ViewCronJobComponent implements OnInit {
  woList;
  total: Number = 0;

  convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(- 2),
      day = ("0" + date.getDate()).slice(- 2);
    return [date.getFullYear(), mnth, day].join("-");
  };
  constructor(private organizationService: OrganizationService) { }

  ngOnInit() {
    var currentDate = this.convert_DT(new Date());

    this.organizationService.cronJob_workordersCount(currentDate).subscribe((data: any[]) => {
      this.woList = data;
      for (var i = 0; i < this.woList.length; i++) {
        this.total = this.total + this.woList[i].count;
      }
    });
  }

}
