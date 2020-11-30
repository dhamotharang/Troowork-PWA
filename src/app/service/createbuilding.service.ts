import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConectionSettings } from './ConnectionSetting';
@Injectable({
  providedIn: 'root'
})
export class CreatebuildingService {

  constructor(private http: HttpClient) { }
  createBuildings(createbuilding, empKey, orgID) {
    const url = ConectionSettings.Url+'/addfacility';
    const obj = {
      fac: createbuilding,
      employeekey: empKey,
      OrganizationID: orgID
    };
    return this
      .http
      .post (url,obj);
  }
  checkNewBuilding(BuildingName,facility,employeekey,OrganizationID)
  {
    return this
    .http
    .get(ConectionSettings.Url+'/checkForNewInventory?checkValue='+BuildingName+'&type='+facility+'&employeekey='+employeekey+'&OrganizationID='+OrganizationID);
  }

}
