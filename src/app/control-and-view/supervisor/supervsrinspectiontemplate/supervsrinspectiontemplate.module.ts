import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SupervisorDashboardModule } from '../../dashboard/user-dashboards/supervisor-dashboard/supervisor-dashboard.module';
import { SupervsrinspectiontemplateComponent } from './supervsrinspectiontemplate.component';
import { FileUploadModule } from 'ng2-file-upload';
import { NgDatepickerModule} from 'ng2-datepicker';
const routes: Routes = [
  {
    path: '',
    component: SupervsrinspectiontemplateComponent
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
    NgDatepickerModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes),
    FileUploadModule
  ],
  declarations: [SupervsrinspectiontemplateComponent]
})
export class SupervsrinspectiontemplateModule { }
