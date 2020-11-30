import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { People } from '../../../../model-class/People';
import { PeopleServiceService } from '../../../../service/people-service.service';
import { FormBuilder, Validators, FormGroup } from "@angular/forms";

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.scss']
})
export class EventViewComponent implements OnInit {

  searchform: FormGroup;
  eventType: People[];
  ActionKey: Number;
  ActionTypeKey: Number;
  eventTypeList;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  page: Number = 1;
  count: Number = 25;
  editQuestions;

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


  //validation starts ..... @rodney
  regexStr = '^[a-zA-Z0-9_ ]*$';
  @Input() isAlphaNumeric: boolean;
  constructor(private formBuilder: FormBuilder, private peopleServ: PeopleServiceService, private el: ElementRef) { }
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

  //validation ends ..... @rodney

  deleteEventValuePass(actionKey, actiontypeKey) {
    this.ActionKey = actionKey;
    this.ActionTypeKey = actiontypeKey;
  }


  deleteEventType() {
    this.peopleServ
      .DeleteEventType(this.ActionKey, this.ActionTypeKey, this.OrganizationID).subscribe(res => {
        alert('Successfully Deleted !');
        this.peopleServ
          .getEventTypeList(this.page, this.count, this.employeekey, this.OrganizationID)
          .subscribe((data: People[]) => {
            this.eventType = data;
          });
      });

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

    this.searchform = this.formBuilder.group({
      SearchMeetingTraining: ['', Validators.required]
    });


    this.peopleServ
      .getEventTypeList(this.page, this.count, this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.eventType = data;
        this.eventTypeList = data;
      });

  }
  cancelTemplateDetails() {
    this.editQuestions = -1;
    this.peopleServ
      .getEventTypeList(this.page, this.count, this.employeekey, this.OrganizationID)
      .subscribe((data: People[]) => {
        this.eventType = data;
      });
  }
  UpdateEventDetais(index1, ActionType, Action, Description, ActionKey, ActionTypeKey) {

    if (!ActionType || !ActionType.trim()) {
      alert("Please enter an event type");
      return;
    }
    if (!Action || !Action.trim()) {
      alert("Please enter an event name");
      return;
    }
    if (ActionType) {
      ActionType = ActionType.trim();
    }
    if (Action) {
      Action = Action.trim();
    }
    if (Description) {
      Description = Description.trim();
    }
    this.peopleServ.checkEventDuplicateForEdit(ActionType, Action, ActionKey, ActionTypeKey, this.OrganizationID).subscribe((data: any[]) => {
      if (data[0].count == 0) {
        this.peopleServ.UpdateEventType(ActionType, Action, Description, ActionKey, ActionTypeKey, this.employeekey, this.OrganizationID).
          subscribe(() => {
            alert('Successfully Updated !');
            this.peopleServ
              .getEventTypeList(this.page, this.count, this.employeekey, this.OrganizationID)
              .subscribe((data: People[]) => {
                this.eventType = data;
                this.editQuestions = -1;
              });
          });
      }
      else {
        alert("Entered event already exists...!!!");
        return false;
      }
    });
    // }
    // else {
    //   this.peopleServ
    //     .getEventTypeList(this.page, this.count, this.employeekey, this.OrganizationID)
    //     .subscribe((data: People[]) => {
    //       this.eventType = data;
    //       this.editQuestions = -1;
    //     });
    // }

  }

}
