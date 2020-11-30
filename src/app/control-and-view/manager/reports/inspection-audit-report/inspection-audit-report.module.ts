import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IgxDatePickerModule } from 'igniteui-angular';
import { NgDatepickerModule } from 'ng2-datepicker';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { InspectionAuditReportComponent } from './inspection-audit-report.component';
const routes: Routes = [
  {
    path: '',
    component: InspectionAuditReportComponent
  }

];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    MDBBootstrapModule,
    FormsModule,
    ReactiveFormsModule,
    IgxDatePickerModule,
    NgDatepickerModule,
    // NgMultiSelectDropDownModule.forRoot(),
    RouterModule.forChild(routes),
  ],
  declarations: [InspectionAuditReportComponent]
})
export class InspectionAuditReportModule { }
