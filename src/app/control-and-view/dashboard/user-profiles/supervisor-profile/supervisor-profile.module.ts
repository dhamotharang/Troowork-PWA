import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupervisorDashboardModule } from '../../user-dashboards/supervisor-dashboard/supervisor-dashboard.module';
import{ SupervisorProfileComponent }   from './supervisor-profile.component';
import { FileUploadModule } from 'ng2-file-upload';
const routes: Routes = [
  {
    path: '',
    component: SupervisorProfileComponent
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
    FileUploadModule
  ],
  declarations: [SupervisorProfileComponent]
})
export class SupervisorProfileModule { }
