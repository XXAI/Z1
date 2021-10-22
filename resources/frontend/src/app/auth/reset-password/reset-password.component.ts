import { Component, OnInit, ViewChild } from '@angular/core';
import { JwtService } from '../../shared/jwt.service';
import { SharedService } from '../../shared/shared.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { ReCaptcha2Component } from 'ngx-captcha';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})

export class ResetPasswordComponent implements OnInit {

  //@ViewChild('captchaElem') captchaElem: ReCaptcha2Component;
  myForm: FormGroup;
  err = null;
  msg = null;
  siteKey:string = "6LeDKMcbAAAAAGSl0ygGm8bCF9zpCEf1hoC7d0xK";
  isLoading:boolean = false;

  constructor(
    public fb: FormBuilder,
    public jwtService: JwtService,
    private sharedService: SharedService,
  ) {
    this.myForm = this.fb.group({
      email:        ['', [Validators.required, Validators.email]],
      validCaptcha: ['', [Validators.required]]
    })
  }

  ngOnInit(): void { }

  onSubmit(){
    this.isLoading = true;
    this.jwtService.reqPasswordReset(this.myForm.value).subscribe(
      (res) => {
        this.msg = res;
        this.isLoading = false;
        this.sharedService.showSnackBar(this.msg?.message, 'Cerrar', 4000);
      },(error) => {
        this.err = error.error.message;
        this.isLoading = false;
        this.sharedService.showSnackBar(this.err, 'Cerrar', 4000);
      }
    );
    
  }

}
