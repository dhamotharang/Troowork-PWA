import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { SchedulingService } from '../../../../service/scheduling.service';
import { Location } from '@angular/common';
import { DataServiceTokenStorageService } from 'src/app/service/DataServiceTokenStorage.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../../../dialog/alertdialog/alertdialog.component';

@Component({
  selector: 'app-view-employeesof-group',
  templateUrl: './view-employeesof-group.component.html',
  styleUrls: ['./view-employeesof-group.component.scss']
})
export class ViewEmployeesofGroupComponent implements OnInit {
  empGroupID$;
  empGroupName$;
  loading;
  role: String;
  name: String;
  employeekey: Number;
  IsSupervisor: Number;
  OrganizationID: Number;
  editEmp;
  empList;
  empKey;
  grpname;
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

  public convert_DT(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");

  }

  constructor(private scheduleServ: SchedulingService, private route: ActivatedRoute, private router: Router, private _location: Location, private dst: DataServiceTokenStorageService, private dialog: MatDialog) {
    this.route.params.subscribe(params => this.empGroupID$ = params.employeegroupID);
    this.route.params.subscribe(params => this.empGroupName$ = params.groupName);
  }

  ngOnInit() {
    // var token = sessionStorage.getItem('token');
    // var encodedProfile = token.split('.')[1];
    // var profile = JSON.parse(this.url_base64_decode(encodedProfile));
    this.role = this.dst.getRole();
    this.IsSupervisor = this.dst.getIsSupervisor();
    this.name = this.dst.getName();
    this.employeekey = this.dst.getEmployeekey();
    this.OrganizationID = this.dst.getOrganizationID();
    this.loading = true;
    this.checkFlag = false;
    this.scheduleServ.getAllEmployeesofEmpGroup(this.empGroupID$, this.OrganizationID).subscribe((data: any[]) => {
      this.empList = data;
      if (data.length > 0) {
        this.grpname = data[0].Description;
      } else {
        this.grpname = this.empGroupName$;
      }
      this.loading = false;
    });
  }
  // For updating items against single line
  // changeDisable(index, empkey) {
  //   this.editEmp = index;
  //   this.empKey = empkey;
  // }

  // cancelOrderChange() {
  //   this.editEmp = -1;
  //   this.scheduleServ.getAllEmployeesofEmpGroup(this.empGroupID$, this.OrganizationID).subscribe((data: any[]) => {
  //     this.empList = data;
  //   });
  // }

  // saveOrderChange(empKey, orderVal) {
  //   this.loading = true;
  //   this.editEmp = -1;
  //   // var scheduleDT = this.convert_DT(new Date());
  //   this.scheduleServ.saveOrderChange(this.employeekey, this.OrganizationID, empKey, orderVal)
  //     .subscribe(res => {
  //       alert("Seniority Order updated Successfully");
  //       this.scheduleServ.getAllEmployeesofEmpGroup(this.empGroupID$, this.OrganizationID).subscribe((data: any[]) => {
  //         this.empList = data;
  //         this.loading = false;
  //       });
  //     });
  // }

  // For updating items by single save
  saveOrderChanges() {
    this.checkFlag = true;
    this.loading = true;
    this.editEmp = -1;

    var count = 0;
    for (var i = 0; i < this.empList.length; i++) {
      // alert(i);
      this.scheduleServ.saveOrderChange(this.employeekey, this.OrganizationID, this.empList[i].EmployeeKey, this.empList[i].GroupSeniorityOrder)
        .subscribe(res => {
          // count = count + 1;
          // alert("Updated... count." + count + "...empKey..." + this.empList[i].EmployeeKey + "...GroupSeniorityOrder..." + this.empList[i].GroupSeniorityOrder);
        });
    }
    if (i === this.empList.length) {
      // alert("Seniority Order updated Successfully");
      const dialogRef = this.dialog.open(AlertdialogComponent, {
        data: {
          message: 'Seniority Order updated Successfully',
          buttonText: {
            cancel: 'Done'
          }
        },
      });
      this.checkFlag = false;
      this.scheduleServ.getAllEmployeesofEmpGroup(this.empGroupID$, this.OrganizationID).subscribe((data: any[]) => {
        this.empList = data;
        this.loading = false;
      });
    }
  }
  cancelOrderChange() {
    this.editEmp = -1;
    this.scheduleServ.getAllEmployeesofEmpGroup(this.empGroupID$, this.OrganizationID).subscribe((data: any[]) => {
      this.empList = data;
    });
  }

  goBack() {
    this._location.back();
  }
}
