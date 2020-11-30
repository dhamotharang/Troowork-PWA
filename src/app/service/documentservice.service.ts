import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ConectionSettings } from './ConnectionSetting';
@Injectable({
  providedIn: 'root'
})
export class DocumentserviceService {

  constructor(private http: HttpClient) { }

  getDocumentFoldersDataTable(page, itemsCount, empKey, orgid) {
    return this
      .http
      .get(ConectionSettings.Url+'/getFormDetails?pageno=' + page + '&itemsPerPage=' + itemsCount + '&empkey=' + empKey + '&OrganizationID=' + orgid);
  }
  SearchDocFolder(orgid, SearchValue) {
    return this
      .http
      .get(ConectionSettings.Url+'/searchFormList?OrganizationID=' + orgid + '&searchForm=' + SearchValue);
  }
  CreateNewDocumentFolder(DocFolderName, servempkey, orgid) {
    const url = ConectionSettings.Url+'/addNewForms';
    const obj = {
      newform: DocFolderName,
      serverEmpKey: servempkey,
      OrganizationID: orgid
    };
    return this
      .http
      .post(url, obj);
  }
  EditDocFolderName(Docfoldername, orgid) {
    return this
      .http
      .get(ConectionSettings.Url+'/getEditFormDetails?FormtypeId=' + Docfoldername + '&OrganizationID=' + orgid);
  }
  UpdateDocumentFolderName(formtypeid, formtype, empKey, orgid) {
    const url = ConectionSettings.Url+'/updateFormDetails';
    const obj = {
      FormtypeId: formtypeid,
      FormType: formtype,
      empkey: empKey,
      OrganizationID: orgid
    };
    return this
      .http
      .post(url, obj);
  }
  DeleteDocFolder(deldfkey, orgID) {
    const url = ConectionSettings.Url+'/deleteForm';
    const obj = {
      FormtypeId: deldfkey,
      OrganizationID: orgID
    };
    return this
      .http
      .post(url, obj);
  }
  getDocumentFolderNamesfordropdown(empKey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url+'/allFormtype?empkey=' + empKey + '&OrganizationID=' + orgID);
  }
  getRecentUploads(page, count, empKey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url+'/view_uploads?pageno=' + page + '&itemsPerPage=' + count + '&empkey=' + empKey + '&OrganizationID=' + orgID);
  }
  SearchFileNameandDescName(orgID, SearchValue) {
    return this
      .http
      .get(ConectionSettings.Url+'/searchViewFormList?OrganizationID=' + orgID + '&searchForm=' + SearchValue);
  }
  getFileDetailsTablewithDropdown(formtype, empKey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url+'/uploadsByFormType?formType=' + formtype + '&empkey=' + empKey + '&OrganizationID=' + orgID);
  }
  checkforForms(DocFolderName,employeekey,OrganizationID)
  {
    return this
      .http
      .get(ConectionSettings.Url+'/checkforForms?newform='+DocFolderName+'&serverEmpKey='+employeekey+'&OrganizationID='+OrganizationID);
  }
}
