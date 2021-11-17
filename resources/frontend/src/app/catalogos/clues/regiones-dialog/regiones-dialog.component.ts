import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CluesService } from '../../clues.service';
import { MediaObserver } from '@angular/flex-layout';
import { Observable } from 'rxjs';
import { startWith, map, throwIfEmpty, debounceTime, tap, switchMap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-regiones-dialog',
  templateUrl: './regiones-dialog.component.html',
  styleUrls: ['./regiones-dialog.component.css']
})
export class RegionesDialogComponent implements OnInit {

  capacitacionIsLoading: boolean = false;
  filteredTitulo: Observable<any[]>;
  institucionIsLoading: boolean = false;
  filteredInstitucion: Observable<any[]>;
  resultado:any = { estatus: false, datos:{}, dias:[]};
  texto_grado_seleccionado:string = "";
  tituloIsLoading:boolean = false;

  isLoading:boolean = false;
  catalogos: any = {};
  filteredCatalogs:any = {};

  filteredClues: Observable<any[]>;
  cluesIsLoading: boolean = false;
  
  constructor(
    private sharedService: SharedService, 
    private fb: FormBuilder,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<RegionesDialogComponent>,
    private cluesService: CluesService,
    public mediaObserver: MediaObserver,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  public RegionesForm = this.fb.group({
    clues: ['', [Validators.required]],
    catalogo_municipio_id: [''],
    catalogo_localidad_id: ['', [Validators.required]],
    catalogo_tipo_camino_id: ['', [Validators.required]],
    catalogo_tipo_regionalizacion_id: ['', [Validators.required]],
    distancia: [''],
    tiempo: [''],
  });

  ngOnInit() {
    this.cargarBuscadores();
    //this.cargarGrado();
    this.IniciarCatalogos(null);
    this.RegionesForm.patchValue({cedula: 0});
    if(this.data.editable != null)
    {
      this.cargarEditable();
    }

    
  }

  public IniciarCatalogos(obj:any)
  {
    this.isLoading = true;
    let carga_catalogos = [
      {nombre:'microrregiones',orden:'descripcion'},
      {nombre:'tipos_caminos',orden:'descripcion'},
      {nombre:'municipios',orden:'descripcion'},
    ];

    this.cluesService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {

        this.catalogos = response.data;

        this.filteredCatalogs['municipios']              = this.RegionesForm.get('catalogo_municipio_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'municipios','descripcion')));
        this.filteredCatalogs['microrregiones']          = this.RegionesForm.get('catalogo_tipo_regionalizacion_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'microrregiones','descripcion')));
        this.filteredCatalogs['tipos_caminos']           = this.RegionesForm.get('catalogo_tipo_camino_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'tipos_caminos','descripcion')));        


        // if(obj)
        // {
        //     console.log("asdasd", obj);
        //    this.cluesForm.get('microrregion_id').setValue(obj.catalogo_microrregion);
        //    this.cluesForm.get('localidad_id').setValue(obj.catalogo_localidad);
        //   //this.valor_unidad = parseInt(obj.tipo_unidad_id);
        // }
        this.isLoading = false; 
      } 
    );

    
    console.log(this.catalogos);

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

  cargarEditable():void
  {
    this.RegionesForm.patchValue(this.data.editable);
    this.texto_grado_seleccionado = this.data.editable.grado_academico.descripcion;
    this.activar_otro_titulo(!this.data.editable.otro_estudio);
    this.activar_otro_institucion(!this.data.editable.otro_institucion);
    this.tiene_cedula(this.data.editable.cedula_profesional);
    this.tiene_cedula(this.data.editable.cedula);
  }

  cargarGrado():void
  {
    this.catalogos = this.data.catalogos;
    console.log(this.catalogos);
  }

  
  cargarBuscadores():void
  { 

    this.RegionesForm.get('clues').valueChanges
    .pipe(
      debounceTime(300),
      tap( () => {
        this.cluesIsLoading = true;
      } ),
      switchMap(value => {
          if(!(typeof value === 'object')){
            return this.cluesService.buscarClue({query:value}).pipe(
              finalize(() => this.cluesIsLoading = false )
            );
          }else{
            this.cluesIsLoading = false;
            return [];
          }
        }
      ),
    ).subscribe(items => this.filteredClues = items);
      // this.RegionesForm.get('clues').valueChanges
      // .pipe(
      //   debounceTime(300),
      //   tap( () => {
      //     //this.element.loading = true;
      //       this.capacitacionIsLoading = true; 
      //   } ),
      //   switchMap(value => {
      //       if(!(typeof value === 'object')){
      //         this.capacitacionIsLoading = false; 
      //         let grado = this.RegionesForm.get('grado_academico_id').value;
      //         let descripcion = this.RegionesForm.get('nombre_estudio').value;
      //         if( grado != '' && descripcion!="")
      //         {
      //           return this.cluesService.buscarClue({tipo: 2, query:value, grado_academico:grado }).pipe(finalize(() => this.capacitacionIsLoading = false ));
      //         }else{
      //           return [];
      //         }
               
      //       }else{
      //         this.capacitacionIsLoading = false; 
      //         return [];
      //       }
      //     }
      //   ),
      // ).subscribe(items => this.filteredTitulo = items);
      
      // this.RegionesForm.get('institucion').valueChanges
      // .pipe(
      //   debounceTime(300),
      //   tap( () => {
      //     //this.element.loading = true;
      //       this.institucionIsLoading = true; 
      //   } ),
      //   switchMap(value => {
      //       if(!(typeof value === 'object')){
      //         this.institucionIsLoading = false; 
      //         let descripcion = this.RegionesForm.get('institucion').value;
      //         if( descripcion!="")
      //         {
               
      //           return this.cluesService.buscarClue({tipo: 3, query:value}).pipe(finalize(() => this.institucionIsLoading = false ));
      //         }else{
      //           return [];
      //         }
               
      //       }else{
      //         this.institucionIsLoading = false; 
      //         return [];
      //       }
      //     }
      //   ),
      // ).subscribe(items => this.filteredInstitucion = items);
      
  }

  tiene_cedula(valor):void{
    if(valor == '0')
    {
      this.RegionesForm.get('no_cedula').disable();
    }else if(valor == '1')
    {
      this.RegionesForm.get('no_cedula').enable();
    }
  }

  activar_otro_titulo(valor)
  {
    if(valor){
      this.RegionesForm.get('nombre_estudio').enable();
      this.RegionesForm.get('otro_nombre_estudio').disable();
    }else{
      this.RegionesForm.get('nombre_estudio').disable();
      this.RegionesForm.get('otro_nombre_estudio').enable();
    }  
    
  }

  activar_otro_institucion(valor)
  {
    if(valor){
      this.RegionesForm.get('institucion').enable();
      this.RegionesForm.get('otro_nombre_institucion').disable();
    }else{
      this.RegionesForm.get('institucion').disable();
      this.RegionesForm.get('otro_nombre_institucion').enable();
    }   
  }

  cancelar(): void {
    this.dialogRef.close(this.resultado);
  }

  guardar(): void {
    this.resultado.estatus = true;
    this.resultado.datos = this.RegionesForm.value;
    this.resultado.datos.grado_academico = { descripcion: this.texto_grado_seleccionado};
    //console.log(this.texto_grado_seleccionado);
    console.log(this.resultado);
    this.dialogRef.close(this.resultado);
  }

  obtener_texto(event) {
    let target = event.source.selected._element.nativeElement;
    this.texto_grado_seleccionado = target.innerText.trim();
  } 

  displayTituloFn(item: any) {
    if (item) { return item.descripcion; }
  }
  displayInstitucionFn(item: any) {
    if (item) { return item.descripcion; }
  }
}
