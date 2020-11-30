import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConectionSettings } from './ConnectionSetting';
import { formatDate } from '@angular/common';
import { toDate } from '@angular/common/src/i18n/format_date';
import { makeStateKey } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class PeopleServiceService {

  constructor(private http: HttpClient) { }

  getLoginCredentialList(pageNo, itemsPerPage, empKey, OrgID) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/getLoginDetailsForAllUsers?pageno=' + pageNo + '&itemsperpage=' + itemsPerPage + '&employeekey=' + empKey + '&OrganizationID=' + OrgID);

    return this
      .http
      .get(ConectionSettings.Url + '/getLoginDetailsForAllUsers_SuType?pageno=' + pageNo + '&itemsperpage=' + itemsPerPage + '&employeekey=' + empKey + '&OrganizationID=' + OrgID);

  }

  getLoginDetailsByEmpKey(empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getLoginDetailsByID?employeekey=' + empKey + '&OrganizationID=' + OrgID);

  }

  resetUserPassword(username, password, empKey, userLoginId, updatedUser, OrgID) {
    const url = ConectionSettings.Url + "/resetPassword";
    const obj = {
      username: username,
      password: password,
      employeekey: empKey,
      updatedBy: updatedUser,
      userloginid: userLoginId,
      OrganizationID: OrgID
    };

    return this.http.post(url, obj);
  }

  getUserEmail(username, empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getUserEmail?username=' + username + '&empkey=' + empKey + '&OrganizationID=' + OrgID);

  }


  getJobTitleList(empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/selectJobtitle?empkey=' + empKey + '&OrganizationID=' + OrgID);

  }

  getallEmployeesList(empKey, orgID) {
    return this
      .http
      // .get(ConectionSettings.Url + '/allemployees?empkey=' + empKey + '&OrganizationID=' + OrgID);
      .get(ConectionSettings.Url + '/allemployees_SuType?empkey=' + empKey + '&OrganizationID=' + orgID);

  }

  gettodaysMeeting(page, count, today, empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/gettodaysMeeting?ondate=' + today + '&employeekey=' + empKey + '&pageno=' + page + '&itemsPerPage=' + count + '&OrganizationID=' + OrgID);

  }

  viewMtngTrainingbyFilter(fromDate, toDate, JobList, EmpList, empKey, OrgID, DepartmentKey, EventType) {

    const url = ConectionSettings.Url + "/viewMeettingTrainingByAllFilter";
    const obj = {
      empKey: empKey,
      search_DT: fromDate,
      search_DT2: toDate,
      employees: EmpList,
      jobs: JobList,
      OrganizationID: OrgID,
      DeptKey: DepartmentKey,
      Evntype: EventType
    };
    return this.http.post(url, obj);
  }


  SearchmeetingTraining(fromDate, toDate, JobList, EmpList, SearchValue, empKey, OrgID) {

    const url = ConectionSettings.Url + "/searchMeetingEventView";
    const obj = {
      empKey: empKey,
      search_DT: fromDate,
      search_DT2: toDate,
      employees: EmpList,
      jobs: JobList,
      searchMeeting: SearchValue,
      OrganizationID: OrgID
    };
    return this.http.post(url, obj);
  }

  viewEmployeesOfEvent(eventKey, empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/viewEmployeesOfEvent?EventKey=' + eventKey + '&employeekey=' + empKey + '&OrganizationID=' + OrgID);

  }

  markAttendance(empKey, eventKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/submitMarkAsAttendedTraining?EventKey=' + eventKey + '&attendedEmployees=' + empKey + '&OrganizationID=' + OrgID);

  }


  removeAttendance(empKey, eventKey, OrgID) {

    const url = ConectionSettings.Url + "/unAttendedTrainingChangeStatus?EventKey=" + eventKey + "&employeekey=" + empKey + "&OrganizationID=" + OrgID;
    const obj = {};
    return this.http.post(url, obj);
  }


  DeleteMeetingTraining(eventKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/deleteMeetingViewEmployeeDetails?EventKey=' + eventKey + '&OrganizationID=' + OrgID);

  }


  getSupervisorList(empKey, OrgID) {
    return this
      .http
      // .get(ConectionSettings.Url + '/supervisorname?employeekey=' + empKey + '&OrganizationID=' + OrgID);
      .get(ConectionSettings.Url + '/supervisorname_SuType?employeekey=' + empKey + '&OrganizationID=' + OrgID);

  }
  getallEventList(empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/meetingTraining?empKey=' + empKey + '&OrganizationID=' + OrgID);

  }
  getSupervisorEmployeesList(supervisorKey, empKey, OrgID) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/empGetBySupervisor?SupervisorKey=' + supervisorKey + '&employeekey=' + empKey + '&OrganizationID=' + OrgID);
    return this
      .http
      .get(ConectionSettings.Url + '/empGetBySupervisor_SuType?SupervisorKey=' + supervisorKey + '&employeekey=' + empKey + '&OrganizationID=' + OrgID);

  }

  getJobtitleEmployeesList(jobTleKey, empKey, OrgID) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/empKey_byJobtitle?jobTitle=' + jobTleKey + '&employeekey=' + empKey + '&OrganizationID=' + OrgID);

    return this
      .http
      .get(ConectionSettings.Url + '/empKey_byJobtitle_SuType?jobTitle=' + jobTleKey + '&employeekey=' + empKey + '&OrganizationID=' + OrgID);

  }

  getSupervisorJobtitleEmployeesList(jobTleKey, superVsrKey, empKey, OrgID) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/empGetBySupervisorjobTitle?SupervisorKey=' + superVsrKey + '&JobTitleKey=' + jobTleKey + '&employeekey=' + empKey + '&OrganizationID=' + OrgID);
    return this
      .http
      .get(ConectionSettings.Url + '/empGetBySupervisorjobTitle_SuType?SupervisorKey=' + superVsrKey + '&JobTitleKey=' + jobTleKey + '&employeekey=' + empKey + '&OrganizationID=' + OrgID);

  }

  addMeetingTraining(EventType, eventHost, Venue, time1, time2, Notes, EmployeeKeyString, date1, empKey, OrgID) {

    const url = ConectionSettings.Url + "/addMeetingTraining";
    const obj = {
      actionKey: EventType,
      eventhost: eventHost,
      venue: Venue,
      MeetingNotes: Notes,
      meetingDate: date1,
      startTime: time1,
      endTime: time2,
      empKey: EmployeeKeyString,
      employeekey: empKey,
      OrganizationID: OrgID
    };
    return this.http.post(url, obj);
  }


  getMeetingTrainingDetails(eventKey, actionKey, empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getEditViewTrainingMeetingDetails?EventKey=' + eventKey + '&ActionKey=' + actionKey + '&EmployeeKey=' + empKey + '&OrganizationID=' + OrgID);

  }

  getallEmpsSelected(eventKey, actionKey, empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getselectedEmployeeByEventKey?EventKey=' + eventKey + '&ActionKey=' + actionKey + '&EmployeeKey=' + empKey + '&OrganizationID=' + OrgID);

  }

  updateMeetingTraining(EventType, eventHost, Venue, time1, time2, Notes, EmployeeKeyString, date1, EventKey, empKey, OrgID) {

    const url = ConectionSettings.Url + "/updateEditMeetingDetails";
    const obj = {
      actionKey: EventType,
      eventhost: eventHost,
      venue: Venue,
      MeetingNotes: Notes,
      meetingDate: date1,
      startTime: time1,
      endTime: time2,
      empKey: EmployeeKeyString,
      employeekey: empKey,
      OrganizationID: OrgID,
      // actionTypeKey: EventType,
      eventKey: EventKey

    };
    return this.http.post(url, obj);
  }

  getEventTypeList(page, itemsPerPage, empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getAllDefaultEvents?pageno=' + page + '&itemsPerPage=' + itemsPerPage + '&employeekey=' + empKey + '&OrganizationID=' + OrgID);
  }

  DeleteEventType(actionKey, actionTypeKey, OrgID) {
    const url = ConectionSettings.Url + "/deleteDefaultEventDetails?ActionKey=" + actionKey + "&ActionTypeKey=" + actionTypeKey + "&OrganizationID=" + OrgID;
    const obj = {};
    return this.http.post(url, obj);

  }

  getEventTypeDetails(actionKey, actionTypeKey, empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getDefaultEventDetailsForEdit?actionKey=' + actionKey + '&actiontypeKey=' + actionTypeKey + '&employeekey=' + empKey + '&OrganizationID=' + OrgID);
  }

  UpdateEventType(type, name, desc, actionKey, actionTypeKey, empKey, OrgID) {
    const url = ConectionSettings.Url + "/submitDefaultEventDetails?ActionType=" + type + "&Action=" + name + "&Description=" + desc + "&ActionKey=" + actionKey + "&ActionTypeKey=" + actionTypeKey + "&employeekey=" + empKey + "&OrganizationID=" + OrgID;
    const obj = {};
    return this.http.post(url, obj);

  }
  // ****@Pooja's Code Starts here****
  CheckNewJobtitle(JobTitle, employeekey, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkForNewJobTittle?JobTitle=' + JobTitle + '&employeekey=' + employeekey + '&OrganizationID=' + OrganizationID);
  }
  getManagerForEmployeeForSuperAdmin(OrgID) {
    return this
      .http
      // .get(ConectionSettings.Url + '/getManagerForEmployeeForSuperAdmin?OrganizationID=' + OrgID);
      .get(ConectionSettings.Url + '/getManagerForEmployeeForSuperAdmin_SuType?OrganizationID=' + OrgID);
  }
  getUserRoleType(OrgID) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/getAllUserRoleType_Admin?OrganizationID=' + OrgID);
    return this
      .http
      .get(ConectionSettings.Url + '/getAllUserRoleType_Admin_SuType?OrganizationID=' + OrgID);
  }
  getJobTitle(OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/JobtitleForSuperAdmin?OrganizationID=' + OrgID);
  }
  getAllJobTitle(OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getAllJobTitle?OrganizationID=' + OrgID);
  }
  getJobTitleforadmindd(employeekey, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/selectJobtitle?empkey=' + employeekey + '&OrganizationID=' + OrganizationID);
  }

  getSuperVisor(empKey, OrgID) {
    return this
      .http
      // .get(ConectionSettings.Url + '/supervisorname?employeekey=' + empKey + '&OrganizationID=' + OrgID);
      .get(ConectionSettings.Url + '/supervisorname_SuType?employeekey=' + empKey + '&OrganizationID=' + OrgID);
  }
  getDepartment(empKey, OrgID) {
    // return this
    //   .http
    // .get(ConectionSettings.Url + '/department?empkey=' + empKey + '&OrganizationID=' + OrgID);
    return this
      .http
      .get(ConectionSettings.Url + '/department_SuType?empkey=' + empKey + '&OrganizationID=' + OrgID);

  }
  createEmployeebyManager(EmployeeNumber, FirstName, LastName, MiddleName, BD, Gender, AddressLine1, City, AddressLine2, State, Country, PrimaryPhone, ZipCode, AlternatePhone, EmailID, HD, theCheckbox, JobTitleKey, SupervisorKey, DepartmentKey, empKey, OrgID, managerkey, isSupervisor) {
    // const url = ConectionSettings.Url + "/addemp";
    const url = ConectionSettings.Url + "/addemp_SuType";
    const obj = {
      employeenumber: EmployeeNumber,
      managerkey: managerkey,
      firstname: FirstName,
      lastname: LastName,
      middlename: MiddleName,
      birthDate: BD,
      gender: Gender,
      addressline1: AddressLine1,
      city: City,
      addressline2: AddressLine2,
      state: State,
      country: Country,
      primaryphone: PrimaryPhone,
      zipcode: ZipCode,
      alternatephone: AlternatePhone,
      email: EmailID,
      hireDate: HD,
      isSupervisor: theCheckbox,
      jobTitleKey: JobTitleKey,
      supervisorKey: SupervisorKey,
      departmentKey: DepartmentKey,
      metaupdatedBy: empKey,
      OrganizationID: OrgID,
      IsSupervisor: isSupervisor
    };
    return this.http.post(url, obj);
  }
  //Commented by Prakash
  // createEmployeebyManager(EmployeeNumber, FirstName, LastName, MiddleName, BD, Gender, AddressLine1, City, AddressLine2, State, Country, PrimaryPhone, ZipCode, AlternatePhone, EmailID, HD, theCheckbox, JobTitleKey, SupervisorKey, DepartmentKey, empKey, OrgID,managerkey) {
  //   const url = ConectionSettings.Url+"/addemp";
  //   const obj = {
  //     employeenumber: EmployeeNumber,
  //     managerkey: managerkey,
  //     firstname: FirstName,
  //     lastname: LastName,
  //     middlename: MiddleName,
  //     birthDate: BD,
  //     gender: Gender,
  //     addressline1: AddressLine1,
  //     city: City,
  //     addressline2: AddressLine2,
  //     state: State,
  //     country: Country,
  //     primaryphone: PrimaryPhone,
  //     zipcode: ZipCode,
  //     alternatephone: AlternatePhone,
  //     email: EmailID,
  //     hireDate: HD,
  //     isSupervisor: theCheckbox,
  //     jobTitleKey: JobTitleKey,
  //     supervisorKey: SupervisorKey,
  //     departmentKey: DepartmentKey,
  //     metaupdatedBy: empKey,
  //     OrganizationID: OrgID
  //   };
  //   return this.http.post(url, obj);
  // }
  //Commented by Prakash
  getAllEmployeeDetails(pagenumber, itemsPerPage, empkey, org) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/getAllEmployees?pagenumber=' + pagenumber + '&itemsPerPage=' + itemsPerPage + '&empkey=' + empkey + '&OrganizationID=' + org);

    return this
      .http
      .get(ConectionSettings.Url + '/getAllEmployees_SuType?pagenumber=' + pagenumber + '&itemsPerPage=' + itemsPerPage + '&empkey=' + empkey + '&OrganizationID=' + org);
  }
  getAllEmployeeDetailswithjobtitledropdown(seljobtitlevalue, empKey, OrgID) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/searchEmpByJobTitle?jobtitleString=' + seljobtitlevalue + '&empkey=' + empKey + '&OrganizationID=' + OrgID);

    return this
      .http
      .get(ConectionSettings.Url + '/searchEmpByJobTitle_SuType?jobtitleString=' + seljobtitlevalue + '&empkey=' + empKey + '&OrganizationID=' + OrgID);

  }
  searchResultOfEmployeedetailsTable(SearchValue, pageno, itemsPerPage, employeekey, OrganizationID) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/searchEmployeeOnTable?searchEmployee=' + SearchValue + '&pageno=' + pageno + '&itemsPerPage=' + itemsPerPage + '&employeekey=' + employeekey + '&OrganizationID=' + OrganizationID);
    return this
      .http
      .get(ConectionSettings.Url + '/searchEmployeeOnTable_SuType?searchEmployee=' + SearchValue + '&pageno=' + pageno + '&itemsPerPage=' + itemsPerPage + '&employeekey=' + employeekey + '&OrganizationID=' + OrganizationID);

  }


  UpdateEmployeeDetailsbyManager(updateBY, mankey, empk, orgid, EmployeeNumber, userRoleTypeKey, FirstName, LastName, MiddleName, BirthDate, Gender, AddressLine1, City, AddressLine2, State, Country, PrimaryPhone, ZipCode, AlternatePhone, EmailID, EmployeeStatusKey, HireDate, SupervisorKey, JobTitleKey, DepartmentKey, remark) {
    // const url = ConectionSettings.Url + "/update_employee_info";
    const url = ConectionSettings.Url + "/update_employee_info_SuType";
    const obj = {
      EmployeeKey: empk,
      managerKey: mankey,
      EmployeeNumber: EmployeeNumber,
      FirstName: FirstName,
      LastName: LastName,
      MiddleName: MiddleName,
      JobTitleKey: JobTitleKey,
      AddressLine1: AddressLine1,
      AddressLine2: AddressLine2,
      City: City,
      State: State,
      ZipCode: ZipCode,
      Country: Country,
      PrimaryPhone: PrimaryPhone,
      AlternatePhone: AlternatePhone,
      birthDate: BirthDate,
      hireDate: HireDate,
      // IsSupervisor: IsSupervisor,
      SupervisorKey: SupervisorKey,
      DepartmentKey: DepartmentKey,
      EmailID: EmailID,
      OrganizationID: orgid,
      Gender: Gender,
      UserRoleTypeKey: userRoleTypeKey,
      EmployeeStatusKey1: EmployeeStatusKey,
      Remark: remark,
      updatedBY: updateBY
    };
    return this.http.post(url, obj);
  }
  // Commented By Prakash
  // UpdateEmployeeDetailsbyManager(mankey, empk, orgid, EmployeeNumber, userRoleTypeKey, FirstName, LastName, MiddleName, BirthDate, Gender, AddressLine1, City, AddressLine2, State, Country, PrimaryPhone, ZipCode, AlternatePhone, EmailID, EmployeeStatusKey, HireDate, IsSupervisor, SupervisorKey, JobTitleKey, DepartmentKey,remark) {
  //   const url = ConectionSettings.Url+"/update_employee_info";
  //   const obj = {
  //     EmployeeKey: empk,
  //     managerKey: mankey,
  //     EmployeeNumber: EmployeeNumber,
  //     FirstName: FirstName,
  //     LastName: LastName,
  //     MiddleName: MiddleName,
  //     JobTitleKey: JobTitleKey,
  //     AddressLine1: AddressLine1,
  //     AddressLine2: AddressLine2,
  //     City: City,
  //     State: State,
  //     ZipCode: ZipCode,
  //     Country: Country,
  //     PrimaryPhone: PrimaryPhone,
  //     AlternatePhone: AlternatePhone,
  //     birthDate: BirthDate,
  //     hireDate: HireDate,
  //     IsSupervisor: IsSupervisor,
  //     SupervisorKey: SupervisorKey,
  //     DepartmentKey: DepartmentKey,
  //     EmailID: EmailID,
  //     OrganizationID: orgid,
  //     Gender: Gender,
  //     UserRoleTypeKey: userRoleTypeKey,
  //     EmployeeStatusKey1: EmployeeStatusKey,
  //     Remark:remark
  //   };
  //   return this.http.post(url, obj);


  // }
  // Commented By Prakash
  getEmployeeStatusListforDropdown(empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getEmployeeStatus?employeekey=' + empKey + '&OrganizationID=' + OrgID);
  }
  getJobTitleListforDropdown(empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/selectJobtitle?empkey=' + empKey + '&OrganizationID=' + OrgID);
  }
  getDeptListforDropdown(empKey, OrgID) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/department?empkey=' + empKey + '&OrganizationID=' + OrgID);
    return this
      .http
      .get(ConectionSettings.Url + '/department_SuType?empkey=' + empKey + '&OrganizationID=' + OrgID);

  }
  getSupervisorListforDropdown(empKey, OrgID) {
    return this
      .http
      // .get(ConectionSettings.Url + '/supervisorname?employeekey=' + empKey + '&OrganizationID=' + OrgID);
      .get(ConectionSettings.Url + '/supervisorname_SuType?employeekey=' + empKey + '&OrganizationID=' + OrgID);
  }

  EditEmployeeDetailsbyManager(empk, orgid) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/empDetails?SearchKey=' + empk + '&OrganizationID=' + orgid);
    return this
      .http
      .get(ConectionSettings.Url + '/empDetails_SuType?SearchKey=' + empk + '&OrganizationID=' + orgid);

  }
  selectEmpWithJobTSprvsrAndDept(employeekey, OrganizationID, JobTitle, Mang, DepartmentKey) {
    // const uri = ConectionSettings.Url + '/empSelectWithFilterInMeetCreate';
    const uri = ConectionSettings.Url + '/empSelectWithFilterInMeetCreate_SuType';
    const obj = {
      emKey: employeekey,
      OrgID: OrganizationID,
      JobT: JobTitle,
      Mang: Mang,
      DeptKey: DepartmentKey
    };
    return this.http.post(uri, obj);
  }
  // ****@Pooja's Code Ends here****

  getJobtitleView(empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/addNewJobTitle?empkey=' + empKey + '&OrganizationID=' + OrgID);
  }
  searchJobtitle(SearchJobTitle, empKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/searchjobTitle?OrganizationID=' + OrgID + '&searchJobTitle=' + SearchJobTitle);
  }
  addJobtitle(jobtitleName, jobTitleDescription, empKey, OrgID) {
    const url = ConectionSettings.Url + "/addJobTitleNew";
    const obj = {
      JobTitle: jobtitleName,
      JobTitleDescription: jobTitleDescription,
      empkey: empKey,
      OrganizationID: OrgID
    };

    return this.http.post(url, obj);

  }
  checkfor_jobtitle(JobtitleName, employeekey, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkForNewJobTittle?JobTitle=' + JobtitleName + '&employeekey=' + employeekey + '&OrganizationID=' + OrganizationID);
  }
  getEditJobtitleDetails(JobTitleKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/editviewJobTitle?JobTitleKey=' + JobTitleKey + '&OrganizationID=' + OrgID);
  }
  // ****@Pooja's Code Starts here****
  createEmployeebySuperAdmin(OrgID, ManagerKey, EmployeeNumber, UserRoleTypeKey, FirstName, LastName, MiddleName, BD, Gender, AddressLine1, City, AddressLine2, State, Country, PrimaryPhone, ZipCode, AlternatePhone, EmailID, HD, JobTitleKey, DepartmentKey, empKey, isSupervisor, superKey) {
    // const url = ConectionSettings.Url + "/addemp";
    const url = ConectionSettings.Url + "/addemp_SuType";
    const obj = {
      employeenumber: EmployeeNumber,
      managerkey: ManagerKey,
      firstname: FirstName,
      lastname: LastName,
      middlename: MiddleName,
      birthDate: BD,
      gender: Gender,
      addressline1: AddressLine1,
      city: City,
      addressline2: AddressLine2,
      state: State,
      country: Country,
      primaryphone: PrimaryPhone,
      zipcode: ZipCode,
      alternatephone: AlternatePhone,
      email: EmailID,
      hireDate: HD,
      jobTitleKey: JobTitleKey,
      departmentKey: DepartmentKey,
      metaupdatedBy: empKey,
      OrganizationID: OrgID,
      IsSupervisor: isSupervisor,
      supervisorKey: superKey
    };
    return this
      .http.post(url, obj);
  }
  getOrganization(OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getAllOrganization?OrganizationID=' + OrgID);
  }
  getUserRoleTypesa(OrgID) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/getAllUserRoleType_SuperAdmin?OrganizationID=' + OrgID);

    return this
      .http
      .get(ConectionSettings.Url + '/getAllUserRoleType_SuperAdmin_SuType?OrganizationID=' + OrgID);
  }
  getAllEmployeeDetailswithjobtitledropdownsa(orgid, empkey, jobtikey, mankey, page, count) {
    // const url = ConectionSettings.Url + "/employeeByAllFilter";
    const url = ConectionSettings.Url + "/employeeByAllFilter_SuType";
    const obj = {
      JobTitleKey: jobtikey,
      ManagerKey: mankey,
      employeekey: empkey,
      OrganizationID: orgid,
      pagenumber: page,
      itemsPerPage: count
    };
    return this
      .http.post(url, obj);
  }
  getvaluesForManagerDropdowninSA(empkey, orgid) {
    return this
      .http
      // .get(ConectionSettings.Url + '/getManagerForEmployee?employeekey=' + empkey + '&OrganizationID=' + orgid);
      .get(ConectionSettings.Url + '/getManagerForEmployee_SuType?employeekey=' + empkey + '&OrganizationID=' + orgid);
  }
  DeleteEmployeeDetailsbyManager(delete_EmpKey, orgID, updatedby) {
    const url = ConectionSettings.Url + "/removeEmployee";
    const obj = {
      empKey: delete_EmpKey,
      updatedBy: updatedby,
      OrganizationID: orgID
    };
    return this
      .http.post(url, obj);
  }
  getOrganizationDDforSuprAdmin(orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getAllOrganization?OrganizationID=' + orgID);
  }
  EditEmployeeDetailsbySuperadmin(empk, orgID) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/empDetails?SearchKey=' + empk + '&OrganizationID=' + orgID);
    return this
      .http
      .get(ConectionSettings.Url + '/empDetails_SuType?SearchKey=' + empk + '&OrganizationID=' + orgID);

  }
  getDepartmentforddinSuperadmin(emplokey, orgID) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/department?empkey=' + emplokey + '&OrganizationID=' + orgID);
    return this
      .http
      .get(ConectionSettings.Url + '/department_SuType?empkey=' + emplokey + '&OrganizationID=' + orgID);
  }
  getEmployeeStatusListforDropdowninSuperadmin(emplokey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getEmployeeStatus?employeekey=' + emplokey + '&OrganizationID=' + orgID);
  }
  getjobTitleforDropdowninSuperadmin(orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/JobtitleForSuperAdmin?OrganizationID=' + orgID);
  }
  UpdateEmployeeDetailsbySa(updateBY, managerKey, superKey, empk, orgID, UserRoleTypeKey, EmployeeNumber, FirstName, LastName, MiddleName, birthdt, AddressLine1, City, AddressLine2, State, Country, PrimaryPhone, ZipCode, AlternatePhone, EmailID, EmployeeStatusKey, hiredt, JobTitleKey, DepartmentKey, Gender, remark) {
    // const url = ConectionSettings.Url + "/update_employee_info";    
    const url = ConectionSettings.Url + "/update_employee_info_SuType";
    const obj = {
      EmployeeKey: empk,
      managerKey: managerKey,
      SupervisorKey: superKey,
      EmployeeNumber: EmployeeNumber,
      FirstName: FirstName,
      LastName: LastName,
      MiddleName: MiddleName,
      JobTitleKey: JobTitleKey,
      AddressLine1: AddressLine1,
      AddressLine2: AddressLine2,
      City: City,
      State: State,
      ZipCode: ZipCode,
      Country: Country,
      PrimaryPhone: PrimaryPhone,
      AlternatePhone: AlternatePhone,
      birthDate: birthdt,
      hireDate: hiredt,
      // IsSupervisor: IsSupervisor,
      DepartmentKey: DepartmentKey,
      EmailID: EmailID,
      OrganizationID: orgID,
      UserRoleTypeKey: UserRoleTypeKey,
      EmployeeStatusKey1: EmployeeStatusKey,
      Gender: Gender,
      Remark: remark,
      updatedBY: updateBY
    };
    return this.http.post(url, obj);
  }
  DeleteEmployeeDetailsbySuperadmin(delete_EmpKey, orgID, Updatdby) {
    const url = ConectionSettings.Url + "/removeEmployee";
    const obj = {
      empKey: delete_EmpKey,
      updatedBy: Updatdby,
      OrganizationID: orgID
    };
    return this
      .http.post(url, obj);
  }
  getMeetingTrainingViewforemployees(curr_date, toServeremployeekey, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/viewEmployeeMeetingTraining?meetingDate=' + curr_date + '&employeekey=' + toServeremployeekey + '&OrganizationID=' + OrganizationID);
  }
  getMeetingTrainingViewforemployee(page, count, curr_date, empKey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/gettodaysMeeting?ondate=' + curr_date + '&employeekey=' + empKey + '&pageno=' + page + '&itemsPerPage=' + count + '&OrganizationID=' + orgID);
  }

  SearchMeetingviewforemployee(SearchValue, empKey, orgID, curr_date) {
    return this
      .http
      .get(ConectionSettings.Url + '/searchEmpMeetingORTraining?OrganizationID=' + orgID + '&searchActionType=' + SearchValue + '&toServeremployeekey=' + empKey + '&today_DT=' + curr_date);
  }
  getuserNamePasswordforsaveandSendemail(page, count, empKey, orgid) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/getLoginDetailsForAllUsers?pageno=' + page + '&itemsperpage=' + count + '&employeekey=' + empKey + '&OrganizationID=' + orgid);
    return this
      .http
      .get(ConectionSettings.Url + '/getLoginDetailsForAllUsers_SuType?pageno=' + page + '&itemsperpage=' + count + '&employeekey=' + empKey + '&OrganizationID=' + orgid);

  }
  CheckForEmployeenumber(EmployeeNumber, employeekey, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkforEmployeeNumber?Employeenumber=' + EmployeeNumber + '&employeekey=' + employeekey + '&OrganizationID=' + OrganizationID);
  }
  // ****@Pooja's Code Ends here****
  updateEditJobtitle(JobTitle_Key, jobtitleName, jobTitleDescription, empKey, OrgID) {

    const url = ConectionSettings.Url + "/updateSelectedJobTitle";
    const obj = {
      JobTitleKey: JobTitle_Key,
      JobTitle: jobtitleName,
      JobTitleDescription: jobTitleDescription,
      empkey: empKey,
      OrganizationID: OrgID
    };
    return this.http.post(url, obj);
  }
  deleteJobTitle(deleteJobtitleKey, OrgID) {
    const url = ConectionSettings.Url + "/deleteJobTitleSelected";
    const obj = {
      JobTitleKey: deleteJobtitleKey,
      OrganizationID: OrgID
    };
    return this.http.post(url, obj);
  }

  searchLoginCredsList(key, empKey, orgID) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/searchEmployeeList?searchEmployee=' + key + '&employeekey=' + empKey + '&OrganizationID=' + orgID);

    return this
      .http
      .get(ConectionSettings.Url + '/searchEmployeeList_SuType?searchEmployee=' + key + '&employeekey=' + empKey + '&OrganizationID=' + orgID);

  }

  getmanagersForEmp(empKey, orgID) {
    return this
      .http
      // .get(ConectionSettings.Url + '/getManagerForEmployee?employeekey=' + empKey + '&OrganizationID=' + orgID);
      .get(ConectionSettings.Url + '/getManagerForEmployee_SuType?employeekey=' + empKey + '&OrganizationID=' + orgID);
  }

  createEmployeebyAdmin(EmployeeNumber, ManagerKey, FirstName, LastName, MiddleName, BD, Gender, AddressLine1, City, AddressLine2, State, Country, PrimaryPhone, ZipCode, AlternatePhone, EmailID, HD, JobTitleKey, DepartmentKey, employeekey, OrganizationID, issupervisor, superKey) {
    // , start_sun_hour, start_sun_min, start_sun_format, start_mon_hour, start_mon_min, start_mon_format, start_tue_hour, start_tue_min, start_tue_format, start_wed_hour, start_wed_min, start_wed_format, start_thu_hour, start_thu_min, start_thu_format, start_fri_hour, start_fri_min, start_fri_format, start_sat_hour, start_sat_min, start_sat_format, end_sun_hour, end_sun_min, end_sun_format, end_mon_hour, end_mon_min, end_mon_format, end_tue_hour, end_tue_min, end_tue_format, end_wed_hour, end_wed_min, end_wed_format, end_thu_hour, end_thu_min, end_thu_format, end_fri_hour, end_fri_min, end_fri_format, end_sat_hour, end_sat_min, end_sat_format, idscheduler_exception, idmaster_exception_weekend, idemployeegrouping
    // const url = ConectionSettings.Url + "/addemp";addemp_SuType
    const url = ConectionSettings.Url + "/addemp_SuType";
    const obj = {
      employeenumber: EmployeeNumber,
      managerkey: ManagerKey,
      firstname: FirstName,
      lastname: LastName,
      middlename: MiddleName,
      birthDate: BD,
      gender: Gender,
      addressline1: AddressLine1,
      city: City,
      addressline2: AddressLine2,
      state: State,
      country: Country,
      primaryphone: PrimaryPhone,
      zipcode: ZipCode,
      alternatephone: AlternatePhone,
      email: EmailID,
      hireDate: HD,
      // isSupervisor: issupervisor,
      jobTitleKey: JobTitleKey,
      departmentKey: DepartmentKey,
      metaupdatedBy: employeekey,
      OrganizationID: OrganizationID,
      IsSupervisor: issupervisor,
      supervisorKey: superKey
      //Author: Prakash Code Starts for Employee Calendar Starts Here
      // start_sun_hour: start_sun_hour,
      // start_sun_min: start_sun_min,
      // start_sun_format: start_sun_format,
      // start_mon_hour: start_mon_hour,
      // start_mon_min: start_mon_min,
      // start_mon_format: start_mon_format,
      // start_tue_hour: start_tue_hour,
      // start_tue_min: start_tue_min,
      // start_tue_format: start_tue_format,
      // start_wed_hour: start_wed_hour,
      // start_wed_min: start_wed_min,
      // start_wed_format: start_wed_format,
      // start_thu_hour: start_thu_hour,
      // start_thu_min: start_thu_min,
      // start_thu_format: start_thu_format,
      // start_fri_hour: start_fri_hour,
      // start_fri_min: start_fri_min,
      // start_fri_format: start_fri_format,
      // start_sat_hour: start_sat_hour,
      // start_sat_min: start_sat_min,
      // start_sat_format: start_sat_format,
      // end_sun_hour: end_sun_hour,
      // end_sun_min: end_sun_min,
      // end_sun_format: end_sun_format,
      // end_mon_hour: end_mon_hour,
      // end_mon_min: end_mon_min,
      // end_mon_format: end_mon_format,
      // end_tue_hour: end_tue_hour,
      // end_tue_min: end_tue_min,
      // end_tue_format: end_tue_format,
      // end_wed_hour: end_wed_hour,
      // end_wed_min: end_wed_min,
      // end_wed_format: end_wed_format,
      // end_thu_hour: end_thu_hour,
      // end_thu_min: end_thu_min,
      // end_thu_format: end_thu_format,
      // end_fri_hour: end_fri_hour,
      // end_fri_min: end_fri_min,
      // end_fri_format: end_fri_format,
      // end_sat_hour: end_sat_hour,
      // end_sat_min: end_sat_min,
      // end_sat_format: end_sat_format,

      // idscheduler_exception: idscheduler_exception,

      // idmaster_exception_weekend: idmaster_exception_weekend,
      // idemployeegrouping: idemployeegrouping

      //Author: Prakash Code Starts for Employee Calendar Ends Here
    };
    return this.http.post(url, obj);
  }

  checkEmpNumber(empNumber, empKey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkforEmployeeNumber?Employeenumber=' + empNumber + '&employeekey=' + empKey + '&OrganizationID=' + orgID);
  }

  checkUserName(userName, empKey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkUsername?username=' + userName + '&employeekey=' + empKey + '&OrganizationID=' + orgID);
  }

  setLoginCreds(userName, passWord, empKey, employeekey, uRoleTypeKey, OrgID) {
    // const url = ConectionSettings.Url + "/setUsernamePassword";
    const url = ConectionSettings.Url + "/setUsernamePassword_SuType";
    const obj = {
      username: userName,
      password: passWord,
      employeekey: empKey,
      updatedBy: employeekey,
      userRoleTypeKey: uRoleTypeKey,
      OrganizationID: OrgID
    };
    return this.http.post(url, obj);
  }

  getEmployeeByFilters(page, count, jobtKey, managerKey, empKey, orgID) {
    // const url = ConectionSettings.Url + "/employeeByAllFilter";
    const url = ConectionSettings.Url + "/employeeByAllFilter_SuType";
    const obj = {
      JobTitleKey: jobtKey,
      ManagerKey: managerKey,
      employeekey: empKey,
      pagenumber: page,
      itemsPerPage: count,
      OrganizationID: orgID
    };
    return this.http.post(url, obj);
  }
  JobtitleForSuperAdmin(OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/JobtitleForSuperAdmin?OrganizationID=' + OrganizationID);

  }
  addMeetinTraingByNewEvent(obj) {
    const url = ConectionSettings.Url + "/addMeetinTraingByNewEvent";
    return this.http.post(url, obj);
  }
  getempdettblwithslctdJbtitleNempStatus(JobTitleKey, EmployeeStatusKey, employeekey, OrganizationID) {
    const url = ConectionSettings.Url + "/employeeByJbtitleNempStatusFilter";
    const obj = {
      JbTitlKy: JobTitleKey,
      empstskey: EmployeeStatusKey,
      empkey: employeekey,
      orgid: OrganizationID
    };
    return this.http.post(url, obj);
  }


  // *** PTO & Trade ends...
  //code by aswathy starts here...

  submitRequest(curr_date, toServeremployeekey, OrganizationID, startdate, enddate, comments, reason) {
    const url = ConectionSettings.Url + "/savePTORequest";
    const obj = {
      currentdate: curr_date,
      employeekey: toServeremployeekey,
      OrganizationID: OrganizationID,
      startdate: startdate,
      enddate: enddate,
      comments: comments,
      ptoreason: reason
    };
    return this.http.post(url, obj);
  }
  getRequestdetails(employeekey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getRequestDetails?OrganizationID=' + orgID + '&employeekey=' + employeekey);
  }
  getRequestInfoforEmployee(ptorequestID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getRequestDetailsforEmployee?ptorequestDetails=' + ptorequestID);
  }
  setEditedRequest(curr_date, ptorequestID$, StartDate, EndDate, Comments, reason, empKey) {
    const url = ConectionSettings.Url + "/setEditedRequest";
    const obj = {
      currdate: curr_date,
      ptorequestID: ptorequestID$,
      StartDate: StartDate,
      EndDate: EndDate,
      Comments: Comments,
      Reason: reason,
      EmpKey: empKey
    };
    return this.http.post(url, obj);
  }
  deletePTORequest(deleteRequestKey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/deletePTORequest?deleteRequestKey=' + deleteRequestKey + '&OrganizationID=' + orgID);
  }
  getRequestdetailsforManager(empKey, orgID) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/getRequestdetailsforManager?OrganizationID=' + orgID + '&employeekey=' + empKey);

    return this
      .http
      .get(ConectionSettings.Url + '/getRequestdetailsforManager_SuType?OrganizationID=' + orgID + '&employeekey=' + empKey);

  }
  getRequestdetailsbyID(ptorequestDetails$) {
    return this
      .http
      .get(ConectionSettings.Url + '/getRequestDetailsbyID?ptorequestDetailskey=' + ptorequestDetails$);
  }
  getassignmentdetailsbyID(ptorequestDetails) {
    return this
      .http
      .get(ConectionSettings.Url + '/getassignmentdetailsbyID?ptorequestDetailskey=' + ptorequestDetails);
  }
  saveRequestAction(ptorequestDetails$, employeekey, statuscurrentdate, approvedstartdate, ApprovedEndDate, StatusKey, statuscomments) {
    const url = ConectionSettings.Url + "/savePTORequestAction";
    const obj = {
      ptorequestDetails: ptorequestDetails$,
      employeekey: employeekey,
      statuscurrentdate: statuscurrentdate,
      approvedstartdate: approvedstartdate,
      ApprovedEndDate: ApprovedEndDate,
      StatusKey: StatusKey,
      statuscomments: statuscomments
    };
    return this.http.post(url, obj);
  }
  getAllEmployeeNames(OrganizationID, toServeremployeekey) {
    return this
      .http
      // .get(ConectionSettings.Url + '/getAllEmployeeNames?OrganizationID=' + OrganizationID + '&employeekey=' + toServeremployeekey);
      .get(ConectionSettings.Url + '/getAllEmployeeNames_SuType?OrganizationID=' + OrganizationID + '&employeekey=' + toServeremployeekey);
  }
  submitTradeRequest(curr_date, toServeremployeekey, OrganizationID, EmployeeKey, startdate, enddate, comments) {
    const url = ConectionSettings.Url + "/saveTradeRequest";
    const obj = {
      currentdate: curr_date,
      toServeremployeekey: toServeremployeekey,
      OrganizationID: OrganizationID,
      EmployeeKey: EmployeeKey,
      startdate: startdate,
      enddate: enddate,
      comments: comments
    };
    return this.http.post(url, obj);
  }

  getTradeRequestdetails(orgID, employeekey) {
    return this
      .http
      .get(ConectionSettings.Url + '/getTradeRequestDetails?OrganizationID=' + orgID + '&employeekey=' + employeekey);
  }
  deleteTradeRequest(deleteRequestKey, empKey) {
    return this
      .http
      .get(ConectionSettings.Url + '/deleteTradeRequest?deleteRequestKey=' + deleteRequestKey + '&employeeKey=' + empKey);
  }
  getTradeRequestInfoforEmployee(traderequestDetails, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getTradeRequestInfoforEmployee?traderequestDetails=' + traderequestDetails + '&OrganizationID=' + OrganizationID);
  }
  setEditedTradeRequest(curr_date, traderequestID, OtherEmployee, StartDate, EndDate, Comments) {
    const url = ConectionSettings.Url + "/setEditedTradeRequest";
    const obj = {
      currdate: curr_date,
      traderequestID: traderequestID,
      OtherEmployee: OtherEmployee,
      StartDate: StartDate,
      EndDate: EndDate,
      Comments: Comments
    };
    return this.http.post(url, obj);
  }
  getTradeRequestdetailsforManager(tradeobj) {
    const url = ConectionSettings.Url + '/getTradeRequestdetailsforManager';
    return this
      .http
      .post(url, tradeobj);
  }
  getTradeRequestdetailsbyID(traderequestID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getTradeRequestdetailsbyID?tradeRequestID=' + traderequestID)
  }
  getAssignmentTradebyID(traderequestID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getAssignmentTradebyID?traderequestID=' + traderequestID)
  }
  saveTradeRequestAction(tradeRequestID, employeekey, statuscurrentdate, approvedstartdate, ApprovedEndDate, StatusKey, statuscomments) {
    const url = ConectionSettings.Url + "/saveTradeRequestAction";
    const obj = {
      tradeRequestID: tradeRequestID,
      employeekey: employeekey,
      statuscurrentdate: statuscurrentdate,
      approvedstartdate: approvedstartdate,
      ApprovedEndDate: ApprovedEndDate,
      StatusKey: StatusKey,
      statuscomments: statuscomments
    };
    return this.http.post(url, obj);
  }

  // code by aswathy ends here...
  // *** PTO & Trade ends...
  //Author: Prakash Code Starts for Employee Calendar Starts Here
  getallschedulingexception(OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getallschedulingexception?OrganizationID=' + OrgID);

  }
  getallexceptionweekend() {
    return this
      .http
      .get(ConectionSettings.Url + '/getallexceptionweekend');

  }
  getallmasterhour() {
    return this
      .http
      .get(ConectionSettings.Url + '/getallmasterhour');

  }
  getallmasterminute() {
    return this
      .http
      .get(ConectionSettings.Url + '/getallmasterminute');

  }
  // UpdateEmployeeDetailsbyManager(mankey, empk, orgid, EmployeeNumber, userRoleTypeKey, FirstName, LastName, MiddleName, BirthDate, Gender, AddressLine1, City, AddressLine2, State, Country, PrimaryPhone, ZipCode, AlternatePhone, EmailID, EmployeeStatusKey, HireDate, IsSupervisor, SupervisorKey, JobTitleKey, DepartmentKey, remark, start_sun_hour, start_sun_min, start_sun_format, start_mon_hour, start_mon_min, start_mon_format, start_tue_hour, start_tue_min, start_tue_format, start_wed_hour, start_wed_min, start_wed_format, start_thu_hour, start_thu_min, start_thu_format, start_fri_hour, start_fri_min, start_fri_format, start_sat_hour, start_sat_min, start_sat_format, end_sun_hour, end_sun_min, end_sun_format, end_mon_hour, end_mon_min, end_mon_format, end_tue_hour, end_tue_min, end_tue_format, end_wed_hour, end_wed_min, end_wed_format, end_thu_hour, end_thu_min, end_thu_format, end_fri_hour, end_fri_min, end_fri_format, end_sat_hour, end_sat_min, end_sat_format, idscheduler_exception, idmaster_exception_weekend, idemployeegrouping) {
  //   const url = ConectionSettings.Url + "/update_employee_info";
  //   const obj = {
  //     EmployeeKey: empk,
  //     managerKey: mankey,
  //     EmployeeNumber: EmployeeNumber,
  //     FirstName: FirstName,
  //     LastName: LastName,
  //     MiddleName: MiddleName,
  //     JobTitleKey: JobTitleKey,
  //     AddressLine1: AddressLine1,
  //     AddressLine2: AddressLine2,
  //     City: City,
  //     State: State,
  //     ZipCode: ZipCode,
  //     Country: Country,
  //     PrimaryPhone: PrimaryPhone,
  //     AlternatePhone: AlternatePhone,
  //     birthDate: BirthDate,
  //     hireDate: HireDate,
  //     IsSupervisor: IsSupervisor,
  //     SupervisorKey: SupervisorKey,
  //     DepartmentKey: DepartmentKey,
  //     EmailID: EmailID,
  //     OrganizationID: orgid,
  //     Gender: Gender,
  //     UserRoleTypeKey: userRoleTypeKey,
  //     EmployeeStatusKey1: EmployeeStatusKey,
  //     Remark: remark,

  //     start_sun_hour: start_sun_hour,
  //     start_sun_min: start_sun_min,
  //     start_sun_format: start_sun_format,
  //     start_mon_hour: start_mon_hour,
  //     start_mon_min: start_mon_min,
  //     start_mon_format: start_mon_format,
  //     start_tue_hour: start_tue_hour,
  //     start_tue_min: start_tue_min,
  //     start_tue_format: start_tue_format,
  //     start_wed_hour: start_wed_hour,
  //     start_wed_min: start_wed_min,
  //     start_wed_format: start_wed_format,
  //     start_thu_hour: start_thu_hour,
  //     start_thu_min: start_thu_min,
  //     start_thu_format: start_thu_format,
  //     start_fri_hour: start_fri_hour,
  //     start_fri_min: start_fri_min,
  //     start_fri_format: start_fri_format,
  //     start_sat_hour: start_sat_hour,
  //     start_sat_min: start_sat_min,
  //     start_sat_format: start_sat_format,
  //     end_sun_hour: end_sun_hour,
  //     end_sun_min: end_sun_min,
  //     end_sun_format: end_sun_format,
  //     end_mon_hour: end_mon_hour,
  //     end_mon_min: end_mon_min,
  //     end_mon_format: end_mon_format,
  //     end_tue_hour: end_tue_hour,
  //     end_tue_min: end_tue_min,
  //     end_tue_format: end_tue_format,
  //     end_wed_hour: end_wed_hour,
  //     end_wed_min: end_wed_min,
  //     end_wed_format: end_wed_format,
  //     end_thu_hour: end_thu_hour,
  //     end_thu_min: end_thu_min,
  //     end_thu_format: end_thu_format,
  //     end_fri_hour: end_fri_hour,
  //     end_fri_min: end_fri_min,
  //     end_fri_format: end_fri_format,
  //     end_sat_hour: end_sat_hour,
  //     end_sat_min: end_sat_min,
  //     end_sat_format: end_sat_format,

  //     idscheduler_exception: idscheduler_exception,

  //     idmaster_exception_weekend: idmaster_exception_weekend,
  //     idemployeegrouping: idemployeegrouping
  //   };
  //   return this.http.post(url, obj);
  // }

  // createEmployeebyManager(empschobj) {
  //   const url = ConectionSettings.Url + "/addemp";

  //   return this.http.post(url, empschobj);
  // }
  getallemployeegrouping(OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getallemployeegrouping?OrganizationID=' + OrgID);

  }
  getUserRoletypeForManager(OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getUserRoletypeForManager?OrganizationID=' + OrgID);
  }
  getweeklyschedulebyEmployeeGroupid(employeegroupid) {
    return this
      .http
      .get(ConectionSettings.Url + '/getweeklyschedulebyEmployeeGroupid?SearchKey=' + employeegroupid);
  }
  Employeecreateeditweeklyschedule(empk, metaupdatekey, orgid, start_sun_hour, start_sun_min, start_sun_format, start_mon_hour, start_mon_min, start_mon_format, start_tue_hour, start_tue_min, start_tue_format, start_wed_hour, start_wed_min, start_wed_format, start_thu_hour, start_thu_min, start_thu_format, start_fri_hour, start_fri_min, start_fri_format, start_sat_hour, start_sat_min, start_sat_format, end_sun_hour, end_sun_min, end_sun_format, end_mon_hour, end_mon_min, end_mon_format, end_tue_hour, end_tue_min, end_tue_format, end_wed_hour, end_wed_min, end_wed_format, end_thu_hour, end_thu_min, end_thu_format, end_fri_hour, end_fri_min, end_fri_format, end_sat_hour, end_sat_min, end_sat_format, idscheduler_exception, idemployeegrouping, exceptionstartdate) {
    console.log("inservice " + exceptionstartdate)
    const url = ConectionSettings.Url + "/employeecreateeditweeklyschedule";
    const obj = {
      EmployeeKey: empk,
      OrganizationID: orgid,

      start_sun_hour: start_sun_hour,
      start_sun_min: start_sun_min,
      start_sun_format: start_sun_format,
      start_mon_hour: start_mon_hour,
      start_mon_min: start_mon_min,
      start_mon_format: start_mon_format,
      start_tue_hour: start_tue_hour,
      start_tue_min: start_tue_min,
      start_tue_format: start_tue_format,
      start_wed_hour: start_wed_hour,
      start_wed_min: start_wed_min,
      start_wed_format: start_wed_format,
      start_thu_hour: start_thu_hour,
      start_thu_min: start_thu_min,
      start_thu_format: start_thu_format,
      start_fri_hour: start_fri_hour,
      start_fri_min: start_fri_min,
      start_fri_format: start_fri_format,
      start_sat_hour: start_sat_hour,
      start_sat_min: start_sat_min,
      start_sat_format: start_sat_format,
      end_sun_hour: end_sun_hour,
      end_sun_min: end_sun_min,
      end_sun_format: end_sun_format,
      end_mon_hour: end_mon_hour,
      end_mon_min: end_mon_min,
      end_mon_format: end_mon_format,
      end_tue_hour: end_tue_hour,
      end_tue_min: end_tue_min,
      end_tue_format: end_tue_format,
      end_wed_hour: end_wed_hour,
      end_wed_min: end_wed_min,
      end_wed_format: end_wed_format,
      end_thu_hour: end_thu_hour,
      end_thu_min: end_thu_min,
      end_thu_format: end_thu_format,
      end_fri_hour: end_fri_hour,
      end_fri_min: end_fri_min,
      end_fri_format: end_fri_format,
      end_sat_hour: end_sat_hour,
      end_sat_min: end_sat_min,
      end_sat_format: end_sat_format,

      idscheduler_exception: idscheduler_exception,
      idemployeegrouping: idemployeegrouping,
      exceptionstartdate: exceptionstartdate,
      metaupdatekey: metaupdatekey

    };
    return this.http.post(url, obj);
  }

  //Author: Prakash Code Starts for Employee Calendar Ends Here

  getAllReasons(OrgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getAllReasonsForLeaves?OrganizationID=' + OrgID);

  }
  saveManualLeaveForEmployee(reasonId, fromDate, toDate, empKey, metaKey, orgID) {
    const obj = {
      reason: reasonId,
      from: fromDate,
      to: toDate,
      empkey: empKey,
      metauser: metaKey,
      orgid: orgID
    }
    const url = ConectionSettings.Url + "/saveLeaveForEmp";
    return this.http.post(url, obj);


  }

  AllEmployeeWorkingHourList(pagenumber, itemsPerPage, empkey, org) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/AllEmployeeWorkingHourList?pagenumber=' + pagenumber + '&itemsPerPage=' + itemsPerPage + '&empkey=' + empkey + '&OrganizationID=' + org);

    return this
      .http
      .get(ConectionSettings.Url + '/AllEmployeeWorkingHourList_SuType?pagenumber=' + pagenumber + '&itemsPerPage=' + itemsPerPage + '&empkey=' + empkey + '&OrganizationID=' + org);

  }
  searchAllEmployeeWorkingHourList(SearchValue, pageno, itemsPerPage, employeekey, OrganizationID) {
    // return this
    //   .http
    //   .get(ConectionSettings.Url + '/searchAllEmployeeWorkingHourList?searchEmployee=' + SearchValue + '&pageno=' + pageno + '&itemsPerPage=' + itemsPerPage + '&employeekey=' + employeekey + '&OrganizationID=' + OrganizationID);

    return this
      .http
      .get(ConectionSettings.Url + '/searchAllEmployeeWorkingHourList_SuType?searchEmployee=' + SearchValue + '&pageno=' + pageno + '&itemsPerPage=' + itemsPerPage + '&employeekey=' + employeekey + '&OrganizationID=' + OrganizationID);
  }
  getWorkingHourListForEmployee(startDT, endDT, selectEmpKey, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getWorkingHourListForEmployee?startDT=' + startDT + '&endDT=' + endDT + '&selectEmpKey=' + selectEmpKey + '&OrganizationID=' + OrganizationID);
  }
  deleteWorkingHours(obj) {
    const url = ConectionSettings.Url + "/deleteWorkingHours";

    return this.http.post(url, obj);
  }
  workingHourDateFilter(obj) {
    const url = ConectionSettings.Url + "/workingHourDateFilter";

    return this.http.post(url, obj);
  }
  createEmpWorkingHour(obj) {
    const url = ConectionSettings.Url + "/createEmpWorkingHour";
    return this.http.post(url, obj);
  }
  getPTORequestdetailsforManager(vpto) {
    // const url = ConectionSettings.Url+'/getPtoRequestdetailsforManager';
    const url = ConectionSettings.Url + '/getPtoRequestdetailsforManager_SuType';
    return this
      .http
      .post(url, vpto);
  }

  checkEventDuplicate(eventType, eventName, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkForNewEventType?eventType=' + eventType + '&eventName=' + eventName + '&OrganizationID=' + orgID);

  }
  checkEventDuplicateForEdit(ActionType, Action, ActionKey, ActionTypeKey, OrganizationID) {
    return this
      .http
      .get(ConectionSettings.Url + '/checkForDuplicateEventType?ActionType=' + ActionType + '&Action=' + Action + '&ActionTypeKey=' + ActionTypeKey +
        '&ActionKey=' + ActionKey + '&OrganizationID=' + OrganizationID);

  }

  cancelPTObyEmployee(ptorequestID$, empKey, orgID, curDate) {
    const url = ConectionSettings.Url + "/cancelPTORequest";
    const obj = {
      todayDate: curDate,
      ptorequestID: ptorequestID$,
      EmpKey: empKey,
      OrgID: orgID
    };
    return this.http.post(url, obj);
  }

  requestForTradeCancel(TradeRequestID, empKey, curDate) {
    const url = ConectionSettings.Url + "/requestForTradeCancel";
    const obj = {
      todayDate: curDate,
      traderequestID: TradeRequestID,
      EmpKey: empKey
    };
    return this.http.post(url, obj);
  }


  tradeCancelApprove(TradeRequestID, empKey, curDate) {
    const url = ConectionSettings.Url + "/tradeCancelApprove";
    const obj = {
      todayDate: curDate,
      traderequestID: TradeRequestID,
      EmpKey: empKey
    };
    return this.http.post(url, obj);
  }


  getTradeStatus(orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getTradeStatus?orgID=' + orgID);
  }
}
