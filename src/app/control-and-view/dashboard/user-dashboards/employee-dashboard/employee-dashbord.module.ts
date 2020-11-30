import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { EmployeeDashboardComponent } from './employee-dashboard.component';
import { TradeRequestApproveModule } from '../../../employee/trade-request-approve/trade-request-approve.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
const routes: Routes = [
  {
    path: 'EmployeeDashboard',
    component: EmployeeDashboardComponent,//by varun - EmployeeDashboard as parent component
    children: [ //by varun- child components
      {
        path: 'Emp_welcomePage',
        outlet: 'EmployeeOut',
        loadChildren: '../../user-welcome-pages/employee-welcome/employee-welcome.module#EmployeeWelcomeModule',

      },
      {
        path: 'Viewmeetingortrainingevent',
        outlet: 'EmployeeOut',
        loadChildren: '../../../employee/viewmeetingortrainingevent/viewmeetingortrainingevent.module#ViewmeetingortrainingeventModule',

      },
      {
        path: 'Viewworkordersforemployee',
        outlet: 'EmployeeOut',
        loadChildren: '../../../employee/viewworkordersforemployee/viewworkordersforemployee.module#ViewworkordersforemployeeModule',

      },
      {
        path: 'employeeMyProfile',
        outlet: 'EmployeeOut',
        loadChildren: '../../user-profiles/employee-profile/employee-profile.module#EmployeeProfileModule',

      },
      {
        path: 'employeeMyProfile/changePasswordEmployee/:EmployeeKey/:UserRoleName/:IsSupervisor',
        outlet: 'EmployeeOut',
        loadChildren: '../../user-password-changes/employee-change-password/employee-change-password.module#EmployeeChangePasswordModule',

      },
      {
        path: 'changePasswordEmployee/:EmployeeKey/:UserRoleName/:IsSupervisor',
        outlet: 'EmployeeOut',
        loadChildren: '../../user-password-changes/employee-change-password/employee-change-password.module#EmployeeChangePasswordModule',

      },
      {
        path: 'ViewSchedulerForEmployee',
        outlet: 'EmployeeOut',
        loadChildren: '../../../employee/view-employee-scheduler/view-employee-scheduler.module#ViewEmployeeSchedulerModule',
      },
      {
        path: 'PtoRequest',
        outlet: 'EmployeeOut',
        loadChildren: '../../../employee/pto-request/pto-request.module#PtoRequestModule',
      },
      {
        path: 'ViewPtoRequest',
        outlet: 'EmployeeOut',
        loadChildren: '../../../employee/pto-request-view/pto-request-view.module#PtoRequestViewModule',
      },
      {
        path: 'ViewPtoRequest/PTORequestDetails/:requestID',
        outlet: 'EmployeeOut',
        loadChildren: '../../../employee/pto-request-details/pto-request-details.module#PtoRequestDetailsModule',
      },
      {
        path: 'ViewPtoRequest/PTORequestEdit/:requestID',
        outlet: 'EmployeeOut',
        loadChildren: '../../../employee/pto-request-edit/pto-request-edit.module#PtoRequestEditModule',
      },
      {
        path: 'TradeRequest',
        outlet: 'EmployeeOut',
        loadChildren: '../../../employee/trade-request/trade-request.module#TradeRequestModule',
      },
      {
        path: 'ViewTradeRequest',
        outlet: 'EmployeeOut',
        loadChildren: '../../../employee/trade-request-view/trade-request-view.module#TradeRequestViewModule',
      },
      {
        path: 'ViewTradeRequest/TradeRequestEdit/:requestID',
        outlet: 'EmployeeOut',
        loadChildren: '../../../employee/trade-request-edit/trade-request-edit.module#TradeRequestEditModule',
      },
      {
        path: 'ViewTradeRequest/TradeRequestApprove/:requestID',
        outlet: 'EmployeeOut',
        loadChildren: '../../../employee/trade-request-approve/trade-request-approve.module#TradeRequestApproveModule',
      },
      {
        path: 'ViewTradeRequest/TradeRequestDetails/:requestID',
        outlet: 'EmployeeOut',
        loadChildren: '../../../employee/trade-request-details/trade-request-details.module#TradeRequestDetailsModule',
      },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MDBBootstrapModule.forRoot()
  ],
  declarations: [EmployeeDashboardComponent],
  exports: [EmployeeDashboardComponent]

})
export class EmployeeDashbordModule { }
