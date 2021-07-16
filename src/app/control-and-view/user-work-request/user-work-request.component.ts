import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../service/review.service';
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../dialog/alertdialog/alertdialog.component';
import { ConfirmationdialogComponent, ConfirmDialogModel } from '../dialog/confirmationdialog/confirmationdialog.component';

@Component({
  selector: 'app-user-work-request',
  templateUrl: './user-work-request.component.html',
  styleUrls: ['./user-work-request.component.scss']
})
export class UserWorkRequestComponent implements OnInit {
  OrgId$;
  rKey$;
  comments;
  Facility_Key;
  Floor_Key;
  Zone_Key;
  checkFlag;
  constructor(private reviewservice: ReviewService, private router: Router, private route: ActivatedRoute, private dialog: MatDialog) {
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
    this.checkFlag = false;
  }
  Submit() {
    this.checkFlag = true;
    if (!(this.comments) || !(this.comments.trim())) {
      // alert("comment not provided !");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Comment not provided !!',
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
    var t = new Date();
    var t = new Date();
    var y = t.getFullYear();
    var m = t.getMonth();
    var d = t.getDate();
    var h = t.getHours();
    var mi = t.getMinutes();
    var s = t.getSeconds();

    var today_DT = this.convert_DT(new Date());
    //  this.Timetemp= new Date().getHours() + ':' + new Date().getMinutes();
    var p = "";
    p = today_DT + " " + h + ":" + mi + ":" + s;
    this.comments = this.comments.trim();
    let reviewAdd = {
      Facility_Key: this.Facility_Key,
      Floor_Key: this.Floor_Key,
      Zone_Key: this.Zone_Key,
      Orgid: this.OrgId$,
      roomKey: this.rKey$,
      Comments: this.comments,
      Datetime: p
    };

    this.reviewservice.UserWorkRequest(reviewAdd).subscribe((data: any[]) => {
      this.checkFlag = false;
      this.router.navigate(['thankYou', 'workRequest']);
    });
  }
}
