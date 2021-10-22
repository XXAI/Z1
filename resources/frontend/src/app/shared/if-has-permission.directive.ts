import { Directive, ElementRef, Input, OnInit, QueryList, Renderer2, ViewChild  } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Directive({
  selector: '[ifHasPermission]'
})
export class IfHasPermissionDirective implements OnInit{

  @Input() ifHasPermission: string;
  

  constructor(
    private elementRef: ElementRef<any>,
    private authService: AuthService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    let permission = `${this.ifHasPermission}`;
    let userPermissions = JSON.parse(localStorage.getItem('permissions'));
    //console.log(userPermissions);
    //console.log(permission);
    if (!this.authService.isAuth() || !userPermissions[permission]) {
      
      this.renderer.addClass(this.elementRef.nativeElement, 'hide')
      this.renderer.removeChild(this.renderer, this.elementRef.nativeElement);
      //this.renderer.destroy();
    }
  }

}
