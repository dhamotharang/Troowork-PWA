import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConectionSettings } from './ConnectionSetting';
@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private http: HttpClient) { }

  createOrganization(OrgName, OrgDesc, Location, State, Country, updatedby, TenName, OrgEmail, tenID) {
    const url = ConectionSettings.Url + '/organizationAdd';
    const obj = {
      OrganizationName: OrgName,
      OrganizationDescription: OrgDesc,
      Location: Location,
      State: State,
      Country: Country,
      MetaUpdatedBy: updatedby,
      TenantName: TenName,
      OrganizationEmail: OrgEmail,
      TenantID: tenID
    };
    return this
      .http
      .post(url, obj);
  }
  getOrganization(page, itemCount) {
    return this
      .http
      .get(ConectionSettings.Url + '/getOrganizationDetails?itemsPerPage=' + itemCount + '&pageNumber=' + page);
  }
  DeleteOrganization(orgkey, updatedby) {
    const url = ConectionSettings.Url + '/deleteOrganizationDetailsByID';
    const obj = {
      OrganizationID: orgkey,
      metaUpdatedBy: updatedby
    };
    return this
      .http
      .post(url, obj);
  }
  ViewOrgDetailsforedit(OrgId) {
    return this
      .http
      .get(ConectionSettings.Url + '/getOrganizationDetailsByID?OrganizationID=' + OrgId);
  }
  UpdateOrganizationDetails(OName, ODesc, state, tid, loc, country, tename, email, updatedby, orgid) {
    const url = ConectionSettings.Url + '/updateOrganizationDetailsByID';
    const obj = {
      OrganizationName: OName,
      OrganizationDescription: ODesc,
      Location: loc,
      State: state,
      Country: country,
      MetaUpdatedBy: updatedby,
      OrganizationID: orgid,
      TenantName: tename,
      OrganizationEmail: email,
      TenantID: tid
    };
    return this
      .http
      .post(url, obj);

  }
  checkForTenantId(TenantID) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkForTenantId?TenantID=' + TenantID);
  }

  cronJob_MST() {
    return this
      .http
      .get(ConectionSettings.Url + '/cronjobMST');
  }

  cronJob_CST() {
    return this
      .http
      .get(ConectionSettings.Url + '/cronjobCST');
  }

  cronJob_workordersCount(currentDate) {
    return this
      .http
      .get(ConectionSettings.Url + '/cronjobworkorderCount?date1=' + currentDate);
  }

  cronJob_unrunBatchCount(currentDate, orgid) {
    return this
      .http
      .get(ConectionSettings.Url + '/cronjobunrunbatchdetailsCount?date1=' + currentDate + '&OrgID=' + orgid);
  }
}
