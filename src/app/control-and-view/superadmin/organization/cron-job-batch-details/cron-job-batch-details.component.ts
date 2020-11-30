import { Component, OnInit } from '@angular/core';
import { People } from '../../../../model-class/People';
import { PeopleServiceService } from '../../../../service/people-service.service';
import { OrganizationService } from '../../../../service/organization.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-cron-job-batch-details',
  templateUrl: './cron-job-batch-details.component.html',
  styleUrls: ['./cron-job-batch-details.component.scss']
})
export class CronJobBatchDetailsComponent implements OnInit {
  OrgID;
  organization;
  OrganizationID: Number = 0;
  batchDetails;
  loading: boolean;
  total: Number = 0;
  currentDate;
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

  constructor(private PeopleServiceService: PeopleServiceService, private organizationService: OrganizationService) { }
  
  orgChanged() {
    this.loading = true;
    this.total=0;
    this.organizationService.cronJob_unrunBatchCount(this.currentDate, this.OrganizationID).subscribe((data: any[]) => {
      this.batchDetails = data;
      for (var i = 0; i < this.batchDetails.length; i++) {
        this.total = this.total + this.batchDetails[i].count;
      }
      this.loading = false;
    });
  }
  ngOnInit() {
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.OrgID = profile.OrganizationID;

    this.currentDate = this.convert_DT(new Date());
    this.PeopleServiceService
      .getOrganization(this.OrgID)
      .subscribe((data: People[]) => {
        this.organization = data;
      });
    this.loading = true;
    this.organizationService.cronJob_unrunBatchCount(this.currentDate, this.OrganizationID).subscribe((data: any[]) => {
      this.batchDetails = data;
      for (var i = 0; i < this.batchDetails.length; i++) {
        this.total = this.total + this.batchDetails[i].count;
      }
      this.loading = false;
    });
  }

}
