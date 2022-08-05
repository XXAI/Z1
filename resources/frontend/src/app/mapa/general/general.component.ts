import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MapaService } from '../mapa.service';
import { SharedService } from 'src/app/shared/shared.service';
import { stringToKeyValue } from '@angular/flex-layout/extended/style/style-transforms';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css']
})
export class GeneralComponent implements OnInit {

  lat: number = 16.404130;
  long: number = -92.655800;
  zoom: number = 8;
  panelOpenState = false;

  municipios:any;
  tipoUnidad:any;
  tipoMicrorregion:any;
  regionalizado:any = [{id:1, descripcion:"SI"},{id:2, descripcion:"NO"}];
  jurisdicciones:any;
  mapa:any;
  localidadesReg:any;
  localidadesNoReg:any;

  latitudOrigen:number;
  longitudOrigen:number;
  localidadesRegionalizadas:any;
  localidadesPoint:any;

  Sede:string = "";
  Microrregion:string = "";
  TipoUnidad:string = "";
  displayInfo:boolean = false;
  DisplayFiltro:boolean = false;

  UnidadSeleccionada:string = "";
  DistritoSeleccionado:string = "";
  PersonalSalud:any = [];
  PersonalExterno:any = [];
  displayedColumns: string[] = ['localidad', 'distancia', 'tiempo', "tipo"];
  dataSource: any = [];
  selectedItemIndex: number = -1;

  iconUnidad = {
    url: '../../assets/icons/UnidadSsa.png',
    //iconHeigh: 10,
    scaledSize: {height: 25, width: 20}
  }

  iconLocalidadReg = {
    url: '../../assets/icons/pin_localidad_reg.png',
    iconHeigh: 10,
    scaledSize: {height: 15, width: 15}
  }

  iconLocalidadNoReg = {
    url: '../../assets/icons/pin_localidad_no_reg.png',
    iconHeigh: 10,
    scaledSize: {height: 15, width: 15}
  }

  constructor(private fb: FormBuilder,
              private mapaService:MapaService,
              private sharedService: SharedService, ) { }

  public regionalizacionForm = this.fb.group({
    'jurisdiccion_id': [0],
    'municipio_id': [''],
    'tipo': [0],
    'microrregion': [''],
    'clues': [''],
    'regionalizacion': [0],
  });

  ngOnInit(): void {
    this.cargarCatalogos();
  }

  cargarCatalogos()
  {
    this.mapaService.getCatalogo().subscribe(
      response =>{
        this.jurisdicciones = response.distrito;
        this.tipoUnidad = response.tipoUnidad;
        
      },
      errorResponse =>{
        //this.isLoading = false;
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, "ERROR", 3000);
        
      }
    );
  }

  CargarMunicipios(jurisdiccion:any)
  {
    this.regionalizacionForm.patchValue({municipio_id:0});
    this.mapaService.getMunicipios(jurisdiccion).subscribe(
      response =>{
        this.municipios = response;
        //this.isLoading = false;
        
      },
      errorResponse =>{
        //this.isLoading = false;
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, "ERROR", 3000);
        
      }
    );
  }
  
  CargarMicrorregion(unidad:any)
  {
    this.regionalizacionForm.patchValue({microrregion:0});
    this.mapaService.getMicroregion(unidad).subscribe(
      response =>{
        this.tipoMicrorregion = response;
        //this.isLoading = false;
        
      },
      errorResponse =>{
        //this.isLoading = false;
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, "ERROR", 3000);
        
      }
    );
  }

  markerClicked(obj){
    //console.log(obj);
    this.latitudOrigen = Number(obj.latitud);
    this.longitudOrigen = Number(obj.longitud);
    this.localidadesRegionalizadas = [];
    this.localidadesPoint = [];
    this.PersonalSalud = [];
    this.PersonalExterno = [];

    this.UnidadSeleccionada = obj.clues+" "+obj.descripcion;

    this.DistritoSeleccionado = this.obtenerDistrito(Number(obj.distrito_id));
    
    this.mapaService.getRegionalizacionLocalidades(obj.clues).subscribe(//({complete:console.info, error:console.error});
      response =>{
        this.displayInfo = true;
        if(Object.keys(response.localidades).length > 0){ 
          response.localidades.forEach(element => {
            this.localidadesRegionalizadas.push({latitud: Number(element.latitud), longitud:Number(element.longitud), descripcion:element.descripcion });
          });
          this.localidadesPoint = response.localidades;
          this.dataSource = response.localidades;

            let sede    = obj.catalogo_localidad;
            let micro   = obj .catalogo_microrregion;
            //console.log(sede);
            if(sede)
            {
              this.Sede         = sede.clave_localidad+"  "+sede.descripcion;
            }else{
              this.Sede         = "SIN SEDE REGISTRADA";
            } 
            this.Microrregion = micro.descripcion+" "+micro.descripcion_tipo;
            this.TipoUnidad   = micro.tipo_unidad.abreviatura+" "+micro.tipo_unidad.descripcion;
        }
        if(Object.keys(response.salud).length > 0){ 
          this.PersonalSalud = response.salud;
        }
        
        if(Object.keys(response.externo).length > 0){ 
          this.PersonalExterno = response.externo;
        }
      },
      errorResponse =>{
        //this.isLoading = false;
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, "ERROR", 3000);
        
      }
    );
  }

  obtenerDistrito(distrito:number):string
  {
    let nombreDistrito:string = "";
    this.jurisdicciones.forEach(element => {
      if(element.id == distrito)
      {
        nombreDistrito = element.clave_distrito+" "+element.descripcion;
      }
    });
    return nombreDistrito;
  }

  BuscarUnidades()
  {
    this.displayInfo = false;
    this.DisplayFiltro = true;
    this.mapa = []; 
    this.localidadesReg = []; 
    this.localidadesNoReg = []; 
    this.localidadesRegionalizadas = [];
    this.localidadesPoint = [];
    this.PersonalSalud = [];
    this.PersonalExterno = [];
    this.mapaService.getUnidades(this.regionalizacionForm.value).subscribe(
      response =>{
        this.DisplayFiltro = false;
        if(Object.keys(response.clues).length > 0){ this.mapa = response.clues; }
        console.log(Object.keys(response.clues).length);
        
        if(Object.keys(response.localidadesReg).length > 0){ this.localidadesReg = response.localidadesReg; }
        console.log(Object.keys(response.localidadesReg).length);
        
        if(Object.keys(response.localidadesNoReg).length > 0){ this.localidadesNoReg = response.localidadesNoReg; }
        console.log(Object.keys(response.localidadesNoReg).length);

        
      },
      errorResponse =>{
        this.DisplayFiltro = false;
        //this.isLoading = false;
        var errorMessage = "Ocurrió un error.";
        if(errorResponse.status == 409){
          errorMessage = errorResponse.error.error.message;
        }
        this.sharedService.showSnackBar(errorMessage, "ERROR", 3000);
        
      }
    );
  }
}
