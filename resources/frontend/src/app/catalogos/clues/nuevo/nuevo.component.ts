import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { CluesService } from '../../clues.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth/auth.service';

import { startWith, map } from 'rxjs/operators';


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
  filteredCatalogs:any = {};
  
  statusLabel: string;
  statusIcon: string;

  responsableIsLoading: boolean = false;
  filteredResponsable: any[];
  
  fechaActual:any = '';
  maxDate:Date;
  minDate:Date;

  inicio_operacion:string = "0000-00-00";
  fecha_acreditacion:string = "0000-00-00";
  permiso_guardar:boolean = false;

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
        let admin = response.data.admin;
        let permisos = response.data.permisos;
        if(admin == false)
        {
          permisos.forEach(element => {
            if(element == "permiso_admin_simoss")
            {
              this.permiso_guardar = true;
            }
          });
          
        }else{
          this.permiso_guardar = true;
        }    
        
        
      }
    );
  }

  public IniciarCatalogos(obj:any)
  {
    this.isLoading = true;
    this.cluesService.obtenerCatalogos(obj).subscribe(
      response => {
        this.catalogos = response;
        console.log(this.catalogos);
        this.isLoading = false; 
      } 
    );

    this.filteredCatalogs['localidades'] = this.cluesForm.get('catalogo_localidad').valueChanges.pipe(startWith(''),map(value => this._filter(value,'localidades','descripcion')));
      
  }

  private _filter(value: any, catalog: string, valueField: string): string[] {
    
    if(this.catalogos[catalog]){
      let filterValue = '';
      if(value){
        if(typeof(value) == 'object'){
          filterValue = value[valueField].toLowerCase();
        }else{
          filterValue = value.toLowerCase();
        }
      }
      
      return this.catalogos[catalog].filter(option => option[valueField].toLowerCase().includes(filterValue));
    }
  }

  cargarLocalidades(event:any){
    console.log(event);
    this.isLoading = true;
    const municipio = event?.value;

    const carga_catalogos = [
      {nombre:'localidades',orden:'id',filtro_id:{campo:'catalogo_municipio_id',valor:municipio}},
    ];

    this.catalogos['localidades'] = false;
    this.cluesForm.get('catalogo_localidad').reset();

    this.cluesService.obtenerLocalidades(carga_catalogos).subscribe(
      response => {
        if(response.data['localidades'].length > 0){
          this.catalogos['localidades'] = response.data['localidades'];
        }
        
        this.actualizarValidacionesCatalogos('localidades');
        this.isLoading = false;
      }
    );
  }

  actualizarValidacionesCatalogos(catalogo){
    switch (catalogo) {
      case 'localidades':
        if(this.catalogos['localidades']){
           this.cluesForm.get('catalogo_localidad').setValidators(null);
           this.cluesForm.get('catalogo_localidad').setValidators([Validators.required]);
        }else{
          this.cluesForm.get('catalogo_localidad').setValidators([Validators.required]);
           this.cluesForm.get('catalogo_localidad').setValidators(null);
        }    
         this.cluesForm.get('catalogo_localidad').updateValueAndValidity();
         this.cluesForm.get('catalogo_localidad').updateValueAndValidity();
        break;
      default:
        break;
    }
  }

  checkAutocompleteValue(field_name) {
    setTimeout(() => {
      if (typeof(this.cluesForm.get(field_name).value) != 'object') {
        this.cluesForm.get(field_name).reset();
        if(field_name != 'catalogo_localidad'){
          this.catalogos['localidades'] = false;
          this.actualizarValidacionesCatalogos('localidades');  
        }
      } 
    }, 300);
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

  LimpiarLocalidad(e:any){
    console.log(e);
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
