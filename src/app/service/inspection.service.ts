import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConectionSettings } from './ConnectionSetting';
@Injectable({
  providedIn: 'root'
})
export class InspectionService {

  constructor(private http: HttpClient) { }
  getTemplateName(empkey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getTemplates?employeekey=' + empkey + '&OrganizationID=' + orgID);
  }
  getAuditorName(empKey, orgID) {
    return this
      .http
      // .get(ConectionSettings.Url + '/supervisorname?employeekey=' + empKey + '&OrganizationID=' + orgID);
      .get(ConectionSettings.Url + '/supervisorname_SuType?employeekey=' + empKey + '&OrganizationID=' + orgID);
  }
  getEmployeeName(empKey, orgID) {
    return this
      .http
      // .get(ConectionSettings.Url + '/allemployees?empkey=' + empKey + '&OrganizationID=' + orgID);
      .get(ConectionSettings.Url + '/allemployees_SuType?empkey=' + empKey + '&OrganizationID=' + orgID);
  }
  getBuildingName(empKey, orgID) {
    return this
      .http
      // .get(ConectionSettings.Url + '/allfacility?empkey=' + empKey + '&OrganizationID=' + orgID);
      .get(ConectionSettings.Url + '/allfacility_SuType?empkey=' + empKey + '&OrganizationID=' + orgID);
  }
  getallFloorNames(key, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/domainvaluesByKey?domain=facilityOnly' + '&key=' + key + '&OrganizationID=' + orgID);
  }
  getallZones(fkey, flkey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/zoneByFacility_Floor?fkey=' + fkey + '&floorkey=' + flkey + '&OrganizationID=' + orgID);
  }
  getallRooms(fkey, flkey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/roomByFacility_Floor?fkey=' + fkey + '&floorkey=' + flkey + '&OrganizationID=' + orgID);
  }
  getallRoomType(fkey, flkey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/roomtypeByFacility_Floor?fkey=' + fkey + '&floorkey=' + flkey + '&OrganizationID=' + orgID);
  }
  getScoreTypeList(orgID) {
    return this
      .http
      // .get(ConectionSettings.Url + '/scoringtype?OrganizationID=' + orgID);
      .get(ConectionSettings.Url + '/scoringtype_SuType?OrganizationID=' + orgID);
  }
  createInspectionTemplate(ScoreTypeKey, InspTempName, QustArry, empKey, orgID) {
    const url = ConectionSettings.Url + '/addTemplatequestion';
    const obj = {
      scoringTypeKey: ScoreTypeKey,
      question: QustArry,
      templatename: InspTempName,
      employeekey: empKey,
      OrganizationID: orgID
    };
    return this
      .http
      .post(url, obj);
  }
  createInspections(TemplateID, SupervisorKey, fromdate, todate, theCheckbox, time, RoomKey, employee, empKey, orgID, full_time) {
    const url = ConectionSettings.Url + '/addInspectionOrderwithRecurring';
    const obj = {
      templateID: TemplateID,
      supervisorKey: SupervisorKey,
      inspectionFromDate: fromdate,
      inspectionToDate: todate,
      isRecurring: theCheckbox,
      inspectiontime: time,
      roomKey: RoomKey,
      OrganizationID: orgID,
      empkey: employee,
      metaUpdatedBy: empKey,
      fulltime: full_time
    };
    return this
      .http
      .post(url, obj);
  }
  getTemplateNameList(empKey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getTempDetailsForDropdown?employeekey=' + empKey + '&OrganizationID=' + orgID);
  }
  getInspectionTemplateTable(key, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getTemplateFilterByTemplateID?key=' + key + '&OrganizationID=' + orgID);
  }
  DeleteInspectionTemplate(templateID, templateQuestionID, empKey, orgID) {
    const url = ConectionSettings.Url + '/deleteInspectionTemplateQuestions';
    const obj = {
      templateID: templateID,
      templateQuestionID: templateQuestionID,
      updatedBy: empKey,
      OrganizationID: orgID
    };
    return this
      .http
      .post(url, obj);
  }
  getInspectionTemplateDetails(page, itemsCount, empKey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getTemplateDetails?pageno=' + page + '&itemsPerPage=' + itemsCount + '&empkey=' + empKey + '&OrganizationID=' + orgID);

  }
  getInspectionOrderTablewithFromCurrentDateFilter(curr_date, page, itemsCount, empKey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/viewInspection?pageno=' + page + '&itemsPerPage=' + itemsCount + '&inspectionDate=' + curr_date + '&employeekey=' + empKey + '&OrganizationID=' + orgID);
  }
  getInspectionOrderTablewithFromDateandToDateFilter(date1, date2, empKey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/viewAllInspectionByDates?search_DT=' + date1 + '&search_DT2=' + date2 + '&employeekey=' + empKey + '&OrganizationID=' + orgID);
  }
  getInspectionOrderTablewithFromDateOnly(date1, page, itemsCount, empKey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/viewInspection?pageno=' + page + '&itemsPerPage=' + itemsCount + '&inspectionDate=' + date1 + '&employeekey=' + empKey + '&OrganizationID=' + orgID);
  }
  DeleteTemplate(templateID, empKey, orgID) {
    const url = ConectionSettings.Url + '/deleteInspectionTemplate';
    const obj = {
      templateID: templateID,
      updatedBy: empKey,
      OrganizationID: orgID
    };
    return this
      .http
      .post(url, obj);
  }
  SearchTemplate(searchMytemp, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/searchMytemplate?OrganizationID=' + orgID + '&searchMytemp=' + searchMytemp)
  }
  SearchTempNameandQuestion(searchMytemp, TemplateID, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/searchtemplateQun?OrganizationID=' + orgID + '&searchMytemp=' + searchMytemp + '&TemplateID=' + TemplateID)
  }
  SearchTemplateandLocation(SearchValue, search_DT, search_DT2, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/searchInspectionOrder?OrganizationID=' + orgID + '&searchLocation=' + SearchValue + '&search_DT=' + search_DT + '&search_DT2=' + search_DT2)
  }
  getViewInspectionManager(ioKey, OrgId) {
    return this
      .http
      .get(ConectionSettings.Url + '/getinspectionDetails?inspectionorder=' + ioKey + '&OrganizationID=' + OrgId)
  }
  InspectionDetails(Insp_Key, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getInspectionorder?InspectionorderKey=' + Insp_Key + "&OrganizationID=" + orgID);
  }
  templateQuestionService(templateId, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getTemplateQuestions?templateId=' + templateId + "&OrganizationID=" + orgID);
  }
  InspectionSaveService(inspectionDetail) {
    const url = ConectionSettings.Url + '/websaveinspectedQuestions';

    return this
      .http
      .post(url, inspectionDetail).subscribe(res => console.log('Done'));
  }
  inspectionCompletedService(inspectionDetail1) {
    const url = ConectionSettings.Url + '/inspectionCompleted';

    return this
      .http
      .post(url, inspectionDetail1);
  }
  updateEditedTemplateQuestion(obj) {
    const url = ConectionSettings.Url + '/updateEditedTemplateQuestion';
    return this
      .http
      .post(url, obj);
  }
  insertEditedTemplateQuestion(obj) {
    const url = ConectionSettings.Url + '/insertEditedTemplateQuestion';
    return this
      .http
      .post(url, obj);
  }
  updateTemplateDetails(templatename, tempEditid, OrganizationID, ScoreTypeKey) {
    return this
      .http
      .get(ConectionSettings.Url + '/updateTemplateDetails?templatename=' + templatename + '&tempEditid=' + tempEditid + '&OrganizationID=' + OrganizationID + '&ScoreTypeKey=' + ScoreTypeKey);

  }
  getTemplateQuestionsEditDetails(templateid, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getTemplateQuestionsEditDetails?templateid=' + templateid + '&OrganizationID=' + OrganizationID);

  }
  deleteSelectedTemplateQuestion(templateID, OrganizationID) {

    const url = ConectionSettings.Url + '/deleteSelectedTemplateQuestion';
    const obj = {
      templateID: templateID,
      OrganizationID: OrganizationID
    }
    return this
      .http
      .post(url, obj);
  }
  getTemplateEditDetails(templateid, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getTemplateEditDetails?templateid=' + templateid + '&OrganizationID=' + OrganizationID);
  }
  scoringtype(OrganizationID) {
    return this
      .http
      // .get(ConectionSettings.Url + '/scoringtype?OrganizationID=' + OrganizationID);
      .get(ConectionSettings.Url + '/scoringtype_SuType?OrganizationID=' + OrganizationID);

  }
  checkforInspectionOnTemplate(templateid, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkforInspectionOnTemplate?templateid=' + templateid + '&OrganizationID=' + OrganizationID);
  }
  updateEditInspection(TemplateName, TemplateID, ScoreTypeKey, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/updateEditInspection?TemplateName=' + TemplateName + '&TemplateID=' + TemplateID + '&ScoreTypeKey=' + ScoreTypeKey + '&OrganizationID=' + OrganizationID);

  }
  SearchTemplateandLocationbysuprvsr(SearchValue, orgid, toservempkey, newdate) {
    return this
      .http
      .get(ConectionSettings.Url + '/searchinspection?searchWO=' + SearchValue + '&OrganizationID=' + orgid + '&toServeremployeekey=' + toservempkey + '&today_DT=' + newdate);

  }
  getInspectionOrderTablewithCurrentDatefrsprvsr(curr_date, toservempkey, orgid) {
    return this
      .http
      .get(ConectionSettings.Url + '/getSupervisorInspectionView_WEB?to_date=' + curr_date + '&employeekey=' + toservempkey + '&OrganizationID=' + orgid);

  }
  checkforTemplate(InspTempName, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkForTemplate?templateName=' + InspTempName + '&OrganizationID=' + OrganizationID);
  }
  roomByFacility_Floor_Zone_RoomType(fac_key, floor, zone, roomtype, Oid) {
    return this
      .http
      // tslint:disable-next-line:max-line-length
      .get(ConectionSettings.Url + '/roomByFacility_Floor_Zone_RoomType?fkey=' + fac_key + "&floorkey=" + floor + "&zonekey=" + zone + "&roomtype=" + roomtype + "&OrganizationID=" + Oid);
  }
  roomByFacility_Floor_RoomType(fac_key, floor, roomtype, Oid) {
    return this
      .http
      // tslint:disable-next-line:max-line-length
      .get(ConectionSettings.Url + '/roomByFacility_Floor_RoomType?fkey=' + fac_key + "&floorkey=" + floor + "&roomtype=" + roomtype + "&OrganizationID=" + Oid);
  }
  roomByFacility_Zone_RoomType(fac_key, zone, roomtype, Oid) {
    return this
      .http
      // tslint:disable-next-line:max-line-length
      .get(ConectionSettings.Url + '/roomByFacility_Zone_RoomType?fkey=' + fac_key + "&zonekey=" + zone + "&roomtype=" + roomtype + "&OrganizationID=" + Oid);

  }
  roomByFacility_RoomType(fac_key, roomtype, Oid) {
    return this
      .http
      // tslint:disable-next-line:max-line-length
      .get(ConectionSettings.Url + '/roomByFacility_RoomType?fkey=' + fac_key + "&roomtype=" + roomtype + "&OrganizationID=" + Oid);

  }
  roomtypeByFacility_Floor_zone(fac_key, floor_key, zonekey, Oid) {
    return this
      .http
      // tslint:disable-next-line:whitespace
      // tslint:disable-next-line:max-line-length
      .get(ConectionSettings.Url + '/roomtypeByFacility_Floor_zone?fkey=' + fac_key + '&floorkey=' + floor_key + ' &zonekey=' + zonekey + ' &OrganizationID= ' + Oid);
  }
  roomByFacility_Floor_zone(fac_key, floor_key, zonekey, Oid) {
    return this
      .http
      // tslint:disable-next-line:max-line-length
      .get(ConectionSettings.Url + '/roomByFacility_Floor_zone?fkey=' + fac_key + '&floorkey=' + floor_key + '&zonekey=' + zonekey + '&OrganizationID=' + Oid);

  }
  roomtypeByFacility_Zone(fac_key, zonekey, Oid) {
    return this
      .http
      // tslint:disable-next-line:max-line-length
      .get(ConectionSettings.Url + '/roomtypeByFacility_Zone?fkey=' + fac_key + '&zonekey=' + zonekey + '&OrganizationID=' + Oid);

  }
  roomByFacility_Zone(fac_key, zonekey, Oid) {
    return this
      .http
      // tslint:disable-next-line:max-line-length
      .get(ConectionSettings.Url + '/roomByFacility_Zone?fkey=' + fac_key + "&zonekey=" + zonekey + "&OrganizationID=" + Oid);

  }
  emailForInspectionComp(inspectionAssignEmp, employeekey, OrganizationID) {//varun-> email id for employee and auditor;
    return this
      .http
      .get(ConectionSettings.Url + '/emailForInspectionComp?inspectionAssignEmp=' + inspectionAssignEmp + "&employeekey=" + employeekey + "&OrganizationID=" + OrganizationID);
  }
  getInspectionDetailsForEmail(inspKey, OrganizationID) {// inspection detail  for Email
    return this
      .http
      .get(ConectionSettings.Url + '/getInspectionDetailsForEmail?inspectionorderKey=' + inspKey + "&OrganizationID=" + OrganizationID);
  }
  delete_InspectionOrder(obj) {
    const url = ConectionSettings.Url + '/deleteInspectionOrders';
    return this
      .http
      .post(url, obj);
  }
  // @Rodney starts
  getFeedbackTemplateQuestionsEditDetails(orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getFeedbackTemplateQuestionsEditDetails?OrganizationID=' + orgID);
  }

  deleteSelectedFeedbackQuestion(id, empKey, orgID) {
    const url = ConectionSettings.Url + '/deleteSelectedFeedbackQuestion';
    const obj = {
      templateQuestionID: id,
      updatedBy: empKey,
      OrganizationID: orgID
    };
    return this
      .http
      .post(url, obj);
  }

  createMasterReviewTempalte(empKey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/createMasterReviewTempalte?OrganizationID=' + orgID + "&employeekey=" + empKey);
  }

  insertFeedbackQuestion(obj) {
    const url = ConectionSettings.Url + '/insertFeedbackQuestion';
    return this
      .http
      .post(url, obj);
  }

  getEmployeeNameForAuditReport(empKey, orgID) {
    return this
      .http
      // .get(ConectionSettings.Url + '/allemployees?empkey=' + empKey + '&OrganizationID=' + orgID);
      .get(ConectionSettings.Url + '/allemployeesForAuditReport_SuType?empkey=' + empKey + '&OrganizationID=' + orgID);
  }

  //picklist
  getTemplateNameForPicklistReport(empkey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getTemplateNameForPicklistReport?employeekey=' + empkey + '&OrganizationID=' + orgID);
  }

  getPickListValues(orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getPickValuesListForInspection?OrganizationID=' + orgID);
  }
  // @Rodney ends
}

