import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { SharedService } from 'src/app/shared/shared.service';
import { RegionalizacionService } from '../../regionalizacion.service';
import { ConfirmActionDialogComponent } from '../../../utils/confirm-action-dialog/confirm-action-dialog.component';

export interface FormularioComponentData {
  trabajador_id?: number;
  tipo_trabajador_id?: number;
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

  cluesIsLoading: boolean = false;
  filteredClues: Observable<any[]>;
  
  personalIsLoading: boolean = false;
  filteredPersonal: Observable<any[]>;

  searchQuery:string = "";
  searchQueryExterno:string = "";
  id_editar:number = 0;
  indexTab:number = 0;
  id_tipo_edicion:number = 0;
  edicion:boolean = false;
  
  tipo:boolean = true;
  
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
  
  public regionalizacionForm = this.fb.group({
    'tipo_trabajador_id': [1,[Validators.required]],
    'municipio_id': [''],
    'localidad_id': [''],
    'personal_id': ['',[Validators.required]],
    'clues': [''],
  });


  ngOnInit(): void {
    this.cargarCatalogos();
    console.log(this.data);
  }


  cargaForm(value)
  {
    if(value == 1)
    {
      this.tipo = true;
    }else if(value == 2)
    {
      this.tipo = false;
    }
  }

  
  editar(obj:any, tipo:number)
  {
    //console.log(obj);
    if(tipo == 1)
    {
      this.regionalizacionForm.patchValue(
        {
          tipo_trabajador_id: 1,
          personal_id: obj,
          clues: obj.rel_clues,
        }
      );
      this.regionalizacionForm.clearValidators();
      
      this.regionalizacionForm.get('clues').setValidators([Validators.required]);
      this.regionalizacionForm.get('personal_id').setValidators([Validators.required]);
      this.regionalizacionForm.updateValueAndValidity();
    }else if(tipo == 2)
    {
      this.regionalizacionForm.patchValue(
        {
          tipo_trabajador_id: 2,
          municipio_id: obj.rel_rh.localidad.municipio.id,
          localidad_id: obj.rel_rh.localidad,
          personal_id: obj,
        }
      );

      this.regionalizacionForm.clearValidators();
      this.regionalizacionForm.get('municipio_id').setValidators([Validators.required]);
      this.regionalizacionForm.get('localidad_id').setValidators([Validators.required]);
      this.regionalizacionForm.updateValueAndValidity();
    }
    /**/
    this.id_tipo_edicion = tipo;
    this.id_editar = obj.rel_rh.id;
    this.indexTab = 0;
    this.edicion = true;
  }

  
  cargarCatalogos()
  {
    this.regionalizacionService.getCatalogos().subscribe(
      response => {
        this.catalogo = response;

        if(this.data.trabajador_id)
        {
          this.buscarTrabajador();
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
            console.log("entro---");
            this.localidadIsLoading = false;
            let municipio = this.regionalizacionForm.get('municipio_id').value;
            if(municipio)
            {
              return this.regionalizacionService.buscarLocalidad({query:value, municipio_id: municipio}).pipe(finalize(() => this.localidadIsLoading = false ));
            }
            
          }else{
            this.localidadIsLoading = false; 
            return [];
          }
        }
      ),
    ).subscribe(items => this.filteredLocalidad = items);
    
    this.regionalizacionForm.get('clues').valueChanges
    .pipe(
      debounceTime(300),
      tap( () => {
          this.cluesIsLoading = true; 
      } ),
      switchMap(value => {
          if(!(typeof value === 'object')){
            this.cluesIsLoading = false;
            let resultado = this.regionalizacionService.buscarClues({query:value}).pipe(finalize(() => this.cluesIsLoading = false ));  
            return resultado; 
          }else{
            this.cluesIsLoading = false; 
            return [];
          }
        }
      ),
    ).subscribe(items => this.filteredClues = items);

    this.regionalizacionForm.get('personal_id').valueChanges
    .pipe(
      debounceTime(300),
      tap( () => {
          this.personalIsLoading = true; 
      } ),
      switchMap(value => {
          if(!(typeof value === 'object')){
            this.personalIsLoading = false;
            let tipo = this.regionalizacionForm.get('tipo_trabajador_id').value;
            return this.regionalizacionService.buscarPersonal({query:value, tipo: tipo}).pipe(finalize(() => this.personalIsLoading = false ));  
          }else{
            this.personalIsLoading = false; 
            return [];
          }
        }
      ),
    ).subscribe(items => this.filteredPersonal = items);
  }

  displayLocalidadFn(item: any) {
    if (item) { return item.descripcion; }
  }

  displayCluesFn(item: any) {
    if (item) { return item.descripcion; }
  }

  displayPersonalFn(item: any) {
    if (item) { return item.nombre+" "+item.apellido_paterno+" "+item.apellido_materno; }
  }

  buscarTrabajador()
  {
    let params = { tipo: this.data.tipo_trabajador_id};
    console.log(this.data);
    this.regionalizacionService.buscarTrabajador(this.data.trabajador_id, params).subscribe(
      response => {
        //this.dialogRef.close(true);
        this.edicion = true;
        if(this.data.tipo_trabajador_id == 1)
        {
          this.regionalizacionForm.patchValue({
            tipo_trabajador_id: this.data.tipo_trabajador_id,
            personal_id: response.data,
            clues: response.data.rel_rh.clues
          });
        }else if(this.data.tipo_trabajador_id == 2)
        {
            this.regionalizacionForm.patchValue({
              tipo_trabajador_id: this.data.tipo_trabajador_id,
              personal_id: response.data,
              municipio_id: response.data.rel_rh.localidad.municipio.id,
              localidad_id: response.data.rel_rh.localidad
            });
        }
      },
      responsError =>{
        this.sharedService.showSnackBar('Error al intentar recuperar datos de asistencia', null, 4000);
      }
    );
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

  cleanSearchExterno(){
    this.searchQueryExterno = '';
  }

  accionGuardar(id:number)
  {
    if(this.data.trabajador_id)
    {
      this.regionalizacionService.editPersonal(this.data.trabajador_id, this.regionalizacionForm.value).subscribe(
        response => {
          this.dialogRef.close(true);
          this.sharedService.showSnackBar("Se ha guardado el registro", null, 3000);
          this.regionalizacionForm.reset();
        },
        responsError =>{
          this.sharedService.showSnackBar('Error al intentar recuperar datos de asistencia', null, 4000);
        }
      );
    }else{
      this.regionalizacionService.savePersonal(this.regionalizacionForm.value).subscribe(
        response => {
          this.sharedService.showSnackBar("Se ha guardado el registro", null, 3000);
          this.regionalizacionForm.reset();
        },
        responsError =>{
          this.sharedService.showSnackBar('Error al intentar recuperar datos de asistencia', null, 4000);
        }
      );
    } 
  }

}
