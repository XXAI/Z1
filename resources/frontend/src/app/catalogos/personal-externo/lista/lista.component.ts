import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { PersonalExternoService } from '../personal-externo.service';
import { SharedService } from '../../../shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatTable } from '@angular/material/table';
import { ConfirmActionDialogComponent } from '../../../utils/confirm-action-dialog/confirm-action-dialog.component';

import { FormBuilder } from '@angular/forms';
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
  panel:boolean = true;
  filtroCatalogos:any;
  tipos:any;

  displayedColumns: string[] = ['trabajador','tipo', 'localidad','unidad','actions'];
  dataSource: any = [];

  filterForm = this.fb.group({
    'grupo': [undefined],
    'tipo': [undefined]
  });

  constructor(private sharedService: SharedService, public dialog: MatDialog, private personalExternoService:PersonalExternoService, private fb: FormBuilder, public mediaObserver: MediaObserver) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) usersTable: MatTable<any>;
  @ViewChild(MatExpansionPanel) advancedFilter: MatExpansionPanel;

  ngOnInit(): void {
    this.catalogos();
    this.loadData();
  }

  catalogos()
  {
    this.personalExternoService.getCatalogo().subscribe(
      response =>{
        console.log(response);
        this.filtroCatalogos = response;
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
  }

  getTipo(valor){
    this.personalExternoService.getTipo(valor).subscribe(
      response =>{
        console.log(response);
        this.tipos = response;
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
        width: '60vw',
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

  toggleAdvancedFilter(status){
    if(status){
      this.panel = false;
      this.advancedFilter.open();
    }else{
      this.panel = true;
      this.advancedFilter.close();
    }
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
        width: '60vw',
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
        this.personalExternoService.eliminarTrabajador(obj.id).subscribe(
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

    let filterFormValues = this.filterForm.value;
    let countFilter = 0;

    for(let i in filterFormValues){
      if(filterFormValues[i]){
        if(i == 'grupo'){
          params[i] = filterFormValues[i];
        }else if(i == 'tipo'){
          params[i] = filterFormValues[i];
        }
        countFilter++;
      }
    }
    
    if(countFilter > 0){
      params.active_filter = true;
    }
    params.query = this.searchQuery;

    this.personalExternoService.getTrabajador(params).subscribe(
      response =>{
        this.dataSource = response.data.data;
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
