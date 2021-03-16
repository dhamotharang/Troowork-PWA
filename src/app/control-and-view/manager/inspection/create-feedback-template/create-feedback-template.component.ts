import { Component, OnInit } from '@angular/core';
import { InspectionService } from '../../../../service/inspection.service';

@Component({
  selector: 'app-create-feedback-template',
  templateUrl: './create-feedback-template.component.html',
  styleUrls: ['./create-feedback-template.component.scss']
})
export class CreateFeedbackTemplateComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  ScoreTypeKey;
  TempName;
  field;

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

  scores;
  title = 'dynamicrow';
  fieldArray: Array<any> = [];
  newAttribute: any = {};

  constructor(private inspectionService: InspectionService) { }

  addFieldValue() {
    this.fieldArray.push('')

  }
  deleteFieldValue(index) {
    this.fieldArray.splice(index, 1);
  }

  valuesSave(ScoreTypeKey, TempName) {

    var ScoringTypeKey;
    if (TempName && !TempName.trim()) {
      alert("Please Enter Feedback Template Name!");
      return;
    }
    if (ScoreTypeKey) {
      ScoringTypeKey = this.ScoreTypeKey;
    }
    else {
      ScoringTypeKey = null;
      alert("Scoring Type is not provided !");
      return;
    }
    if (TempName) {
      TempName = this.TempName.trim();
    }
    else {
      TempName = null;
      alert("Feedback Template Name is not provided !");
      return;
    }
    var arr = [];
    var t1;
    for (var i = 0; i < this.fieldArray.length; i++) {
      if (!(this.fieldArray[i])) {
        var index = i + 1;
        alert("Question " + index + " is not provided !");
        return;
      }
      if (this.fieldArray[i]) {
        this.fieldArray[i] = this.fieldArray[i].trim();
      }
      arr.push(this.fieldArray[i]);
    }
    this.fieldArray;
    var TempQustArry = [];
    var QustArry;
    for (var j = 0; j < arr.length; j++) {
      TempQustArry.push(arr[j]);
    }
    QustArry = TempQustArry.join(',');
    if (QustArry === '') {
      QustArry = null;
      alert(" Questions are not provided !");
      return;
    }
    if (QustArry && !QustArry.trim()) {
      alert("Please Enter Question!");
      return;
    }
    this.inspectionService.checkforFeedbackTemplate(TempName, this.OrganizationID).subscribe(res => {
      if (res[0].count == 0) {
        this.inspectionService.createFeedbackTemplate(ScoreTypeKey, TempName, QustArry, this.employeekey, this.OrganizationID).subscribe(res => {
          this.ScoreTypeKey = "";
          this.TempName = null;
          this.fieldArray = [];
          alert("Feedback Template Added !");
          this.addFieldValue();
        });
      }
      else {

        this.ScoreTypeKey = "";
        this.TempName = null;
        this.fieldArray = [];
        alert("Template Name already exists !");
        this.addFieldValue();
      }
    });
  }
  customTrackBy(index: number, obj: any): any {
    return index;
  }
  ngOnInit() {

    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;
    this.addFieldValue();
    this.ScoreTypeKey = "";
    this.inspectionService
      .getScoreTypeList(this.OrganizationID)
      .subscribe((data: any[]) => {
        this.scores = data;
      });
  }

}
