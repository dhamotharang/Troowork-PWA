import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { People } from '../../../../model-class/People';
import { PeopleServiceService } from '../../../../service/people-service.service';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss']
})
export class EventEditComponent implements OnInit {
  actionKey$: Object;
  actionTypeKey$: Object;
  dept;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;

  checkFlag;
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



  constructor(private route: ActivatedRoute, private peopleServ: PeopleServiceService, private router: Router, private dst: DataServiceTokenStorageService) {
    this.route.params.subscribe(params => this.actionKey$ = params.ActionKey);
    this.route.params.subscribe(params => this.actionTypeKey$ = params.ActionTypeKey);
  }

  updateEventType(type, name, desc) {
    this.checkFlag = true;

    this.peopleServ.UpdateEventType(type, name, desc, this.actionKey$, this.actionTypeKey$, this.employeekey, this.OrganizationID).subscribe(res => {
      this.checkFlag = false;
      this.router.navigateByUrl('/EventView');
    }
    );

  }

  ngOnInit() {
    this.checkFlag = false;
        // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.employeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();
    this.peopleServ.getEventTypeDetails(this.actionKey$, this.actionTypeKey$, this.employeekey, this.OrganizationID).subscribe((data: any[]) => {
      this.dept = data[0];
    });
  }
}

