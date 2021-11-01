import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { CluesService } from '../../clues.service';
import { Router, ActivatedRoute  } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Observable, combineLatest, of, forkJoin } from 'rxjs';
import { startWith, map, throwIfEmpty, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { ConfirmActionDialogComponent } from '../../../utils/confirm-action-dialog/confirm-action-dialog.component';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.css']
})
export class EditarComponent implements OnInit {

   
  lat = 16.75;
  long = -93.1167;

  clues:any;
  estatus_clues:boolean = false;
  datos_clues:any;

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

    
    // 'responsable_id': [''],
    // 'cargo_responsable': ['',Validators.required],
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.clues = params.get('id');

      if(this.clues){
        this.loadCluesData(this.clues);
      }

      // this.cluesForm.get('responsable').valueChanges
      //   .pipe(
      //     debounceTime(300),
      //     tap( () => {
      //       this.responsableIsLoading = true;
      //     } ),
      //     switchMap(value => {
      //         if(!(typeof value === 'object')){
      //           return this.cluesService.buscarResponsable({busqueda_empleado:value}).pipe(
      //             finalize(() => this.responsableIsLoading = false )
      //           );
      //         }else{
      //           this.responsableIsLoading = false;
      //           return [];
      //         }
      //       }
      //     ),
      //   ).subscribe(items => this.filteredResponsable = items);
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
    ];

    this.cluesService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {

        this.catalogos = response.data;

        this.filteredCatalogs['microrregiones']    = this.cluesForm.get('microrregion_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'microrregiones','descripcion')));
        this.filteredCatalogs['localidades']       = this.cluesForm.get('localidad_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'localidades','descripcion')));


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
