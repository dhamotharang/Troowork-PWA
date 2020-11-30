import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard.component';
// import { CreateshiftModule } from '../../../admin/createshift/createshift.module';
// import { EditshiftModule } from '../../../admin/editshift/editshift.module';
// import { ViewshiftModule } from '../../../admin/viewshift/viewshift.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
const routes: Routes = [
  {
    path: 'AdminDashboard',
    component: AdminDashboardComponent,// varun - AdminDashboard as parent component
    children: [ // varun- child components
      {
        path: 'welcomePage',
        outlet: 'AdminOut',
        loadChildren: '../../user-welcome-pages/admin-welcome/admin-welcome.module#AdminWelcomeModule',

      },
      {
        path: 'addEmployeeAdmin',
        outlet: 'AdminOut',
        loadChildren: '../../../admin/add-employee/add-employee.module#AddEmployeeModule',

      },
      {
        path: 'setUserLoginAdmin/:EmployeeKey/:str/:UserRoleTypeKey',
        outlet: 'AdminOut',
        loadChildren: '../../../admin/set-login-credentials-for-user/set-login-credentials-for-user.module#SetLoginCredentialsForUserModule',

      },
      {
        path: 'viewEmployeeAdmin',
        outlet: 'AdminOut',
        loadChildren: '../../../admin/view-employee-admin/view-employee-admin.module#ViewEmployeeAdminModule',

      },
      {
        path: 'viewEmployeeAdmin/editEmpDetailsAdmin/:EmployeeKey',
        outlet: 'AdminOut',
        loadChildren: '../../../admin/edit-employee-details-admin/edit-employee-details-admin.module#EditEmployeeDetailsAdminModule',

      },
      {
        path: 'manageLoginCreds',
        outlet: 'AdminOut',
        loadChildren: '../../../admin/manage-logins/manage-logins.module#ManageLoginsModule',

      },
      {
        path: 'manageLoginCreds/resetPasswords/:EmpKey',
        outlet: 'AdminOut',
        loadChildren: '../../../admin/reset-passwords/reset-password.module#ResetPasswordModule',

      },
      {
        path: 'JobTitleViewAdmin',
        outlet: 'AdminOut',
        loadChildren: '../../../admin/job-title-view-admin/job-tittile-view-admin.module#JobTittileViewAdminModule',

      },
      {
        path: 'JobTitleViewAdmin/JobTitleAddAdmin',
        outlet: 'AdminOut',
        loadChildren: '../../../admin/job-title-add-admin/job-tittile-add-admin.module#JobTittileAddAdminModule',

      },
      {
        path: 'JobTitleViewAdmin/JobTitleEditAdmin/:JobTitle_Key',
        outlet: 'AdminOut',
        loadChildren: '../../../admin/job-title-edit-admin/job-tittile-edit-admin.module#JobTittileEditAdminModule',

      },
      {
        path: 'ViewDepartment',
        outlet: 'AdminOut',
        loadChildren: '../../../admin/view-department/view-department.module#ViewDepartmentModule',

      },
      {
        path: 'ViewDepartment/DepartmentCreate',
        outlet: 'AdminOut',
        loadChildren: '../../../admin/create-department/create-department.module#CreateDepartmentModule',

      },
      {
        path: 'ViewDepartment/EditDepartment/:DeptKey',
        outlet: 'AdminOut',
        loadChildren: '../../../admin/edit-department/edit-department.module#EditDepartmentModule',

      },
      {
        path: 'adminMyProfile',
        outlet: 'AdminOut',
        loadChildren: '../../user-profiles/admin-profile/admin-profile.module#AdminProfileModule',

      },
      {
        path: 'adminMyProfile/changePasswordAdmin/:EmployeeKey/:UserRoleName/:IsSupervisor',
        outlet: 'AdminOut',
        loadChildren: '../../user-password-changes/admin-change-password/admin-change-password.module#AdminChangePasswordModule',

      },
      {
        path: 'changePasswordAdmin/:EmployeeKey/:UserRoleName/:IsSupervisor',
        outlet: 'AdminOut',
        loadChildren: '../../user-password-changes/admin-change-password/admin-change-password.module#AdminChangePasswordModule',

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
  declarations: [AdminDashboardComponent]
})
export class AdminDashboardModule { }
