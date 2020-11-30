import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConectionSettings } from './ConnectionSetting';

@Injectable({
  providedIn: 'root'
})
export class WorkOrderServiceService {

  constructor(private http: HttpClient) { }
  getallEmployee(emp_key, org_id) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/employeeForManager?empkey=' + emp_key + '&OrganizationID=' + org_id);
    return this
      .http
      .get(ConectionSettings.Url + '/employeeForManager_SuType?empkey=' + emp_key + '&OrganizationID=' + org_id);
  }
  getallFacility(empKey, orgID) {
    return this
      .http
      // .get(ConectionSettings.Url + '/allfacility?empkey=' + emp_key + '&OrganizationID=' + org_id);
      .get(ConectionSettings.Url + '/allfacility_SuType?empkey=' + empKey + '&OrganizationID=' + orgID);
  }
  getallPriority(org_id) {

    return this
      .http
      // .get(ConectionSettings.Url + '/allpriority?OrganizationID=' + org_id);
      .get(ConectionSettings.Url + '/allpriority_SuType?OrganizationID=' + org_id);
  }
  addQuickWorkOrder(obj) {
    const url = ConectionSettings.Url + '/addQuickworkorder';
    return this
      .http
      .post(url, obj);
  }
  getallEmployeeName(empKey, orgID) {
    return this
      .http
      // .get(ConectionSettings.Url + '/allemployees?empkey=' + emp_key + '&OrganizationID=' + org_id);
      .get(ConectionSettings.Url + '/allemployees_SuType?empkey=' + empKey + '&OrganizationID=' + orgID);
  }
  getallScheduleName(emp_key, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/getBatchScheduleName?empkey=' + emp_key + '&OrganizationID=' + org_id);
  }
  getallFloor(facilityName, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/domainvaluesByKey?domain=facilityOnly&key=' + facilityName + '&OrganizationID=' + org_id);
  }
  getzone_facilityfloor(floor, facility, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/zoneByFacility_Floor?fkey=' + facility + '&floorkey=' + floor + '&OrganizationID=' + org_id);
  }
  getroomType_facilityfloor(floor, facility, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/roomtypeByFacility_Floor?fkey=' + facility + '&floorkey=' + floor + '&OrganizationID=' + org_id);
  }
  getRoom_facilityfloor(floor, facility, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/roomByFacility_Floor?fkey=' + facility + '&floorkey=' + floor + '&OrganizationID=' + org_id);
  }
  getRoomtype_zone_facilityfloor(zone, floor, facility, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/roomtypeByFacility_Floor_zone?fkey=' + facility + '&floorkey=' + floor + '&zonekey=' + zone + '&OrganizationID=' + org_id);
  }
  getRoom_zone_facilityfloor(zone, floor, facility, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/roomByFacility_Floor_zone?fkey=' + facility + '&floorkey=' + floor + '&zonekey=' + zone + '&OrganizationID=' + org_id);
  }
  getRoom_Roomtype_zone_facilityfloor(roomtype, zone, floor, facility, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/roomByFacility_Floor_Zone_RoomType?fkey=' + facility + '&floorkey=' + floor + '&zonekey=' + zone + '&roomtype=' + roomtype + '&OrganizationID=' + org_id);
  }
  getallworkStatus(domain_name, emp_key, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/getAllValueByDomain?domainName=' + domain_name + '&empkey=' + emp_key + '&OrganizationID=' + org_id);
  }
  getallworkorderType(emp_key, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/allWorkOrderTypeWithOutQuick?empkey=' + emp_key + '&OrganizationID=' + org_id);
  }
  getall_workordertype(pageno, items_perpage, emp_key, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/viewWorkorderType?pageno=' + pageno + '&itemsPerPage=' + items_perpage + '&employeekey=' + emp_key + '&OrganizationID=' + org_id);
  }
  Edit_WOT(wOT_key, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/editviewWorkOrderType?WorkorderTypeKey=' + wOT_key + '&OrganizationID=' + org_id);
  }
  checkforWOT(WOTName, emp_key, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkforcheckForWorkOrderType?WorkorderTypeName=' + WOTName + '&employeekey=' + emp_key + '&OrganizationID=' + org_id);
  }
  getworkorder(on_date, emp_key, page_no, iems_perpage, org_id) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/viewworkorder?viewdate=' + on_date + '&employeekey=' + emp_key + '&pageno=' + page_no + '&itemsPerPage=' + iems_perpage + '&OrganizationID=' + org_id);
    return this
      .http
      .get(ConectionSettings.Url + '/viewworkorder_SuType?viewdate=' + on_date + '&employeekey=' + emp_key + '&pageno=' + page_no + '&itemsPerPage=' + iems_perpage + '&OrganizationID=' + org_id);

  }
  getBatchworkorder(on_date, emp_key, page_no, iems_perpage, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/viewScheduledWorks?viewdate=' + on_date + '&employeekey=' + emp_key + '&pageno=' + page_no + '&itemsPerPage=' + iems_perpage + '&OrganizationID=' + org_id);
  }
  getWoFilter(viewWorkOrder) {
    const url = ConectionSettings.Url + '/workorderByallFilters';
    return this
      .http
      .post(url, viewWorkOrder);
  }
  getBatchWoFilter(viewWorkOrder) {
    const url = ConectionSettings.Url + '/workorderScheduleByallFilters';
    return this
      .http
      .post(url, viewWorkOrder);
  }

  getallEquipment(facility_key, floor_key, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/getEquipmentBuildFloor?FacilityKey=' + facility_key + '&FloorKey=' + floor_key + '&OrganizationID=' + org_id);
  }
  getEquipment_typechange(equip_type, facility, floor, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/getEquipmentEquTypeChange?FacilityKey=' + facility + '&FloorKey=' + floor + '&EquipmentTypeKey=' + equip_type + '&OrganizationID=' + org_id);
  }
  addWorkOrderWithOutEqup(obj) {
    const url = ConectionSettings.Url + '/addNewWorkorder';
    return this
      .http
      .post(url, obj);
  }
  addworkorderSchedule(obj) {
    const url = ConectionSettings.Url + '/addworkorderSchedule';
    return this
      .http
      .post(url, obj);
  }
  addWorkOrderEqup(obj) {
    const url = ConectionSettings.Url + '/addworkorderwithEquipment';
    return this
      .http
      .post(url, obj);
  }
  addworkorderSchedulewithEquipment(obj) {
    const url = ConectionSettings.Url + '/addworkorderSchedulewithEquipment';
    return this
      .http
      .post(url, obj);
  }
  UpdateWOT(obj) {
    const url = ConectionSettings.Url + '/editSelectedWorkordertype';
    return this
      .http
      .post(url, obj);
  }
  view_wotype(WOTKey, OrganizationID) {

    return this
      .http
      .get(ConectionSettings.Url + '/editviewWorkOrderType?WorkorderTypeKey=' + WOTKey + '&OrganizationID=' + OrganizationID);
  }
  createWOT(obj) {
    const url = ConectionSettings.Url + '/addNewWorkordertype';
    return this
      .http
      .post(url, obj);
  }
  search_WO(obj) {
    const url = ConectionSettings.Url + '/searchWorkorderByallFilters';
    return this
      .http
      .post(url, obj);
  }
  search_Batch_WO(obj) {
    const url = ConectionSettings.Url + '/searchWorkorderScheduleByallFilters';
    return this
      .http
      .post(url, obj);
  }
  delete_WO(obj) {
    const url = ConectionSettings.Url + '/deleteWorkOrders';
    return this
      .http
      .post(url, obj);
  }
  getWO_edit(WO_Key, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/workorderDetails?SearchKey=' + WO_Key + '&OrganizationID=' + org_id);
  }
  getBatchWO_edit(BatchWO_Key, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/workorderScheduleDetails?SearchKey=' + BatchWO_Key + '&OrganizationID=' + org_id);
  }
  search_workordertype(org_id, key) {
    return this
      .http
      .get(ConectionSettings.Url + '/searchworkOrderType?OrganizationID=' + org_id + '&searchWorkOrderType=' + key);
  }
  getRoomList(Key, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/getRoomNameByRoomList?SearchKey=' + Key + '&OrganizationID=' + org_id);
  }
  getEquipmentNameList(Key, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/getEquipmentNameList?workorderSchedulekey=' + Key + '&OrganizationID=' + org_id);
  }
  getFloor(WOrder_Key, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/getFloorKeyForEquipWorkOrder?workorderkey=' + WOrder_Key + '&OrganizationID=' + org_id);
  }
  getFloor_batch(WOrder_Key, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/getFloorKeyForEquipSchedule?workorderSchedulekey=' + WOrder_Key + '&OrganizationID=' + org_id);
  }
  deleteCurrent_WO(obj) {
    const url = ConectionSettings.Url + '/deleteByWorkorderKey';
    return this
      .http
      .post(url, obj);
  }
  deleteCurrent_BatchWO(obj) {
    const url = ConectionSettings.Url + '/deleteWorkOrderBatchSchedule';
    return this
      .http
      .post(url, obj);
  }
  DeleteWOT(obj) {
    const url = ConectionSettings.Url + '/deleteWorkOrderType';
    return this
      .http
      .post(url, obj);
  }
  checkforcheckForWorkOrderType(newworkordertypetext, emp_key, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkforcheckForWorkOrderType?WorkorderTypeName=' + newworkordertypetext + '&employeekey=' + emp_key + '&OrganizationID=' + org_id);
  }
  AddnewWOT(obj) {
    const url = ConectionSettings.Url + '/addworkordertype';
    return this
      .http
      .post(url, obj);
  }
  getEmployee_scheduleNamae(schedulename, org_id) {
    return this
      .http
      .get(ConectionSettings.Url + '/getEmployeeForBatchScheduling?key=' + schedulename + '&OrganizationID=' + org_id);
  }

  // ****Pooja's code starts here****

  getallBuildingsForEmployee(empKey, orgID) {
    return this
      .http
      // .get(ConectionSettings.Url + '/allfacility?empkey=' + empk + '&OrganizationID=' + orgid);
      .get(ConectionSettings.Url + '/allfacility_SuType?empkey=' + empKey + '&OrganizationID=' + orgID);
  }
  getallFloorNames(key, orgid) {
    return this
      .http
      .get(ConectionSettings.Url + '/domainvaluesByKey?domain=facilityOnly' + '&key=' + key + '&OrganizationID=' + orgid);
  }
  getallZones(facikey, flkey, orgid) {
    return this
      .http
      .get(ConectionSettings.Url + '/zoneByFacility_Floor?fkey=' + facikey + '&floorkey=' + flkey + '&OrganizationID=' + orgid);

  }
  getallRoomType(facikey, flkey, orgid) {
    return this
      .http
      .get(ConectionSettings.Url + '/roomtypeByFacility_Floor?fkey=' + facikey + '&floorkey=' + flkey + '&OrganizationID=' + orgid);
  }
  getWOdetailsForEmployee(page, count, curr_date, empk, orgid) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/viewworkorder?viewdate=' + curr_date + '&employeekey=' + empk + '&pageno=' + page + '&itemsPerPage=' + count + '&OrganizationID=' + orgid);
    return this
      .http
      .get(ConectionSettings.Url + '/viewworkorder_SuType?viewdate=' + curr_date + '&employeekey=' + empk + '&pageno=' + page + '&itemsPerPage=' + count + '&OrganizationID=' + orgid);

  }
  getworkOrderTablewithOnDateOnly(page, count, date1, tosrvempky, orgid) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/viewworkorder?viewdate=' + date1 + '&employeekey=' + tosrvempky + '&pageno=' + page + '&itemsPerPage=' + count + '&OrganizationID=' + orgid);
    return this
      .http
      .get(ConectionSettings.Url + '/viewworkorder_SuType?viewdate=' + date1 + '&employeekey=' + tosrvempky + '&pageno=' + page + '&itemsPerPage=' + count + '&OrganizationID=' + orgid);

  }
  getworkOrderTablewithOnDateandToDateFilter(date1, date2, tosrvempky, orgid, FacKey, Flrky, RmTypKy, ZnKy) {
    const url = ConectionSettings.Url + '/workorderEmployeeByallFilters';
    const obj = {
      manager: tosrvempky,
      workorderDate: date1,
      workorderDate2: date2,
      facilitykey: FacKey,
      roomTypeKey: RmTypKy,
      floorKey: Flrky,
      zoneKey: ZnKy,
      OrganizationID: orgid
    };
    return this
      .http
      .post(url, obj);
  }
  SearchwoByEmployee(SearchValue, date1, date2, tosrvempky, orgid, FacKey, Flrky, RmTypKy, ZnKy) {
    const url = ConectionSettings.Url + '/myWorkOrderSearchList';
    const obj = {
      searchWO: SearchValue,
      workorderDate: date1,
      workorderDate2: date2,
      manager: tosrvempky,
      OrganizationID: orgid,
      facilitykey: FacKey,
      floorKey: Flrky,
      roomTypeKey: RmTypKy,
      zoneKey: ZnKy
    };
    return this
      .http
      .post(url, obj);
  }
  BarcodeRoomCheck(BarcodeValue, workorderkey, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/barcodeRoom_check?barcode=' + BarcodeValue + "&wkey=" + workorderkey + "&OrganizationID=" + OrganizationID);
  }
  BarcodeRoom(BarcodeValue, toServeremployeekey, workorderkey, type, OrganizationID, complete_Time) {
    return this
      .http
      .get(ConectionSettings.Url + '/barcodeRoom_Ang?barcode=' + BarcodeValue + "&employeekey=" + toServeremployeekey + "&wkey=" + workorderkey + "&updatetype=" + type + "&OrganizationID=" + OrganizationID + "&complete_Time=" + complete_Time);
  }
  UpdatewobyPhotoForEmployee(fileName, toServeremployeekey, workorderkey, orgid, complete_Time) {
    return this
      .http
      .get(ConectionSettings.Url + '/updateWorkorderByPhoto_Ang6?pho=' + fileName + "&employeekey=" + toServeremployeekey + "&wkey=" + workorderkey + "&OrganizationID=" + orgid + "&complete_Time=" + complete_Time);
  }
  CompletewoByempWithoutPhotoandBarcd(toServeremployeekey, workorderkey, OrganizationID, complete_Time) {
    return this
      .http
      .get(ConectionSettings.Url + '/workCompleted?employeekey=' + toServeremployeekey + "&wkey=" + workorderkey + "&OrganizationID=" + OrganizationID + "&complete_Time=" + complete_Time);
  }
  getworkOrderTablewithbuildingFilter(date1, date2, tosrvempky, orgid, FacKey, Flrky, RmTypKy, ZnKy) {
    const url = ConectionSettings.Url + '/workorderEmployeeByallFilters';
    const obj = {
      manager: tosrvempky,
      workorderDate: date1,
      workorderDate2: date2,
      facilitykey: FacKey,
      roomTypeKey: RmTypKy,
      floorKey: Flrky,
      zoneKey: ZnKy,
      OrganizationID: orgid
    };
    return this
      .http
      .post(url, obj);
  }
  // ****Pooja's code ends here****

  getMetricValues(OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/metricTypevalues?OrganizationID=' + OrgID);
  }

  getviewWorkorderservicerequest(vpto) {
    const url = ConectionSettings.Url + '/getviewWorkorderservicerequest';
    return this
      .http
      .post(url, vpto);
  }

  generateWorkorderbyservicerequest(vpto) {
    const url = ConectionSettings.Url + '/generateWorkorderbyservicerequest';
    return this
      .http
      .post(url, vpto);
  }

  setCancelWorkorder(wokey, reason, date1, time1, empkey, orgID) {
    // const url = ConectionSettings.Url + '/cancelWorkOrder';
    const url = ConectionSettings.Url + '/cancelWorkOrder_SuType';
    const obj = {
      workOrderKey: wokey,
      Reason: reason,
      updateDate: date1,
      updateTime: time1,
      empKey: empkey,
      OrganizationID: orgID
    };
    return this
      .http
      .post(url, obj);
  }
  workorderViewsEmpByAll(obj) {
    const url = ConectionSettings.Url + '/workorderViewsEmpByAll';

    return this
      .http
      .post(url, obj);
  }


  workorderViewsSupervisorByAll(obj) {
    const url = ConectionSettings.Url + '/workorderViewSupervisorByAll';

    return this
      .http
      .post(url, obj);
  }
  // @Rodney starts...
  getallWorkorderDetailswithStatus(OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getWODetailswithStatus?OrganizationID=' + OrgID);
  }

  getAllIntervalTypes(OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getAllIntervalTypes?OrganizationID=' + OrgID);
  }

  getIntervalTypeDetails(intervalid, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getIntervalTypeDetails?intervalid=' + intervalid + "&OrganizationID=" + OrgID);
  }
  updateIntervalDetails(color, intervalid, OrgID) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/updateIntervalTypeDetails?intervalid=' + intervalid + "&color=" + color + "&OrganizationID=" + OrgID);

    const url = ConectionSettings.Url + '/updateIntervalTypeDetails';
    const obj = {
      intervalid: intervalid,
      color: color,
      OrganizationID: OrgID
    };
    return this
      .http
      .post(url, obj);
  }

  getWoFilter_pagination(viewWorkOrder) {
    const url = ConectionSettings.Url + '/workorderByallFilters_pagination';
    return this
      .http
      .post(url, viewWorkOrder);
  }

  getRemainingWODetails(from, to, empKey, wotypeKey, org) {
    return this
      .http
      .get(ConectionSettings.Url + '/getRemainingWODetails?from=' + from + "&to=" + to + "&empKey=" + empKey + "&wotypeKey=" + wotypeKey + "&org=" + org);
  }


  getLastCleanedDetails(roomKey, orgID) {
    return this.http.
      get(ConectionSettings.Url + '/getLastCleaningDetails?roomKey=' + roomKey + "&orgID=" + orgID);
  }

  
  // @Rodney ends...
  // Prakash Code Starts here
  delete_batchWO(obj) {
    const url = ConectionSettings.Url + '/deletebatchWorkOrders';
    return this
      .http
      .post(url, obj);
  }
  // Prakash Code Ends here
}
