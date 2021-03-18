import { Component, OnInit } from '@angular/core';
import { ConectionSettings } from '../../service/ConnectionSetting';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
@Component({
  selector: 'app-support-page',
  templateUrl: './support-page.component.html',
  styleUrls: ['./support-page.component.scss']
})
export class SupportPageComponent implements OnInit {
  useType;
  EmailID;
  comments;
  FirstName; LastName; Organization;
  checkFlag;
  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit() {
    this.useType = "";
    this.checkFlag = false;
  }

  Submit() {
    this.checkFlag = true;
    if (this.useType === 'Support') {
      if (!(this.EmailID)) {
        alert("Please enter your email id");
        this.checkFlag = false; return;
      } else if (this.EmailID) {
        if (!(this.EmailID.trim())) {
          alert("Please enter your email id");
          this.checkFlag = false; return;
        }
      }

      if (!(this.comments)) {
        alert("Please enter your query");
        this.checkFlag = false; return;
      } else if (this.comments) {
        if (!(this.comments.trim())) {
          alert("Please enter your query");
          this.checkFlag = false; return;
        }
      }


      this.comments = this.comments.trim();

      const tomail = "troodonits@gmail.com"
      const obj = {
        from: this.EmailID,
        to: tomail,
        subject: 'Troowork Support Mail',
        text: this.comments
      };
      const url = ConectionSettings.Url + "/sendmail";
      this.callalert();
      this.checkFlag = false;
      return this.http.post(url, obj)
        .subscribe(res => console.log("Mail sent")
        );

    } else if (this.useType === 'User Registration') {
      if (!(this.FirstName)) {
        alert("Please enter your first name");
        this.checkFlag = false; return;
      } else if (this.FirstName) {
        if (!(this.FirstName.trim())) {
          alert("Please enter your first name");
          this.checkFlag = false; return;
        }
      }

      if (!(this.LastName)) {
        alert("Please enter your last name");
        this.checkFlag = false; return;
      } else if (this.LastName) {
        if (!(this.LastName.trim())) {
          alert("Please enter your last name");
          this.checkFlag = false; return;
        }
      }
      if (!(this.Organization)) {
        alert("Please enter your organization name");
        this.checkFlag = false; return;
      } else if (this.Organization) {
        if (!(this.Organization.trim())) {
          alert("Please enter your organization name");
          this.checkFlag = false; return;
        }
      }

      if (!(this.EmailID)) {
        alert("Please enter your email id");
        this.checkFlag = false; return;
      } else if (this.EmailID) {
        if (!(this.EmailID.trim())) {
          alert("Please enter your email id");
          this.checkFlag = false; return;
        }
      }

      const userdetails = "First name is " + this.FirstName + " \n Last name is " + this.LastName + "\nOrganizaton is " + this.Organization + "\nEmail id is " + this.EmailID;

      const tomail = "troodonits@gmail.com"
      const obj = {
        from: this.EmailID,
        to: tomail,
        subject: 'Troowork Registration Request',
        text: userdetails
      };
      const url = ConectionSettings.Url + "/sendmail";
      this.callalert1();
      this.checkFlag = false;
      return this.http.post(url, obj)
        .subscribe(res => console.log("Mail sent")
        );

    }



  }
  callalert() {
    console.log("Mail sent");
    alert("Your request has been submitted. The support team will get back to you soon");
    this.router.navigate(['']);
  }

  callalert1() {
    console.log("Mail sent");
    alert("Your request for registration has been submitted. Login details will be shared with you soon");
    this.router.navigate(['']);
  }
}
