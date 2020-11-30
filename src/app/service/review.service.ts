import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConectionSettings } from './ConnectionSetting';
@Injectable({
  providedIn: 'root'
})
export class ReviewService {

  constructor(private http: HttpClient) { }

  submitReview(obj) {
    const url = ConectionSettings.Url + "/addReview";
    return this.http.post(url, obj);
  }
  UserWorkRequest(obj) {
    const url = ConectionSettings.Url + "/addUserWorkRequest";
    return this.http.post(url, obj);
  }
  getReviewQuestions(tempKey, orgID) {
    return this
      .http
      .get(ConectionSettings.Url + '/getReviewQuestionDetails?templateID=' + tempKey + '&OrganizationID=' + orgID);
  }
  setReviewDetails(obj) {
    const url = ConectionSettings.Url + "/addReviewDetails";
    return this.http.post(url, obj);
  }
}
