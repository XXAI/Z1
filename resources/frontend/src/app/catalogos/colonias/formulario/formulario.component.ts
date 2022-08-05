import { Component, OnInit, Inject } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { SharedService } from 'src/app/shared/shared.service';
/* Utilerias */
/*Dialogs */
import { ColoniasService } from '../colonias.service';

export interface FormularioComponentData {
  id?: number;
}

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {

  catalogo:any = [];
  localidadIsLoading: boolean = false;
  filteredLocalidad: any[];
  isLoading:boolean = false;
  constructor(
    private sharedService: SharedService, 
    private coloniasService: ColoniasService,
    public dialogRef: MatDialogRef<FormularioComponent>,
    private authService: AuthService, 
    private route: ActivatedRoute, 
    private fb: FormBuilder,
    public dialog: MatDialog,
    public mediaObserver: MediaObserver,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: FormularioComponentData 
  ) { }
  
  public coloniaForm = this.fb.group({
    'distrito_id': ['',[Validators.required]],
    'municipio_id': ['',[Validators.required]],
    'localidad_id': ['',[Validators.required]],
    'clave_colonia': ['',[Validators.required]],
    'colonia': ['',[Validators.required]],
    'latitud': ['',[Validators.required]],
    'longitud': ['',[Validators.required]]
    
  });

  ngOnInit(): void {
    this.cargarCatalogos();
  }

  cargarDatos()
  {
    this.coloniasService.getColonia(this.data.id).subscribe(
      response => {
        
        let obj = response.data;
        //console.log(obj);
        this.cargaMunicipio(obj.localidad.municipio.catalogo_distrito_id, obj, 0);
        this.coloniaForm.patchValue({
          distrito_id:obj.localidad.municipio.catalogo_distrito_id, 
          colonia: obj.descripcion, 
          clave_colonia: obj.clave_colonia, 
          localidad_id:obj.localidad,
          latitud: obj.latitud,
          longitud: obj.longitud
        });
        
      },
      responsError =>{
        console.log(responsError);
        this.sharedService.showSnackBar('Error al intentar recuperar datos de asistencia', null, 4000);
      }
    );
  }
  cargarCatalogos()
  {
    this.coloniasService.getCatalogos().subscribe(
      response => {
        this.catalogo = response;
        
        if(this.data.id != null)
        {
          this.cargarDatos();
        }
      },
      responsError =>{
        console.log(responsError);
        this.sharedService.showSnackBar('Error al intentar recuperar datos de asistencia', null, 4000);
      }
    );

    this.coloniaForm.get('localidad_id').valueChanges
      .pipe(
        debounceTime(300),
        tap( () => {
            this.localidadIsLoading = true; 
        } ),
        switchMap(value => {
            if(!(typeof value === 'object')){
              this.localidadIsLoading = false;
              let distrito = this.coloniaForm.get('distrito_id').value;
              let municipio = this.coloniaForm.get('municipio_id').value;
              if( distrito != '' && municipio!="")
              {
                return this.coloniasService.buscarLocalidad({distrito_id:distrito, municipio_id:municipio, query:value }).pipe(finalize(() => this.localidadIsLoading = false ));
              }else{
                return [];
              }
               
            }else{
              this.localidadIsLoading = false; 
              return [];
            }
          }
        ),
      ).subscribe(items => this.filteredLocalidad = items);
  }

  cargaMunicipio(valor, obj = null, tipo:Number)
  {
    this.coloniasService.getCatalogosMunicipio(valor).subscribe(
      response => {
        //console.log(response);
        this.catalogo['municipio'] = response;
        if(tipo == 1)
        {
          this.coloniaForm.patchValue({localidad_id:[]});
        }
        
        if(this.data.id != null)
        {
          this.coloniaForm.patchValue({municipio_id:obj.localidad.municipio.id});
        }
      },
      responsError =>{
        console.log(responsError);
        this.sharedService.showSnackBar('Error al intentar recuperar datos de asistencia', null, 4000);
      }
    );
  }

  displayLocalidadFn(item: any) {
    if (item) { return item.descripcion; }
  }

  accionGuardar(id:number)
  {
    
    if(typeof this.coloniaForm.value.localidad_id != 'object')
    {
      this.sharedService.showSnackBar('Debe de seleccionar una localidad de la lista', null, 4000);
    }else{
      if(this.data.id != null)
      {
        console.log(this.coloniaForm.value);
        this.coloniasService.editColonias(this.data.id, this.coloniaForm.value).subscribe(
          response => {
            this.dialogRef.close(true);
            this.sharedService.showSnackBar("Se ha guardado el registro", null, 3000);
          },
          responsError =>{
            console.log(responsError);
            this.sharedService.showSnackBar('Error al guardar el formulario', null, 4000);
          }
        );
      }else{
        this.coloniasService.saveColonias(this.coloniaForm.value).subscribe(
          response => {
            this.dialogRef.close(true);
            this.sharedService.showSnackBar("Se ha guardado el registro", null, 3000);
          },
          responsError =>{
            console.log(responsError);
            this.sharedService.showSnackBar('Error al guardar el formulario', null, 4000);
          }
        );
      }
    }
  }

}
