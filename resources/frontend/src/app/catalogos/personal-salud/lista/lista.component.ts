import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { PersonalService } from '../personal.service';
import { SharedService } from '../../../shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatTable } from '@angular/material/table';
import { ConfirmActionDialogComponent } from '../../../utils/confirm-action-dialog/confirm-action-dialog.component';

import { FormBuilder } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { trigger, transition, animate, style } from '@angular/animations';
import { MediaObserver } from '@angular/flex-layout';
import { FormularioComponent } from '../formulario/formulario.component';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  isLoading: boolean = false;
  
  showMyStepper:boolean = false;
  searchQuery: string = '';
  mediaSize:string;
  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  selectedItemIndex: number = -1;
  permiso_editar:boolean = false;

  displayedColumns: string[] = ['trabajador','clues','distrito','actions'];
  dataSource: any = [];

  constructor(private sharedService: SharedService, public dialog: MatDialog, private personalService:PersonalService, private fb: FormBuilder, public mediaObserver: MediaObserver) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) usersTable: MatTable<any>;
  @ViewChild(MatExpansionPanel) advancedFilter: MatExpansionPanel;

  ngOnInit(): void {
    this.loadData();
    this.loadPermisos();
  }

  loadPermisos()
  {
    this.personalService.getPermisos({}).subscribe(
      response => {
        let admin = response.data.admin;
        let permisos = response.data.permisos;
        console.log(response);
        if(admin == false)
        {
          permisos.forEach(element => {
            if(element == "permiso_admin_simoss")
            {
              this.permiso_editar = true;
            }
            if(element == "permiso_guardar_general")
            {
              this.permiso_editar = true;
            }
            if(element == "permiso_visor")
            {
              this.permiso_editar = false;
            }
          });
          
        }else{
          this.permiso_editar = true;
        }    
      }
    );
  }

  agregar()
  {
    let configDialog = {};
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '60vw',
        maxHeight: '100vh',
        data:{}
      };
    }else{
      configDialog = {
        maxWidth: '60vw',
        maxHeight: '100vh',
        data:{}
      }
    }
    const dialogRef = this.dialog.open(FormularioComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.loadData();
        //console.log('Aceptar');
      }else{
        console.log('Cancelar');
      }
    });
  }
  editar(obj:any)
  {
    let configDialog = {};
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '60vw',
        maxHeight: '100vh',
        data:{id:obj.id}
      };
    }else{
      configDialog = {
        width: '60%',
        maxHeight: '100vh',
        data:{id:obj.id}
      }
    }
    
    const dialogRef = this.dialog.open(FormularioComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.loadData();
      }else{
        console.log('Cancelar');
      }
    });
  }
  eliminar(obj:any)
  {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'ELIMINAR',dialogMessage:'¿Realmente desea eliminar este registro? Escriba ACEPTAR a continuación para realizar el proceso.',validationString:'ACEPTAR',btnColor:'primary',btnText:'Aceptar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.personalService.eliminarTrabajador(obj.id).subscribe(
          response =>{
            console.log(response);
            this.sharedService.showSnackBar("Se ha Actualizado Correctamente", null, 3000);
            this.isLoading = false;
            this.loadData();
          },
          errorResponse =>{
            this.isLoading = false;
            var errorMessage = "Ocurrió un error.";
            if(errorResponse.status == 409){
              errorMessage = errorResponse.error.error.message;
            }
            this.sharedService.showSnackBar(errorMessage, "ERROR", 3000);
            
          }
        );
      }
    });
  }

  cleanSearch(){
    this.searchQuery = '';
  }

  loadData(event?:PageEvent)
  {
    this.isLoading = true;
    let params:any;
    if(!event){
      params = { page: 1, per_page: 20 }
    }else{
      params = {
        page: event.pageIndex+1,
        per_page: event.pageSize
      };
    }

    params.query = this.searchQuery;

    this.personalService.getTrabajador(params).subscribe(
      response =>{
        this.dataSource = response.data.data;
        this.resultsLength = response.data.total;
        this.isLoading = false;
        
      },
      errorResponse =>{
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
      }
    );
    return event;
  }

  applyFilter(){
    this.loadData();
  }
}
