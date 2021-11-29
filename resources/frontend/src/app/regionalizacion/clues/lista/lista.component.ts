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

  displayedColumns: string[] = ['clues','tipo','localidades','actions'];
  dataSource: any = [];

  constructor(private sharedService: SharedService, public dialog: MatDialog, private regionalizacionService:RegionalizacionService, private fb: FormBuilder, public mediaObserver: MediaObserver) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) usersTable: MatTable<any>;
  @ViewChild(MatExpansionPanel) advancedFilter: MatExpansionPanel;

  ngOnInit(): void {
    this.loadData();
  }

  agregar()
  {

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
  
  eliminar(obj:any)
  {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'ELIMINAR',dialogMessage:'¿Realmente desea eliminar este registro? Escriba ACEPTAR a continuación para realizar el proceso.',validationString:'ACEPTAR',btnColor:'primary',btnText:'Aceptar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        /*this.personalService.eliminarTrabajador(obj.id).subscribe(
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
        );*/
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

    this.regionalizacionService.getCluesList(params).subscribe(
      response =>{
        this.dataSource = response.data.data;
        console.log(this.dataSource);
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
