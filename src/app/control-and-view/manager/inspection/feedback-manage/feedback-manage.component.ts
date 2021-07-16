import { Component, OnInit } from '@angular/core';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { InspectionService } from '../../../../service/inspection.service';
// import { MatDialog } from '@angular/material/dialog';
// import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';

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
  // , private dialog: MatDialog
  constructor(private inspectionService: InspectionService, private dst: DataServiceTokenStorageService) { }

  customTrackBy(index: number, obj: any): any {
    return index;
  }

  ngOnInit() {
    //token starts....
    // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.toServeremployeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();
    //token ends
    this.loading = true;
    this.inspectionService
      .getFeedbackTemplateList(this.OrganizationID).subscribe((data: any[]) => {
        this.temlates = data;
        this.loading = false;
      });

  }


  // deleteFeedbackTemp(TemplateID) {
  //   this.TemplateID = TemplateID;
  // }

  // deleteFeedbackTemplate() {
  //   this.loading = true;
  //   this.inspectionService
  //     .deleteFeedbackTemplate(this.TemplateID, this.toServeremployeekey, this.OrganizationID).subscribe(() => {
  //       // alert("Template deleted successfully");
  //       const dialogRef = this.dialog.open(AlertdialogComponent, {
  //         data: {
  //           message: 'Template deleted successfully',
  //           buttonText: {
  //             cancel: 'Done'
  //           }
  //         },
  //       });
  //       dialogRef.afterClosed().subscribe(dialogResult => {
  //         this.inspectionService
  //           .getFeedbackTemplateList(this.OrganizationID).subscribe((data: any[]) => {
  //             this.temlates = data;
  //             this.loading = false;
  //           });
  //       });
  //     });
  // }

}

