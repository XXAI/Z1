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
import { LocalidadService } from '../localidad.service';

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
  poblacion:any;

  displayedColumns: string[] = ['AÑO', 'CANTIDAD'];
  dataSource:any;

  constructor(
    private sharedService: SharedService, 
    private localidadService: LocalidadService,
    public dialogRef: MatDialogRef<FormularioComponent>,
    private authService: AuthService, 
    private route: ActivatedRoute, 
    private fb: FormBuilder,
    public dialog: MatDialog,
    public mediaObserver: MediaObserver,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: FormularioComponentData 
  ) { }
  
  public localidadForm = this.fb.group({
    //'tipo_localidad': ['',[Validators.required]],
    'municipio_id': ['',[Validators.required]],
    'clave_localidad': ['',[Validators.required]],
    'descripcion': ['',[Validators.required]],
    'latitud': ['',[Validators.required]],
    'longitud': ['',[Validators.required]]
    
  });

  ngOnInit(): void {
    this.cargarCatalogos();
  }

  cargarDatos()
  {
    this.localidadService.getLocalidad(this.data.id).subscribe(
      response => {
        
        let obj = response.data;
        //console.log(obj);
        this.dataSource = obj.poblacion_inegi;
        this.cargaMunicipio();
        this.localidadForm.patchValue({
          descripcion: obj.descripcion, 
          clave_localidad: obj.clave_localidad, 
          municipio_id:obj.catalogo_municipio_id,
          tipo_localidad: parseInt(obj.tipo_localidad),
          latitud: obj.latitud,
          longitud: obj.longitud
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
    this.localidadService.getCatalogos().subscribe(
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

  }

  cerrar()
  {
    this.dialogRef.close(true);
  }

  cargaMunicipio()
  {
    /*this.localidadService.getCatalogos().subscribe(
      response => {
        //console.log(response);
        this.catalogo['municipio'] = response;
        if(tipo == 1)
        {
          this.localidadForm.patchValue({localidad_id:[]});
        }
        
        if(this.data.id != null)
        {
          this.localidadForm.patchValue({municipio_id:obj.localidad.municipio.id});
        }
      },
      responsError =>{
        console.log(responsError);
        this.sharedService.showSnackBar('Error al intentar recuperar datos', null, 4000);
      }
    );*/
  }

  displayLocalidadFn(item: any) {
    if (item) { return item.descripcion; }
  }

  accionGuardar(id:number)
  {
    if(this.data.id != null)
    {
      this.localidadService.updateLocalidad(this.data.id, this.localidadForm.value).subscribe(
        response => {
          this.dialogRef.close(true);
          this.sharedService.showSnackBar("Se ha guardado el registro", null, 3000);
        },
        responsError =>{
          console.log(responsError);
          this.sharedService.showSnackBar('Error al intentar recuperar datos', null, 4000);
        }
      );
    }else{
      this.localidadService.saveLocalidad(this.localidadForm.value).subscribe(
        response => {
          this.dialogRef.close(true);
          this.sharedService.showSnackBar("Se ha guardado el registro", null, 3000);
        },
        responsError =>{
          console.log(responsError);
          this.sharedService.showSnackBar('Error al intentar recuperar datos', null, 4000);
        }
      );
    }
    
  }

}
