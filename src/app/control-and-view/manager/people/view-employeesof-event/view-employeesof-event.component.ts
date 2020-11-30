import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { PeopleServiceService } from '../../../../service/people-service.service';
import { People } from '../../../../model-class/People';

@Component({
  selector: 'app-view-employeesof-event',
  templateUrl: './view-employeesof-event.component.html',
  styleUrls: ['./view-employeesof-event.component.scss']
})
export class ViewEmployeesofEventComponent implements OnInit {

  eventKey$: Object;
  eventEmps: People[];
  eventKey: Number;

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;

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


  constructor(private route: ActivatedRoute, private peopleServ: PeopleServiceService, private router: Router) {
    this.route.params.subscribe(params => this.eventKey$ = params.EventKey);
  }

  markAttended(empKey, isAttend, eventKey) {
    this.peopleServ
      .markAttendance(empKey, eventKey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.peopleServ.viewEmployeesOfEvent(this.eventKey$, this.employeekey, this.OrganizationID).subscribe((data: People[]) => {
          this.eventEmps = data;
        });
      });
  }

  markUnAttended(empKey, isAttend, eventKey) {
    this.peopleServ
      .removeAttendance(empKey, eventKey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.peopleServ.viewEmployeesOfEvent(this.eventKey$, this.employeekey, this.OrganizationID).subscribe((data: People[]) => {
          this.eventEmps = data;
        });
      });
  }

  deleteMeetingPass(EventKey) {
    this.eventKey = EventKey;
  }

  deleteMeeting() {
    this.peopleServ
      .DeleteMeetingTraining(this.eventKey, this.OrganizationID)
      .subscribe(res => {

        if (this.role == 'Manager') {
          this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['MeetingTrainingView'] } }]);
        }
        // else  if(this.role=='Employee' && this.IsSupervisor==1){
        else if (this.role == 'Supervisor') {
          this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['MeetingTrainingView'] } }]);
        }
      }
      );

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

    this.peopleServ.viewEmployeesOfEvent(this.eventKey$, this.employeekey, this.OrganizationID).subscribe((data: People[]) => {
      this.eventEmps = data;
    });
  }
}
