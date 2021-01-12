import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgDatepickerModule} from 'ng2-datepicker';
import { EmployeeDashbordModule } from '../../dashboard/user-dashboards/employee-dashboard/employee-dashbord.module';
import { TradeRequestEditPWAComponent } from "./trade-request-edit-pwa.component";

const routes: Routes = [
  {
    path: '',
    component: TradeRequestEditPWAComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    EmployeeDashbordModule,
    MDBBootstrapModule,
    NgDatepickerModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TradeRequestEditPWAComponent]
})
export class TradeRequestEditPWAModule { }
