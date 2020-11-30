import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SuperadminDashboardComponent } from './superadmin-dashboard.component';
// import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// import { SuperadminChangePasswordModule } from '../../../dashboard/user-password-changes/supeadmin-change-password/superadmin-change-password.module';
import { ManualCronJobModule } from '../../../superadmin/organization/manual-cron-job/manual-cron-job.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
const routes: Routes = [
  {
    path: 'SuperadminDashboard',
    component: SuperadminDashboardComponent,// varun - superadmindashboard as parent component
    children: [ // varun- child components
      {
        path: 'welcomePage',
        outlet: 'SuperAdminOut',
        loadChildren: '../../user-welcome-pages/superadmin-welcome/superadmin-welcome.module#SuperadminWelcomeModule',

      },
      {
        path: 'Createemployee',
        outlet: 'SuperAdminOut',
        loadChildren: '../../../superadmin/people/createemployee/createemployee.module#CreateemployeeModule',

      },
      {
        path: 'setUserLoginSuper/:EmployeeKey/:str/:UserRoleTypeKey/:Organization',
        outlet: 'SuperAdminOut',
        loadChildren: '../../../superadmin/people/set-user-login-super/set-user-login-super.module#SetUserLoginSuperModule',

      },
      {
        path: 'Viewemployee',
        outlet: 'SuperAdminOut',
        loadChildren: '../../../superadmin/people/viewemployee/viewemployee.module#ViewemployeeModule',

      },
      {
        path: 'Viewemployee/Editemployee/:EmployeeKey',
        outlet: 'SuperAdminOut',
        loadChildren: '../../../superadmin/people/editemployee/editemployee.module#EditemployeeModule',

      },
      {
        path: 'Managelogincredentials',
        outlet: 'SuperAdminOut',
        loadChildren: '../../../superadmin/people/managelogincredentials/managelogincredentials.module#ManagelogincredentialsModule',

      },
      {
        path: 'Managelogincredentials/Resetpasswordforsamodule/:EmpKey',
        outlet: 'SuperAdminOut',
        loadChildren: '../../../superadmin/people/resetpasswordforsamodule/resetpasswordforsamodule.module#ResetpasswordforsamoduleModule',

      },
      {
        path: 'CreateOrganization',
        outlet: 'SuperAdminOut',
        loadChildren: '../../../superadmin/organization/create-organization/create-organization.module#CreateOrganizationModule',

      },
      {
        path: 'ViewOrganization',
        outlet: 'SuperAdminOut',
        loadChildren: '../../../superadmin/organization/view-organization/view-organization.module#ViewOrganizationModule',

      },
      {
        path: 'ViewOrganization/Orgedit/:OrganizationID',
        outlet: 'SuperAdminOut',
        loadChildren: '../../../superadmin/organization/edit-organization/edit-organization.module#EditOrganizationModule',

      },
      {
        path: 'superAdminMyProfile',
        outlet: 'SuperAdminOut',
        loadChildren: '../../user-profiles/superadmin-profile/superadmin-profile.module#SuperadminProfileModule',

      },
      {
        path: 'superAdminMyProfile/changePasswordSuperAdmin/:EmployeeKey/:UserRoleName/:IsSupervisor',
        outlet: 'SuperAdminOut',
        loadChildren: '../../../dashboard/user-password-changes/supeadmin-change-password/superadmin-change-password.module#SuperadminChangePasswordModule',

      },
      {
        path: 'changePasswordSuperAdmin/:EmployeeKey/:UserRoleName/:IsSupervisor',
        outlet: 'SuperAdminOut',
        loadChildren: '../../../dashboard/user-password-changes/supeadmin-change-password/superadmin-change-password.module#SuperadminChangePasswordModule',

      },
      {
        path: 'cronJob',
        outlet: 'SuperAdminOut',
        loadChildren: '../../../superadmin/organization/manual-cron-job/manual-cron-job.module#ManualCronJobModule',

      },
      {
        path: 'cronJobView',
        outlet: 'SuperAdminOut',
        loadChildren: '../../../superadmin/organization/view-cron-job/view-cron-job.module#ViewCronJobModule',

      },
      {
        path: 'cronJobBatchDetailedView',
        outlet: 'SuperAdminOut',
        loadChildren: '../../../superadmin/organization/cron-job-batch-details/cron-job-batch-details.module#CronJobBatchDetailsModule',
      },
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MDBBootstrapModule.forRoot(),
    // NgMultiSelectDropDownModule.forRoot(),
  ],
  declarations: [SuperadminDashboardComponent]
})
export class SuperadminDashboardModule { }
