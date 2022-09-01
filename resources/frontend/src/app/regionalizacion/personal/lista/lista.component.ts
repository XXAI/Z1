import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { RegionalizacionService } from '../../regionalizacion.service';
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
import { TransferirComponent } from '../transferir/transferir.component';

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
  panel:boolean = true;
  
  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  selectedItemIndex: number = -1;

  pageEventExterno: PageEvent;
  resultsLengthExterno: number = 0;
  currentPageExterno: number = 0;
  pageSizeExterno: number = 20;
  selectedItemIndexExterno: number = -1;

  displayedColumns: string[] = ['nombre','tipo','unidad','actions'];
  displayedExternoColumns: string[] = ['nombre','tipo','localidad','actions'];
  dataSource: any = [];
  dataSourceExterno: any = [];

  constructor(private sharedService: SharedService, public dialog: MatDialog, private regionalizacionService:RegionalizacionService, private fb: FormBuilder, public mediaObserver: MediaObserver) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) usersTable: MatTable<any>;
  @ViewChild(MatExpansionPanel) advancedFilter: MatExpansionPanel;

  filterForm = this.fb.group({
    'clues': [undefined]
  });

  ngOnInit(): void {
    this.loadData();
  }

  regionalizacion(obj:any)
  {
    let configDialog = {};
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '80vw',
        maxHeight: '100vh',
        data:{id:obj.id}
      };
    }else{
      configDialog = {
        width: '80%',
        maxWidth: '80vw',
        maxHeight: '60vh',
        data:{clues:obj.clues}
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
    let filterFormValues = this.filterForm.value;
    let countFilter = 0;
    for(let i in filterFormValues){
      if(filterFormValues[i]){
        if(i == 'clues'){
          params[i] = filterFormValues[i];
        }
        countFilter++;
      }
    }

    if(countFilter > 0){
      params.active_filter = true;
    }
    params.query = this.searchQuery;

    this.regionalizacionService.getPersonalList(params).subscribe(
      response => {
        console.log(response);
        this.dataSource = response.salud.data;
        this.dataSourceExterno = response.externo.data;
        this.resultsLength = response.salud.total;
        this.resultsLengthExterno = response.externo.total;
        this.isLoading = false;
      },
      responsError =>{
        this.isLoading = false;
        console.log(responsError);
        this.sharedService.showSnackBar('Error al intentar recuperar datos de', null, 4000);
      }
    );
    return event;
  }

  agregar()
  {
    let configDialog = {};
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '80vw',
        maxHeight: '100vh',
        data:{}
      };
    }else{
      configDialog = {
        width: '80%',
        maxWidth: '80vw',
        maxHeight: '60vh',
        data:{}
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

  editar(obj:any, tipo:number)
  {
    let configDialog = {};
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '80vw',
        maxHeight: '100vh',
        data:{trabajador_id:obj.id, tipo_trabajador_id: tipo}
      };
    }else{
      configDialog = {
        width: '80%',
        maxWidth: '80vw',
        maxHeight: '60vh',
        data:{trabajador_id:obj.id, tipo_trabajador_id: tipo}
      }
    } 
    console.log(configDialog);
    const dialogRef = this.dialog.open(FormularioComponent, configDialog);
    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.loadData();
      }else{
        console.log('Cancelar');
      }
    });
  }

  transferir(obj:any, tipo:number)
  {
    let configDialog = {};
    let nombre = obj.nombre+" "+obj.apellido_paterno+" "+obj.apellido_materno;
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '80vw',
        maxHeight: '100vh',
        data:{trabajador_id:obj.id, rfc: obj.rfc, nombre: nombre, clues: obj.rel_rh.clues.clues, unidad: obj.rel_rh.clues.descripcion}
      };
    }else{
      configDialog = {
        width: '80%',
        maxWidth: '80vw',
        maxHeight: '60vh',
        data:{trabajador_id:obj.id, rfc: obj.rfc, nombre: nombre, clues: obj.rel_rh.clues.clues, unidad: obj.rel_rh.clues.descripcion}
      }
    } 
    console.log(configDialog);
    const dialogRef = this.dialog.open(TransferirComponent, configDialog);
    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.loadData();
      }else{
        console.log('Cancelar');
      }
    });
  }

  eliminar(obj:any, tipo:number)
  {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'ELIMINAR',dialogMessage:'¿Realmente desea eliminar este registro? Escriba ACEPTAR a continuación para realizar el proceso.',validationString:'ACEPTAR',btnColor:'primary',btnText:'Aceptar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        let params = { tipo_personal: tipo}
        this.regionalizacionService.eliminarPersonal(obj.id, params).subscribe(
          response =>{
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

  applyFilter(){
    this.loadData();
  }

  toggleAdvancedFilter(status){
    if(status){
      this.panel = false;
      this.advancedFilter.open();
    }else{
      this.panel = true;
      this.advancedFilter.close();
    }
  }
}