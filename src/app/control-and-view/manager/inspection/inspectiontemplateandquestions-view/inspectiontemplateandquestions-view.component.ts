import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { InspectionService } from '../../../../service/inspection.service';
import { Inspection } from '../../../../model-class/Inspection';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
@Component({
  selector: 'app-inspectiontemplateandquestions-view',
  templateUrl: './inspectiontemplateandquestions-view.component.html',
  styleUrls: ['./inspectiontemplateandquestions-view.component.scss']
})
export class InspectiontemplateandquestionsViewComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  TemplateID;
  loading;
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

  searchform: FormGroup;
  template: Inspection[];
  viewinspectionTemplate: any;
  delete_tempId: number;
  templateQuestionID: number;
  key: number;
  searchFlag: any;
  tempkey1;
  regexStr = '^[a-zA-Z0-9_ ]*$';
  @Input() isAlphaNumeric: boolean;
  constructor(private formBuilder: FormBuilder, private inspectionService: InspectionService, private el: ElementRef) { }
  @HostListener('keypress', ['$event']) onKeyPress(event) {
    return new RegExp(this.regexStr).test(event.key);
  }

  @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
    this.validateFields(event);
  }

  validateFields(event) {
    setTimeout(() => {

      this.el.nativeElement.value = this.el.nativeElement.value.replace(/[^A-Za-z ]/g, '').replace(/\s/g, '');
      event.preventDefault();

    }, 100)
  }
  showInspectionTemplateTable(tempKey) {
    this.tempkey1=tempKey;
    if(!(this.TemplateID))
    {
        this.searchFlag = false;
        this.viewinspectionTemplate= false;
    }
    else{
    this.inspectionService
      .getInspectionTemplateTable(tempKey, this.OrganizationID)
      .subscribe((data: Inspection[]) => {
        this.searchFlag = true;
        this.viewinspectionTemplate = data;
      });
    }
  }
  deleteInspTemplate() {

    this.inspectionService
      .DeleteInspectionTemplate(this.delete_tempId, this.templateQuestionID, this.employeekey, this.OrganizationID).subscribe(() => {
        this.inspectionService
          .getInspectionTemplateTable(this.tempkey1, this.OrganizationID)
          .subscribe((data: Inspection[]) => {
            this.viewinspectionTemplate = data;
          });

      });
  }
  deleteInspTemplatePass(templateID, templateQuestionID) {
    this.delete_tempId = templateID;
    this.templateQuestionID = templateQuestionID;
  }
  searchTNandTQ(SearchValue, TemplateID) {

    var value=SearchValue.trim();

    if (value.length >= 3){
    this.inspectionService
      .SearchTempNameandQuestion(value, TemplateID, this.OrganizationID).subscribe((data: Inspection[]) => {
        this.viewinspectionTemplate = data;

      });
    }
    else if (value.length == 0) {
      this.inspectionService
      .getInspectionTemplateTable(this.tempkey1, this.OrganizationID)
      .subscribe((data: Inspection[]) => {
        this.searchFlag = true;
        this.viewinspectionTemplate = data;
      });
    }
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

    this.searchFlag = false;
    this.TemplateID = "";
    this.inspectionService
      .getTemplateNameList(this.employeekey, this.OrganizationID)
      .subscribe((data: Inspection[]) => {
        this.template = data;
      });
    this.searchform = this.formBuilder.group({
      searchTemplateNameAndQuestion: ['', Validators.required]
    });
  }

}
