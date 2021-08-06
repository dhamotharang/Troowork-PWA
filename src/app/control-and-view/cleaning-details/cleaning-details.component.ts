import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../service/review.service';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-cleaning-details',
  templateUrl: './cleaning-details.component.html',
  styleUrls: ['./cleaning-details.component.scss']
})
export class CleaningDetailsComponent implements OnInit {

  OrgId$;
  rKey$;
  cleaningDetails;
  Facility_Key;
  Floor_Key;
  Zone_Key;
  loading;
  show;

  constructor(private reviewservice: ReviewService, private router: Router, private route: ActivatedRoute) {
    this.route.params.subscribe(params => this.Facility_Key = params.Facility_Key);
    this.route.params.subscribe(params => this.Floor_Key = params.Floor_Key);
    this.route.params.subscribe(params => this.Zone_Key = params.Zone_Key);
    this.route.params.subscribe(params => this.OrgId$ = params.rev_orgid);
    this.route.params.subscribe(params => this.rKey$ = params.room_key);
  }

  convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(- 2),
      day = ("0" + date.getDate()).slice(- 2);
    return [date.getFullYear(), mnth, day].join("-");
  };

  ngOnInit() {
    this.loading = true;
    // call to get the last details of the room
    this.reviewservice.getLastCleanedDetails(this.rKey$, this.OrgId$).subscribe((data: any[]) => {
      if (data.length > 0) {
        this.show = true;
      } else {
        this.show = false;
      }
      this.cleaningDetails = data[0];
      this.loading = false;
    });
  }

}
