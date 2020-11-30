import { Component, OnInit } from '@angular/core';
import { SchedulingService } from '../../../../service/scheduling.service';
import { ActivatedRoute, Router } from "@angular/router";
import { People } from '../../../../model-class/People';
import { PeopleServiceService } from '../../../../service/people-service.service';
@Component({
  selector: 'app-editshift',
  templateUrl: './editshift.component.html',
  styleUrls: ['./editshift.component.scss']
})
export class EditshiftComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;

  edit;
  shiftk$;
  StartTime;
  EndTime;
  Description;
  Abbrevation;
  PublishAs;
  PaidHours;
  Colour;
  schedularcount = 0;
  idemployeegrouping;
  Idscheduler_exception
  isemployeecalendar;
  desc;
  schedulerexception: People[];
  masterhour: People[];
  masterminute: People[];

  showHide;

  start_hour: String;
  start_min: String;
  start_format: String;
  end_hour: String;
  end_min: String;
  end_format: String;


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

  constructor(private scheduleServ: SchedulingService, private route: ActivatedRoute, private router: Router, private PeopleServiceService: PeopleServiceService) {
    this.route.params.subscribe(params => this.shiftk$ = params.Idemployeeshift);
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
    this.scheduleServ.getShiftsforEditing(this.shiftk$, this.OrganizationID).subscribe((data: any[]) => {
      this.edit = data[0];
      // var cur_time = new Date(Date.now());
      // var timeValue1 = this.edit.StartTime;
      // var timeValue2 = this.edit.EndTime;
      // var test1 = timeValue1.split(":");
      // var test2 = timeValue2.split(":");
      // var start = new Date(cur_time.getFullYear(), cur_time.getMonth(), cur_time.getDate(), test1[0], test1[1], 0);
      // var end = new Date(cur_time.getFullYear(), cur_time.getMonth(), cur_time.getDate(), test2[0], test2[1], 0);
      // this.StartTime = start;
      // this.EndTime = end;
      // scheduler code starts...
      // this.idemployeegrouping = this.edit.Idemployeegrouping;
      this.desc = this.edit.Description;
      if (!(this.edit.Idscheduler_exception)) {
        this.Idscheduler_exception = "";
      }
      else {
        this.Idscheduler_exception = this.edit.Idscheduler_exception;
      }
      // console.log(this.Idscheduler_exception + "*****")
      if (this.showHide == true) {
        if (!(this.edit.Start_sun_hour)) {
          this.edit.Start_sun_hour = '-1';
        }
        if (!(this.edit.Start_sun_min)) {
          this.edit.Start_sun_min = '-1';
        }
        if (!(this.edit.Start_sun_format)) {
          this.edit.Start_sun_format = 'AM';
        }
        if (!(this.edit.Start_mon_hour)) {
          this.edit.Start_mon_hour = '-1';
        }
        if (!(this.edit.Start_mon_min)) {
          this.edit.Start_mon_min = '-1';
        }
        if (!(this.edit.Start_mon_format)) {
          this.edit.Start_mon_format = 'AM';
        }
        if (!(this.edit.Start_tue_hour)) {
          this.edit.Start_tue_hour = '-1';
        }
        if (!(this.edit.Start_tue_min)) {
          this.edit.Start_tue_min = '-1';
        }
        if (!(this.edit.Start_tue_format)) {
          this.edit.Start_tue_format = 'AM';
        }
        if (!(this.edit.Start_wed_hour)) {
          this.edit.Start_wed_hour = '-1';
        }
        if (!(this.edit.Start_wed_min)) {
          this.edit.Start_wed_min = '-1';
        }
        if (!(this.edit.Start_wed_format)) {
          this.edit.Start_wed_format = 'AM';
        }
        if (!(this.edit.Start_thu_hour)) {
          this.edit.Start_thu_hour = '-1';
        }
        if (!(this.edit.Start_thu_min)) {
          this.edit.Start_thu_min = '-1';
        }
        if (!(this.edit.Start_thu_format)) {
          this.edit.Start_thu_format = 'AM';
        }
        if (!(this.edit.Start_fri_hour)) {
          this.edit.Start_fri_hour = '-1';
        }
        if (!(this.edit.Start_fri_min)) {
          this.edit.Start_fri_min = '-1';
        }
        if (!(this.edit.Start_fri_format)) {
          this.edit.Start_fri_format = 'AM';
        }
        if (!(this.edit.Start_sat_hour)) {
          this.edit.Start_sat_hour = '-1';
        }
        if (!(this.edit.Start_sat_min)) {
          this.edit.Start_sat_min = '-1';
        }
        if (!(this.edit.Start_sat_format)) {
          this.edit.start_sat_format = 'AM';
        }
        if (!(this.edit.End_sun_hour)) {
          this.edit.End_sun_hour = '-1';
        }
        if (!(this.edit.End_sun_min)) {
          this.edit.End_sun_min = '-1';
        }
        if (!(this.edit.End_sun_format)) {
          this.edit.End_sun_format = 'AM';
        }
        if (!(this.edit.End_mon_hour)) {
          this.edit.End_mon_hour = '-1';
        }
        if (!(this.edit.End_mon_min)) {
          this.edit.End_mon_min = '-1';
        }
        if (!(this.edit.End_mon_format)) {
          this.edit.End_mon_format = 'AM';
        }
        if (!(this.edit.End_tue_hour)) {
          this.edit.End_tue_hour = '-1';
        }
        if (!(this.edit.End_tue_min)) {
          this.edit.End_tue_min = '-1';
        }
        if (!(this.edit.End_tue_format)) {
          this.edit.End_tue_format = 'AM';
        }
        if (!(this.edit.End_wed_hour)) {
          this.edit.End_wed_hour = '-1';
        }
        if (!(this.edit.End_wed_min)) {
          this.edit.End_wed_min = '-1';
        }
        if (!(this.edit.End_wed_format)) {
          this.edit.End_wed_format = 'AM';
        }
        if (!(this.edit.End_thu_hour)) {
          this.edit.End_thu_hour = '-1';
        }
        if (!(this.edit.End_thu_min)) {
          this.edit.End_thu_min = '-1';
        }
        if (!(this.edit.End_thu_format)) {
          this.edit.End_thu_format = 'AM';
        }
        if (!(this.edit.End_fri_hour)) {
          this.edit.End_fri_hour = '-1';
        }
        if (!(this.edit.End_fri_min)) {
          this.edit.End_fri_min = '-1';
        }
        if (!(this.edit.End_fri_format)) {
          this.edit.End_fri_format = 'AM';
        }
        if (!(this.edit.End_sat_hour)) {
          this.edit.End_sat_hour = '-1';
        }
        if (!(this.edit.End_sat_min)) {
          this.edit.End_sat_min = '-1';
        }
        if (!(this.edit.End_sat_format)) {
          this.edit.End_sat_format = 'AM';
        }
      } else if (this.showHide == false) {

        this.start_hour = this.edit.Start_sun_hour;
        this.start_min = this.edit.Start_sun_min;
        this.start_format = this.edit.Start_sun_format;
        this.end_hour = this.edit.End_sun_hour;
        this.end_min = this.edit.End_sun_min;
        this.end_format = this.edit.End_sun_format;

        console.log(this.start_format + "  " + this.end_format);
      }
      // scheduler code ends...
    });
  }
  editShift() {
    this.schedularcount = 0;
    console.log("initial... " + this.schedularcount);
    if (!(this.edit.Description)) {
      alert("Please enter the Employee Group Name");
      return;
    }

    if (!(this.edit.Colour)) {
      alert("Please select a colour");
      return;
    }
    if (this.showHide == true) {
      if (this.edit.Start_sun_hour == '-1' && this.edit.Start_sun_min == '-1' && this.edit.End_sun_hour == '-1' && this.edit.End_sun_min == '-1') {
        this.schedularcount = this.schedularcount;
      }
      else if (this.edit.Start_sun_hour != '-1' && this.edit.Start_sun_min != '-1' && this.edit.End_sun_hour != '-1' && this.edit.End_sun_min != '-1') {
        this.schedularcount = this.schedularcount;
      }
      else {
        this.schedularcount++;
        console.log("sun... " + this.schedularcount);
        alert('Values Missing in Sunday');
        return;
      }

      if (this.edit.Start_mon_hour == '-1' && this.edit.Start_mon_min == '-1' && this.edit.End_mon_hour == '-1' && this.edit.End_mon_min == '-1') {
        this.schedularcount = this.schedularcount;
      }
      else if (this.edit.Start_mon_hour != '-1' && this.edit.Start_mon_min != '-1' && this.edit.End_mon_hour != '-1' && this.edit.End_mon_min != '-1') {
        this.schedularcount = this.schedularcount;
      }
      else {
        this.schedularcount++;
        console.log("mon... " + this.schedularcount);
        alert('Values Missing in Monday');
        return;
      }

      if (this.edit.Start_tue_hour == '-1' && this.edit.Start_tue_min == '-1' && this.edit.End_tue_hour == '-1' && this.edit.End_tue_min == '-1') {
        this.schedularcount = this.schedularcount;
      }
      else if (this.edit.Start_tue_hour != '-1' && this.edit.Start_tue_min != '-1' && this.edit.End_tue_hour != '-1' && this.edit.End_tue_min != '-1') {
        this.schedularcount = this.schedularcount;
      }
      else {
        this.schedularcount++;
        console.log("tue... " + this.schedularcount);
        alert('Values Missing in Tuesday');
        return;
      }

      if (this.edit.Start_wed_hour == '-1' && this.edit.Start_wed_min == '-1' && this.edit.End_wed_hour == '-1' && this.edit.End_wed_min == '-1') {
        this.schedularcount = this.schedularcount;
      }
      else if (this.edit.Start_wed_hour != '-1' && this.edit.Start_wed_min != '-1' && this.edit.End_wed_hour != '-1' && this.edit.End_wed_min != '-1') {
        this.schedularcount = this.schedularcount;
      }
      else {
        this.schedularcount++;
        console.log("wed... " + this.schedularcount);
        alert('Values Missing in Wednesday');
        return;
      }

      if (this.edit.Start_thu_hour == '-1' && this.edit.Start_thu_min == '-1' && this.edit.End_thu_hour == '-1' && this.edit.End_thu_min == '-1') {
        this.schedularcount = this.schedularcount;
      }
      else if (this.edit.Start_thu_hour != '-1' && this.edit.Start_thu_min != '-1' && this.edit.End_thu_hour != '-1' && this.edit.End_thu_min != '-1') {
        this.schedularcount = this.schedularcount;
      }
      else {
        this.schedularcount++;
        console.log("thu... " + this.schedularcount);
        alert('Values Missing in Thursday');
        return;
      }

      if (this.edit.Start_fri_hour == '-1' && this.edit.Start_fri_min == '-1' && this.edit.End_fri_hour == '-1' && this.edit.End_fri_min == '-1') {
        this.schedularcount = this.schedularcount;
      }
      else if (this.edit.Start_fri_hour != '-1' && this.edit.Start_fri_min != '-1' && this.edit.End_fri_hour != '-1' && this.edit.End_fri_min != '-1') {
        this.schedularcount = this.schedularcount;
      }
      else {
        this.schedularcount++;
        console.log("fri... " + this.schedularcount);
        alert('Values Missing in Friday');
        return;
      }

      if (this.edit.Start_sat_hour == '-1' && this.edit.Start_sat_min == '-1' && this.edit.End_sat_hour == '-1' && this.edit.End_sat_min == '-1') {
        this.schedularcount = this.schedularcount;
      }
      else if (this.edit.Start_sat_hour != '-1' && this.edit.Start_sat_min != '-1' && this.edit.End_sat_hour != '-1' && this.edit.End_sat_min != '-1') {
        this.schedularcount = this.schedularcount;
      } else {
        this.schedularcount++;
        console.log("sat... " + this.schedularcount);
        alert('Values Missing in Saturday');
        return;
      }
    }
    else if (this.showHide == false) {
      console.log(this.start_format + "  " + this.end_format);
      if (this.start_hour == '-1' || this.start_min == '-1' || this.end_hour == '-1' || this.end_min == '-1') {
        this.schedularcount++;
        alert('Values Missing in Start and End Time');
        return;
      } else {
        this.edit.Start_sun_hour = this.start_hour;
        this.edit.Start_sun_min = this.start_min;
        this.edit.Start_sun_format = this.start_format;

        this.edit.Start_mon_hour = this.start_hour;
        this.edit.Start_mon_min = this.start_min;
        this.edit.Start_mon_format = this.start_format;

        this.edit.Start_tue_hour = this.start_hour;
        this.edit.start_tue_min = this.start_min;
        this.edit.start_tue_format = this.start_format;

        this.edit.Start_wed_hour = this.start_hour;
        this.edit.Start_wed_min = this.start_min;
        this.edit.Start_wed_format = this.start_format;

        this.edit.Start_thu_hour = this.start_hour;
        this.edit.Start_thu_min = this.start_min;
        this.edit.Start_thu_format = this.start_format;

        this.edit.Start_fri_hour = this.start_hour;
        this.edit.Start_fri_min = this.start_min;
        this.edit.Start_fri_format = this.start_format;

        this.edit.Start_sat_hour = this.start_hour;
        this.edit.Start_sat_min = this.start_min;
        this.edit.Start_sat_format = this.start_format;

        this.edit.End_sun_hour = this.end_hour;
        this.edit.End_sun_min = this.end_min;
        this.edit.End_sun_format = this.end_format;

        this.edit.End_mon_hour = this.end_hour;
        this.edit.End_mon_min = this.end_min;
        this.edit.End_mon_format = this.end_format;

        this.edit.End_tue_hour = this.end_hour;
        this.edit.End_tue_min = this.end_min;
        this.edit.End_tue_format = this.end_format;

        this.edit.End_wed_hour = this.end_hour;
        this.edit.End_wed_min = this.end_min;
        this.edit.End_wed_format = this.end_format;

        this.edit.End_thu_hour = this.end_hour;
        this.edit.End_thu_min = this.end_min;
        this.edit.End_thu_format = this.end_format;

        this.edit.End_fri_hour = this.end_hour;
        this.edit.End_fri_min = this.end_min;
        this.edit.End_fri_format = this.end_format;

        this.edit.End_sat_hour = this.end_hour;
        this.edit.End_sat_min = this.end_min;
        this.edit.End_sat_format = this.end_format;
      }

    }


    if (!this.Idscheduler_exception) {
      this.Idscheduler_exception = null;
    }
    console.log("before if... " + this.schedularcount);
    if (this.schedularcount == 0) {
      // this.scheduleServ.checkForEmpGrpDuplicate(this.edit.Description, this.OrganizationID).subscribe((data: any[]) => {
      // if (data.length == 0) {
      const empschobj = {
        start_sun_hour: this.edit.Start_sun_hour,
        start_sun_min: this.edit.Start_sun_min,
        start_sun_format: this.edit.Start_sun_format,
        start_mon_hour: this.edit.Start_mon_hour,
        start_mon_min: this.edit.Start_mon_min,
        start_mon_format: this.edit.Start_mon_format,
        start_tue_hour: this.edit.Start_tue_hour,
        start_tue_min: this.edit.Start_tue_min,
        start_tue_format: this.edit.Start_tue_format,
        start_wed_hour: this.edit.Start_wed_hour,
        start_wed_min: this.edit.Start_wed_min,
        start_wed_format: this.edit.Start_wed_format,
        start_thu_hour: this.edit.Start_thu_hour,
        start_thu_min: this.edit.Start_thu_min,
        start_thu_format: this.edit.Start_thu_format,
        start_fri_hour: this.edit.Start_fri_hour,
        start_fri_min: this.edit.Start_fri_min,
        start_fri_format: this.edit.Start_fri_format,
        start_sat_hour: this.edit.Start_sat_hour,
        start_sat_min: this.edit.Start_sat_min,
        start_sat_format: this.edit.Start_sat_format,
        end_sun_hour: this.edit.End_sun_hour,
        end_sun_min: this.edit.End_sun_min,
        end_sun_format: this.edit.End_sun_format,
        end_mon_hour: this.edit.End_mon_hour,
        end_mon_min: this.edit.End_mon_min,
        end_mon_format: this.edit.End_mon_format,
        end_tue_hour: this.edit.End_tue_hour,
        end_tue_min: this.edit.End_tue_min,
        end_tue_format: this.edit.End_tue_format,
        end_wed_hour: this.edit.End_wed_hour,
        end_wed_min: this.edit.End_wed_min,
        end_wed_format: this.edit.End_wed_format,
        end_thu_hour: this.edit.End_thu_hour,
        end_thu_min: this.edit.End_thu_min,
        end_thu_format: this.edit.End_thu_format,
        end_fri_hour: this.edit.End_fri_hour,
        end_fri_min: this.edit.End_fri_min,
        end_fri_format: this.edit.End_fri_format,
        end_sat_hour: this.edit.End_sat_hour,
        end_sat_min: this.edit.End_sat_min,
        end_sat_format: this.edit.End_sat_format,
        idscheduler_exception: this.Idscheduler_exception,
        groupId: this.shiftk$,
        desc: this.edit.Description,
        color: this.edit.Colour,
        orgid: this.OrganizationID,
        empkey: this.employeekey
      };
      if (this.desc !== this.edit.Description) {
        this.scheduleServ.checkForEmpGrpDuplicate(this.edit.Description, this.OrganizationID).subscribe((data: any[]) => {
          if (data.length > 0) {
            alert("Group Name already exists");
            return;
          } else {
            this.scheduleServ.updateShiftDetails(empschobj).subscribe((data: any[]) => {
              alert("Updated Successfully");
              this.router.navigate(['ManagerDashBoard', { outlets: { ManagerOut: ['ViewShift'] } }]);
            });
          }
        });
      }
      else {
        this.scheduleServ.updateShiftDetails(empschobj).subscribe((data: any[]) => {
          alert("Updated Successfully");
          this.router.navigate(['ManagerDashBoard', { outlets: { ManagerOut: ['ViewShift'] } }]);
        });
      }
      // } else {
      //   alert("Group Name already exists");
      //   return;
      // }
      // });
    } else {
      console.log("inside else... " + this.schedularcount);
      alert("Value for weekly schedule is missing somewhere. Please check it!!!");
      return;
    }

  }
  goBack() {
    this.router.navigate(['ManagerDashBoard', { outlets: { ManagerOut: ['ViewShift'] } }]);
  }
}
