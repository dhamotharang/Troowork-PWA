import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { InspectionService } from '../../../../service/inspection.service';
import { Inspection } from '../../../../model-class/Inspection';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Router } from '@angular/router';

import { Location } from '@angular/common';

@Component({
  selector: 'app-inspectiontemplate-edit',
  templateUrl: './inspectiontemplate-edit.component.html',
  styleUrls: ['./inspectiontemplate-edit.component.scss']
})
export class InspectiontemplateEditComponent implements OnInit {

  loading: boolean;// loading

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;

  //Variables for pagination

  pageNo: Number = 1;
  itemsPerPage: Number = 25;
  showHide1: boolean;
  showHide2: boolean;
  pagination: Number;

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

  inspectiontemplate;
  searchform: FormGroup;
  delete_tempid: number;
  regexStr = '^[a-zA-Z0-9_ ]*$';
  @Input() isAlphaNumeric: boolean;
  editQuestions;

  constructor(private formBuilder: FormBuilder, private inspectionService: InspectionService, private el: ElementRef, private router: Router, private _location: Location) { }

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
  deleteTemplate() {
    this.loading = true;// loading
    this.inspectionService
      .DeleteTemplate(this.delete_tempid, this.employeekey, this.OrganizationID).subscribe(() => {
        this.inspectionService
          .getInspectionTemplateDetails(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
          .subscribe((data: Inspection[]) => {
            this.inspectiontemplate = data;
            this.loading = false;// loading
          });
      });
  }

  deleteTemplatePass(TemplateID) {
    this.delete_tempid = TemplateID;
  }
  searchTemplate(SearchValue) {

    var value = SearchValue.trim();

    if (value.length >= 3) {
      this.inspectionService
        .SearchTemplate(value, this.OrganizationID).subscribe((data: Inspection[]) => {
          this.inspectiontemplate = data;
        });
    }
    else if (value.length == 0) {
      this.inspectionService
        .getInspectionTemplateDetails(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
        .subscribe((data: Inspection[]) => {
          this.inspectiontemplate = data;
        });
    }
  };

  //functions for pagination

  nextPage() {
    this.loading = true;// loading
    this.pageNo = +this.pageNo + 1;
    this.inspectionService
      .getInspectionTemplateDetails(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
      .subscribe((data: Inspection[]) => {
        this.inspectiontemplate = data;
        this.loading = false;// loading
        this.pagination = +this.inspectiontemplate[0].totalItems / (+this.pageNo * (+this.itemsPerPage));
        if (this.pagination > 1) {
          this.showHide2 = true;
          this.showHide1 = true;
        }
        else {
          this.showHide2 = false;
          this.showHide1 = true;
        }
      });
  }
  previousPage() {
    this.loading = true;// loading
    this.pageNo = +this.pageNo - 1;
    this.inspectionService
      .getInspectionTemplateDetails(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
      .subscribe((data: Inspection[]) => {
        this.inspectiontemplate = data;
        this.loading = false;// loading
        if (this.pageNo == 1) {
          this.showHide2 = true;
          this.showHide1 = false;
        } else {
          this.showHide2 = true;
          this.showHide1 = true;
        }
      });
  }

  //functions for pagination 
  ngOnInit() {

    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;

    this.loading = true;// loading

    this.inspectionService
      .getInspectionTemplateDetails(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID)
      .subscribe((data: Inspection[]) => {
        this.inspectiontemplate = data;
        this.loading = false;// loading
        if (this.inspectiontemplate[0].totalItems > this.itemsPerPage) {
          this.showHide2 = true;
          this.showHide1 = false;
        }
        else if (this.inspectiontemplate[0].totalItems <= this.itemsPerPage) {
          this.showHide2 = false;
          this.showHide1 = false;
        }
      });
    this.searchform = this.formBuilder.group({
      SearchTemplate: ['', Validators.required]
    });
  }
  editTemplateDetails(index, TemplateID) {
    this.inspectionService.checkforInspectionOnTemplate(TemplateID, this.OrganizationID).subscribe((data: any[]) => {

      if (data[0].count == 0) {
        // this.router.navigate(['/InspectiontemplatedetailEdit', TemplateID]);
        // this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['InspectiontemplatedetailEdit',TemplateID] } }]);
        if (this.role == 'Manager') {
          this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['InspectiontemplatedetailEdit', TemplateID] } }]);
        }
        // else  if(this.role=='Employee' && this.IsSupervisor==1){
        else if (this.role == 'Supervisor') {
          this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['InspectiontemplatedetailEdit', TemplateID] } }]);
        }
      } else {
        this.editQuestions = index;
      }

    });
  }
  cancelTemplateDetails() {
    this.editQuestions = -1;
    this.inspectionService
      .getInspectionTemplateDetails(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID).subscribe((data: Inspection[]) => {
        this.inspectiontemplate = data;
      });
  }
  submiteditInspectionTemplate(TemplateName, TemplateID, ScoreTypeKey) {

    if (!TemplateName && !TemplateName.trim()) {
      alert("Template Name Not provided !");
      return;
    }
    if (TemplateName) {
      TemplateName = TemplateName.trim();
    }
    this.inspectionService
      .updateEditInspection(TemplateName, TemplateID, ScoreTypeKey, this.OrganizationID).subscribe(() => {
        this.inspectionService
          .getInspectionTemplateDetails(this.pageNo, this.itemsPerPage, this.employeekey, this.OrganizationID).subscribe((data: Inspection[]) => {
            this.inspectiontemplate = data;
          });
        this.editQuestions = -1;
      });
  }

  goBack() {
    this._location.back();
  }
}
