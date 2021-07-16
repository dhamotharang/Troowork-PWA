import { Component, Inject, OnInit, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-promptdialog',
  templateUrl: './promptdialog.component.html',
  styleUrls: ['./promptdialog.component.css']
})
export class PromptdialogComponent {

  title: string;
  message: string;
  // reason;
  loginForm: FormGroup;
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<PromptdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PromptDialogModel) {
    // Update view with given values
    this.title = data.title;
    this.message = data.message;

    this.loginForm = fb.group({
      reason: ['']
    });
  }


  onConfirm(reason) {
    // Close the dialog, return true
    // console.log(reason);
    this.dialogRef.close(reason);
    // return this.reason;
  }

  onDismiss(): void {
    // Close the dialog, return false
    this.dialogRef.close(null);
  }
}

export class PromptDialogModel {

  constructor(public title: string, public message: string) {
  }
}