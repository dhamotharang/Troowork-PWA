import { Component, OnInit } from '@angular/core';
import { SchedulingService } from '../../../../service/scheduling.service';
import { People } from '../../../../model-class/People';
import { PeopleServiceService } from '../../../../service/people-service.service';
import { Router } from "@angular/router";
@Component({
  selector: 'app-createshift',
  templateUrl: './createshift.component.html',
  styleUrls: ['./createshift.component.scss']
})
export class CreateshiftComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;

  Description;
  Abbrevation;
  publishas;
  time1;
  paidhours;
  time2;
  color;
  isemployeecalendar;
  schedulerexception: People[];
  masterhour: People[];
  masterminute: People[];

  start_hour: String;
  start_min: String;
  start_format: String;
  end_hour: String;
  end_min: String;
  end_format: String;


  start_sun_hour: String;
  start_sun_min: String;
  start_sun_format: String;

  start_mon_hour: String;
  start_mon_min: String;
  start_mon_format: String;

  start_tue_hour: String;
  start_tue_min: String;
  start_tue_format: String;

  start_wed_hour: String;
  start_wed_min: String;
  start_wed_format: String;

  start_thu_hour: String;
  start_thu_min: String;
  start_thu_format: String;

  start_fri_hour: String;
  start_fri_min: String;
  start_fri_format: String;

  start_sat_hour: String;
  start_sat_min: String;
  start_sat_format: String;

  end_sun_hour: String;
  end_sun_min: String;
  end_sun_format: String;

  end_mon_hour: String;
  end_mon_min: String;
  end_mon_format: String;

  end_tue_hour: String;
  end_tue_min: String;
  end_tue_format: String;

  end_wed_hour: String;
  end_wed_min: String;
  end_wed_format: String;

  end_thu_hour: String;
  end_thu_min: String;
  end_thu_format: String;

  end_fri_hour: String;
  end_fri_min: String;
  end_fri_format: String;

  end_sat_hour: String;
  end_sat_min: String;
  end_sat_format: String;

  idscheduler_exception;
  schedularcount = 0;

  showHide;
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

  constructor(private scheduleServ: SchedulingService, private PeopleServiceService: PeopleServiceService, private router: Router) { }

  createShift() {

    // var q = this.time1.getHours();
    // var q1 = this.time1.getMinutes();
    // var newTime1 = q + ":" + q1;

    // var t = this.time2.getHours();
    // var t1 = this.time2.getMinutes();
    // var newTime2 = t + ":" + t1;
    if (!(this.Description)) {
      alert("Please provide a Group Name !!!");
      return;
    }
    if (!(this.color)) {
      alert("Please select a color");
      return;
    }
    //Code for scheduler starts....
    this.schedularcount = 0;
    if (this.showHide == true) {
      if (!this.idscheduler_exception) {
        this.idscheduler_exception = null;
      }

      if (this.start_sun_hour == '-1' && this.start_sun_min == '-1' && this.end_sun_hour == '-1' && this.end_sun_min == '-1') {
        this.schedularcount = this.schedularcount;
      }
      else if (this.start_sun_hour != '-1' && this.start_sun_min != '-1' && this.end_sun_hour != '-1' && this.end_sun_min != '-1') {
        this.schedularcount = this.schedularcount;
      }
      else {
        this.schedularcount++;
        alert('Values Missing in Sunday');
        return;
      }

      if (this.start_mon_hour == '-1' && this.start_mon_min == '-1' && this.end_mon_hour == '-1' && this.end_mon_min == '-1') {
        this.schedularcount = this.schedularcount;
      }
      else if (this.start_mon_hour != '-1' && this.start_mon_min != '-1' && this.end_mon_hour != '-1' && this.end_mon_min != '-1') {
        this.schedularcount = this.schedularcount;
      }
      else {
        this.schedularcount++;
        alert('Values Missing in Monday');
        return;
      }

      if (this.start_tue_hour == '-1' && this.start_tue_min == '-1' && this.end_tue_hour == '-1' && this.end_tue_min == '-1') {
        this.schedularcount = this.schedularcount;
      }
      else if (this.start_tue_hour != '-1' && this.start_tue_min != '-1' && this.end_tue_hour != '-1' && this.end_tue_min != '-1') {
        this.schedularcount = this.schedularcount;
      }
      else {
        this.schedularcount++;
        alert('Values Missing in Tuesday');
        return;
      }

      if (this.start_wed_hour == '-1' && this.start_wed_min == '-1' && this.end_wed_hour == '-1' && this.end_wed_min == '-1') {
        this.schedularcount = this.schedularcount;
      }
      else if (this.start_wed_hour != '-1' && this.start_wed_min != '-1' && this.end_wed_hour != '-1' && this.end_wed_min != '-1') {
        this.schedularcount = this.schedularcount;
      }
      else {
        this.schedularcount++;
        alert('Values Missing in Wednesday');
        return;
      }

      if (this.start_thu_hour == '-1' && this.start_thu_min == '-1' && this.end_thu_hour == '-1' && this.end_thu_min == '-1') {
        this.schedularcount = this.schedularcount;
      }
      else if (this.start_thu_hour != '-1' && this.start_thu_min != '-1' && this.end_thu_hour != '-1' && this.end_thu_min != '-1') {
        this.schedularcount = this.schedularcount;
      }
      else {
        this.schedularcount++;
        alert('Values Missing in Thursday');
        return;
      }

      if (this.start_fri_hour == '-1' && this.start_fri_min == '-1' && this.end_fri_hour == '-1' && this.end_fri_min == '-1') {
        this.schedularcount = this.schedularcount;
      }
      else if (this.start_fri_hour != '-1' && this.start_fri_min != '-1' && this.end_fri_hour != '-1' && this.end_fri_min != '-1') {
        this.schedularcount = this.schedularcount;
      }
      else {
        this.schedularcount++;
        alert('Values Missing in Friday');
        return;
      }

      if (this.start_sat_hour == '-1' && this.start_sat_min == '-1' && this.end_sat_hour == '-1' && this.end_sat_min == '-1') {
        this.schedularcount = this.schedularcount;
      }
      else if (this.start_sat_hour != '-1' && this.start_sat_min != '-1' && this.end_sat_hour != '-1' && this.end_sat_min != '-1') {
        this.schedularcount = this.schedularcount;
      } else {
        this.schedularcount++;
        alert('Values Missing in Saturday');
        return;
      }
    } else if (this.showHide == false) {
      console.log(this.start_format + "  " + this.end_format);
      if (this.start_hour == '-1' || this.start_min == '-1' || this.end_hour == '-1' || this.end_min == '-1') {
        this.schedularcount++;
        alert('Values Missing in Start and End Time');
        return;
      } else {
        this.start_sun_hour = this.start_hour;
        this.start_sun_min = this.start_min;
        this.start_sun_format = this.start_format;

        this.start_mon_hour = this.start_hour;
        this.start_mon_min = this.start_min;
        this.start_mon_format = this.start_format;

        this.start_tue_hour = this.start_hour;
        this.start_tue_min = this.start_min;
        this.start_tue_format = this.start_format;

        this.start_wed_hour = this.start_hour;
        this.start_wed_min = this.start_min;
        this.start_wed_format = this.start_format;

        this.start_thu_hour = this.start_hour;
        this.start_thu_min = this.start_min;
        this.start_thu_format = this.start_format;

        this.start_fri_hour = this.start_hour;
        this.start_fri_min = this.start_min;
        this.start_fri_format = this.start_format;

        this.start_sat_hour = this.start_hour;
        this.start_sat_min = this.start_min;
        this.start_sat_format = this.start_format;

        this.end_sun_hour = this.end_hour;
        this.end_sun_min = this.end_min;
        this.end_sun_format = this.end_format;

        this.end_mon_hour = this.end_hour;
        this.end_mon_min = this.end_min;
        this.end_mon_format = this.end_format;

        this.end_tue_hour = this.end_hour;
        this.end_tue_min = this.end_min;
        this.end_tue_format = this.end_format;

        this.end_wed_hour = this.end_hour;
        this.end_wed_min = this.end_min;
        this.end_wed_format = this.end_format;

        this.end_thu_hour = this.end_hour;
        this.end_thu_min = this.end_min;
        this.end_thu_format = this.end_format;

        this.end_fri_hour = this.end_hour;
        this.end_fri_min = this.end_min;
        this.end_fri_format = this.end_format;

        this.end_sat_hour = this.end_hour;
        this.end_sat_min = this.end_min;
        this.end_sat_format = this.end_format;
      }

    }
    //Code for scheduler ends....
    if (this.schedularcount == 0) {
      this.scheduleServ.checkForEmpGrpDuplicate(this.Description, this.OrganizationID).subscribe((data: any[]) => {
        if (data.length == 0) {
          const empschobj = {
            start_sun_hour: this.start_sun_hour,
            start_sun_min: this.start_sun_min,
            start_sun_format: this.start_sun_format,
            start_mon_hour: this.start_mon_hour,
            start_mon_min: this.start_mon_min,
            start_mon_format: this.start_mon_format,
            start_tue_hour: this.start_tue_hour,
            start_tue_min: this.start_tue_min,
            start_tue_format: this.start_tue_format,
            start_wed_hour: this.start_wed_hour,
            start_wed_min: this.start_wed_min,
            start_wed_format: this.start_wed_format,
            start_thu_hour: this.start_thu_hour,
            start_thu_min: this.start_thu_min,
            start_thu_format: this.start_thu_format,
            start_fri_hour: this.start_fri_hour,
            start_fri_min: this.start_fri_min,
            start_fri_format: this.start_fri_format,
            start_sat_hour: this.start_sat_hour,
            start_sat_min: this.start_sat_min,
            start_sat_format: this.start_sat_format,
            end_sun_hour: this.end_sun_hour,
            end_sun_min: this.end_sun_min,
            end_sun_format: this.end_sun_format,
            end_mon_hour: this.end_mon_hour,
            end_mon_min: this.end_mon_min,
            end_mon_format: this.end_mon_format,
            end_tue_hour: this.end_tue_hour,
            end_tue_min: this.end_tue_min,
            end_tue_format: this.end_tue_format,
            end_wed_hour: this.end_wed_hour,
            end_wed_min: this.end_wed_min,
            end_wed_format: this.end_wed_format,
            end_thu_hour: this.end_thu_hour,
            end_thu_min: this.end_thu_min,
            end_thu_format: this.end_thu_format,
            end_fri_hour: this.end_fri_hour,
            end_fri_min: this.end_fri_min,
            end_fri_format: this.end_fri_format,
            end_sat_hour: this.end_sat_hour,
            end_sat_min: this.end_sat_min,
            end_sat_format: this.end_sat_format,
            idscheduler_exception: this.idscheduler_exception,

            desc: this.Description,
            color: this.color,
            orgid: this.OrganizationID,
            empkey: this.employeekey
          };

          this.scheduleServ.createEmpShiftwithColourCode(empschobj).subscribe((data: any[]) => {
            alert("Employee Group Name created successfully");
            this.router.navigate(['ManagerDashBoard', { outlets: { ManagerOut: ['ViewShift'] } }]);
            // code for if staying in the same page....starts
            // this.Description = "";

            // this.start_sun_hour = '-1';
            // this.start_sun_min = '-1';
            // this.start_sun_format = 'AM';

            // this.start_mon_hour = '-1';
            // this.start_mon_min = '-1';
            // this.start_mon_format = 'AM';

            // this.start_tue_hour = '-1';
            // this.start_tue_min = '-1';
            // this.start_tue_format = 'AM';

            // this.start_wed_hour = '-1';
            // this.start_wed_min = '-1';
            // this.start_wed_format = 'AM';

            // this.start_thu_hour = '-1';
            // this.start_thu_min = '-1';
            // this.start_thu_format = 'AM';

            // this.start_fri_hour = '-1';
            // this.start_fri_min = '-1';
            // this.start_fri_format = 'AM';

            // this.start_sat_hour = '-1';
            // this.start_sat_min = '-1';
            // this.start_sat_format = 'AM';

            // this.end_sun_hour = '-1';
            // this.end_sun_min = '-1';
            // this.end_sun_format = 'AM';

            // this.end_mon_hour = '-1';
            // this.end_mon_min = '-1';
            // this.end_mon_format = 'AM';

            // this.end_tue_hour = '-1';
            // this.end_tue_min = '-1';
            // this.end_tue_format = 'AM';

            // this.end_wed_hour = '-1';
            // this.end_wed_min = '-1';
            // this.end_wed_format = 'AM';

            // this.end_thu_hour = '-1';
            // this.end_thu_min = '-1';
            // this.end_thu_format = 'AM';

            // this.end_fri_hour = '-1';
            // this.end_fri_min = '-1';
            // this.end_fri_format = 'AM';

            // this.end_sat_hour = '-1';
            // this.end_sat_min = '-1';
            // this.end_sat_format = 'AM';
            // this.idscheduler_exception = '';
            // code for if staying in the same page....ends
          });
        } else {
          alert("Group Name already exists");
          return;
        }
      });
      // this.scheduleServ.createEmpShiftwithColourCode(this.Description, this.Abbrevation, this.publishas, newTime1,
      //   this.paidhours, newTime2, this.color, this.OrganizationID, this.employeekey).subscribe((data: any[]) => { });
    } else {
      alert("Value for weekly schedule is missing somewhere. Please check it!!!");
      return;
    }
  }
  ngOnInit() {
    //token starts....
    var token = localStorage.getItem('token');
    var encodedProfile = token.split('.')[1];
    var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = profile.role;
    this.IsSupervisor = profile.IsSupervisor;
    this.name = profile.username;
    this.employeekey = profile.employeekey;
    this.OrganizationID = profile.OrganizationID;

    if (this.OrganizationID == 223 || this.OrganizationID == 134) {
      this.showHide = true;
    } else {
      this.showHide = false;
    }

    this.isemployeecalendar = profile.isemployeecalendar;
    //token ends

    this.PeopleServiceService
      .getallschedulingexception(this.OrganizationID)
      .subscribe((data: People[]) => {
        this.schedulerexception = data;
      });

    this.PeopleServiceService
      .getallmasterhour()
      .subscribe((data: People[]) => {
        this.masterhour = data;
      });
    this.PeopleServiceService
      .getallmasterminute()
      .subscribe((data: People[]) => {
        this.masterminute = data;
      });

    this.start_sun_hour = '-1';
    this.start_sun_min = '-1';
    this.start_sun_format = 'AM';

    this.start_mon_hour = '-1';
    this.start_mon_min = '-1';
    this.start_mon_format = 'AM';

    this.start_tue_hour = '-1';
    this.start_tue_min = '-1';
    this.start_tue_format = 'AM';

    this.start_wed_hour = '-1';
    this.start_wed_min = '-1';
    this.start_wed_format = 'AM';

    this.start_thu_hour = '-1';
    this.start_thu_min = '-1';
    this.start_thu_format = 'AM';

    this.start_fri_hour = '-1';
    this.start_fri_min = '-1';
    this.start_fri_format = 'AM';

    this.start_sat_hour = '-1';
    this.start_sat_min = '-1';
    this.start_sat_format = 'AM';

    this.end_sun_hour = '-1';
    this.end_sun_min = '-1';
    this.end_sun_format = 'AM';

    this.end_mon_hour = '-1';
    this.end_mon_min = '-1';
    this.end_mon_format = 'AM';

    this.end_tue_hour = '-1';
    this.end_tue_min = '-1';
    this.end_tue_format = 'AM';

    this.end_wed_hour = '-1';
    this.end_wed_min = '-1';
    this.end_wed_format = 'AM';

    this.end_thu_hour = '-1';
    this.end_thu_min = '-1';
    this.end_thu_format = 'AM';

    this.end_fri_hour = '-1';
    this.end_fri_min = '-1';
    this.end_fri_format = 'AM';

    this.end_sat_hour = '-1';
    this.end_sat_min = '-1';
    this.end_sat_format = 'AM';
    this.idscheduler_exception = '';


    this.start_hour = '-1';
    this.start_min = '-1';
    this.start_format = 'AM';

    this.end_hour = '-1';
    this.end_min = '-1';
    this.end_format = 'AM';

  }

}
