import { Component, OnInit } from '@angular/core';
import { ConectionSettings } from '../../service/ConnectionSetting';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { MatDialog } from '@angular/material/dialog';
import { AlertdialogComponent } from '../dialog/alertdialog/alertdialog.component';
import { ConfirmationdialogComponent, ConfirmDialogModel } from '../dialog/confirmationdialog/confirmationdialog.component';

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
  constructor(private router: Router, private http: HttpClient, private dialog: MatDialog) { }

  ngOnInit() {
    this.useType = "";
    this.checkFlag = false;
  }
  // Function to save the support request details
  Submit() {
    this.checkFlag = true;
    if (this.useType === 'Support') {
      if (!(this.EmailID)) {
        // alert("Please enter your email id");
        const dialogRef = this.dialog.open(AlertdialogComponent, {
          data: {
            message: 'Please enter your email id!!',
            buttonText: {
              cancel: 'Done'
            }
          },
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          this.checkFlag = false; return;
        });

      } else if (this.EmailID) {
        if (!(this.EmailID.trim())) {
          // alert("Please enter your email id");
          const dialogRef = this.dialog.open(AlertdialogComponent, {
            data: {
              message: 'Please enter your email id!!',
              buttonText: {
                cancel: 'Done'
              }
            },
          });
          dialogRef.afterClosed().subscribe(dialogResult => {
            this.checkFlag = false; return;
          });
        }
      }

      if (!(this.comments)) {
        // alert("Please enter your query");
        const dialogRef = this.dialog.open(AlertdialogComponent, {
          data: {
            message: 'Please enter your query!!',
            buttonText: {
              cancel: 'Done'
            }
          },
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          this.checkFlag = false; return;
        });
      } else if (this.comments) {
        if (!(this.comments.trim())) {
          // alert("Please enter your query");
          const dialogRef = this.dialog.open(AlertdialogComponent, {
            data: {
              message: 'Please enter your query!!',
              buttonText: {
                cancel: 'Done'
              }
            },
          });
          dialogRef.afterClosed().subscribe(dialogResult => {
            this.checkFlag = false; return;
          });
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
        // alert("Please enter your first name");
        const dialogRef = this.dialog.open(AlertdialogComponent, {
          data: {
            message: 'Please enter your first name!!',
            buttonText: {
              cancel: 'Done'
            }
          },
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          this.checkFlag = false; return;
        });
      } else if (this.FirstName) {
        if (!(this.FirstName.trim())) {
          // alert("Please enter your first name");
          const dialogRef = this.dialog.open(AlertdialogComponent, {
            data: {
              message: 'Please enter your first name!!',
              buttonText: {
                cancel: 'Done'
              }
            },
          });
          dialogRef.afterClosed().subscribe(dialogResult => {
            this.checkFlag = false; return;
          });
        }
      }

      if (!(this.LastName)) {
        // alert("Please enter your last name");
        const dialogRef = this.dialog.open(AlertdialogComponent, {
          data: {
            message: 'Please enter your last name!!',
            buttonText: {
              cancel: 'Done'
            }
          },
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          this.checkFlag = false; return;
        });
      } else if (this.LastName) {
        if (!(this.LastName.trim())) {
          // alert("Please enter your last name");
          const dialogRef = this.dialog.open(AlertdialogComponent, {
            data: {
              message: 'Please enter your last name!!',
              buttonText: {
                cancel: 'Done'
              }
            },
          });
          dialogRef.afterClosed().subscribe(dialogResult => {
            this.checkFlag = false; return;
          });
        }
      }
      if (!(this.Organization)) {
        // alert("Please enter your organization name");
        const dialogRef = this.dialog.open(AlertdialogComponent, {
          data: {
            message: 'Please enter your organization name!!',
            buttonText: {
              cancel: 'Done'
            }
          },
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          this.checkFlag = false; return;
        });
      } else if (this.Organization) {
        if (!(this.Organization.trim())) {
          // alert("Please enter your organization name");
          const dialogRef = this.dialog.open(AlertdialogComponent, {
            data: {
              message: 'Please enter your organization name!!',
              buttonText: {
                cancel: 'Done'
              }
            },
          });
          dialogRef.afterClosed().subscribe(dialogResult => {
            this.checkFlag = false; return;
          });
        }
      }

      if (!(this.EmailID)) {
        // alert("Please enter your email id");
        const dialogRef = this.dialog.open(AlertdialogComponent, {
          data: {
            message: 'Please enter your email id!!',
            buttonText: {
              cancel: 'Done'
            }
          },
        });
        dialogRef.afterClosed().subscribe(dialogResult => {
          this.checkFlag = false; return;
        });
      } else if (this.EmailID) {
        if (!(this.EmailID.trim())) {
          // alert("Please enter your email id");
          const dialogRef = this.dialog.open(AlertdialogComponent, {
            data: {
              message: 'Please enter your email id!!',
              buttonText: {
                cancel: 'Done'
              }
            },
          });
          dialogRef.afterClosed().subscribe(dialogResult => {
            this.checkFlag = false; return;
          });
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

  // Function to call the alert after saving the request starts

  callalert() {
    // alert("Your request has been submitted. The support team will get back to you soon");
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      data: {
        message: 'Your request has been submitted. The support team will get back to you soon',
        buttonText: {
          cancel: 'Done'
        }
      },
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.router.navigate(['']);
    });

  }

  callalert1() {
    // alert("Your request for registration has been submitted. Login details will be shared with you soon");
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      data: {
        message: 'Your request for registration has been submitted. Login details will be shared with you soon',
        buttonText: {
          cancel: 'Done'
        }
      },
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.router.navigate(['']);
    });
  }
  // Function to call the alert after saving the request ends
}
