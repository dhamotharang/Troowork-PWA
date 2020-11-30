import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ManagerDashBoardComponent } from './manager-dash-board.component';

import { ExpiredAssignmentsDetailsModule } from "../../../dashboard/manager-dashboard-pages/expired-assignments-details/expired-assignments-details.module";

import { MDBBootstrapModule } from 'angular-bootstrap-md';

const routes: Routes = [
  {
    path: 'ManagerDashBoard',
    component: ManagerDashBoardComponent,// varun - superadmindashboard as parent component
    children: [ // varun- child components
      {
        path: 'Buildview',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/building-view/building-view.module#BuildingViewModule',

      },
      {
        path: 'welcomePage',
        outlet: 'ManagerOut',
        loadChildren: '../../user-welcome-pages/welcomepage/welcomepage.module#WelcomepageModule',

      },
      {
        path: 'Buildview/Createbuilding',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/createbuilding/createbuilding.module#CreatebuildingModule',

      },
      {
        path: 'Buildview/Buildedit/:Facility_Key',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/building-edit/building-edit.module#BuildingEditModule',

      },
      {
        path: 'FloorView',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/floor-view/floor-view.module#FloorViewModule',

      },
      {
        path: 'FloorView/FloorCreate',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/floor-create/floor-create.module#FloorCreateModule',

      },
      {
        path: 'FloorView/Flooredit/:Floor_Key/:Facility_Key',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/floor-edit/floor-edit.module#FloorEditModule',

      },
      {
        path: 'ZoneView',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/zone-view/zone-view.module#ZoneViewModule',

      },
      {
        path: 'ZoneView/ZoneCreate',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/zone-create/zone-create.module#ZoneCreateModule',

      },
      {
        path: 'ZoneView/Zonedit/:Floor_Key/:Facility_Key/:Zone_Key',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/zone-edit/zone-edit.module#ZoneEditModule',

      },
      {
        path: 'roomView',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/room-view/room-view.module#RoomViewModule',

      },
      {
        path: 'roomView/RoomEdit/:RoomKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/room-edit/room-edit.module#RoomEditModule',

      },
      {
        path: 'roomView/RoomCreate',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/room-create/room-create.module#RoomCreateModule',

      },
      {
        path: 'roomView/RoomTypeView',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/room-type-view/room-type-view.module#RoomTypeViewModule',

      },
      {
        path: 'roomView/RoomTypeView/RoomTypeCreate',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/room-type-create/room-type-create.module#RoomTypeCreateModule',

      },
      {
        path: 'roomView/RoomTypeView/roomTypeEdit/:RoomTypeKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/room-type-update/room-type-update.module#RoomTypeUpdateModule',

      },
      {
        path: 'roomView/FloorTypeView',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/floor-type-view/floor-type-view.module#FloorTypeViewModule',

      },
      {
        path: 'roomView/FloorTypeView/FloorTypeCreate',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/floor-type-create/floor-type-create.module#FloorTypeCreateModule',

      },
      {
        path: 'roomView/FloorTypeView/FloorTypeEdit/:FloorTypeKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/floor-type-edit/floor-type-edit.module#FloorTypeEditModule',

      },
      {
        path: 'EquipmentView',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/equipment-view/equipment-view.module#EquipmentViewModule',

      },
      {
        path: 'EquipmentView/EquipmentCreate',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/equipment-create/equipment-create.module#EquipmentCreateModule',

      },
      {
        path: 'EquipmentView/EquipmentEdit/:EquipKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/equipment-edit/equipment-edit.module#EquipmentEditModule',

      },
      {
        path: 'EquipmentView/EquipmentTypeView',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/equipment-type-view/equipment-type-view.module#EquipmentTypeViewModule',

      },
      {
        path: 'EquipmentView/EquipmentTypeView/EquipmentTypeCreate',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/equipment-type-create/equipment-type-create.module#EquipmentTypeCreateModule',

      },
      {
        path: 'EquipmentView/EquipmentTypeView/EquipmentTypeEdit/:EquipTypeKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/equipment-type-edit/equipment-type-edit.module#EquipmentTypeEditModule',

      },
      {
        path: 'DepartmentView',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/department-view/department-view.module#DepartmentViewModule',

      },
      {
        path: 'DepartmentView/DepartmentCreate',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/department-create/department-create.module#DepartmentCreateModule',

      },
      {
        path: 'DepartmentView/departmentEdit/:DeptKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/department-edit/department-edit.module#DepartmentEditModule',

      },
      {
        path: 'InspectionCreate',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inspection/inspection-create/inspection-create.module#InspectionCreateModule',

      },
      {
        path: 'InspectionView',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inspection/inspection-view/inspection-view.module#InspectionViewModule',

      },
      {
        path: 'InspectionView/Managerinspectiontemplate/:InspectionOrderKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inspection/managerinspectiontemplate/managerinspectiontemplate.module#ManagerinspectiontemplateModule',

      },
      {
        path: 'ViewInspectionManager/:InspectionOrderKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inspection/viewinspectionmanager/viewinspectiomanager.module#ViewinspectiomanagerModule',

      },
      {
        path: 'InspectiontemplateCreate',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inspection/inspectiontemplate-create/inspectiontemplate-create.module#InspectiontemplateCreateModule',

      },
      {
        path: 'InspectiontemplateandquestionsView',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inspection/inspectiontemplateandquestions-view/inspectiontemplateandquestions-view.module#InspectiontemplateandquestionsViewModule',

      },
      {
        path: 'InspectiontemplateandquestionsView/InspectiontemplateEdit',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inspection/inspectiontemplate-edit/inspectiontemplate-edit.module#InspectiontemplateEditModule',

      },
      {
        path: 'InspectiontemplatedetailEdit/:TemplateID',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inspection/inspectiontemplatedetail-edit/inspectiontemplatedetail-edit.module#InspectiontemplatedetailEditModule',

      },
      {
        path: 'DocumentfolderView',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/documents/documentfolder-view/documentfolder-view.module#DocumentfolderViewModule',

      },
      {
        path: 'DocumentfolderView/NewdocumentfolderCreate',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/documents/newdocumentfolder-create/newdocumentfolder-create.module#NewdocumentfolderCreateModule',

      },
      {
        path: 'DocumentfolderView/DocumentfolderEdit/:FormtypeId',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/documents/documentfolder-edit/documentfolder-edit.module#DocumentfolderEditModule',

      },
      {
        path: 'DocumentsUpload',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/documents/documents-upload/documents-upload.module#DocumentsUploadModule',

      },
      {
        path: 'ViewDocuments',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/documents/view-documents/view-documents.module#ViewDocumentsModule',

      },
      {
        path: 'SchedulingView',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/scheduling/scheduling-view/scheduling-view.module#SchedulingViewModule',

      },
      {
        path: 'SchedulingView/CreateBatchWork',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/scheduling/create-batch-work/create-batch-work.module#CreateBatchWorkModule',

      },
      {
        path: 'SchedulingView/EditBatchWork/:scheduleNameKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/scheduling/edit-batch-work/edit-batch-work.module#EditBatchWorkModule',

      },
      {
        path: 'BatchScheduleRoom',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/scheduling/batch-schedule-room/batch-schedule-room.module#BatchScheduleRoomModule',

      },
      {
        path: 'editScheduleForReport/:scheduleKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/scheduling/edit-assignment-schedule-for-report/edit-assignment-schedule-for-report.module#EditAssignmentScheduleForReportModule',

      },
      {
        path: 'CreateBatchSchedule',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/scheduling/create-batch-schedule/create-batch-schedule.module#CreateBatchScheduleModule',

      },
      {
        path: 'WorkorderReport',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/reports/workorder-report/workorder-report.module#WorkorderReportModule',

      },
      {
        path: 'Batch-work-order-Report',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/reports/batch-work-order-report/batch-work-order-report.module#BatchWorkOrderReportModule',

      },
      {
        path: 'BatchScheduleAssignment',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/reports/batch-schedule-assignment-report/batch-schedule-assignment-report.module#BatchScheduleAssignmentReportModule',

      },
      {
        path: 'InspectionReport',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/reports/inspection-report/inspection-report.module#InspectionReportModule',

      },
      {
        path: 'BarcodeReport',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/reports/barcode-report/barcode-report.module#BarcodeReportModule',

      },
      {
        path: 'DashboardReport',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/reports/dashboard-report/dashboard-report.module#DashboardReportModule',

      },
      {
        path: 'CreateEmployee',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/people/create-employee/create-employee.module#CreateEmployeeModule',

      },
      {
        path: 'Settingusernameandpswrdaftremplcreatebyman/:EmployeeKey/:str/:UserRoleTypeKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/people/settingusernameandpswrdaftremplcreatebyman/settingusernameandpswrdafter.module#SettingusernameandpswrdafterModule',

      },
      {
        path: 'ViewEmployee',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/people/view-employee/view-employee.module#ViewEmployeeModule',

      },
      {
        path: 'ViewEmployee/EditEmployeedetails/:EmployeeKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/people/edit-employeedetails/edit-employeedetails.module#EditEmployeedetailsModule',

      },
      {
        path: 'MeetingTrainingCreate',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/people/meeting-training-create/meeting-training-create.module#MeetingTrainingCreateModule',

      },
      {
        path: 'MeetingTrainingView',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/people/meeting-training-view/meeting-training-view.module#MeetingTrainingViewModule',

      },
      {
        path: 'MeetingTrainingView/EventView',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/people/event-view/event-view.module#EventViewModule',

      },
      {
        path: 'MeetingTrainingView/viewEventEmployees/:EventKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/people/view-employeesof-event/view-employeesof-event.module#ViewEmployeesofEventModule',

      },
      {
        path: 'MeetingTrainingView/viewEventEmployees/:EventKey/MeetingTrainingEdit/:EventKey/:ActionKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/people/meeting-training-edit/meeting-training-edit.module#MeetingTrainingEditModule',

      },
      {
        path: 'JobTitileView',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/people/job-title-view/job-titile-view.module#JobTitileViewModule',

      },
      {
        path: 'JobTitileView/JobTitleAdd',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/people/job-title-add/job-titile-add.module#JobTitileAddModule',

      },
      {
        path: 'JobTitileView/JobTitleEdit/:JobTitle_Key',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/people/job-title-edit/job-titile-edit.module#JobTitileEditModule',

      },
      {
        path: 'manageLoginCredentials',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/people/manage-login-credentials/manage-login-credentials.module#ManageLoginCredentialsModule',

      },
      {
        path: 'manageLoginCredentials/resetPassword/:EmpKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/people/reset-pass-word/reset-pass-word.module#ResetPassWordModule',

      },
      {
        path: 'CreateWorkOrder',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/work-order/create-workorder/create-work-order.module#CreateWorkOrderModule',

      },
      {
        path: 'createQuickOrder',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/work-order/create-quick-order/create-quick-order.module#CreateQuickOrderModule',

      },
      {
        path: 'ViewWorkOrder',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/work-order/view-work-orders/view-work-orders.module#ViewWorkOrdersModule',

      },
      {
        path: 'ViewWorkOrder/EditWorkOrder/:WorkorderKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/work-order/edit-work-order/edit-work-order.module#EditWorkOrderModule',

      },
      {
        path: 'ViewWorkOrder/UpdateRecurWorkorder/:WorkorderKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/work-order/update-recur-workorder/update-recur-workorder.module#UpdateRecurWorkorderModule',

      },
      {
        path: 'CreateBatchWorkOrder',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/work-order/create-batch-workorder/create-batch-workorder.module#CreateBatchWorkorderModule',

      },
      {
        path: 'ViewBatchWorkorder',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/work-order/view-batch-workorder/view-batch-work-order.module#ViewBatchWorkOrderModule',

      },
      {
        path: 'ViewBatchWorkorder/EditBatchWorkorder/:WorkorderScheduleKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/work-order/edit-batch-workorder/edit-batch-work-order.module#EditBatchWorkOrderModule',

      },
      {
        path: 'WorkOrderType',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/work-order/work-order-type/work-order-type.module#WorkOrderTypeModule',

      },
      {
        path: 'WorkOrderType/CreateWorkorderType',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/work-order/create-workorder-type/create-work-order-type.module#CreateWorkOrderTypeModule',

      },
      {
        path: 'WorkOrderType/EditWorkorderType/:WorkorderTypeKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/work-order/edit-workorder-type/edit-work-order-type.module#EditWorkOrderTypeModule',

      },
      {
        path: 'managerMyProfile',
        outlet: 'ManagerOut',
        loadChildren: '../../user-profiles/manager-myprofile/manager-myprofile-component.module#ManagerMyprofileComponentModule',

      },
      {
        path: 'managerMyProfile/changePasswordManager/:EmployeeKey/:UserRoleName/:IsSupervisor',
        outlet: 'ManagerOut',
        loadChildren: '../../user-password-changes/manager-change-pass-word/manager-change-password.module#ManagerChangePasswordModule',

      },
      {
        path: 'changePasswordManager/:EmployeeKey/:UserRoleName/:IsSupervisor',
        outlet: 'ManagerOut',
        loadChildren: '../../user-password-changes/manager-change-pass-word/manager-change-password.module#ManagerChangePasswordModule',

      },
      {
        path: 'employeeDowntimeReport',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/reports/employees-downtime-report/employees-downtime-report.module#EmployeesDowntimeReportModule',

      },
      {
        path: 'inventoryReport',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/reports/inventory-report/inventory-report.module#InventoryReportModule',

      },
      {
        path: 'BarchartReport',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/reports/barchart-report/barchart-report.module#BarchartReportModule',

      },
      // {
      //   path: 'createshift',
      //   outlet: 'ManagerOut',
      //   loadChildren: '../../../manager/scheduling/createshift/createshift.module#CreateshiftModule',

      // },
      // {
      //   path: 'ViewShift',
      //   outlet: 'ManagerOut',
      //   loadChildren: '../../../manager/scheduling/viewshift/viewshift.module#ViewshiftModule',

      // },
      // {
      //   path: 'ViewShift/EditShift/:Idemployeeshift',
      //   outlet: 'ManagerOut',
      //   loadChildren: '../../../manager/scheduling/editshift/editshift.module#EditshiftModule',

      // },
      {
        path: 'Scheduler',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/people/schedulerNew/scheduler.module#SchedulerModule',
      },
      // {
      //   path: 'ViewSchedulerForEmployee',
      //   outlet: 'ManagerOut',
      //   loadChildren: '../../../manager/people/view-employee-scheduler/view-employee-scheduler.module#ViewEmployeeSchedulerModule',
      // },

      {
        path: 'RequestsFromEmployees',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/people/pto-requestsfrom-employees/ptorequestsfromemployees.module#PtorequestsfromemployeesModule',
      },
      {
        path: 'RequestsFromEmployees/PTORequestAction/:requestID',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/people/pto-request-action/pto-request-action.module#PtoRequestActionModule',
      },
      {
        path: 'TradeRequestsFromEmployees',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/people/trade-requestsfrom-employees/trade-requestfrom-employees.module#TradeRequestfromEmployeesModule',
      },
      {
        path: 'TradeRequestsFromEmployees/TradeRequestAction/:requestID',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/people/trade-request-action/trade-request-action.module#TradeRequestActionModule',
      },
      {
        path: 'ScheduleEmployee',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/people/view-employee-weekly-schedule/view-employee-weekly-schedule.module#ViewEmployeeWeeklyScheduleModule',
      },
      {
        path: 'ScheduleEmployee/ScheduleEmployeeDetail/:EmployeeKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/people/view-employee-weekly-schedule-detail/view-employee-weekly-schedule-detail.module#ViewEmployeeWeeklyScheduleDetailModule',
      },
      {
        path: 'EmployeeWorkingHourEmpListView/EmployeeWorkingHourList/:EmployeeKey/manualEmpOff/:EmployeeKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/people/manual-employee-leave/manual-employee-leave.module#ManualEmployeeLeaveModule',
      },
      {
        path: 'EmployeeWorkingHourEmpListView',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/people/employee-working-hour-emp-list-view/employee-working-hour-emp-list-view.module#EmployeeWorkingHourEmpListViewModule',
      },
      {
        path: 'EmployeeWorkingHourEmpListView/EmployeeWorkingHourList/:EmployeeKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/people/employee-working-hour-list/employee-working-hour-list.module#EmployeeWorkingHourListModule'
      },
      {
        path: 'EmployeeWorkingHourEmpListView/EmployeeWorkingHourList/:EmployeeKey/EmployeeWorkingHourAdd/:EmployeeKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/people/employee-working-hour-add/employee-working-hour-add.module#EmployeeWorkingHourAddModule',
      },
      {
        path: 'createshift',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/scheduling/createshift/createshift.module#CreateshiftModule',

      },
      {
        path: 'ViewShift',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/scheduling/viewshift/viewshift.module#ViewshiftModule',

      },
      {
        path: 'ViewShift/EditShift/:Idemployeeshift',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/scheduling/editshift/editshift.module#EditshiftModule',

      },
      {
        path: 'schedulerReport',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/reports/scheduler-report/scheduler-report.module#SchedulerReportModule',
      },
      {
        path: 'GenerateQRCode',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/generate-qr-code/generate-qr-code.module#GenerateQrCodeModule',

      },
      {
        path: 'GenerateQRCode/WOQRCodeView/:RoomKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/qr-code-view/qr-code-view.module#QrCodeViewModule'
      },
      {
        path: 'GenerateQRCode/FeedbackQRCodeView/:RoomKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/qr-code-view-feedback/qr-code-view-feedback.module#QrCodeViewFeedbackModule'
      },
      {
        path: 'GenerateQRCodeList',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/generate-qr-code-list/generate-qr-code-list.module#GenerateQrCodeListModule'
      },
      {
        path: 'QrCodeViewList/:QRCodeRoomKey/:checkvaluetag',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/qr-code-view-list/qr-code-view-list.module#QrCodeViewListModule'

      },
      {
        path: 'ViewServiceRequest',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/work-order/view-service-request/view-service-request.module#ViewServiceRequestModule',
      },
      {
        path: 'reviewReport',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/reports/review-report/review-report.module#ReviewReportModule',
      },
      {
        path: 'feedbackManage',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inspection/feedback-manage/feedback-manage.module#FeedbackManageModule',
      },
      {
        path: 'woprogressReport',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/reports/workorder-in-progress-report/workorder-in-progress-report.module#WorkorderInProgressReportModule',
      },
      {
        path: 'ViewShift/ViewGroupEmployees/:employeegroupID/:groupName',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/scheduling/view-employeesof-group/view-employeesof-group.module#ViewEmployeesofGroupModule'

      },
      {
        path: 'inspectionAuditReport',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/reports/inspection-audit-report/inspection-audit-report.module#InspectionAuditReportModule'

      },
      {
        path: 'viewMasterShifts',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/scheduling/view-master-shifts/view-master-shifts.module#ViewMasterShiftsModule'

      },
      {
        path: 'viewMasterShifts/CreateMasterShift',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/scheduling/create-master-shifts/create-master-shifts.module#CreateMasterShiftsModule'

      },
      {
        path: 'viewMasterShifts/masterShiftEdit/:masterShiftID',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/scheduling/edit-master-shifts/edit-master-shifts.module#EditMasterShiftsModule'

      },
      {
        path: 'ManualSchedulerCronjob',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/scheduling/scheduler-cronjob-manual/scheduler-cronjob-manual.module#SchedulerCronjobManualModule'

      },
      {
        path: 'viewIntervaltype',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/work-order/view-interval-types/view-interval-types.module#ViewIntervalTypesModule'

      },
      {
        path: 'viewIntervaltype/EditIntervalTypeColor/:intervalID',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/work-order/edit-interval-type-color/edit-interval-type-color.module#EditIntervalTypeColorModule'

      },
      {
        path: 'viewWORemainingDetails/:fromdt/:todt/:empKey/:wotypeKey/:empName/:wotypeName',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/reports/view-remaining-workorders-details/view-remaining-workorders-details.module#ViewRemainingWorkordersDetailsModule'

      },
      {
        path: 'picklistReport',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/reports/picklist-report/picklist-report.module#PicklistReportModule'

      },
      {
        path: 'inspectionDetailReport',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/reports/inspection-detailed-report/inspection-detailed-report.module#InspectionDetailedReportModule'
      },
      {
        path: 'GenerateQRCode/CleaningQRCodeView/:RoomKey',
        outlet: 'ManagerOut',
        loadChildren: '../../../manager/inventory/cleaning-qr-code-view/cleaning-qr-code-view.module#CleaningQrCodeViewModule'
      },

      {
        path: 'welcomePage/expiryNearDetails',
        outlet: 'ManagerOut',
        loadChildren: '../../../dashboard/manager-dashboard-pages/expiring-assignments-details/expiring-assignments-details.module#ExpiringAssignmentsDetailsModule'
      },
      {
        path: 'welcomePage/expiredDetails',
        outlet: 'ManagerOut',
        loadChildren: '../../../dashboard/manager-dashboard-pages/expired-assignments-details/expired-assignments-details.module#ExpiredAssignmentsDetailsModule'
      },

      {
        path: 'TradeRequestsFromEmployees/TradeRequestDetails/:requestID',
        outlet: 'ManagerOut',
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
    // NgMultiSelectDropDownModule.forRoot(),
  ],
  declarations: [ManagerDashBoardComponent],
  exports: [ManagerDashBoardComponent]
})
export class ManagerDashBoardModule { }
