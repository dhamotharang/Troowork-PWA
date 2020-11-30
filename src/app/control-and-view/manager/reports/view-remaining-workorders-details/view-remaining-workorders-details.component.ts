import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { WorkOrderServiceService } from '../../../../service/work-order-service.service';
import { DataService } from '../dashboard-report/data.service';
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: 'app-view-remaining-workorders-details',
  templateUrl: './view-remaining-workorders-details.component.html',
  styleUrls: ['./view-remaining-workorders-details.component.scss']
})
export class ViewRemainingWorkordersDetailsComponent implements OnInit {
  from;
  to;
  empKey;
  wotypeKey;
  wotypeName;
  empName;
  workorderList;
  loading;

  role;
  name;
  employee;
  org;

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

  constructor(private woServ: WorkOrderServiceService, private dataSer: DataService, private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => this.from = params.fromdt);
    this.route.params.subscribe(params => this.to = params.todt);
    this.route.params.subscribe(params => this.empKey = params.empKey);
    this.route.params.subscribe(params => this.wotypeKey = params.wotypeKey);
    this.route.params.subscribe(params => this.empName = params.empName);
    this.route.params.subscribe(params => this.wotypeName = params.wotypeName);
  }

  ngOnInit() {

    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.name = profile.username;
    this.employee = profile.employeekey;
    this.org = profile.OrganizationID;

    this.loading = true;
    this.woServ.getRemainingWODetails(this.from, this.to, this.empKey, this.wotypeKey, this.org)
      .subscribe((data: any[]) => {
        this.workorderList = data;
        this.loading = false;
      });
  }

  goBack() {
    if (this.role == 'Manager') {
      this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['DashboardReport'] } }]);
    }
    else if (this.role == 'Supervisor') {
      this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['DashboardReport'] } }]);
    }
  }
}
