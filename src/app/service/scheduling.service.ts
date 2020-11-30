import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConectionSettings } from './ConnectionSetting';

@Injectable({
  providedIn: 'root'
})
export class SchedulingService {

  constructor(private http: HttpClient) { }

  getAllSchedulingNames(empkey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getBatchScheduleName?empkey=' + empkey + '&OrganizationID=' + orgID);
  }
  deleteScheduledRoomslist(delete_scheduledroom) {
    const url = ConectionSettings.Url + '/deleteScheduledRoomslistbyscheduleroomid';
    return this
      .http
      .post(url, delete_scheduledroom);
  }
  getSchedulingDetails(scheduleKey, empkey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getBatchScheduleMasterDetailService?batchschedulenamekey=' + scheduleKey + '&employeekey=' + empkey + '&OrganizationID=' + orgID);
  }

  getRoomDetailsForSchedule(scheduleKey, empkey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/roomsForCreateBatchSchedule?BatchScheduleNameKey=' + scheduleKey + '&employeekey=' + empkey + '&OrganizationID=' + orgID);
  }

  getRoomofTempTableDetailsForSchedule(scheduleKey, empkey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/roomstempForCreateBatchSchedule?BatchScheduleNameKey=' + scheduleKey + '&employeekey=' + empkey + '&OrganizationID=' + orgID);
  }

  getAllWorkOrders(empkey, orgID) {
    return this
      .http
      // .get(ConectionSettings.Url + '/allWorkordertype?empkey=' + empkey + '&OrganizationID=' + orgID);
      .get(ConectionSettings.Url + '/allWorkordertype_SuType?employeekey=' + empkey + '&OrganizationID=' + orgID);
  }
  getallworkorderType(emp_key, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/allWorkOrderTypeWithOutQuick?empkey=' + emp_key + '&OrganizationID=' + org_id);
  }
  setUpdateScheduleReport(scheduleUpdate) {

    const url = ConectionSettings.Url + "/updateScheduleReport";
    return this.http.post(url, scheduleUpdate);
  }

  setInsertScheduleReport(scheduleInsert) {

    const url = ConectionSettings.Url + "/saveScheduleReport";
    return this.http.post(url, scheduleInsert);
  }

  getAllBatchScheduleNames(page, itemsPerPage, empkey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/viewScheduleNameList?pageno=' + page + '&itemsPerPage=' + itemsPerPage + '&managerkey=' + empkey + '&OrganizationID=' + orgID);
  }

  searchBatchScheduleName(SearchValue, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/searchScheduleName?searchSchedule=' + SearchValue + '&OrganizationID=' + orgID);
  }

  getAllEmpList(empkey, orgID) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/employeeForManager?empkey=' + empkey + '&OrganizationID=' + orgID);

    return this
      .http
      .get(ConectionSettings.Url + '/employeeForManager_SuType?empkey=' + empkey + '&OrganizationID=' + orgID);
  }

  checkScheduleName(scheduleName, empkey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkForNewScheduleName?bkey=' + scheduleName + '&employeekey=' + empkey + '&OrganizationID=' + orgID);
  }

  addScheduleName(scheduleName, MasterShiftID, empKey, scheduleDescription, startTime, endTime, Date, EMPloyeeKey, OrgID) {

    const url = ConectionSettings.Url + "/addnewbatchName";
    const obj = {
      BatchSchduleName: scheduleName,
      ScheduleDescription: scheduleDescription,
      masterShiftID: MasterShiftID,
      EmployeeKey: empKey,
      startTime: startTime,
      endTime: endTime,
      Date: Date,
      employeekey: EMPloyeeKey,
      OrganizationID: OrgID
    }
    return this.http.post(url, obj);
  }

  getSchedulingRoomList(scheduleKey, orgID, building, floor, zone, roomtype, room, floortype) {
    const url = ConectionSettings.Url + "/getscheduledroomsbybatchschedulename";
    const obj = {
      batchschedulenamekey: scheduleKey,
      OrganizationID: orgID,
      build: building,
      flr: floor,
      zone: zone,
      rmtype: roomtype,
      room: room,
      flrtyp: floortype
    }
    return this.http.post(url, obj);
  }

  getAllOtherRoomList(scheduleKey, orgID, pageno, itemsPerPage) {
    return this
      .http
      .get(ConectionSettings.Url + '/getScheduleRoomslistByBatchScheduleNamekey?batchschedulenamekey=' + scheduleKey + '&OrganizationID=' + orgID + '&pageno=' + pageno + '&itemsperpage=' + itemsPerPage);
  }


  addRoomToSchedule(BatchScheduleNameKey, addRoomString, employeekey, OrgID) {

    const url = ConectionSettings.Url + "/addRoomInWorkOrder";
    const obj = {
      empkey: employeekey,
      wkey: BatchScheduleNameKey,
      rkey: addRoomString,
      OrganizationID: OrgID
    }
    return this.http.post(url, obj);
  }

  getScheduleDetailsbyID(scheduleKey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getScheduleById?bkey=' + scheduleKey + '&OrganizationID=' + orgID);
  }

  assignChangesForWO(scheduleDT, employeekey, orgID, EmpKey, scheduleNameKey, ScheduleDescription) {
    return this
      .http
      .get(ConectionSettings.Url + '/assignChangesForWork?managerkey=' + employeekey + '&empkey=' + EmpKey + '&batchkey=' + scheduleNameKey + '&batchdesp=' + ScheduleDescription + '&OrganizationID=' + orgID + '&date1=' + scheduleDT);
  }

  checkForNewScheduleName(EmpKey, orgID, BatchSchduleName) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkForNewScheduleName?bkey=' + BatchSchduleName + '&employeekey=' + EmpKey + '&OrganizationID=' + orgID);
  }

  updateScheduleNameDetails(employeeKey, OrgID, BatchscheduleName, empKey, scheduleNameKey, ScheduleDescription, startTime, endTime, shiftID) {

    const url = ConectionSettings.Url + "/updateScheduleName";
    const obj = {
      BatchSchduleName: BatchscheduleName,
      ScheduleDescription: ScheduleDescription,
      EmployeeKey: empKey,
      bskey: scheduleNameKey,
      employeekey: employeeKey,
      OrganizationID: OrgID,
      startTime: startTime,
      endTime: endTime,
      shiftKey: shiftID
    }
    return this.http.post(url, obj);
  }

  getfloorType_facilityfloor(floor, building, zone, roomtype, OrgID) {

    const url = ConectionSettings.Url + "/getfloorTypeValue";
    const obj = {
      FacilityKey: building,
      FloorKey: floor,
      ZoneKey: zone,
      RoomTypeKey: roomtype,
      OrganizationID: OrgID
    }
    return this.http.post(url, obj);
  }

  getAllRoomFilterList(BatchScheduleNameKey, OrgID,
    bldgKey, flrKey, zKey, rTypeKey, rKey, flrTypeKey) {

    const url = ConectionSettings.Url + "/viewFilterRoomsforScheduleroom";
    const obj = {
      batchschedulenamekey: BatchScheduleNameKey,
      searchtype: 'filter',
      searchname: null,
      facilitykey: bldgKey,
      floorkey: flrKey,
      zonekey: zKey,
      roomkey: rKey,
      roomTypeKey: rTypeKey,
      floortypekey: flrTypeKey,
      OrganizationID: OrgID
    }
    return this.http.post(url, obj);
  }

  //for edit from assignment schedule view
  saveEmployeeChange(employeeKey, OrgID, BatchscheduleName, empKey, scheduleNameKey, ScheduleDescription, scheduleDT) {
    const url = ConectionSettings.Url + "/saveEmployeechange";
    const obj = {
      BatchSchduleName: BatchscheduleName,
      ScheduleDescription: ScheduleDescription,
      EmployeeKey: empKey,
      bskey: scheduleNameKey,
      employeekey: employeeKey,
      OrganizationID: OrgID,
      ScheduleDT: scheduleDT
    }
    return this.http.post(url, obj);
  }

  //for delete assignment schedulename

  deleteAssignmentName(BatchScheduleNameKey, EmpKey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/deleteScheduleName?employeekey=' + EmpKey + '&batchschedulenamekey=' + BatchScheduleNameKey + '&OrganizationID=' + orgID);
  }

  getallworkorderTypeNew(emp_key, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/allWorkOrderTypeWithOutQuickNew?empkey=' + emp_key + '&OrganizationID=' + org_id);
  }
  //Pooja's code starts
  // createEmpShiftwithColourCode(Description, Abbrevation, publishas, newTime1, paidhours, newTime2, color, OrganizationID, employeekey) {
  createEmpShiftwithColourCode(empschobj) {
    const url = ConectionSettings.Url + "/saveEmployeeShift";
    // const obj = {
    //   desc: Description,
    // abbr: Abbrevation,
    // publishas: publishas,
    // time1: newTime1,
    // paidhours: paidhours,
    // time2: newTime2,
    // color: color,
    //   orgid: OrganizationID,
    //   empkey: employeekey
    // }
    return this.http.post(url, empschobj);
  }

  getShifts(employeekey, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getEmployeeShifts?empkey=' + employeekey + '&OrgID=' + OrganizationID);
  }
  removeEmployeeShift(delete_shiftKey, employeekey, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/removeEmployeeShift?dltkey=' + delete_shiftKey + '&empkey=' + employeekey + '&OrgID=' + OrganizationID);
  }

  getShiftsforEditing(shiftk$, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getShiftsforEditing?shiftkey=' + shiftk$ + '&OrgID=' + OrganizationID);
  }
  updateShiftDetails(empschobj) {
    const url = ConectionSettings.Url + "/updateEmployeeShiftDetails";
    // const obj = {
    //   shiftkey: shiftk,
    //   desc: Description,
    //   // abbr: Abbrevation,
    //   // publishas: PublishAs,
    //   // time1: newTime,
    //   // paidhours: PaidHours,
    //   // time2: newTime1,
    //   // color: Colour,
    //   orgid: OrganizationID,
    //   empkey: employeekey
    // }
    return this.http.post(url, empschobj);
  }
  //Pooja's code ends

  //varun code starts
  employeesForScheduler(groupID, empkey, orgID) {
    // return this
    //   .http
    // .get(ConectionSettings.Url + '/employeesForScheduler?groupID=' + groupID + '&empkey=' + empkey + '&OrganizationID=' + orgID);
    return this
      .http
      .get(ConectionSettings.Url + '/employeesForScheduler_SuType?groupID=' + groupID + '&empkey=' + empkey + '&OrganizationID=' + orgID);
  }
  SchedulerEventCreate(obj) {
    const url = ConectionSettings.Url + "/SchedulerEventCreate";
    return this.http.post(url, obj);
  }
  SchedulerEventUpdate(obj) {
    const url = ConectionSettings.Url + "/SchedulerEventUpdate";
    return this.http.post(url, obj);
  }
  SchedulerEventDelete(Assignment_CalenderID, empkey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/SchedulerEventDelete?Assignment_CalenderID=' + Assignment_CalenderID + '&empkey=' + empkey + '&OrganizationID=' + orgID);
  }
  scheduleEventCheckForCreate(checkDate, empKey, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/scheduleEventCheckForCreate?checkDate=' + checkDate + '&empKey=' + empKey + '&OrganizationID=' + OrganizationID);
  }
  SchedulerEmployeeGroups(empKey, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/SchedulerEmployeeGroups?empKey=' + empKey + '&OrganizationID=' + OrganizationID);
  }
  SchedulerTimeRangeCheck(ScheduleNameKey, Date, empKey, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/SchedulerTimeRangeCheck?ScheduleNameKey=' + ScheduleNameKey + '&Date=' + Date + '&empKey=' + empKey + '&OrganizationID=' + OrganizationID);
  }
  SchedulerWorkingOffCheck(Date, empKey, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/SchedulerWorkingOffCheck?Date=' + Date + '&empKey=' + empKey + '&OrganizationID=' + OrganizationID);
  }
  getEmpSchedulerStartDate() {
    return this
      .http
      .get(ConectionSettings.Url + '/getEmpSchedulerStartDate');
  }
  //varun code ends

  // @Author:Rodney starts

  empCalendarDetails(dateRange, startDate, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/employeeCalendarDetailsForScheduler?dateRange=' + dateRange + '&startDate=' + startDate + '&OrganizationID=' + OrgID);
  }
  empCalendarDetailsForViewOnly(empkey, dateRange, startDate, endDate, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/employeeCalendarDetailsForSchedulerOnlyForView?dateRange=' + dateRange + '&startDate=' + startDate + '&endDate=' + endDate + '&empKey=' + empkey + '&OrganizationID=' + OrgID);
  }
  employeesViewOnlyForScheduler(empkey, orgID) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/employeesViewOnlyForScheduler?empkey=' + empkey + '&OrganizationID=' + orgID);

    return this
      .http
      .get(ConectionSettings.Url + '/employeesViewOnlyForScheduler_SuType?empkey=' + empkey + '&OrganizationID=' + orgID);
  }

  checkForEmpGrpDuplicate(groupName, orgID) {
    return this.
      http.
      get(ConectionSettings.Url + '/checkForEmpGrpDuplicate?groupname=' + groupName + '&OrganizationID=' + orgID);
  }
  SchedulerEmployeeGroups_EmpView(groupID, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/SchedulerEmployeeGroups_EmpView?grpID=' + groupID + '&OrganizationID=' + OrganizationID);
  }
  getEmployeesForSchedulerReport(OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getAllEmployeesForSchedulerReport?OrganizationID=' + OrganizationID);
  }
  getEmployeesofEmpGroup(GroupID, OrganizationID) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/getAllEmployeesofGroupForSchedulerReport?groupID=' + GroupID + '&OrganizationID=' + OrganizationID);
    return this
      .http
      .get(ConectionSettings.Url + '/getAllEmployeesofGroupForSchedulerReport_SuType?groupID=' + GroupID + '&OrganizationID=' + OrganizationID);

  }
  SchedulerEmployeeGroupsForReport(OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/SchedulerEmployeeGroupsForReport?OrganizationID=' + OrganizationID);
  }

  generateSchedulerReport(fromdate, todate, groupID, empKeys, OrganizationID) {
    // const url = ConectionSettings.Url + "/generateSchedulerReport";
    const url = ConectionSettings.Url + "/generateSchedulerReport_SuType";
    const obj = {
      fromDate: fromdate,
      toDate: todate,
      groupId: groupID,
      empKey: empKeys,
      organizationID: OrganizationID
    }
    return this.http.post(url, obj);
  }

  iteratedatesForReport(fromdate) {

    const url = ConectionSettings.Url + "/getIteratedDates";
    const obj = {
      fromdate: fromdate
      // todate: todate
    }
    return this.http.post(url, obj);

    // return this.
    //   http.get(ConectionSettings.Url + '/getIteratedDates?fromdate=' + fromdate + '&todate=' + todate);
  }

  deleteEmpFromEmpGroup(empID, orgid) {
    const url = ConectionSettings.Url + "/deleteEmpFromEmpGroup";
    const obj = {
      empKey: empID,
      orgID: orgid
    }
    return this.http.post(url, obj);

  }

  getAllEmployeesofEmpGroup(GroupID, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getAllEmployeesofGroupForSeniorityEdit?groupID=' + GroupID + '&OrganizationID=' + OrganizationID);
  }

  saveOrderChange(metauser, OrganizationID, empKey, orderVal) {
    return this
      .http
      .get(ConectionSettings.Url + '/updateEmployeeSeniorityORder?empKey=' + empKey + '&orderVal=' + orderVal + '&metauser=' + metauser + '&OrganizationID=' + OrganizationID);

  }
  getAllEmployeesForSchedulerReport(OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getEmployeesForSchedulerReport?OrganizationID=' + OrganizationID);
  }

  checkNewShift(shiftName, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkMasterShiftsForDuplicate?shiftName=' + shiftName + '&OrganizationID=' + OrganizationID);
  }
  createMasterShifts(newshiftName, employeekey, OrganizationID) {
    const url = ConectionSettings.Url + "/createMasterShift";
    const obj = {
      shiftName: newshiftName,
      empKey: employeekey,
      orgID: OrganizationID
    }
    return this.http.post(url, obj);
  }

  removeMasterShifts(shiftkey, empKey, orgID) {
    const url = ConectionSettings.Url + "/removeMasterShift";
    const obj = {
      shiftKey: shiftkey,
      empKey: empKey,
      orgID: orgID
    }
    return this.http.post(url, obj);
  }

  getMasterShiftDetails(shiftKey, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getMasterShiftDetailsForEdit?shiftKey=' + shiftKey + '&OrganizationID=' + OrganizationID);
  }

  udpateMasterShiftDetails(shiftkey, shiftname, empKey, orgID) {
    const url = ConectionSettings.Url + "/updateMasterShift";
    const obj = {
      shiftKey: shiftkey,
      shiftName: shiftname,
      empKey: empKey,
      orgID: orgID
    }
    return this.http.post(url, obj);
  }

  checkForDuplicateMasterShiftName(shiftkey, shiftname, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkForDuplicateMasterShiftName?shiftkey=' + shiftkey + '&shiftname=' + shiftname + '&orgID=' + orgID);
  }

  createSchedulerCronjob(orgID, curDate, empKey) {
    const url = ConectionSettings.Url + "/createManualSchedulerCronjob";
    const obj = {
      curDate: curDate,
      empKey: empKey,
      orgID: orgID
    }
    return this.http.post(url, obj);
  }

  deleteSchedulerCronjob(orgID, curDate, empKey) {
    const url = ConectionSettings.Url + "/deleteManualSchedulerCronjob";
    const obj = {
      curDate: curDate,
      empKey: empKey,
      orgID: orgID
    }
    return this.http.post(url, obj);
  }

  getCountForDelete(orgID, curDate) {
    return this
      .http
      .get(ConectionSettings.Url + '/getItemCountsForDeleting?orgID=' + orgID + '&curDate=' + curDate);
  }

  rowFiltering(searchtext, eventsOnly, range, todaydate, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/employeesrowFiltering?groupID=Manager' + '&searchtext=' + searchtext + '&eventsOnly=' + eventsOnly
        + '&range=' + range + '&todaydate=' + todaydate + '&OrganizationID=' + orgID);
  }
  // @Author:Rodney ends

  // @Author:Prakash code starts here
  getCountForAssignmentManualCronjob(orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getCountForAssignmentManualCronjob?orgID=' + orgID);
  }
  getCountForAssignmentManualCronjobnextdate(orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getCountForAssignmentManualCronjobnextdate?orgID=' + orgID);
  }
  getCountForAssignmentManualcreatecheck(curDate, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getCountForAssignmentManualcreatecheck?orgID=' + orgID + '&curDate=' + curDate);
  }
  // @Author:Prakash code ends here

}
