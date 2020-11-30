import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConectionSettings } from './ConnectionSetting';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(userName, passWord, tenantID) {
    // const uri = ConectionSettings.AbsUrl + '/authenticate';
    const uri = ConectionSettings.AbsUrl + '/authenticate_SuType';
    const obj = {
      uname: userName,
      pwd: passWord,
      tid: tenantID
    };
    return this.http.post(uri, obj);
  }

  getmessage(empkey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/welcomeUpdateMessage?empKey=' + empkey + '&OrganizationID=' + orgID);
  }

  getUserProfileDetails(empKey, orgID) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url+'/empDetails?SearchKey=' + empKey + '&OrganizationID=' + orgID);
    return this
      .http
      .get(ConectionSettings.Url + '/empDetails_SuType?SearchKey=' + empKey + '&OrganizationID=' + orgID);

  }
  getUserPasswordDetails(empKey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getLoginDetailsByID?employeekey=' + empKey + '&OrganizationID=' + orgID);
  }

  setPassword(userName, newPassword, Employeekey, UserLoginId, organizationID) {
    const uri = ConectionSettings.Url + '/resetPassword';
    const obj = {
      username: userName,
      password: newPassword,
      employeekey: Employeekey,
      updatedBy: Employeekey,
      userloginid: UserLoginId,
      OrganizationID: organizationID
    };
    return this.http.post(uri, obj);
  }

  getUsermanagerDetails(empKey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getManagerDetailsByID?employeekey=' + empKey + '&OrganizationID=' + orgID);
  }

  getUpdateList(empkey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/welcomeUpdateMessage?empKey=' + empkey + '&OrganizationID=' + orgID);
  }

  getEmpNameForWelcomeMessage(empkey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/welcomeMessage?empKey=' + empkey + '&OrganizationID=' + orgID);
  }
  getMaintenanceUpdateMsg(empkey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/MaintnancUpdateMsg?empKey=' + empkey + '&OrganizationID=' + orgID);
  }
  getimage(employeeid, organisid, imgid) {
    const uri = ConectionSettings.Url + '/getprofileimgapi';
    const obj = {
      empid: employeeid,
      orgid: organisid,
      imgid: imgid
    };
    return this.http.post(uri, obj);
  }
  schedulingIcons(empkey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/schedulingIcons?empKey=' + empkey + '&OrganizationID=' + orgID);
  }

  // @Rodney starts
  getVersionDetails() {
    return this
      .http
      .get(ConectionSettings.Url + '/getVersionDetails');
  }

  getExpiredAssignmentList(limit, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getExpiredAssignmentList?orgID=' + orgID + '&limit=' + limit);
  }

  getExpiringAssignmentList(limit, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getExpiringAssignmentList?orgID=' + orgID + '&limit=' + limit);
  }
  // @Rodney ends
}
