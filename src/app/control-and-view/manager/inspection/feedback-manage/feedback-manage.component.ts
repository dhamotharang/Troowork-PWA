import { Component, OnInit } from '@angular/core';
import { InspectionService } from '../../../../service/inspection.service';

@Component({
  selector: 'app-feedback-manage',
  templateUrl: './feedback-manage.component.html',
  styleUrls: ['./feedback-manage.component.scss']
})
export class FeedbackManageComponent implements OnInit {
  role: String;
  name: String;
  toServeremployeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  pageNo: Number = 1;
  itemsPerPage: Number = 25;
  tempID;
  fieldArray;
  scores;
  TemplateEditDetails;
  newAttribute = [];
  temparray = [];
  insertObj;
  TemplateQuestionID;
  loading=false;

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

  constructor(private inspectionService: InspectionService) { }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

  ngOnInit() {
    //token starts....
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.toServeremployeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;
    //token ends

    this.inspectionService
      .getFeedbackTemplateQuestionsEditDetails(this.OrganizationID).subscribe((data: any[]) => {
        this.fieldArray = data;
        if (this.fieldArray.length == 0) {
          this.tempID = 0;
        } else {
          this.tempID = this.fieldArray[0].idreviewtemplate;
        }
      });

  }

  addFieldValue() {
    this.newAttribute.push('');
  }

  deleteFieldValue1(TemplateQuestionID) {
    this.TemplateQuestionID = TemplateQuestionID;
  }

  deleteFieldValue() {
    this.inspectionService
      .deleteSelectedFeedbackQuestion(this.TemplateQuestionID, this.toServeremployeekey, this.OrganizationID).subscribe(() => {
        alert("Question deleted successfully");
        this.inspectionService
          .getFeedbackTemplateQuestionsEditDetails(this.OrganizationID).subscribe((data: any[]) => {
            this.fieldArray = data;
          });
      });
  }

  deleteNewFieldValue(index) {
    this.newAttribute.splice(index, 1);
  }

  savetemplate() {

    var temp_insertArry = [];
    temp_insertArry = this.newAttribute;
    
    if (this.tempID == 0) {
      this.inspectionService.createMasterReviewTempalte(this.toServeremployeekey, this.OrganizationID).subscribe((data: any[]) => {
        this.tempID = data[0].idreviewtemplate;
        var count = 0;
        for (var j = 0; j < temp_insertArry.length; j++) {
          if(temp_insertArry[j]){
            temp_insertArry[j]=temp_insertArry[j].trim();
          }
          this.insertObj = {
            templateid: this.tempID,
            question: temp_insertArry[j],
            empKey: this.toServeremployeekey,
            OrganizationID: this.OrganizationID
          };
          count = j + 1;

        }
      })
    } else {
      var count = 0;
      var count1 = 0;
      for (var j = 0; j < temp_insertArry.length; j++) {
        if (temp_insertArry[j].trim()) {
          if(temp_insertArry[j]){
            temp_insertArry[j]=temp_insertArry[j].trim();
          }
          this.insertObj = {
            templateid: this.tempID,
            question: temp_insertArry[j],
            empKey: this.toServeremployeekey,
            OrganizationID: this.OrganizationID
          };
          count = j + 1;

        } else {
          count1 = count1 + 1;
          // 
        }
      }
      if (count1 > 0) {
        alert("Don't leave question area empty");
      }
      else{
        this.inspectionService
        .insertFeedbackQuestion(this.insertObj).subscribe((data: any[]) => {
          if (count == this.newAttribute.length) {
            this.alertme();
          }
        });
      }
    }
  }

  alertme() {
    alert("Questions added successfully");
    this.newAttribute = [];
    this.loading=true;
    this.inspectionService
      .getFeedbackTemplateQuestionsEditDetails(this.OrganizationID).subscribe((data: any[]) => {
        this.loading=false;
        this.fieldArray = data;
      });
  }

}

