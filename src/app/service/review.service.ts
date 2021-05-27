import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConectionSettings } from './ConnectionSetting';
@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) { }

  submitReview(obj) {
    const url = ConectionSettings.AbsUrl + "/addReview";
    return this.http.post(url, obj);
  }

  UserWorkRequest(obj) {
    const url = ConectionSettings.AbsUrl + "/addUserWorkRequest";
    return this.http.post(url, obj);
  }

  getReviewQuestions(tempKey, orgID) {
    return this
      .http
      .get(ConectionSettings.AbsUrl + '/getReviewQuestionDetails?templateID=' + tempKey + '&OrganizationID=' + orgID);
  }

  setReviewDetails(obj) {
    const url = ConectionSettings.AbsUrl + "/addReviewDetails";
    return this.http.post(url, obj);
  }

  getLastCleanedDetails(roomKey, orgID) {
    return this.http.
      get(ConectionSettings.AbsUrl + '/getLastCleaningDetails?roomKey=' + roomKey + "&orgID=" + orgID);
  }

  getTemplateDetailsForFeedback(roomKey, OrgID) {
    return this
      .http
      .get(ConectionSettings.AbsUrl + '/getTemplateDetailsForFeedbackByRoomID_OrgId?roomKey=' + roomKey + '&OrganizationID=' + OrgID);
  }

  getPickListValuesforfeedback(orgID) {
    return this
      .http
      .get(ConectionSettings.AbsUrl + '/getPickValuesListForFeedback?OrganizationID=' + orgID);
  }

}
