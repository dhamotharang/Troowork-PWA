import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { EmployeeDashbordModule } from '../../dashboard/user-dashboards/employee-dashboard/employee-dashbord.module';
import { TradeRequestViewComponent } from './trade-request-view.component';

const routes: Routes = [
  {
    path: '',
    component: TradeRequestViewComponent
  }
  
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    EmployeeDashbordModule,
    MDBBootstrapModule,
    FormsModule, ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TradeRequestViewComponent]
})
export class TradeRequestViewModule { }
