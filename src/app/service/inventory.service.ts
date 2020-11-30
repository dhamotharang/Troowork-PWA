import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StaticSymbolResolver } from '@angular/compiler';
import { ConectionSettings } from './ConnectionSetting';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {

  constructor(private http: HttpClient) { }

  //http: HttpClient
  getBuildings(page, itemsCount, empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/allfacilityByPageNo?pageno=' + page + '&itemsperpage=' + itemsCount + '&employeekey=' + empKey + '&OrganizationID=' + OrgID);
  }
  EditFacility(facKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getfacilityById?facKey=' + facKey + '&OrganizationID=' + OrgID);

  }
  EditFloorAutoGenerate(floorKey, facKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getFloorById?facKey=' + facKey + '&floorKey=' + floorKey + '&OrganizationID=' + OrgID);
  }
  UpdateBuilding(FacilityName, FacilityKey, empKey, OrgID) {
    const url = ConectionSettings.Url + '/updateFacility';
    const obj = {
      facility_key: FacilityKey,
      facility_name: FacilityName,
      employeekey: empKey,
      OrganizationID: OrgID
    };
    return this
      .http
      .post(url, obj);

  }
  DeleteBuilding(facility_key, empKey, OrgID) {
    const url = ConectionSettings.Url + '/deleteFacility';
    const obj = {
      facility_key: facility_key,
      employeekey: empKey,
      OrganizationID: OrgID
    };
    return this
      .http
      .post(url, obj);

  }
  DeleteFloor(FacilityKey, FloorKey, empKey, OrgID) {
    const url = ConectionSettings.Url + '/deleteFloor';
    const obj = {
      FacilityKey: FacilityKey,
      FloorKey: FloorKey,
      employeekey: empKey,
      OrganizationID: OrgID
    };
    return this
      .http
      .post(url, obj);

  }
  SearchBuilding(SearchFacility, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/searchBuildingList?OrganizationID=' + OrgID + '&searchFacility=' + SearchFacility)


  }
  SearchFloor(SearchFloor, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getSearchFloor?OrganizationID=' + OrgID + '&searchFloor=' + SearchFloor)


  }
  getFloors(page, itemsCount, empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getAllfacility_floor?pagenumber=' + page + '&itemsPerPage=' + itemsCount + '&employeekey=' + empKey + '&OrganizationID=' + OrgID);
  }
  getZones(page, itemsCount, empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getAllfacility_floor_zone?pageno=' + page + '&itemsperpage=' + itemsCount + '&employeekey=' + empKey + '&OrganizationID=' + OrgID);
  }
  createFloors(FacilityKey, FloorName, FloorDescription, empKey, OrgID) {
    const url = ConectionSettings.Url + '/addnewfloor';
    const obj = {
      FacilityKey: FacilityKey,
      FloorDescription: FloorDescription,
      FloorName: FloorName,
      employeekey: empKey,
      OrganizationID: OrgID
    };
    return this
      .http
      .post(url, obj);
  }
  createZones(FacilityKey, FloorName, ZoneName, empKey, OrgID) {
    const url = ConectionSettings.Url + '/addnewZone';
    const obj = {
      facility: FacilityKey,
      floor: FloorName,
      zone: ZoneName,
      OrganizationID: OrgID,
      employeekey: empKey
    };
    return this
      .http
      .post(url, obj);
  }
  CheckNewFloor(FacilityKey, FloorName, employeekey, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkForNewFloor?FacilityKey=' + FacilityKey + '&FloorName=' + FloorName + '&employeekey=' + employeekey + '&OrganizationID=' + OrganizationID);
  }
  getallBuildingList(empKey, orgID) {
    return this
      .http
      // .get(ConectionSettings.Url + '/allfacility?empkey=' + empKey + '&OrganizationID=' + OrgID);
      .get(ConectionSettings.Url + '/allfacility_SuType?empkey=' + empKey + '&OrganizationID=' + orgID);
  }
  CheckNewBuilding(FacilityName, type, employeekey, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkForNewInventory?checkValue=' + FacilityName + '&type=' + type + '&employeekey=' + employeekey + '&OrganizationID=' + OrganizationID);
  }
  CheckRoomType(RoomTypeName, type, employeekey, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkForNewInventory?checkValue=' + RoomTypeName + '&type=' + type + '&employeekey=' + employeekey + '&OrganizationID=' + OrganizationID);
  }

  getallFloorList(facKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/floorvaluesByfacKey?key=' + facKey + '&OrganizationID=' + OrgID);
  }
  UpdateFloor(FacilityKey, FloorKey, FloorName, FloorDescription, empKey, OrgID) {
    const url = ConectionSettings.Url + '/updateFloor';
    const obj = {
      FacilityKey: FacilityKey,
      FloorKey: FloorKey,
      FloorName: FloorName,
      FloorDescription: FloorDescription,
      employeekey: empKey,
      OrganizationID: OrgID
    };
    return this
      .http
      .post(url, obj);
  }

  // @rodney starts....
  searchZone(SearchZone, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/searchZoneList?OrganizationID=' + OrgID + '&searchZone=' + SearchZone)
  }

  EditZoneAutoGenerate(zoneKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getZoneById?zoneKey=' + zoneKey + '&OrganizationID=' + OrgID);
  }


  checkForZone(FacilityKey, FloorKey, ZoneName, empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkForNewZone?FacilityKey=' + FacilityKey + '&FloorKey=' + FloorKey + '&ZoneName=' + ZoneName + '&employeekey=' + empKey + '&OrganizationID=' + OrgID);
  }

  updateZone(facilityKey, facilityName, floorName, floorKey, zoneKey, zoneName, empKey, OrgID) {
    const url = ConectionSettings.Url + "/updateZone";
    const obj = {
      FacilityKey: facilityKey,
      FloorKey: floorKey,
      FacilityName: facilityName,
      FloorName: floorName,
      ZoneKey: zoneKey,
      ZoneName: zoneName,
      employeekey: empKey,
      OrganizationID: OrgID
    };
    return this.http.post(url, obj);
  }


  DeleteZone(FacilityKey, FloorKey, ZoneKey, empKey, OrgID) {
    const url = ConectionSettings.Url + "/deleteZoneById";
    const obj = {
      facility: FacilityKey,
      floorkey: FloorKey,
      zoneKey: ZoneKey,
      employeekey: empKey,
      OrganizationID: OrgID
    };
    return this.http.post(url, obj);
  }

  checkForNewDepartment(DeptName, empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkForNewInventory?checkValue=' + DeptName + '&type=department' + '&employeekey=' + empKey + '&OrganizationID=' + OrgID);
  }
  addDepartment(DeptName, empKey, OrgID) {
    const url = ConectionSettings.Url + "/addNewDepartment";
    const obj = {
      DepartmentName: DeptName,
      empkey: empKey,
      OrganizationID: OrgID
    };
    return this.http.post(url, obj);
  }


  getDepartmentList(page, itemsCount, empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/viewDepartmentpage?pageno=' + page + '&itemsPerPage=' + itemsCount + '&empkey=' + empKey + '&OrganizationID=' + OrgID);
  }

  SearchDepartment(DeptName, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/searchDepartmentType?OrganizationID=' + OrgID + '&searchDepartment=' + DeptName)
  }

  DeleteDepartment(deptKey, OrgID) {
    const url = ConectionSettings.Url + "/deleteDepartment";
    const obj = {
      DepartmentKey: deptKey,
      OrganizationID: OrgID
    };
    return this.http.post(url, obj);
  }

  EditDepartment(deptKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/editviewDepartment?DepartmentKey=' + deptKey + '&OrganizationID=' + OrgID);

  }
  UpdateDepartment(departmentName, departmentKey, empKey, OrgID) {
    const url = ConectionSettings.Url + "/editSelectedDepartment";
    const obj = {
      DepartmentKey: departmentKey,
      DepartmentName: departmentName,
      empkey: empKey,
      OrganizationID: OrgID
    };
    return this.http.post(url, obj);
  }


  SearchEquipment(EquipName, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/searchequipment?OrganizationID=' + OrgID + '&searchEquipment=' + EquipName);
  }

  getEquipmentList(page, itemsCount, empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getAllEquipmentTypeEquipment?pageno=' + page + '&itemsperpage=' + itemsCount + '&empkey=' + empKey + '&OrganizationID=' + OrgID);
  }


  DeleteEquipment(EquipKey, empKey, OrgID) {
    const url = ConectionSettings.Url + "/deleteEquipmentById";
    const obj = {
      EquipmentKey: EquipKey,
      employeekey: empKey,
      OrganizationID: OrgID
    };
    return this.http.post(url, obj);
  }

  getEquipmentTypeList(page, itemsCount, empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getAllEquipmentTypes?pageno=' + page + '&itemsperpage=' + itemsCount + '&empkey=' + empKey + '&OrganizationID=' + OrgID);
  }
  SearchEquipmentType(EquipTypeName, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/searchEquipmentTypeList?OrganizationID=' + OrgID + '&searchEquipmentType=' + EquipTypeName);
  }

  DeleteEquipmentType(EquipTypeKey, empKey, OrgID) {
    const url = ConectionSettings.Url + "/deleteEquipmentTypeById";
    const obj = {
      equipmentTypeKey: EquipTypeKey,
      employeekey: empKey,
      OrganizationID: OrgID
    };
    return this.http.post(url, obj);
  }

  checkForNewEquipmentType(EquipmentTypeName, empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkForNewInventory?checkValue=' + EquipmentTypeName + '&type=equipmenttype' + '&employeekey=' + empKey + '&OrganizationID=' + OrgID);
  }

  addEquipmentType(EquipmentTypeName, EquipmentTypeDescription, empKey, OrgID) {
    const url = ConectionSettings.Url + "/addnewEquipmentType";
    const obj = {
      EquipmentType: EquipmentTypeName,
      EquipmentTypeDescription: EquipmentTypeDescription,
      EquipmentTypeKey: -99,
      employeekey: empKey,
      OrganizationID: OrgID
    };
    return this.http.post(url, obj);
  }

  getEquipmentTypeListEdit(equipTypeKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getEquipmentTypeKeyById?equipmentTypeKey=' + equipTypeKey + '&OrganizationID=' + OrgID);
  }

  UpdateEquipmentType(equipType, equipTypeDesc, equipTypeKey, empKey, OrgID) {
    const url = ConectionSettings.Url + "/updateEquipmentType";
    const obj = {
      EquipmentType: equipType,
      EquipmentTypeDescription: equipTypeDesc,
      EquipmentTypeKey: equipTypeKey,
      employeekey: empKey,
      OrganizationID: OrgID
    };
    return this.http.post(url, obj);
  }



  getRoomTypeList(page, itemsCount, empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getAllRoomType?pageno=' + page + '&itemsperpage=' + itemsCount + '&empkey=' + empKey + '&OrganizationID=' + OrgID);
  }
  SearchRoomType(RoomType, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/searchroomType?OrganizationID=' + OrgID + '&searchRoomType=' + RoomType);
  }

  DeleteRoomType(RoomTypeKey, empKey, OrgID) {
    const url = ConectionSettings.Url + "/deleteRoomTypeById";
    const obj = {
      roomTypeKey: RoomTypeKey,
      employeekey: empKey,
      OrganizationID: OrgID
    };
    return this.http.post(url, obj);
  }

  getMetricValues(OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/metricTypevalues?OrganizationID=' + OrgID);
  }

  checkRoomType(RoomTypeName, empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkForNewInventory?checkValue=' + RoomTypeName + '&type=roomtype' + '&employeekey=' + empKey + '&OrganizationID=' + OrgID);
  }

  addRoomType(roomTypeName, MetricTypeValue, metricType, empKey, OrgID) {
    const url = ConectionSettings.Url + "/addnewRoomtype";
    const obj = {
      RoomTypeName: roomTypeName,
      metric: 1,
      MetricType: 'default',
      TypeValue: 1,
      EquipmentTypeKey: -99,
      employeekey: empKey,
      OrganizationID: OrgID
    };
    return this.http.post(url, obj);
  }

  getFloorTypeList(page, itemsCount, empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/allFloorType?pagenumber=' + page + '&itemsPerPage=' + itemsCount + '&empkey=' + empKey + '&OrganizationID=' + OrgID);
  }
  SearchFloorType(FloorType, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/searchFloorTypeList?OrganizationID=' + OrgID + '&searchFloorType=' + FloorType);
  }

  DeleteFloorType(FloorTypeKey, empKey, OrgID) {
    const url = ConectionSettings.Url + "/deleteFloorTypeById";
    const obj = {
      floortypekey: FloorTypeKey,
      employeekey: empKey,
      OrganizationID: OrgID
    };
    return this.http.post(url, obj);
  }

  getRoomList(page, itemsCount, empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getAllRooms?pageno=' + page + '&itemsperpage=' + itemsCount + '&empkey=' + empKey + '&OrganizationID=' + OrgID);
  }
  SearchRoom(Room, empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/searchRoomOnTable?OrganizationID=' + OrgID + '&searchRoom=' + Room + '&employeekey=' + empKey);
  }

  DeleteRoom(RoomKey, empKey, OrgID) {
    const url = ConectionSettings.Url + "/deleteRoomById?roomkey=" + RoomKey + "&employeekey=" + empKey + "&OrganizationID=" + OrgID;
    const obj = {};
    return this.http.post(url, obj);
  }

  EditRoomtTypeAutoGenerate(roomTypeKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getRoomTypeById?roomTypeKey=' + roomTypeKey + '&OrganizationID=' + OrgID);
  }


  updateRoomType(roomTypeKey, metricTypeKey, metricType, roomTypeName, MetricTypeValue, empKey, OrgID) {
    const url = ConectionSettings.Url + "/updateRoomType";
    const obj = {
      RoomTypeKey: roomTypeKey,
      RoomTypeName: roomTypeName,
      metric: metricTypeKey,
      MetricType: metricType,
      TypeValue: MetricTypeValue,
      employeekey: empKey,
      OrganizationID: OrgID
    };
    return this.http.post(url, obj);
  }
  getBarcodeForEquipment(empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getBarcodeForEquipment?employeekey=' + empKey + '&OrganizationID=' + OrgID);
  }
  getAllEquipmentType(empKey, OrgID) {
    return this
      .http
      // .get(ConectionSettings.Url + '/allequiptype?employeekey=' + empKey + '&OrganizationID=' + OrgID);
      .get(ConectionSettings.Url + '/allequiptype_SuType?employeekey=' + empKey + '&OrganizationID=' + OrgID);
  }

  checkForNewEquipment(EquipmentTypeKey, EquipmentName, empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkForNewEquipment?EquipmentTypeKey=' + EquipmentTypeKey + '&EquipmentName=' + EquipmentName + '&employeekey=' + empKey + '&OrganizationID=' + OrgID);
  }
  checkForNewEquipmentbarcode(barcode, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkForBarcodeInventory?Barcode=' + barcode + '&type=equipment' + '&OrganizationID=' + OrgID);
  }
  addEquipment(EquipmentName, EquipmentDescription, Barcode, EquipmentTypeKey, FacKey, FloorKey, empKey, OrgID) {
    const url = ConectionSettings.Url + "/addnewEquipment";
    const obj = {

      EquipmentTypeKey: EquipmentTypeKey,
      EquipmentName: EquipmentName,
      EquipmentDescription: EquipmentDescription,
      EquipmentBarcode: Barcode,
      FacilityKey: FacKey,
      FloorKey: FloorKey,
      BarcodeINT: Barcode,
      employeekey: empKey,
      OrganizationID: OrgID
    };
    return this.http.post(url, obj);
  }


  EditEquipmentAutoGenerate(equipKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getEquipmentKeyById?equipmentKey=' + equipKey + '&OrganizationID=' + OrgID);
  }

  getallFloorTypeList(empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getFloorTypeListForRoomEdit?empkey=' + empKey + '&OrganizationID=' + OrgID);
  }
  getallRoomTypeList(empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getRoomTypeListForRoomEdit?empkey=' + empKey + '&OrganizationID=' + OrgID);
  }
  getBarcodeForRoom(empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getBarcodeForRoom?employeekey=' + empKey + '&OrganizationID=' + OrgID);
  }
  getallZoneList(facKey, flrKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getZoneListForRoomEdit?FacilityKey=' + facKey + '&FloorKey=' + flrKey + '&OrganizationID=' + OrgID);
  }


  checkNewRoom(facilityKey, floorKey, floorTypeKey, zoneKey, roomTypeKey, roomName, empKey, OrgID) {
    const url = ConectionSettings.Url + "/checkForNewRoom";
    const obj = {

      FacilityKey: facilityKey,
      FloorKey: floorKey,
      FloorTypeKey: floorTypeKey,
      ZoneKey: zoneKey,
      RoomTypeKey: roomTypeKey,
      RoomName: roomName,
      employeekey: empKey,
      OrganizationID: OrgID
    };
    return this.http.post(url, obj);
  }
  checkRoomBarcode(Barcode, empKey, OrgID) {

    return this
      .http
      .get(ConectionSettings.Url + '/checkUniqueBarcode_Updation?roomkey=' + -1 + '&barcode=' + Barcode + '&employeekey=' + empKey + '&OrganizationID=' + OrgID);
  }
  //Add check according to building and Floor name
  checkRoomName(facilityKey, floorKey, RoomName, OrgID) {

    return this
      .http
      .get(ConectionSettings.Url + '/checkNewRoomName?RoomName=' + RoomName + '&FacilityKey=' + facilityKey + '&FloorKey=' + floorKey + '&OrganizationID=' + OrgID);

  }


  addRoom(facilityKey, floorKey, floorTypeKey, zoneKey, roomTypeKey, roomName, SquareFoot, barcode, empKey, OrgID) {
    const url = ConectionSettings.Url + "/addnewRoom";
    const obj = {

      FacilityKey: facilityKey,
      FloorKey: floorKey,
      FloorTypeKey: floorTypeKey,
      ZoneKey: zoneKey,
      RoomTypeKey: roomTypeKey,
      roomkey: -99,
      Area: SquareFoot,
      RoomName: roomName,
      employeekey: empKey,
      Barcode: barcode,
      OrganizationID: OrgID
    };
    return this.http.post(url, obj);
  }



  getRoomDetailsList(RoomKey, OrgID) {

    return this
      .http
      .get(ConectionSettings.Url + '/getRoomById?roomKey=' + RoomKey + '&OrganizationID=' + OrgID);

  }
  checkUniqueBarcode_Updation(Barcode, roomkey, employeekey, OrganizationID) {

    return this
      .http
      .get(ConectionSettings.Url + '/checkUniqueBarcode_Updation?barcode=' + Barcode + '&roomkey=' + roomkey + '&employeekey=' + employeekey + '&OrganizationID=' + OrganizationID);

  }
  updateRoom(obj) {
    const url = ConectionSettings.Url + '/updateRoom';
    return this
      .http
      .post(url, obj);
  }

  checkForNewFloorType(FloorTypeName, empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkForNewInventory?checkValue=' + FloorTypeName + '&type=floortype' + '&employeekey=' + empKey + '&OrganizationID=' + OrgID);
  }

  addNewFloorType(floorTypeName, empKey, OrgID) {
    const url = ConectionSettings.Url + "/addnewfloortype";
    const obj = {
      FloorTypeName: floorTypeName,
      employeekey: empKey,
      OrganizationID: OrgID
    };
    return this.http.post(url, obj);
  }

  EditFloorType(FloorTypeKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getFloorTypeById?floortypeKey=' + FloorTypeKey + '&OrganizationID=' + OrgID);

  }

  UpdateFloorType(floorTypeName, FlrTypeKey, empKey, OrgID) {
    const url = ConectionSettings.Url + "/updateFloorType";
    const obj = {
      FloorTypeKey: FlrTypeKey,
      FloorTypeName: floorTypeName,
      employeekey: empKey,
      OrganizationID: OrgID
    };
    return this.http.post(url, obj);
  }
  updateEquipment(equipmentName, equipmentDescription, equipmentBarcode, equipTypeKey, FacKey, floorKey, equipKey, empKey, OrgID) {
    const url = ConectionSettings.Url + "/updateEquipment";
    const obj = {
      EquipmentKey: equipKey,
      EquipmentTypeKey: equipTypeKey,
      // EquipmentType: equipType,
      EquipmentName: equipmentName,
      EquipmentDescription: equipmentDescription,
      employeekey: empKey,
      EquipmentBarcode: equipmentBarcode,
      OrganizationID: OrgID,
      FacilityKey: FacKey,
      FloorKey: floorKey,
      BarcodeINT: equipmentBarcode
    };
    return this.http.post(url, obj);

  }

  checkEditedRoomName(facKey, roomName, RoomKey, empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkForEditedRoomName?roomKey=' + RoomKey + '&RoomName=' + roomName + '&FacilityKey=' + facKey + '&employeekey=' + empKey + '&OrganizationID=' + OrgID);

  }

  getAllRoomFilterList(OrgID, bldgKey, flrKey, zKey, rTypeKey, rKey, flrTypeKey, empKey) {
    console.log("service... org" + OrgID + " ..... bldg " + bldgKey + " .....flr " + flrKey + " .....zone " + zKey + " .....rtype " + rTypeKey + " .....room " + rKey + " .....flrtype " + flrTypeKey + " .....emp " + empKey);
    const url = ConectionSettings.Url + "/viewRoomsByallFilters";
    const obj = {
      manager: empKey,
      facilitykey: bldgKey,
      floorKey: flrKey,
      zoneKey: zKey,
      roomKey: rKey,
      roomTypeKey: rTypeKey,
      floorTypeKey: flrTypeKey,
      OrganizationID: OrgID
    }
    return this.http.post(url, obj);
  }

  getTemplateDetailsForFeedback(OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getTemplateDetailsForFeedbackByOrgId?OrganizationID=' + OrgID);
  }
  // @rodney ends....

  getRoomDetailsNamesList(RoomKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getRoomDetailsNamesList?roomKey=' + RoomKey + '&OrganizationID=' + OrgID);
  }

}
