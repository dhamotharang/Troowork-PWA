import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SupervisorDashboardComponent } from './supervisor-dashboard.component';
import { SupervsrinspectiontemplateModule } from '../../../supervisor/supervsrinspectiontemplate/supervsrinspectiontemplate.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
// import { ViewinspectiomanagerModule } from "../../../manager/inspection/viewinspectionmanager/viewinspectiomanager.module";
const routes: Routes = [
  {
    path: 'SupervisorDashboard',
    component: SupervisorDashboardComponent,// sudina - superadmindashboard as parent component
    children: [//child components
      {
        path: 'Supervisor_welcomePage',
        outlet: 'Superout',
        loadChildren: '../../user-welcome-pages/supervisor-welcome/supervisor-welcome.module#SupervisorWelcomeModule',
      },
      {
        path: 'createQuickOrderSuperVisor',
        outlet: 'Superout',
        loadChildren: '../../../supervisor/create-quick-work-order/create-quick-work-order.module#CreateQuickWorkOrderModule',
      },
      {
        path: 'CreateWorkOrderSuperVisor',
        outlet: 'Superout',
        loadChildren: '../../../supervisor/create-work-order/create-work-order.module#CreateWorkOrderModule',
      },
      {
        path: 'Createinspectionbysuprvsr',
        outlet: 'Superout',
        loadChildren: '../../../supervisor/createinspection/createinspection.module#CreateinspectionModule',
      },
      {
        path: 'viewWorkOrderSupervisor',
        outlet: 'Superout',
        loadChildren: '../../../supervisor/view-work-order/view-work-order.module#ViewWorkOrderModule',
      },
      {
        path: 'Viewinspctnbysprvsr',
        outlet: 'Superout',
        loadChildren: '../../../supervisor/viewinspctnbysprvsr/viewinspctnbysprvsr.module#ViewinspctnbysprvsrModule',
      },
      {
        path: 'Viewinspctnbysprvsr/Supervsrinspectiontemplate/:InspectionOrderKey',
        outlet: 'Superout',
        loadChildren: '../../../supervisor/supervsrinspectiontemplate/supervsrinspectiontemplate.module#SupervsrinspectiontemplateModule',
      },

      {
        path: 'ViewInspectionManager/:InspectionOrderKey',
        outlet: 'Superout',
        loadChildren: '../../../manager/inspection/viewinspectionmanager/viewinspectiomanager.module#ViewinspectiomanagerModule',
      },




      {
        path: 'Training',
        outlet: 'Superout',
        loadChildren: '../../../supervisor/training/training.module#TrainingModule',
      },
      {
        path: 'supervisorMyProfile',
        outlet: 'Superout',
        loadChildren: '../../../dashboard/user-profiles/supervisor-profile/supervisor-profile.module#SupervisorProfileModule',
      },
      {
        path: 'supervisorMyProfile/changePasswordSupervisor/:EmployeeKey/:UserRoleName/:IsSupervisor',
        outlet: 'Superout',
        loadChildren: '../../../dashboard/user-password-changes/supervisor-change-password/supervisor-change-password.module#SupervisorChangePasswordModule',
      },
      {
        path: 'changePasswordSupervisor/:EmployeeKey/:UserRoleName/:IsSupervisor',
        outlet: 'Superout',
        loadChildren: '../../../dashboard/user-password-changes/supervisor-change-password/supervisor-change-password.module#SupervisorChangePasswordModule',
      },
      {
        path: 'CreateBatchWorkOrder',
        outlet: 'Superout',
        loadChildren: '../../../manager/work-order/create-batch-workorder/create-batch-workorder.module#CreateBatchWorkorderModule',

      },
      {
        path: 'ViewBatchWorkorder',
        outlet: 'Superout',
        loadChildren: '../../../manager/work-order/view-batch-workorder/view-batch-work-order.module#ViewBatchWorkOrderModule',

      },
      {
        path: 'ViewBatchWorkorder/EditBatchWorkorder/:WorkorderScheduleKey',
        outlet: 'Superout',
        loadChildren: '../../../manager/work-order/edit-batch-workorder/edit-batch-work-order.module#EditBatchWorkOrderModule',

      },
      {
        path: 'WorkOrderType',
        outlet: 'Superout',
        loadChildren: '../../../manager/work-order/work-order-type/work-order-type.module#WorkOrderTypeModule',

      },
      {
        path: 'WorkOrderType/CreateWorkorderType',
        outlet: 'Superout',
        loadChildren: '../../../manager/work-order/create-workorder-type/create-work-order-type.module#CreateWorkOrderTypeModule',

      },
      {
        path: 'WorkOrderType/EditWorkorderType/:WorkorderTypeKey',
        outlet: 'Superout',
        loadChildren: '../../../manager/work-order/edit-workorder-type/edit-work-order-type.module#EditWorkOrderTypeModule',

      },
      {
        path: 'CreateEmployee',
        outlet: 'Superout',
        loadChildren: '../../../manager/people/create-employee/create-employee.module#CreateEmployeeModule',

      },
      {
        path: 'Settingusernameandpswrdaftremplcreatebyman/:EmployeeKey/:str/:UserRoleTypeKey',
        outlet: 'Superout',
        loadChildren: '../../../manager/people/settingusernameandpswrdaftremplcreatebyman/settingusernameandpswrdafter.module#SettingusernameandpswrdafterModule',

      },
      {
        path: 'ViewEmployee',
        outlet: 'Superout',
        loadChildren: '../../../manager/people/view-employee/view-employee.module#ViewEmployeeModule',

      },
      {
        path: 'ViewEmployee/EditEmployeedetails/:EmployeeKey',
        outlet: 'Superout',
        loadChildren: '../../../manager/people/edit-employeedetails/edit-employeedetails.module#EditEmployeedetailsModule',

      },
      {
        path: 'MeetingTrainingCreate',
        outlet: 'Superout',
        loadChildren: '../../../manager/people/meeting-training-create/meeting-training-create.module#MeetingTrainingCreateModule',

      },
      {
        path: 'JobTitileView',
        outlet: 'Superout',
        loadChildren: '../../../manager/people/job-title-view/job-titile-view.module#JobTitileViewModule',

      },
      {
        path: 'JobTitileView/JobTitleAdd',
        outlet: 'Superout',
        loadChildren: '../../../manager/people/job-title-add/job-titile-add.module#JobTitileAddModule',

      },
      {
        path: 'JobTitileView/JobTitleEdit/:JobTitle_Key',
        outlet: 'Superout',
        loadChildren: '../../../manager/people/job-title-edit/job-titile-edit.module#JobTitileEditModule',

      },
      {
        path: 'manageLoginCredentials',
        outlet: 'Superout',
        loadChildren: '../../../manager/people/manage-login-credentials/manage-login-credentials.module#ManageLoginCredentialsModule',

      },
      {
        path: 'manageLoginCredentials/resetPassword/:EmpKey',
        outlet: 'Superout',
        loadChildren: '../../../manager/people/reset-pass-word/reset-pass-word.module#ResetPassWordModule',

      },
      {
        path: 'WorkorderReport',
        outlet: 'Superout',
        loadChildren: '../../../manager/reports/workorder-report/workorder-report.module#WorkorderReportModule',

      },
      {
        path: 'Batch-work-order-Report',
        outlet: 'Superout',
        loadChildren: '../../../manager/reports/batch-work-order-report/batch-work-order-report.module#BatchWorkOrderReportModule',

      },
      {
        path: 'BatchScheduleAssignment',
        outlet: 'Superout',
        loadChildren: '../../../manager/reports/batch-schedule-assignment-report/batch-schedule-assignment-report.module#BatchScheduleAssignmentReportModule',

      },
      {
        path: 'InspectionReport',
        outlet: 'Superout',
        loadChildren: '../../../manager/reports/inspection-report/inspection-report.module#InspectionReportModule',

      },
      {
        path: 'BarcodeReport',
        outlet: 'Superout',
        loadChildren: '../../../manager/reports/barcode-report/barcode-report.module#BarcodeReportModule',

      },
      {
        path: 'DashboardReport',
        outlet: 'Superout',
        loadChildren: '../../../manager/reports/dashboard-report/dashboard-report.module#DashboardReportModule',

      },
      {
        path: 'SchedulingView',
        outlet: 'Superout',
        loadChildren: '../../../manager/scheduling/scheduling-view/scheduling-view.module#SchedulingViewModule',

      },
      {
        path: 'SchedulingView/CreateBatchWork',
        outlet: 'Superout',
        loadChildren: '../../../manager/scheduling/create-batch-work/create-batch-work.module#CreateBatchWorkModule',

      },
      {
        path: 'SchedulingView/EditBatchWork/:scheduleNameKey',
        outlet: 'Superout',
        loadChildren: '../../../manager/scheduling/edit-batch-work/edit-batch-work.module#EditBatchWorkModule',

      },
      {
        path: 'DocumentfolderView',
        outlet: 'Superout',
        loadChildren: '../../../manager/documents/documentfolder-view/documentfolder-view.module#DocumentfolderViewModule',

      },
      {
        path: 'DocumentfolderView/NewdocumentfolderCreate',
        outlet: 'Superout',
        loadChildren: '../../../manager/documents/newdocumentfolder-create/newdocumentfolder-create.module#NewdocumentfolderCreateModule',

      },
      {
        path: 'DocumentfolderView/DocumentfolderEdit/:FormtypeId',
        outlet: 'Superout',
        loadChildren: '../../../manager/documents/documentfolder-edit/documentfolder-edit.module#DocumentfolderEditModule',

      },
      {
        path: 'DocumentsUpload',
        outlet: 'Superout',
        loadChildren: '../../../manager/documents/documents-upload/documents-upload.module#DocumentsUploadModule',

      },
      {
        path: 'ViewDocuments',
        outlet: 'Superout',
        loadChildren: '../../../manager/documents/view-documents/view-documents.module#ViewDocumentsModule',

      },
      {
        path: 'InspectiontemplateCreate',
        outlet: 'Superout',
        loadChildren: '../../../manager/inspection/inspectiontemplate-create/inspectiontemplate-create.module#InspectiontemplateCreateModule',

      },
      {
        path: 'InspectiontemplateandquestionsView',
        outlet: 'Superout',
        loadChildren: '../../../manager/inspection/inspectiontemplateandquestions-view/inspectiontemplateandquestions-view.module#InspectiontemplateandquestionsViewModule',

      },
      {
        path: 'InspectiontemplateandquestionsView/InspectiontemplateEdit',
        outlet: 'Superout',
        loadChildren: '../../../manager/inspection/inspectiontemplate-edit/inspectiontemplate-edit.module#InspectiontemplateEditModule',

      },
      {
        path: 'InspectiontemplatedetailEdit/:TemplateID',
        outlet: 'Superout',
        loadChildren: '../../../manager/inspection/inspectiontemplatedetail-edit/inspectiontemplatedetail-edit.module#InspectiontemplatedetailEditModule',

      },
      {
        path: 'MeetingTrainingView',
        outlet: 'Superout',
        loadChildren: '../../../manager/people/meeting-training-view/meeting-training-view.module#MeetingTrainingViewModule',

      },
      {
        path: 'MeetingTrainingView/EventView',
        outlet: 'Superout',
        loadChildren: '../../../manager/people/event-view/event-view.module#EventViewModule',

      },
      {
        path: 'MeetingTrainingView/viewEventEmployees/:EventKey',
        outlet: 'Superout',
        loadChildren: '../../../manager/people/view-employeesof-event/view-employeesof-event.module#ViewEmployeesofEventModule',

      },
      {
        path: 'MeetingTrainingView/viewEventEmployees/:EventKey/MeetingTrainingEdit/:EventKey/:ActionKey',
        outlet: 'Superout',
        loadChildren: '../../../manager/people/meeting-training-edit/meeting-training-edit.module#MeetingTrainingEditModule',

      },
      {
        path: 'Scheduler',
        outlet: 'Superout',
        loadChildren: '../../../manager/people/schedulerNew/scheduler.module#SchedulerModule',
      },
      {
        path: 'RequestsFromEmployees',
        outlet: 'Superout',
        loadChildren: '../../../manager/people/pto-requestsfrom-employees/ptorequestsfromemployees.module#PtorequestsfromemployeesModule',
      },
      {
        path: 'RequestsFromEmployees/PTORequestAction/:requestID',
        outlet: 'Superout',
        loadChildren: '../../../manager/people/pto-request-action/pto-request-action.module#PtoRequestActionModule',
      },
      {
        path: 'PtoRequest',
        outlet: 'Superout',
        loadChildren: '../../../employee/pto-request/pto-request.module#PtoRequestModule',
      },
      {
        path: 'ViewPtoRequest',
        outlet: 'Superout',
        loadChildren: '../../../employee/pto-request-view/pto-request-view.module#PtoRequestViewModule',
      },
      {
        path: 'ViewPtoRequest/PTORequestDetails/:requestID',
        outlet: 'Superout',
        loadChildren: '../../../employee/pto-request-details/pto-request-details.module#PtoRequestDetailsModule',
      },
      {
        path: 'ViewPtoRequest/PTORequestEdit/:requestID',
        outlet: 'Superout',
        loadChildren: '../../../employee/pto-request-edit/pto-request-edit.module#PtoRequestEditModule',
      },
      {
        path: 'schedulerReport',
        outlet: 'Superout',
        loadChildren: '../../../manager/reports/scheduler-report/scheduler-report.module#SchedulerReportModule',
      },
      {
        path: 'ViewServiceRequest',
        outlet: 'Superout',
        loadChildren: '../../../manager/work-order/view-service-request/view-service-request.module#ViewServiceRequestModule',
      },
      {
        path: 'viewWORemainingDetails/:fromdt/:todt/:empKey/:wotypeKey/:empName/:wotypeName',
        outlet: 'Superout',
        loadChildren: '../../../manager/reports/view-remaining-workorders-details/view-remaining-workorders-details.module#ViewRemainingWorkordersDetailsModule'
      },
      // TRADE

      {
        path: 'TradeRequest',
        outlet: 'Superout',
        loadChildren: '../../../employee/trade-request/trade-request.module#TradeRequestModule',
      },
      {
        path: 'ViewTradeRequest',
        outlet: 'Superout',
        loadChildren: '../../../employee/trade-request-view/trade-request-view.module#TradeRequestViewModule',
      },
      {
        path: 'ViewTradeRequest/TradeRequestEdit/:requestID',
        outlet: 'Superout',
        loadChildren: '../../../employee/trade-request-edit/trade-request-edit.module#TradeRequestEditModule',
      },
      {
        path: 'ViewTradeRequest/TradeRequestApprove/:requestID',
        outlet: 'Superout',
        loadChildren: '../../../employee/trade-request-approve/trade-request-approve.module#TradeRequestApproveModule',
      },
      {
        path: 'ViewTradeRequest/TradeRequestDetails/:requestID',
        outlet: 'Superout',
        loadChildren: '../../../employee/trade-request-details/trade-request-details.module#TradeRequestDetailsModule',
      },
      {
        path: 'TradeRequestsFromEmployees',
        outlet: 'Superout',
        loadChildren: '../../../manager/people/trade-requestsfrom-employees/trade-requestfrom-employees.module#TradeRequestfromEmployeesModule',
      },
      {
        path: 'TradeRequestsFromEmployees/TradeRequestAction/:requestID',
        outlet: 'Superout',
        loadChildren: '../../../manager/people/trade-request-action/trade-request-action.module#TradeRequestActionModule',
      },
      {
        path: 'TradeRequestsFromEmployees/TradeRequestDetails/:requestID',
        outlet: 'Superout',
        loadChildren: '../../../manager/people/trade-request-details/trade-request-details.module#TradeRequestDetailsModule',
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
  declarations: [SupervisorDashboardComponent],
  exports: [SupervisorDashboardComponent]
})
export class SupervisorDashboardModule { }
