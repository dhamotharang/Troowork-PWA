import { Component, OnInit } from '@angular/core';
import { InspectionService } from '../../../../service/inspection.service';
import { Inspection } from '../../../../model-class/Inspection';
@Component({
  selector: 'app-inspectiontemplate-create',
  templateUrl: './inspectiontemplate-create.component.html',
  styleUrls: ['./inspectiontemplate-create.component.scss']
})
export class InspectiontemplateCreateComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  ScoreTypeKey;
  InspTempName;
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

  scores: Inspection[];
  title = 'dynamicrow';
  fieldArray: Array<any> = [];
  ;newAttribute: any = {};

  constructor(private inspectionService: InspectionService) { }

  addFieldValue() {
    this.fieldArray.push('')

  }
  deleteFieldValue(index) {
    this.fieldArray.splice(index, 1);
  }

  valuesSave(ScoreTypeKey, InspTempName) {

    var ScoringTypeKey;
    var TemplateID;
    var templatename;
    if (InspTempName && !InspTempName.trim()) {
      alert("Please Enter Inspection Template Name!");
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
    if (InspTempName) {
      InspTempName = this.InspTempName.trim();
    }
    else {
      InspTempName = null;
      alert("Inspection Template Name is not provided !");
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
    this.inspectionService.checkforTemplate(InspTempName, this.OrganizationID).subscribe(res => {
      if (res[0].count == 0) {
        this.inspectionService.createInspectionTemplate(ScoreTypeKey, InspTempName, QustArry, this.employeekey, this.OrganizationID).subscribe(res => {
          this.ScoreTypeKey = "";
          this.InspTempName = null;
          this.fieldArray = [];
          alert("Inspection Template Added !");
          this.addFieldValue();
        });
      }
      else {

        this.ScoreTypeKey = "";
        this.InspTempName = null;
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
      .subscribe((data: Inspection[]) => {
        this.scores = data;
      });
  }

}
