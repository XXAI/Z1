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
  filteredClues: Observable<any[]>;
  cluesIsLoading: boolean = false;

  catalogos: any = {};
  filteredCatalogs:any = {};

  puedeGuardar: boolean = true;
  puedeValidar: boolean = true;
  puedeTransferir: boolean = true;
  necesitaActivarse: boolean = false;
  statusLabel: string;
  statusIcon: string;

  responsableIsLoading: boolean = false;
  filteredResponsable: Observable<any[]>;
  
  fechaActual:any = '';
  maxDate:Date;
  minDate:Date;

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
    'clues': ['',Validators.required],
    'descripcion': ['',Validators.required],
    'direccion': ['',Validators.required],
    'cp': ['',Validators.required],
    'telefono': ['',Validators.required],
    'nucleos_camas': ['',Validators.required],
    'inicio_operacion': ['',Validators.required],
    'fecha_operacion': ['',Validators.required],
    'latitud': ['',Validators.required],
    'longitud': ['',Validators.required],
    'microrregion_id': ['',Validators.required],
    'microrregiones': [''],
    'localidad_id': ['',Validators.required],
    'localidades': [''],
    'tipo_camino_id': [''],
    'tipos_regionalizacion_id':[''],
    'regionalizaciones':this.fb.array([]),

    
    // 'responsable_id': [''],
    // 'cargo_responsable': ['',Validators.required],
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.clues = params.get('id');

      if(this.clues){
        this.loadCluesData(this.clues);
      }
    });

    let fecha = new Date('YYYY-MM-D');
    this.fechaActual = fecha;
    //this.fechaActual = moment(fecha).format('YYYY-MM-D');
    // this.maxDate = fecha;

    // let fecha_inicio = new Date(2020, 0, 1);
    // this.minDate = fecha_inicio;
    this.IniciarCatalogos(null);

  }

  public IniciarCatalogos(obj:any)
  {
    this.isLoading = true;
    let carga_catalogos = [
      {nombre:'microrregiones',orden:'descripcion'},
      {nombre:'localidades',orden:'descripcion'},
      {nombre:'tipos_caminos',orden:'descripcion'},
    ];

    this.cluesService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {

        this.catalogos = response.data;

        this.filteredCatalogs['microrregiones']           = this.cluesForm.get('microrregion_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'microrregiones','descripcion')));
        this.filteredCatalogs['localidades']              = this.cluesForm.get('localidad_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'localidades','descripcion')));
        this.filteredCatalogs['tipos_caminos']            = this.cluesForm.get('tipo_camino_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'tipos_caminos','descripcion')));        


        if(obj)
        {
            console.log("asdasd", obj);
           this.cluesForm.get('microrregion_id').setValue(obj.catalogo_microrregion);
           this.cluesForm.get('localidad_id').setValue(obj.catalogo_localidad);
          //this.valor_unidad = parseInt(obj.tipo_unidad_id);
        }
        this.isLoading = false; 
      } 
    );

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


  showRegionesDialog(index_editable = null){
    let configDialog = {};
    let index = index_editable;
    
    if(this.mediaSize == 'xs'){
      configDialog = {
        maxWidth: '100vw',
        maxHeight: '100vh',
        height: '100%',
        width: '100%',
        data:{scSize:this.mediaSize, catalogos: this.catalogos, editable: this.datosRegion[index_editable] },
      };
    }else{
      
      configDialog = {
        width: '95%',
        data:{ catalogos: this.catalogos, editable: this.datosRegion[index_editable] },
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
        console.log(response);
        this.cluesForm.reset();

        if(typeof response === 'object'){
          //this.datos_clues = response.data;
          this.IniciarCatalogos(response.data);
          this.cluesForm.patchValue(response.data);
          this.estatus_clues = true;
          
        }
        this.isLoading = false;
      },
      errorResponse =>{
        console.log(errorResponse);
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, null, 3000);
        this.isLoading = false;
      }
    );
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
