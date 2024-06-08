import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { throwError } from 'rxjs';
import { Router, ActivatedRoute  } from '@angular/router';
import { JwtService } from '../../shared/jwt.service';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})

export class UpdatePasswordComponent implements OnInit {

  updatePwd: FormGroup;
  errors = null;
  isLoading:boolean = false;
  confirmPasword:string = '';
  hidePassword:boolean = true;
  hidePasswordConfirm:boolean = true;

  constructor(
    public fb: FormBuilder,
    public activatedRoute: ActivatedRoute,
    public authService: JwtService,
    private sharedService: SharedService,
    public router: Router,
  ) {
    this.updatePwd = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      password_confirmation: ['', [Validators.required]],
      passwordToken: ['']
    })
    activatedRoute.queryParams.subscribe((params) => {
      this.updatePwd.controls['passwordToken'].setValue(params['token']);
    })
  }

  ngOnInit(): void { }

  updatePassword(){
    this.isLoading = true;
    this.authService.updatePassword(this.updatePwd.value).subscribe(
      result => {
        this.isLoading = false;
        this.sharedService.showSnackBar('¡La contraseña se actualizo Correctamente! del usuario con el Correo:'+' '+this.updatePwd.value.email, 'Cerrar', 4000,1);
        this.updatePwd.reset();
        this.router.navigate(['/login']);
        //console.log(this.updatePwd.value)
      },
      error => {
        this.isLoading = false;
        this.handleError(error);
      }
    );
  }

  handleError(error) {
      let errorMsg = '';
      if (error.error instanceof ErrorEvent) {
        errorMsg = `Error: ${error.error.message}`;
        //console.log("mensajeeee error", errorMsg);
        this.sharedService.showSnackBar('Error, verifique sus datos', 'Cerrar', 4000);
      } else {
          errorMsg = `Error Code: ${error.status}\nMessage: ${error.message}`;
          this.sharedService.showSnackBar('Error, verifique sus datos', 'Cerrar', 4000);
      }
      return throwError(errorMsg);
  }

}
