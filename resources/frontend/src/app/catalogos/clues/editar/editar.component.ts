import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { CluesService } from '../../clues.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, combineLatest, of, forkJoin } from 'rxjs';
import { startWith, map, throwIfEmpty, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { ConfirmActionDialogComponent } from '../../../utils/confirm-action-dialog/confirm-action-dialog.component';
import { RegionesDialogComponent } from '../regiones-dialog/regiones-dialog.component';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {
 
  lat = 16.75;
  long = -93.1167;

  mediaSize: string;
  datosRegion:any = [];
  dataSourceRegiones:any = new MatTableDataSource(this.datosRegion);

  clues:any;
  estatus_clues:boolean = false;
  datos_clues:any;
  filteredClues: any[];
  filteredLocalidad: any[];
  cluesIsLoading: boolean = false;
  localidadIsLoading: boolean = false;

  catalogos: any = {};
  filteredCatalogs:any = {};
  distrito:any;
  
 
  necesitaActivarse: boolean = false;
  statusLabel: string;
  statusIcon: string;

  btn_guardar = false;
  permiso_guardar:boolean = false;

  responsableIsLoading: boolean = false;
  filteredResponsable: any[];
  
  fechaActual:any = '';
  maxDate:Date;
  minDate:Date;

  inicio_operacion:string = "0000-00-00";
  fecha_acreditacion:string = "0000-00-00";


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
    'cp': ['',Validators.required],
    'telefono': ['',Validators.required],
    'nucleos_camas': ['',Validators.required],
    //'inicio_operacion': [''],
    //'fecha_operacion': [''],
    'latitud': ['',Validators.required],
    'longitud': ['',Validators.required],
  });

  async ngOnInit() {
    //this.catalogos['localidades'] = [{id:1, descripcion:"hola"},{id:2, descripcion:"hola 2"}];

    let fecha = new Date('YYYY-MM-D');
    this.fechaActual = fecha;

    await this.IniciarCatalogos(null);

    this.route.paramMap.subscribe(params => {
      this.clues = params.get('id');

      if(this.clues){
        this.loadCluesData(this.clues);
      }
    });
    this.loadPermisos();
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

  displayLocalidadFn(item: any) {
    if (item) { 
      return item.descripcion; 
    }
    
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

  getDisplayFn(label: string){
    return (val) => this.displayFn(val,label);
  }

  displayFn(value: any, valueLabel: string){
    return value ? value[valueLabel] : value;
  }



  validarFecha(valor)
  {
    this.cluesForm.get('inicio_operacion').disable();
    console.log(valor);
  }


  showRegionesDialog(index_editable = null){
    let configDialog = {};
    let index = index_editable;
    
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data:{scSize:this.mediaSize, editable: this.datosRegion[index_editable] },
      };
    }else{
      
      configDialog = {
        width: '95%',
        data:{ editable: this.datosRegion[index_editable] },
      }
    }
    const dialogRef = this.dialog.open(RegionesDialogComponent, configDialog);
    dialogRef.afterClosed().subscribe(valid => {
      
      if(valid){
        if(valid.estatus){
         
          if(index != null)
          {
            this.datosRegion[index] = valid.datos;  
          }else{
            if(this.datosRegion.length == 4)
            {
              let mensaje = "Solo se puede agregar hasta 4 grados escolares";
              this.sharedService.showSnackBar(mensaje, "ERROR", 3000);
            }else{
              this.datosRegion.push(valid.datos);
            }
            
          }
          this.dataSourceRegiones.data = this.datosRegion;
          
        }
      }
    });
  }


  loadCluesData(id:any)
  {
    this.isLoading = true;
    let params = {};

    this.cluesService.obtenerDatosClues(id,params).subscribe(
      response =>{
        console.log(response.data);
        if(response.data.distrito)
        {
          this.distrito = response.data.distrito;
        }
        
        if(typeof response === 'object'){
          //this.datos_clues = response.data;
          this.IniciarCatalogos(response.data);
          if(response.data.catalogo_localidad)
          {
            response.data.municipio_id = response.data.catalogo_localidad.catalogo_municipio_id;
            this.cargarLocalidades(response.data.municipio_id); 
          }
          this.cluesForm.patchValue(response.data);
          this.cluesForm.get('catalogo_localidad').patchValue(response?.data?.catalogo_localidad);
          this.inicio_operacion = response.data.inicio_operacion;
          this.fecha_acreditacion = response.data.fecha_operacion;
          /*console.log(this.cluesForm.get('fecha_operacion').value);
          

          //if()
          this.cluesForm.patchValue({'fecha_operacion': new Date(1960, 1, 1), 'inicio_operacion': new Date(1960, 1, 1)});          */
          //console.log(response.data);
          this.estatus_clues = true;
          
        }
        this.isLoading = false;
      },
      errorResponse =>{
        //console.log(errorResponse);
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
      }
    );
  }

  LimpiarLocalidad()
  {
    this.cluesForm.patchValue({catalogo_localidad:''});
  }

  cargarLocalidades(event:any){
    
    let municipio = event;

    if(municipio?.value){
      municipio = event?.value;
     }else{
      municipio = event;
     }

    this.isLoading = true;

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

    this.cluesService.actualizarClues(this.clues, formData).subscribe(
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
