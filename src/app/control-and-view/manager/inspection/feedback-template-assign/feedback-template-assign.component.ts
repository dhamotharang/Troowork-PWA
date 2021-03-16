import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { InspectionService } from '../../../../service/inspection.service';
import { WorkOrderServiceService } from '../../../../service/work-order-service.service';
import { SchedulingService } from '../../../../service/scheduling.service';
import { InventoryService } from '../../../../service/inventory.service';

@Component({
  selector: 'app-feedback-template-assign',
  templateUrl: './feedback-template-assign.component.html',
  styleUrls: ['./feedback-template-assign.component.scss']
})
export class FeedbackTemplateAssignComponent implements OnInit {
  role: String;
  name: String;
  toServeremployeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  pageNo: Number = 1;
  itemsPerPage: Number = 25;
  tempID;
  temlates;
  TemplateID;
  TemplateEditDetails;
  loading = false;

  roomtype;
  room;
  tempName; scorename;
  roomtypeList;
  roomList;
  roomtypeKEY;
  roomList1;
  alertCheck: number = 0;

  FloorList; FloorKey;
  RoomKey; RoomList;
  FacilityKey; building;
  zonelist; ZoneKey;
  RoomType;
  roomData; roomTempname;
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

  constructor(private route: ActivatedRoute, private router: Router, private invServ: InventoryService, private inspectionService: InspectionService, private woServ: WorkOrderServiceService, private scheduleServ: SchedulingService) {
    this.route.params.subscribe(params => this.tempID = params.idreviewtemplate);
  }

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
    this.roomtype = false;
    this.room = false;

    this.inspectionService
      .getFeedbackTemplateEditDetails(this.tempID, this.OrganizationID).subscribe((data: any[]) => {

        if (data.length > 0) {
          this.tempName = data[0].TemplateName;
          this.scorename = data[0].ScoreName;
        }
        this.loading = false;
        this.RoomType="";

      });
  }


  roomTypeChange() {
    this.roomtype = true;
    this.room = false;

    this.inspectionService.getallRoomTypes(this.OrganizationID).subscribe((data: any[]) => {
      this.roomtypeList = data;
    });
  }

  roomChange() {
    this.roomtype = false;
    this.room = true;


    this.invServ
      .getallBuildingList(this.toServeremployeekey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.building = data;
        this.FacilityKey = "";
      });
  }

  selectroomfromRoomtype(roomtypeKey) {
    if (!(roomtypeKey)) {
      alert("Please select a room type");
      return;
    }
    this.roomtypeKEY = roomtypeKey;
    this.alertCheck = 0;
    this.inspectionService.getallRooms_Roomtype(roomtypeKey, this.OrganizationID).subscribe((data: any[]) => {
      this.roomList = data;
      this.inspectionService.getallRoomswithTemplates(roomtypeKey, this.OrganizationID).subscribe((data: any[]) => {
        this.roomList1 = data;
        for (var i = 0; i < this.roomList.length; i++) {
          this.roomList[i].roomCheck = true;
          for (var j = 0; j < this.roomList1.length; j++) {
            if (this.roomList[i].RoomKey == this.roomList1[j].RoomKey) {
              this.roomList[i].RoomKeyTemp = this.roomList1[j].TemplateName;
              this.alertCheck = 1;
            }
          }
        }
      });
    });
  }

  valuesSave_RoomType() {
    var addRoomList = [];
    var addRoomString;

    if (this.alertCheck == 1) {
      var k = confirm("There are rooms with other templates assigned. Clicking yes will overwrite them to this template. Do you really want to continue?");
      if (k) {
        console.log(this.roomList);
        for (var i = 0; i < this.roomList.length; i++) {
          if (this.roomList[i].roomCheck == true) {
            addRoomList.push(this.roomList[i].RoomKey);
          }
        }
        addRoomString = addRoomList.join(',');
        if (addRoomList.length > 0) {
          this.inspectionService.addRooms_RoomtypeToTemplate(this.tempID, addRoomString, this.roomtypeKEY, this.toServeremployeekey, this.OrganizationID)
            .subscribe((data: any[]) => {
              alert("Rooms added to template successfully");
              this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['feedbackManage'] } }]);
            });
        }
      }
      else {
        return false;
      }

    } else {
      console.log(this.roomList);
      for (var i = 0; i < this.roomList.length; i++) {
        if (this.roomList[i].roomCheck == true) {
          addRoomList.push(this.roomList[i].RoomKey);
        }
      }
      addRoomString = addRoomList.join(',');
      if (addRoomList.length > 0) {
        this.inspectionService.addRooms_RoomtypeToTemplate(this.tempID, addRoomString, this.roomtypeKEY, this.toServeremployeekey, this.OrganizationID)
          .subscribe((data: any[]) => {
            alert("Rooms added to template successfully");
            this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['feedbackManage'] } }]);
          });
      }
    }
  }

  getFloorDisp(facilityName) {
    if (!facilityName) {
      facilityName = 0;
    }
    this.woServ
      .getallFloor(facilityName, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.FloorList = data;
        this.FloorKey = "";
        this.ZoneKey = "";
        this.RoomKey = "";
      });
  }
  getZoneRoomTypeRoom(floor, facility) {
    if (floor) {
      this.woServ
        .getzone_facilityfloor(floor, facility, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.zonelist = data;
          this.ZoneKey = "";
          this.RoomKey = "";
        });
      this.woServ
        .getRoom_facilityfloor(floor, facility, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.RoomList = data;
          this.RoomKey = ""
        });
    }
    if (!(this.FloorKey)) {
      this.ZoneKey = '';
      this.RoomKey = '';
    }
  }

  getRoomTypeRoom(zone, facility, floor) {
    if (facility && floor && zone) {

      this.woServ
        .getRoom_zone_facilityfloor(zone, floor, facility, this.OrganizationID)
        .subscribe((data: any[]) => {
          this.RoomList = data;
          this.RoomKey = "";
        });
    }
    if (!(this.ZoneKey)) {
      this.getZoneRoomTypeRoom(this.FloorKey, this.FacilityKey);
      this.RoomKey = '';
    }
  }

  getRoomDetails(roomKey) {
    this.invServ
      .getRoomDetailsList(roomKey, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.roomData = data;
        this.roomtypeKEY = data[0].RoomTypeKey;
        this.inspectionService.getTemplateDetailsForRoom(roomKey, this.OrganizationID)
          .subscribe((data: any[]) => {
            this.roomList1 = data;
            if (this.roomList1[0].TemplateName) {
              this.roomTempname = this.roomList1[0].TemplateName;
              this.alertCheck = 1;
            }
          });
      });
  }



  valuesSave_Room() {

    if (this.alertCheck == 1) {
      var k = confirm("The selected rooms has another template assigned. Clicking yes will overwrite it to this template. Do you really want to continue?");
      if (k) {
        this.inspectionService.addRooms_RoomtypeToTemplate(this.tempID, this.RoomKey, this.roomtypeKEY, this.toServeremployeekey, this.OrganizationID)
          .subscribe((data: any[]) => {
            alert("Rooms added to template successfully");
            this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['feedbackManage'] } }]);
          });

      }
      else {
        return false;
      }

    } else {
      this.inspectionService.addRooms_RoomtypeToTemplate(this.tempID, this.RoomKey, this.roomtypeKEY, this.toServeremployeekey, this.OrganizationID)
        .subscribe((data: any[]) => {
          alert("Rooms added to template successfully");
          this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['feedbackManage'] } }]);
        });
    }
  }


}
