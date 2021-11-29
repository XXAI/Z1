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
import { PersonalService } from '../personal.service';

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
  cluesIsLoading: boolean = false;
  filteredClues: Observable<any[]>;
  isLoading:boolean = false;
  
  constructor(
    private sharedService: SharedService, 
    private personalService: PersonalService,
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
    'ur': ['',[Validators.required]],
    'catalogo_lengua_id': ['',[Validators.required]],
    'clues': ['',[Validators.required]],
    
  });


  ngOnInit(): void {
    this.cargarCatalogos();
  }

  cargarDatos()
  {
    this.personalService.getTrabajadorEdit(this.data.id).subscribe(
      response => {
        
        let obj = response.data;
        console.log(obj);
        //this.cargaMunicipio(obj.localidad.municipio.catalogo_distrito_id, obj, 0);
        this.trabajadorForm.patchValue({nombre:obj.nombre, 
          apellido_paterno: obj.apellido_paterno, 
          apellido_materno: obj.apellido_materno, 
          rfc:obj.rfc, 
          curp: obj.curp,
          sexo_id: obj.sexo_id,
          ur: obj.ur.ur,
          edad: obj.edad,
          catalogo_lengua_id: obj.catalogo_lengua_id,
          clues: obj.rel_rh.clues
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
    this.personalService.getCatalogos().subscribe(
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
    this.trabajadorForm.get('clues').valueChanges
    .pipe(
      debounceTime(300),
      tap( () => {
          this.cluesIsLoading = true; 
      } ),
      switchMap(value => {
          if(!(typeof value === 'object')){
            this.cluesIsLoading = false;
            return this.personalService.buscarClues({query:value}).pipe(finalize(() => this.cluesIsLoading = false ));
           
             
          }else{
            this.cluesIsLoading = false; 
            return [];
          }
        }
      ),
    ).subscribe(items => this.filteredClues = items);
    
  }

  displayCluesFn(item: any) {
    if (item) { return item.descripcion; }
  }

  accionGuardar(id:number)
  {
    if(this.data.id != null)
    {
      this.personalService.editTrabajador(this.data.id, this.trabajadorForm.value).subscribe(
        response => {
          this.dialogRef.close(true);
          this.sharedService.showSnackBar("Se ha guardado el registro", null, 3000);
        },
        responsError =>{
          console.log(responsError);
          this.sharedService.showSnackBar('Error al intentar recuperar datos de asistencia', null, 4000);
        }
      );
    }else{
      this.personalService.saveTrabajador(this.trabajadorForm.value).subscribe(
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
