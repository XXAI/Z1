import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { CluesService } from '../../clues.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent implements OnInit {

  lat = 16.75;
  long = -93.1167;

  mediaSize: string;
  datosRegion:any = [];
  dataSourceRegiones:any = new MatTableDataSource(this.datosRegion);

  estatus_clues:boolean = false;
  datos_clues:any;
  filteredClues: any[];
  filteredLocalidad: any[];
  cluesIsLoading: boolean = false;
  localidadIsLoading: boolean = false;

  catalogos: any = {};
  filteredCatalogs:any = [];
  
  statusLabel: string;
  statusIcon: string;

  responsableIsLoading: boolean = false;
  filteredResponsable: any[];
  
  fechaActual:any = '';
  maxDate:Date;
  minDate:Date;

  inicio_operacion:string = "0000-00-00";
  fecha_acreditacion:string = "0000-00-00";
  btn_guardar = false;

  constructor(
    private sharedService: SharedService, 
    private cluesService: CluesService,
    private authService: AuthService, 
    private route: ActivatedRoute, 
    private fb: FormBuilder,
    public dialog: MatDialog,
    public router: Router,
  ) { }

  isLoading:boolean = false;
  
  cluesForm = this.fb.group({
    'catalogo_microrregion_id': ['',Validators.required],
    'catalogo_localidad': ['',Validators.required],
    'municipio_id': ['',Validators.required],
    'clues': ['',Validators.required],
    'descripcion': ['',Validators.required],
    'direccion': [''],
    'inicio_operacion': [''],
    'fecha_operacion': [''],
    'cp': ['',Validators.required],
    'telefono': ['',Validators.required],
    'nucleos_camas': ['',Validators.required],
    'latitud': ['',Validators.required],
    'longitud': ['',Validators.required],
  });

  async ngOnInit() {
    
    let fecha = new Date('YYYY-MM-D');
    this.fechaActual = fecha;

    await this.IniciarCatalogos(null);
    this.loadPermisos();
  }

  displayLocalidadFn(item: any) {
    if (item) { 
      return item.descripcion; 
    }
  }

  loadPermisos()
  {
    this.cluesService.getPermisos({}).subscribe(
      response => {
        
        response.permisos.forEach(element => {
          if(element == "permiso_visor")
          {
            this.btn_guardar == true;
          }
        });
        
      }
    );
  }

  public IniciarCatalogos(obj:any)
  {
    this.isLoading = true;
    this.cluesService.obtenerCatalogos(obj).subscribe(
      response => {
        this.catalogos = response;
        this.isLoading = false; 
      } 
    );

    this.cluesForm.get('catalogo_localidad').valueChanges
      .pipe(
        debounceTime(300),
        tap( () => {
          //this.element.loading = true;
            this.localidadIsLoading = true; 
        } ),
        switchMap(value => {
            if(!(typeof value === 'object')){
              this.localidadIsLoading = false;
              let municipio = this.cluesForm.get('municipio_id').value;
                return this.cluesService.obtenerLocalidades({query:value, municipio:municipio }).pipe(finalize(() => this.localidadIsLoading = false ));
               
            }else{
              this.localidadIsLoading = false; 
              return [];
            }
          }
        ),
      ).subscribe(items => this.catalogos['localidades'] = items.data);
  }

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }

  validarFecha(valor)
  {
    this.cluesForm.get('inicio_operacion').disable();
  }

  LimpiarLocalidad()
  {
    this.cluesForm.patchValue({catalogo_localidad:''});
  }

  displayResponsableFn(item: any) {
    if (item) { return item.nombre; }
  }

  accionGuardar(validar:boolean = false){
    this.isLoading = true;
    let formData = JSON.parse(JSON.stringify(this.cluesForm.value));
    //console.log(formData);
    if(formData.microrregion_id != null && formData.localidad_id != null )
    {
      formData.microrregion_id = formData.microrregion_id.id;
      formData.localidad_id    = formData.localidad_id.id;
    }

    delete formData.microrregiones;
    delete formData.localidades;
    //console.log(formData);
    this.cluesService.guardarClues(formData).subscribe(
      respuesta => {
        this.isLoading = false;
        this.sharedService.showSnackBar("Se ha guardado correctamente", "Correcto", 4000);
        this.router.navigate(['/catalogos/clues']);
      },
      errorResponse =>{
        console.log(errorResponse);
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }else{
          errorMessage += ': ' + errorResponse.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
      }
    );
  }

}
