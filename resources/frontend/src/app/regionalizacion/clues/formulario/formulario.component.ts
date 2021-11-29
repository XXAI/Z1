import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { SharedService } from 'src/app/shared/shared.service';
import { RegionalizacionService } from '../../regionalizacion.service';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatTable } from '@angular/material/table';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ConfirmActionDialogComponent } from '../../../utils/confirm-action-dialog/confirm-action-dialog.component';

export interface FormularioComponentData {
  clues?: number;
}

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  catalogo:any = [];
  isLoading:boolean = false;
  localidadIsLoading: boolean = false;
  filteredLocalidad: Observable<any[]>;
  searchQuery:string = "";
  id_editar:number = 0;
  indexTab:number = 0;
  edicion:boolean = false;
  
  mediaSize:string;
  pageEvent: PageEvent;
  resultsLength: number = 0;
  currentPage: number = 0;
  pageSize: number = 20;
  selectedItemIndex: number = -1;

  displayedColumns: string[] = ['localidad','camino', 'distancia','actions'];
  dataSource: any = [];

  constructor(
    private sharedService: SharedService, 
    private regionalizacionService:RegionalizacionService,
    public dialogRef: MatDialogRef<FormularioComponent>,
    private authService: AuthService, 
    private route: ActivatedRoute, 
    private fb: FormBuilder,
    public dialog: MatDialog,
    public mediaObserver: MediaObserver,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: FormularioComponentData 
  ) { }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) usersTable: MatTable<any>;
  @ViewChild(MatExpansionPanel) advancedFilter: MatExpansionPanel;
  
  public regionalizacionForm = this.fb.group({
    'municipio_id': ['',[Validators.required]],
    'localidad_id': ['',[Validators.required]],
    'catalogo_tipo_camino_id': ['',[Validators.required]],
    'distancia': ['',[Validators.required]],
    'tiempo': ['',[Validators.required]],
    'clues': ['',[Validators.required]],
  });


  ngOnInit(): void {
    this.cargarCatalogos();
    //this.loadData();
  }

  loadData(event?:PageEvent)
  {
    /*this.isLoading = true;
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

    this.regionalizacionService.getLocalidadesList(this.data.clues, params).subscribe(
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
    );*/
    return event;
  
  }

  eliminar(obj:any)
  {
    const dialogRef = this.dialog.open(ConfirmActionDialogComponent, {
      width: '500px',
      data:{dialogTitle:'ELIMINAR',dialogMessage:'¿Realmente desea eliminar este registro? Escriba ACEPTAR a continuación para realizar el proceso.',validationString:'ACEPTAR',btnColor:'primary',btnText:'Aceptar'}
    });

    dialogRef.afterClosed().subscribe(valid => {
      if(valid){
        this.regionalizacionService.eliminar(obj.id).subscribe(
          response =>{
            this.sharedService.showSnackBar("Se ha Actualizado Correctamente", null, 3000);
            this.isLoading = false;
            this.cargarDatos();
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

  editar(obj:any)
  {
    this.regionalizacionForm.patchValue(
      {
        municipio_id: obj.municipio.id,
        localidad_id: obj,
        catalogo_tipo_camino_id: obj.regionalizacion.catalogo_tipo_camino.id,
        distancia: obj.regionalizacion.distancia,
        tiempo:obj.regionalizacion.tiempo,
        clues: obj.regionalizacion.catalogo_clues
      }
    );
    this.id_editar = obj.regionalizacion.id;
    this.indexTab = 0;
    this.edicion = true;
    //console.log(this.indexTab);
  }

  cargarDatos(event?:PageEvent)
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

    //console.log("entro"+ params );
    //console.log(this.searchQuery );
    this.regionalizacionService.getFilterLocalidadesList(this.data.clues, params).subscribe(
      response => {
        this.dataSource = response.data.data;
        this.regionalizacionForm.patchValue({clues:this.data.clues});
        this.isLoading = false;
      },
      responsError =>{
        this.isLoading = false;
        console.log(responsError);
        this.sharedService.showSnackBar('Error al intentar recuperar datos de asistencia', null, 4000);
      }
    );
    return event;
  }

  cargarCatalogos()
  {
    this.regionalizacionService.getCatalogos().subscribe(
      response => {
        this.catalogo = response;
        if(this.data.clues != null)
        {
          this.cargarDatos();
        }
      },
      responsError =>{
        console.log(responsError);
        this.sharedService.showSnackBar('Error al intentar recuperar datos de asistencia', null, 4000);
      }
    );
    this.regionalizacionForm.get('localidad_id').valueChanges
    .pipe(
      debounceTime(300),
      tap( () => {
          this.localidadIsLoading = true; 
      } ),
      switchMap(value => {
          if(!(typeof value === 'object')){
            this.localidadIsLoading = false;
            let municipio = this.regionalizacionForm.get('municipio_id').value;
            return this.regionalizacionService.buscarLocalidad({query:value, municipio_id: municipio}).pipe(finalize(() => this.localidadIsLoading = false ));
           
             
          }else{
            this.localidadIsLoading = false; 
            return [];
          }
        }
      ),
    ).subscribe(items => this.filteredLocalidad = items);
    
  }

  displayLocalidadFn(item: any) {
    if (item) { return item.descripcion; }
  }

  applyFilter()
  {
    this.cargarDatos();
  }

  cancelar()
  {
    this.edicion = false;
    this.id_editar = 0;
    this.regionalizacionForm.reset();
  }

  cerrar()
  {
    this.dialogRef.close(true);
  }

  cleanSearch(){
    this.searchQuery = '';
  }

  accionGuardar(id:number)
  {
    if(this.id_editar != 0)
    {
      this.regionalizacionService.edit(this.id_editar, this.regionalizacionForm.value).subscribe(
        response => {
          this.dialogRef.close(true);
          this.sharedService.showSnackBar("Se ha guardado el registro", null, 3000);
          this.id_editar = 0;
          this.edicion = false;
        },
        responsError =>{
          console.log(responsError);
          this.sharedService.showSnackBar('Error al intentar recuperar datos de asistencia', null, 4000);
        }
      );
    }else{
      this.regionalizacionService.save(this.regionalizacionForm.value).subscribe(
        response => {
          this.dialogRef.close(true);
          this.sharedService.showSnackBar("Se ha guardado el registro", null, 3000);
        },
        responsError =>{
          console.log(responsError);
          this.sharedService.showSnackBar('Error al intentar recuperar datos de asistencia', null, 4000);
        }
      );
    } 
  }

}
