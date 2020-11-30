import { Component, OnInit, OnChanges, Directive, HostListener, ElementRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
// import { workorder } from '../../../../model-class/work-order';
import { WorkOrderServiceService } from '../../../../service/work-order-service.service';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-edit-workorder-type',
  templateUrl: './edit-workorder-type.component.html',
  styleUrls: ['./edit-workorder-type.component.scss']
})
export class EditWorkorderTypeComponent implements OnInit {

  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;

  metricType: String;
  metricTypeKey: Number;
  MetricTypeValue;
  metricType1;
  WorkorderTypeName;

  showField1: boolean = false;
  showField2: boolean = false;
  metricTypeList;
  //token decoding
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

  WOT_Key;
  workorderTypeList;
  update_WO;
  numberValid(event: any) {
    const pattern = /[0-9\.\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
  constructor(private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private WorkOrderServiceService: WorkOrderServiceService) {
    this.route.params.subscribe(params => this.WOT_Key = params.WorkorderTypeKey);//getting WorkorderTypeKey for edited workordertype
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

    this.WorkOrderServiceService
      .Edit_WOT(this.WOT_Key, this.OrganizationID)
      .subscribe((data: any[]) => {
        this.workorderTypeList = data;
        this.WorkorderTypeName = data[0].WorkorderTypeName;
        this.MetricTypeValue = data[0].MetricTypeValue;
        this.metricType = data[0].MetricType;
        this.metricType1 = data[0].MetricType;
        this.WorkOrderServiceService
          .getMetricValues(this.OrganizationID)
          .subscribe((data: any[]) => {
            this.metricTypeList = data;
          });
      });
  }

  showFields(metricType) {
    {
      if (!metricType) {
        this.showField1 = false;
        this.showField2 = false;
      } else if (metricType === 'Default') {
        this.MetricTypeValue = 1;
        this.showField1 = false;
        this.showField2 = true;
      } else if (metricType === 'Custom') {
        this.MetricTypeValue = null;
        this.showField1 = false;
        this.showField2 = true;
      } else if (metricType === 'Minutes Per') {
        this.MetricTypeValue = null;
        this.showField1 = false;
        this.showField2 = true;
      }
    }
  }
  //function for updating workordertype
  updateWOT(WOTName, WOTKey, MetricTypeValue1) {
    if (!this.metricType || this.metricType == "--Select--") {
      this.metricType = null;
      alert("Select a metric type !");
      return;
    }
    if (!WOTName || !WOTName.trim()) {
      alert("Please enter work-order type!");
      return;
    }
    if (this.metricType != 'Default' && (!MetricTypeValue1 || !MetricTypeValue1.trim())) {
      MetricTypeValue1 = null;
      alert("MetricTypeValue is not provided !");
      return;
    }
    if(WOTName){
      WOTName=WOTName.trim();
    }
    if( this.metricType != 'Default' && MetricTypeValue1){
      MetricTypeValue1=MetricTypeValue1.trim();
    }
      this.WorkOrderServiceService
        .getMetricValues(this.OrganizationID)
        .subscribe((data: any[]) => {
          this.metricTypeList = data;
          for (let i of this.metricTypeList) {
            if (i.MetricType === this.metricType) {
              this.metricTypeKey = i.MetricTypeKey;
            }
          }
        });
      if (this.WorkorderTypeName != WOTName) {



        this.update_WO = {
          WorkorderTypeKey: WOTKey,
          WorkorderTypeName: WOTName,
          RoomTypeKey: null,
          Frequency: null,
          Repeatable: true,
          WorkorderTime: null,
          OrganizationID: this.OrganizationID,
          metric: this.metricType,
          MetricType: MetricTypeValue1
        };
        this.WorkOrderServiceService//check if wokordertype is already existing
          .checkforWOT(WOTName, this.employeekey, this.OrganizationID)
          .subscribe((data: any[]) => {
            if (data[0].count != 0) {
              alert("Work-order type already exists!");
            }
            else if (data[0].count == 0) {//add new workordertype
              this.WorkOrderServiceService
                .UpdateWOT(this.update_WO)
                .subscribe((data: any[]) => {
                  this.WorkOrderServiceService
                    .view_wotype(WOTKey, this.OrganizationID)
                    .subscribe((data: any[]) => {
                      alert("Work-order type updated successfully");
                      // this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['WorkOrderType'] } }]);
                      if (this.role == 'Manager') {
                        this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['WorkOrderType'] } }]);
                      }
                      // else if (this.role == 'Employee' && this.IsSupervisor == 1) {
                      else if (this.role == 'Supervisor') {
                        this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['WorkOrderType'] } }]);
                      }
                    });
                });
            }
          });
      }
      else {
        // if (this.MetricTypeValue == MetricTypeValue1 && this.metricType == this.metricType1) {
        //   alert("No changes are made");
        // }
        // else
        // {

        this.update_WO = {
          WorkorderTypeKey: WOTKey,
          WorkorderTypeName: WOTName,
          RoomTypeKey: null,
          Frequency: null,
          Repeatable: true,
          WorkorderTime: null,
          OrganizationID: this.OrganizationID,
          metric: this.metricType,
          MetricType: MetricTypeValue1
        };
        this.WorkOrderServiceService
          .UpdateWOT(this.update_WO)
          .subscribe((data: any[]) => {
            this.WorkOrderServiceService
              .view_wotype(WOTKey, this.OrganizationID)
              .subscribe((data: any[]) => {
                alert("Work-order type updated successfully");
                // this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['WorkOrderType'] } }]);
                if (this.role == 'Manager') {
                  this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['WorkOrderType'] } }]);
                }
                // else if (this.role == 'Employee' && this.IsSupervisor == 1) {
                else if (this.role == 'Supervisor') {
                  this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['WorkOrderType'] } }]);
                }
              });
          });
      }

    
  }
  goBack() {
    // this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['WorkOrderType'] } }]);
    if (this.role == 'Manager') {
      this.router.navigate(['/ManagerDashBoard', { outlets: { ManagerOut: ['WorkOrderType'] } }]);
    }
    // else if (this.role == 'Employee' && this.IsSupervisor == 1) {
    else if (this.role == 'Supervisor') {
      this.router.navigate(['/SupervisorDashboard', { outlets: { Superout: ['WorkOrderType'] } }]);
    }
  }
}
