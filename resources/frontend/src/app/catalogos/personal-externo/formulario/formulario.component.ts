import { Component, OnInit, Inject } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { SharedService } from 'src/app/shared/shared.service';
/* Utilerias */
/*Dialogs */
import { PersonalExternoService } from '../personal-externo.service';

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
  isLoading:boolean = false;
  localidadIsLoading: boolean = false;
  filteredLocalidad: any[];

  constructor(
    private sharedService: SharedService, 
    private personalExternoService: PersonalExternoService,
    public dialogRef: MatDialogRef<FormularioComponent>,
    private authService: AuthService, 
    private route: ActivatedRoute, 
    private fb: FormBuilder,
    public dialog: MatDialog,
    public mediaObserver: MediaObserver,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: FormularioComponentData 
  ) { }
  
  public trabajadorForm = this.fb.group({
    'nombre': ['',[Validators.required]],
    'apellido_paterno': ['',[Validators.required]],
    'apellido_materno': ['',[Validators.required]],
    'rfc': ['',[Validators.required]],
    'curp': ['',[Validators.required]],
    'edad': ['',[Validators.required]],
    'sexo_id': ['',[Validators.required]],
    'tipo_personal': ['',[Validators.required]],
    'catalogo_lengua_id': ['',[Validators.required]],
    'municipio_id': ['',[Validators.required]],
    'localidad_id': ['',[Validators.required]],
    
  });


  ngOnInit(): void {
    this.cargarCatalogos();
  }

  cargarDatos()
  {
    this.personalExternoService.getTrabajadorEdit(this.data.id).subscribe(
      response => {
        
        let obj = response.data;
       this.trabajadorForm.patchValue({nombre:obj.nombre, 
          apellido_paterno: obj.apellido_paterno, 
          apellido_materno: obj.apellido_materno, 
          rfc:obj.rfc, 
          curp: obj.curp,
          sexo_id: obj.sexo_id,
          tipo_personal: obj.tipo_personal_id,
          edad: obj.edad,
          catalogo_lengua_id: obj.catalogo_lengua_id,
          municipio_id: obj.rel_regionalizacion_rh.localidad.municipio.id,
          localidad_id: obj.rel_regionalizacion_rh.localidad
        });
        
      },
      responsError =>{
        console.log(responsError);
        this.sharedService.showSnackBar('Error al intentar recuperar datos', null, 4000);
      }
    );

    
  }

  cargarCatalogos()
  {
    this.personalExternoService.getCatalogos().subscribe(
      response => {
        this.catalogo = response;
        if(this.data.id != null)
        {
          this.cargarDatos();
        }
      },
      responsError =>{
        console.log(responsError);
        this.sharedService.showSnackBar('Error al intentar recuperar datos', null, 4000);
      }
    );

    this.trabajadorForm.get('localidad_id').valueChanges
    .pipe(
      debounceTime(300),
      tap( () => {
          this.localidadIsLoading = true; 
      } ),
      switchMap(value => {
          if(!(typeof value === 'object')){
            this.localidadIsLoading = false;
            let municipio = this.trabajadorForm.get('municipio_id').value;
            return this.personalExternoService.buscarLocalidad({query:value, municipio_id: municipio}).pipe(finalize(() => this.localidadIsLoading = false ));
           
             
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

  accionGuardar(id:number)
  {
    if(this.data.id != null)
    {
      this.personalExternoService.editTrabajador(this.data.id, this.trabajadorForm.value).subscribe(
        response => {
          this.dialogRef.close(true);
          this.sharedService.showSnackBar("Se ha guardado el registro", null, 3000);
        },
        responsError =>{
          console.log(responsError);
          this.sharedService.showSnackBar('Error al registrar el trabajador', null, 4000);
        }
      );
    }else{
      this.personalExternoService.saveTrabajador(this.trabajadorForm.value).subscribe(
        response => {
          this.dialogRef.close(true);
          this.sharedService.showSnackBar("Se ha guardado el registro", null, 3000);
        },
        responsError =>{
          console.log(responsError);
          this.sharedService.showSnackBar('Error al registrar el trabajador', null, 4000);
        }
      );
    } 
  }
}