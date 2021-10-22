import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

export interface SelectorCrData {
  id?: number;
}

@Component({
  selector: 'selector-cr-dialog',
  templateUrl: './selector-cr-dialog.component.html',
  styleUrls: ['./selector-cr-dialog.component.css']
})
export class SelectorCrDialogComponent implements OnInit {

  constructor(
      public dialogRef: MatDialogRef<SelectorCrDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data: SelectorCrData,
      private fb: FormBuilder
    ) { }

  ngOnInit() {
    //
  }

  cancel(): void {
    this.dialogRef.close();
  }

  confirm():void {
    this.dialogRef.close(true);
  }
}