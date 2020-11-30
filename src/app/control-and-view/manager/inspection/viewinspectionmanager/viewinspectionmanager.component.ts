import { Component, OnInit } from '@angular/core';
import { InspectionService } from '../../../../service/inspection.service';
import { Inspection } from '../../../../model-class/Inspection';
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: 'app-viewinspectionmanager',
  templateUrl: './viewinspectionmanager.component.html',
  styleUrls: ['./viewinspectionmanager.component.scss']
})
export class ViewinspectionmanagerComponent implements OnInit {

  inspectioneddetails: Inspection[];
  ioKey$: object;
  role: String;
  name: String;
  IsSupervisor: Number;
  OrgId: Number;
  emp_key: Number;

  constructor(private route: ActivatedRoute, private router: Router, private inspectionService: InspectionService) {
    this.route.params.subscribe(params => this.ioKey$ = params.InspectionOrderKey);
  }
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

  ngOnInit() {
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.emp_key = profile.employeekey;
    this.OrgId = profile.OrganizationID;

    this.inspectionService
      .getViewInspectionManager(this.ioKey$, this.OrgId)
      .subscribe((data: Inspection[]) => {
        this.inspectioneddetails = data;
      });

  }
  GoView() {
    // this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['InspectionView'] } }]);
    if (this.role == 'Manager') {
      this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['InspectionView'] } }]);
    }
    // else if (this.role == 'Employee' && this.IsSupervisor == 1) {
    else if (this.role == 'Supervisor') {
      this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['Viewinspctnbysprvsr'] } }]);
    }
  }
}
