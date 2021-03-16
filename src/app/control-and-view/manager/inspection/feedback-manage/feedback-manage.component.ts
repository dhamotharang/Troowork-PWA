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

  temlates;
  TemplateID;
  loading = false;

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
    this.loading = true;
    this.inspectionService
      .getFeedbackTemplateList(this.OrganizationID).subscribe((data: any[]) => {
        this.temlates = data;
        this.loading = false;
      });

  }


  deleteFeedbackTemp(TemplateID) {
    this.TemplateID = TemplateID;
  }

  deleteFeedbackTemplate() {
    this.loading = true;
    this.inspectionService
      .deleteFeedbackTemplate(this.TemplateID, this.toServeremployeekey, this.OrganizationID).subscribe(() => {
        alert("Template deleted successfully");
        this.inspectionService
          .getFeedbackTemplateList(this.OrganizationID).subscribe((data: any[]) => {
            this.temlates = data;
            this.loading = false;
          });
      });
  }

}

