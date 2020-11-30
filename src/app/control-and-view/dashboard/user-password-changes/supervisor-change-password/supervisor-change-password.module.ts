import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupervisorDashboardModule } from '../../user-dashboards/supervisor-dashboard/supervisor-dashboard.module';
import{ SupervisorChangePasswordComponent }   from './supervisor-change-password.component';
const routes: Routes = [
  {
    path: '',
    component: SupervisorChangePasswordComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MDBBootstrapModule,
    SupervisorDashboardModule,
    // UserDashboardsModule,
    // InventoryModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
  declarations: [SupervisorChangePasswordComponent]
})
export class SupervisorChangePasswordModule { }
