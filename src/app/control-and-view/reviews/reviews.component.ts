import { Component, OnInit } from '@angular/core';
import { ReviewService } from '../../service/review.service';
import { InventoryService } from '../../service/inventory.service';
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {

  comments;
  fac$;
  flr$;
  zone$;
  rtype$;
  OrgId$;
  rKey$;
  tempKey$;
  reviewAdd;
  rating_yn;
  starList = [];
  rating = [];
  reviewQuestions;
  value;
  templateQuestionvalues = {};
  count = 0;
  saveInspection = {};
  names;
  ScoreName;
  Scoringtype = { ratingValue: [], inspectionNotes: [], rating_yn: [] };


  lastIndexValue;

  constructor(private reviewservice: ReviewService, private router: Router, private route: ActivatedRoute, private inventoryService: InventoryService) {
    this.route.params.subscribe(params => this.fac$ = params.Facility_Key);
    this.route.params.subscribe(params => this.flr$ = params.Floor_Key);
    this.route.params.subscribe(params => this.zone$ = params.Zone_Key);
    this.route.params.subscribe(params => this.rtype$ = params.RoomType_Key);
    this.route.params.subscribe(params => this.OrgId$ = params.rev_orgid);
    this.route.params.subscribe(params => this.rKey$ = params.room_key);
    // this.route.params.subscribe(params => this.tempKey$ = params.templateID);
  }

  saveRatings(TemplateQuestionID, ScoreName) {

    if (ScoreName === 'Yes/No' || ScoreName === 'Pass/Fail') {
      var length = Object.keys(this.Scoringtype.rating_yn).length;
      var arrayLength = this.Scoringtype.rating_yn.length;
      var value = this.Scoringtype.rating_yn[arrayLength - 1];
      this.Scoringtype.ratingValue.push({ rating: value, questionID: TemplateQuestionID });
    }
    else if (ScoreName === '5 Star') {
      this.Scoringtype.ratingValue.push({ rating: this.value, questionID: TemplateQuestionID });
    }
    else if (ScoreName === '3 Star') {
      this.Scoringtype.ratingValue.push({ rating: this.value, questionID: TemplateQuestionID });
    }
  }

  setStar(k, data: any) {
    this.rating[k] = data + 1;
    this.value = this.rating[k];
    for (var i = 0; i <= 4; i++) {
      if (i <= data) {
        this.starList[k][i] = false;
      }
      else {
        this.starList[k][i] = true;
      }
    }
  }

  convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(- 2),
      day = ("0" + date.getDate()).slice(- 2);
    return [date.getFullYear(), mnth, day].join("-");
  };

  arrayUnique(array) {
    var a = array.concat();
    for (var i = 0; i < a.length; ++i) {
      for (var j = i + 1; j < a.length; ++j) {
        if (a[i] === a[j]) {
          a.splice(j--, 1);
        }
      }
    }
    return a;
  };

  lastIndex(array, val) {
    var a = [];
    a = array;
    var b = val;
    var z = null;
    for (var i = 0; i < a.length; i++) {
      if (b == a[i])
        z = i;
    }
    return z;
  }

  SubmitReview() {
    var t = new Date();
    var t = new Date();
    var y = t.getFullYear();
    var m = t.getMonth();
    var d = t.getDate();
    var h = t.getHours();
    var mi = t.getMinutes();
    var s = t.getSeconds();
    var today_DT = this.convert_DT(new Date());
    var p = "";
    p = today_DT + " " + h + ":" + mi + ":" + s;

    var temp = [];
    var choices1 = [];
    choices1[0] = this.Scoringtype;
    var totalQuestions = this.reviewQuestions.length;
    var indexObj = [];
    var ratingIndexlist = [];
    var noteIndexList = [];
    var questionidList = [];

    noteIndexList = Object.keys(this.Scoringtype.inspectionNotes);
    indexObj = this.Scoringtype.ratingValue;
    if (indexObj) {
      for (var j = 0; j < indexObj.length; j++) {
        ratingIndexlist.push("" + indexObj[j].questionID);
      }
    }
    questionidList = this.arrayUnique(noteIndexList.concat(ratingIndexlist));


    var questionValues = "";
    if (questionidList.length === totalQuestions && this.ScoreName !== 'Pass/Fail') {
      console.log("i am in");
      questionValues = null;
      var starRating = null;
      var notes = null;
      var questionid = null;
      var i = 0;
      var j = 0;
      var k = 0;
      if (this.comments) {
        this.comments = this.comments.trim();
      }
      else {
        this.comments = null;
      }
      console.log(questionidList);
      console.log(ratingIndexlist);
      console.log(this.comments);
      this.reviewAdd = {
        Orgid: this.OrgId$,
        Comments: this.comments,
        feedback_time: p,
        templateid: this.tempKey$,
        roomKey: this.rKey$
      };

      this.reviewservice.submitReview(this.reviewAdd).subscribe((data: any[]) => {
        var feedbackmasterID = data[0].feedbackmasterID;
        var count = 0;
        for (i = i; i < questionidList.length; i++) {
          questionValues = null;
          notes = null;
          questionid = questionidList[i];
          for (k = 0; k < ratingIndexlist.length; k++) {
            this.lastIndexValue = 0;
            if (ratingIndexlist[k] === questionid) {
              this.lastIndexValue = this.lastIndex(ratingIndexlist, questionidList[i]);
              var x = this.lastIndexValue.length - ratingIndexlist.length;
              if (this.lastIndexValue != null) {
                questionValues = this.Scoringtype.ratingValue[this.lastIndexValue].rating;
              }
              else {
                questionValues = null;
              }
              break;
            }
          }
          count = count + 1;
          const reviewDetail =
          {
            OrganizationID: this.OrgId$,
            feedbackmasterkey: feedbackmasterID,
            templateQstnValues: questionValues,
            templateid: this.tempKey$,
            questionid: questionid,
            feedback_time: p
          };
          this.reviewservice
            .setReviewDetails(reviewDetail).subscribe();
          if (count == questionidList.length) {
            this.redirect();
          }
        }
      });
    }
  }

  redirect() {
    this.router.navigate(['thankYou', 'feedback']);
  }


  ngOnInit() {
    this.inventoryService.getTemplateDetailsForFeedback(this.OrgId$).subscribe((data) => {
      var tempID = data[0];
      if (!tempID) {
        tempID = [];
        tempID.TemplateID = 0;
      }
      this.tempKey$ = tempID.TemplateID;

      this.reviewservice.getReviewQuestions(this.tempKey$, this.OrgId$).subscribe((data: any[]) => {
        this.reviewQuestions = data;

        if (this.reviewQuestions[0].ScoreName === 'Yes/No') {
          this.names = ['Yes', 'No'];
          this.ScoreName = this.reviewQuestions[0].ScoreName;
        }
        else if (this.reviewQuestions[0].ScoreName === 'Pass/Fail') {
          this.names = ['Fail', 'N/A'];
          this.ScoreName = this.reviewQuestions[0].ScoreName;
        }
        else if (this.reviewQuestions[0].ScoreName === '5 Star') {
          for (var i = 0; i < this.reviewQuestions.length; i++) {
            this.starList[i] = [true, true, true, true, true];
          }
        } else if (this.reviewQuestions[0].ScoreName === '3 Star') {
          for (var i = 0; i < this.reviewQuestions.length; i++) {
            this.starList[i] = [true, true, true];
          }
        }

      });
    });
  }


}
