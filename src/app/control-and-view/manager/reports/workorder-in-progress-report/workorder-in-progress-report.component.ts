import { Component, OnInit, ElementRef } from '@angular/core';
import { WorkOrderServiceService } from '../../../../service/work-order-service.service';
import { interval, Subscription } from 'rxjs';//for calling function on regular interval

@Component({
  selector: 'app-workorder-in-progress-report',
  templateUrl: './workorder-in-progress-report.component.html',
  styleUrls: ['./workorder-in-progress-report.component.scss']
})
export class WorkorderInProgressReportComponent implements OnInit {
  loading: boolean;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  subscription: Subscription;
  woList: any;

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

  constructor(private WorkOrderService: WorkOrderServiceService, private el: ElementRef) { }

  ngOnInit() {
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;

    this.callReport();

    const source = interval(900000);  //code for calling filter function after regular interval
    this.subscription = source.subscribe(val => this.callReport());
  }

  ngOnDestroy() {//unsubscribing from calling filter function after regular interval
    this.subscription.unsubscribe();
  }

  callReport() {
    this.loading = true;
    this.WorkOrderService
      .getallWorkorderDetailswithStatus(this.OrganizationID)
      .subscribe((data: any[]) => {
        this.woList = data;
        this.loading = false;
      });
  }
}
