import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupervisorDashboardModule } from '../../dashboard/user-dashboards/supervisor-dashboard/supervisor-dashboard.module';
import{ ViewWorkOrderComponent }   from './view-work-order.component';
import { NgDatepickerModule} from 'ng2-datepicker';
import { FileUploadModule } from 'ng2-file-upload';
const routes: Routes = [
  {
    path: '',
    component: ViewWorkOrderComponent
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
    NgDatepickerModule,
    FileUploadModule
  ],
  declarations: [ViewWorkOrderComponent]
})
export class ViewWorkOrderModule { }
