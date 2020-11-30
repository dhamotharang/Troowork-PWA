import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { InspectionService } from '../../../../service/inspection.service';
import { Inspection } from '../../../../model-class/Inspection';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-inspectiontemplatedetail-edit',
  templateUrl: './inspectiontemplatedetail-edit.component.html',
  styleUrls: ['./inspectiontemplatedetail-edit.component.scss']
})
export class InspectiontemplatedetailEditComponent implements OnInit {
  role: String;
  name: String;
  toServeremployeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  pageNo: Number = 1;
  itemsPerPage: Number = 25;

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

  tempID;
  fieldArray;
  scores;
  TemplateEditDetails;
  newAttribute = [];
  temparray = [];
  insertObj;

  constructor(private route: ActivatedRoute, private inspectionService: InspectionService, private router: Router, private _location: Location) {
    this.route.params.subscribe(params => this.tempID = params.TemplateID);
  }

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
      .scoringtype(this.OrganizationID).subscribe((data: any[]) => {

        this.scores = data;
      });
    this.inspectionService
      .getTemplateEditDetails(this.tempID, this.OrganizationID).subscribe((data: any[]) => {

        this.TemplateEditDetails = data[0];
      });
    this.inspectionService
      .getTemplateQuestionsEditDetails(this.tempID, this.OrganizationID).subscribe((data: any[]) => {

        this.fieldArray = data;
      });

  }
  addFieldValue() {
    this.newAttribute.push('');
  }
  addtempId(tempKeys) {
    this.temparray.push(tempKeys);
  }
  deleteFieldValue(TemplateQuestionID) {
    if (this.fieldArray.length > 1) {
      this.inspectionService
        .deleteSelectedTemplateQuestion(TemplateQuestionID, this.OrganizationID).subscribe(() => {
          this.inspectionService
            .getTemplateQuestionsEditDetails(this.tempID, this.OrganizationID).subscribe((data: any[]) => {
              this.fieldArray = data;
            });

        });
    } else {
      alert("Atleast one question is needed in the template.");
      return false;
    }
  }
  deleteNewFieldValue(index) {
    this.newAttribute.splice(index, 1);
  }
  savetemplate() {
    var temp_updateArry = this.fieldArray;
    var temp_insertArry = this.newAttribute;
    var temp_TemplateQuestionID;
    var temp_Question;
    this.temparray;

    for (var j = 0; j < this.temparray.length; j++) {
      for (var i = 0; i < temp_updateArry.length; i++) {
        if (this.temparray[j] === temp_updateArry[i].TemplateQuestionID) {
          temp_TemplateQuestionID = temp_updateArry[i].TemplateQuestionID;
          temp_Question = temp_updateArry[i].Question;
          if(temp_Question){
            temp_Question=temp_Question.trim();
          }
          else{
 
                    alert("Question  is not provided !");
                    return;
          }
        }
      }
      this.insertObj = {
        templateid: temp_TemplateQuestionID,
        questionid: temp_Question,
        empkey: this.toServeremployeekey,
        OrganizationID: this.OrganizationID
      };
      this.inspectionService
        .updateEditedTemplateQuestion(this.insertObj).subscribe(() => {

        });

    }
    for (var j = 0; j < temp_insertArry.length; j++) {

      if(temp_insertArry[j]){
        temp_insertArry[j]=temp_insertArry[j].trim();
      }
      else{
      
                alert("Question  is not provided !");
                return;
      }

      this.insertObj = {
        templateid: this.tempID,
        questionid: temp_insertArry[j],
        empKey: this.toServeremployeekey,
        OrganizationID: this.OrganizationID
      };

      this.inspectionService
        .insertEditedTemplateQuestion(this.insertObj).subscribe(() => {

        });
    }
    if(!this.TemplateEditDetails.TemplateName && !this.TemplateEditDetails.TemplateName.trim()){
      alert("Template Name Not provided !");
      return;
    }
    if(this.TemplateEditDetails.TemplateName){
      this.TemplateEditDetails.TemplateName=this.TemplateEditDetails.TemplateName.trim();
    }
    // this.inspectionService.checkforTemplate(this.TemplateEditDetails.TemplateName,this.OrganizationID).subscribe(res => {
    //   if (res[0].count == 0){
    this.inspectionService
      .updateTemplateDetails(this.TemplateEditDetails.TemplateName, this.tempID, this.OrganizationID, this.TemplateEditDetails.ScoreTypeKey).subscribe(() => {
        alert("Successfully Updated");
        this._location.back();
      });
    // }
    // else{
    //   alert("Template Name already exists !");
    // }
    // });
  }
  goBack() {
    this._location.back();
  }
}
