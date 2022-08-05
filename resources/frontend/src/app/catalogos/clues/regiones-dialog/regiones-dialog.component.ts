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
  filteredTitulo: any[];
  institucionIsLoading: boolean = false;
  filteredInstitucion: any[];
  resultado:any = { estatus: false, datos:{}, dias:[]};
  texto_grado_seleccionado:string = "";
  tituloIsLoading:boolean = false;

  isLoading:boolean = false;
  catalogos: any = {};
  filteredCatalogs:any = {};

  filteredClues: any[];
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
    clue: [''],
    clues: ['', [Validators.required]],
    municipio:[''],
    catalogo_municipio_id: [''],
    localidad:[''],
    catalogo_localidad_id: ['', [Validators.required]],
    catalogo_tipo_camino_id: ['', [Validators.required]],
    microrregion:[''],
    catalogo_tipo_regionalizacion_id: ['', [Validators.required]],
    distancia: [''],
    tiempo: [''],
  });

  ngOnInit() {
    console.log("DATOS", this.data);
    //this.cargarGrado();
    this.IniciarCatalogos(null);
    //this.RegionesForm.patchValue({cedula: 0});
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

        /*this.catalogos = response.data;

        this.filteredCatalogs['municipios']             = this.RegionesForm.get('catalogo_municipio_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'municipios','descripcion')));
        this.filteredCatalogs['microrregiones']         = this.RegionesForm.get('catalogo_tipo_regionalizacion_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'microrregiones','descripcion')));
        this.filteredCatalogs['tipos_caminos']          = this.RegionesForm.get('catalogo_tipo_camino_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'tipos_caminos','descripcion')));
        this.filteredCatalogs['localidades']            = this.RegionesForm.get('catalogo_localidad_id').valueChanges.pipe(startWith(''),map(value => this._filter(value,'localidades','descripcion')));
        this.filteredCatalogs['clues']                  = this.RegionesForm.get('clues').valueChanges.pipe(startWith(''),map(value => this._filter(value,'clues','descripcion')));
*/


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

    
    console.log("CATALOGOS",this.catalogos);

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

  checkAutocompleteValue(field_name) {
    setTimeout(() => {
      if (typeof(this.RegionesForm.get(field_name).value) != 'object') {
        this.RegionesForm.get(field_name).reset();
        if(field_name != 'catalogo_localidad_id'){
          this.catalogos['localidades'] = false;
          this.actualizarValidacionesCatalogos('localidades');  
        }
      } 
    }, 300);
  }

  cargarLocalidades(event){
    
    this.isLoading = true;
    let municipio = event.option.value;

    let carga_catalogos = [
      {nombre:'localidades',orden:'descripcion',filtro_id:{campo:'catalogo_municipio_id',valor:municipio.id}},
    ];
    this.catalogos['localidades'] = false;
    this.RegionesForm.get('catalogo_localidad_id').reset();
    this.RegionesForm.get('localidad').reset();

    this.cluesService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        /*if(response.data['localidades'].length > 0){
          this.catalogos['localidades'] = response.data['localidades'];
        }
        else{
         this.RegionesForm.get('localidad').disable();
         this.RegionesForm.get('catalogo_localidad_id').disable();
        }
        
        this.actualizarValidacionesCatalogos('localidades');*/
        this.isLoading = false;
      }
    );
  }

  cargarClues(event){

    this.isLoading = true;
    let clues = event.option.value;

    let carga_catalogos = [
      {nombre:'clues',orden:'descripcion',filtro_id:{campo:'catalogo_localidad_id',valor:clues.id}},
    ];

    this.catalogos['clues'] = false;
    this.RegionesForm.get('clue').reset();
    this.RegionesForm.get('clues').reset();

    this.cluesService.obtenerCatalogos(carga_catalogos).subscribe(
      response => {
        /*if(response.data['clues'].length > 0){
          this.catalogos['clues'] = response.data['clues'];
          this.actualizarValidacionesCatalogos('clues');
        }else{
         this.RegionesForm.get('clue').disable();
         this.RegionesForm.get('clues').disable();
        }
        */
        this.isLoading = false;
      }
    );

    console.log(this.RegionesForm);

  }

  actualizarValidacionesCatalogos(catalogo){
    switch (catalogo) {
      case 'municipios':
        if(this.catalogos['municipios']){
          this.RegionesForm.get('municipio').setValidators(null);
          this.RegionesForm.get('catalogo_municipio_id').setValidators([Validators.required]);
        }else{
          this.RegionesForm.get('municipio').setValidators([Validators.required]);
          this.RegionesForm.get('catalogo_municipio_id').setValidators(null);
        }
          this.RegionesForm.get('municipio').updateValueAndValidity();
          this.RegionesForm.get('catalogo_municipio_id').updateValueAndValidity();
        break;
      case 'localidades':
        if(this.catalogos['localidades']){
          this.RegionesForm.get('localidad').setValidators(null);
          this.RegionesForm.get('catalogo_localidad_id').setValidators([Validators.required]);
        }else{
          this.RegionesForm.get('localidad').setValidators([Validators.required]);
          this.RegionesForm.get('catalogo_localidad_id').setValidators(null);
        }    
         this.RegionesForm.get('localidad').updateValueAndValidity();
         this.RegionesForm.get('catalogo_localidad_id').updateValueAndValidity();
        break;
      case 'clues':
        if(this.catalogos['clues']){
          this.RegionesForm.get('clue').setValidators(null);
          this.RegionesForm.get('clues').setValidators([Validators.required]);
        }else{
          this.RegionesForm.get('clue').setValidators([Validators.required]);
          this.RegionesForm.get('clues').setValidators(null);
        }    
          this.RegionesForm.get('clue').updateValueAndValidity();
          this.RegionesForm.get('clues').updateValueAndValidity();
        break;
      default:
        break;
    }
  }

  cargarEditable():void
  {
    console.log("aaaaa",this.data.editable);
    // this.RegionesForm.patchValue(this.data.editable);
    // this.texto_grado_seleccionado = this.data.editable.grado_academico.descripcion;
    // this.activar_otro_titulo(!this.data.editable.otro_estudio);
    // this.activar_otro_institucion(!this.data.editable.otro_institucion);
    // this.tiene_cedula(this.data.editable.cedula_profesional);
    // this.tiene_cedula(this.data.editable.cedula);
  }

  cargarGrado():void
  {
    this.catalogos = this.data.catalogos;

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
