import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { LocalidadService } from '../localidad.service';
import { SharedService } from '../../../shared/shared.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatTable } from '@angular/material/table';
import { ConfirmActionDialogComponent } from '../../../utils/confirm-action-dialog/confirm-action-dialog.component';
import { RegionalizacionComponent } from '../regionalizacion/regionalizacion.component';

import { FormBuilder } from '@angular/forms';
//import { map, startWith } from 'rxjs/operators';
//import { trigger, transition, animate, style } from '@angular/animations';
import { MediaObserver } from '@angular/flex-layout';
import { FormularioComponent } from '../formulario/formulario.component';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {

  isLoading: boolean = false;
  
  panel:boolean = true;
  showMyStepper:boolean = false;
  searchQuery: string = '';
  mediaSize:string;
  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  selectedItemIndex: number = -1;
  filteredCatalogs:any = {};
  filterCatalogs:any = {};

  displayedColumns: string[] = ['distrito','localidad','sede', 'regionalizacion','actions'];

  dataSource: any = [];

  constructor(private sharedService: SharedService, public dialog: MatDialog, private localidadService:LocalidadService, private fb: FormBuilder, public mediaObserver: MediaObserver) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) usersTable: MatTable<any>;
  @ViewChild(MatExpansionPanel) advancedFilter: MatExpansionPanel;

  filterForm = this.fb.group({
    'municipio': [undefined],
    'tipo': [undefined],
    'regionalizado': [undefined],
    'orden': [undefined],
  });

  ngOnInit(): void {
    this.loadData();
    this.cargarMunicipios();
  }

  cleanSearch(){
    this.searchQuery = '';
  }

  loadData(event?:PageEvent)
  {
    this.isLoading = true;
    let params:any;
    if(!event){
      params = { page: 1, per_page: this.pageSize }
    }else{
      params = {
        page: event.pageIndex+1,
        per_page: event.pageSize
      };
    }
    console.log(this.searchQuery);
    console.log("------------------1");
    params.query = this.searchQuery;

    let filterFormValues = this.filterForm.value;
    console.log(this.filterForm.value);
    console.log("------------------2");
    
    let countFilter = 0;

    for(let i in filterFormValues){
      console.log(i);
      if(filterFormValues[i]){
        if(i == 'municipio'){
          params[i] = filterFormValues[i];
        }else if(i == 'tipo'){
          params[i] = filterFormValues[i];
          
        }else if(i == 'regionalizado'){
          params[i] = filterFormValues[i];
        }else if(i == 'orden'){
          console.log("orden");
          console.log(filterFormValues[i]);
          params[i] = filterFormValues[i];
        }else{ //profesion y rama (grupos)
          params[i] = filterFormValues[i].id;
        }
        countFilter++;
      }
    }
    console.log(params);
    console.log("------------------3");

    if(countFilter > 0){
      params.active_filter = true;
    }

    let dummyPaginator;
    if(event){
      this.sharedService.setDataToCurrentApp('paginator',event);
    }else{
      dummyPaginator = {
        length: 0,
        pageIndex: (this.paginator)?this.paginator.pageIndex:this.currentPage,
        pageSize: (this.paginator)?this.paginator.pageSize:this.pageSize,
        previousPageIndex: (this.paginator)?this.paginator.previousPage:((this.currentPage > 0)?this.currentPage-1:0)
      };
    }

    let appStoredData = this.sharedService.getArrayDataFromCurrentApp(['searchQuery','paginator','filter']);
    console.log(appStoredData);
    console.log("------------------4");
    
    if(appStoredData['searchQuery']){
      this.searchQuery = appStoredData['searchQuery'];
    }

    if(appStoredData['paginator']){
      this.currentPage = appStoredData['paginator'].pageIndex;
      this.pageSize = appStoredData['paginator'].pageSize;
      event = appStoredData['paginator'];

    }else{
      let dummyPaginator = {
        length: 0,
        pageIndex: this.currentPage,
        pageSize: this.pageSize,
        previousPageIndex: (this.currentPage > 0)?this.currentPage-1:0
       };
      this.sharedService.setDataToCurrentApp('paginator', dummyPaginator);
    }

    /*if(appStoredData['filter']){
      this.filterForm.patchValue(appStoredData['filter']);
    }*/

    console.log(appStoredData['filter']);
    console.log("------------------5");
    

    this.sharedService.setDataToCurrentApp('searchQuery',this.searchQuery);
    //this.sharedService.setDataToCurrentApp('filter',params);
    this.sharedService.setDataToCurrentApp('filter',filterFormValues);

    this.localidadService.getLocaliadList(params).subscribe(
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

  toggleAdvancedFilter(status){
    if(status){
      this.panel = false;
      this.advancedFilter.open();
    }else{
      this.panel = true;
      this.advancedFilter.close();
    }
  }

  agregar()
  {
    let configDialog = {};
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '30vw',
        maxHeight: '100vh',
        data:{}
      };
    }else{
      configDialog = {
        width: '60vw',
        maxHeight: '75vh',
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
        maxWidth: '30vw',
        maxHeight: '100vh',
        data:{id:obj.id}
      };
    }else{
      configDialog = {
        width: '60vw',
        maxHeight: '75vh',
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

  cargarMunicipios()
  {
      this.localidadService.catalogoMunicipio().subscribe(
        response =>{
          this.isLoading = false;
          this.filterCatalogs['municipio'] = response;
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

  verUnidades(obj, tipo)
  {
    let configDialog = {};
    let title = "";
    if(tipo == 1)
    {
      title = "SEDES";
    }else if(tipo == 2)
    {
      title = "REGIONALIZACION";
    }

    if(this.mediaSize == 'lg'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '91vh',
        height: '460px',
        width: '100%',
        data:{titulo: title, localidad: "["+obj.municipio.clave_municipio+" - "+obj.clave_localidad+"] "+obj.descripcion, listado: obj.regionalizacion, clues: obj.clues, tipoUnidad: tipo}
      }
    }else if(this.mediaSize == "md"){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data:{titulo: title, localidad: "["+obj.municipio.clave_municipio+" - "+obj.clave_localidad+"] "+obj.descripcion, listado: obj.regionalizacion, clues: obj.clues, tipoUnidad: tipo}
      }
    }else if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '72%',
        width: '100%',
        data:{titulo: title, localidad: "["+obj.municipio.clave_municipio+" - "+obj.clave_localidad+"] "+obj.descripcion, listado: obj.regionalizacion, clues: obj.clues, tipoUnidad: tipo}
      };
    }else{
      configDialog = {
        width: '99%',
        maxHeight: '91vh',
        height: '620px',
        data:{titulo: title, localidad: "["+obj.municipio.clave_municipio+" - "+obj.clave_localidad+"] "+obj.descripcion, listado: obj.regionalizacion, clues: obj.clues, tipoUnidad: tipo}
      }
    }

    //console.log(configDialog);

    const dialogRef = this.dialog.open(RegionalizacionComponent, configDialog);

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        console.log('Aceptar');
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
        this.localidadService.deleteLocalidad(obj.id).subscribe(
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

  applyFilter(){
    this.selectedItemIndex = -1;
    this.paginator.pageIndex = 0;
    this.paginator.pageSize = this.pageSize;
    this.loadData(null);
  }

}
