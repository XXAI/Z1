import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { User } from 'src/app/auth/models/user';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { App } from 'src/app/apps-list/apps';
import { AppsListService } from 'src/app/apps-list/apps-list.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SharedService } from '../../shared/shared.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Output() onSidenavToggle = new EventEmitter<void>();

  public isAuthenticated:boolean;
  authSubscription: Subscription;
  selectedApp: any = {children:[]};
  pendientes:number = 0;
  Listapendientes:any = [{icon:'person_search', descripcion:"PRUEBA", link:'/tramites/adscripcion'}];
  user: User;
  apps: App[];
  modules:any  = [];
  breakpoint = 6;
  selectedChild: any;
  expandDrawer:boolean = true;

  constructor(private authService:AuthService, private appsService: AppsListService, private sharedService: SharedService, private router: Router) {

    router.events.pipe(
      filter(event => event instanceof NavigationEnd)  
    ).subscribe((event: NavigationEnd) => {
      
      this.getApps();
      
      let routes = event.url.split('/',3);
      this.modules = [];
      /*routes.forEach(element => {
        if(element != "")
        {
          this.modules.push({nombre: element.toUpperCase(), link:element});
        }
        
      });*/
      let selected_route = routes[1];
      let selected_child = '';

      let currentApp = this.sharedService.getCurrentApp();
      if(currentApp.name != selected_route ){
        this.sharedService.newCurrentApp(selected_route);
      }

      if(routes.length > 2){
        selected_child = routes[2];
      }

      if(selected_route){
        this.selectedApp = this.apps.find(function(element) {
          return element.route == selected_route;
        });
      }else{
        this.selectedApp = undefined;
      }
      this.selectedChild = {};
      if(this.selectedApp && this.selectedApp.children && selected_child){
        this.selectedChild = this.selectedApp.children.find(function(element) {
          return (element)?element.route == selected_child:false;
        });
      }

    });
    console.log(this.selectedApp);
  }

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuth();
    if(this.isAuthenticated){
      this.user = this.authService.getUserData();
    }
    this.authSubscription = this.authService.authChange.subscribe(
      status => {
        this.isAuthenticated = status;
        if(status){
          this.user = this.authService.getUserData();
        }else{
          this.user = new User();
        }
      }
    );
    this.breakpoint = (window.innerWidth <= 599) ? 3 : 6;

    this.calcularPendientes();
  }

  calcularPendientes()
  {

  }

  navegarPendientes= function (link) {
    this.router.navigateByUrl(link);
  };

  getApps():void{
    this.apps = this.appsService.getApps();
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 599) ? 3 : 6;
  }

  ngOnDestroy(){
    this.authSubscription.unsubscribe();
  }

  toggleSidenav(){
    this.onSidenavToggle.emit();
  }

  logout(){
    this.authService.logout();
  }
}
