import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { Routes, RouterModule } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';

import{ ManagerDashBoardModule  } from '../user-dashboards/manager-dash-board/manager-dash-board.module';
import{ EmployeeDashbordModule  } from '../user-dashboards/employee-dashboard/employee-dashbord.module';
import{ SupervisorDashboardModule  } from '../user-dashboards/supervisor-dashboard/supervisor-dashboard.module';
import{ SuperadminDashboardModule } from '../user-dashboards/superadmin-dashboard/superadmin-dashboard.module';
import{ AdminDashboardModule } from '../user-dashboards/admin-dashboard/admin-dashboard.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    ManagerDashBoardModule,//manger router paths are loaded
    EmployeeDashbordModule,//employee router paths are loaded
    SuperadminDashboardModule,//superadminDashboard router paths are loaded
    SupervisorDashboardModule,//supervisor router paths are loaded
    AdminDashboardModule,//admin router paths are loaded
    HttpClientModule,
    MDBBootstrapModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }
