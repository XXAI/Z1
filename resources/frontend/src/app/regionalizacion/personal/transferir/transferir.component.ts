import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { SharedService } from 'src/app/shared/shared.service';
import { RegionalizacionService } from '../../regionalizacion.service';
import { ConfirmActionDialogComponent } from '../../../utils/confirm-action-dialog/confirm-action-dialog.component';

export interface DatosComponentData {
  clues?:         string;
  unidad?:        string;
  rfc?:           string;
  nombre?:        string;
  trabajador_id?: string;
}

@Component({
  selector: 'app-transferir',
  templateUrl: './transferir.component.html',
  styleUrls: ['./transferir.component.css']
})
export class TransferirComponent implements OnInit {

  catalogo:any = [];
  isLoading:boolean = false;
  localidadIsLoading: boolean = false;
  filteredLocalidad: any[];

  cluesIsLoading: boolean = false;
  filteredClues: any[];
  
  personalIsLoading: boolean = false;
  filteredPersonal: any[];

  searchQuery:string = "";
  searchQueryExterno:string = "";
  id_editar:number = 0;
  indexTab:number = 0;
  id_tipo_edicion:number = 0;
  edicion:boolean = false;
  
  tipo:boolean = true;

  clues:string          = "";
  nombre_unidad:string  = "";
  rfc:string            = "";
  nombre:string         = "";
  
  constructor(
    private sharedService: SharedService, 
    private regionalizacionService:RegionalizacionService,
    public dialogRef: MatDialogRef<TransferirComponent>,
    private authService: AuthService, 
    private route: ActivatedRoute, 
    private fb: FormBuilder,
    public dialog: MatDialog,
    public mediaObserver: MediaObserver,
    public router: Router,
    @Inject(MAT_DIALOG_DATA) public data: DatosComponentData 
  ) { }

  public transferirForm = this.fb.group({
    'clues': [1,[Validators.required]],
    'trabajador_id': [1,[Validators.required]],
    'clues_anterior': [1,[Validators.required]],
  });

  ngOnInit(): void {
    this.cargarCatalogos();
  }

  displayCluesFn(item: any) {
    if (item) { return item.descripcion; }
  }

  cerrar()
  {
    this.dialogRef.close(true);
  }

  cargarCatalogos()
  {
    this.rfc = this.data.rfc;
    this.nombre = this.data.nombre;
    this.nombre_unidad = this.data.unidad;
    this.clues = this.data.clues;
    this.transferirForm.patchValue({clues_anterior: this.clues, trabajador_id: this.data.trabajador_id});

    this.transferirForm.get('clues').valueChanges
    .pipe(
      debounceTime(300),
      tap( () => {
          this.cluesIsLoading = true; 
      } ),
      switchMap(value => {
          if(!(typeof value === 'object')){
            this.cluesIsLoading = false;
            let resultado = this.regionalizacionService.buscarClues({query:value}).pipe(finalize(() => this.cluesIsLoading = false ));  
            return resultado; 
          }else{
            this.cluesIsLoading = false; 
            return [];
          }
        }
      ),
    ).subscribe(items => this.filteredClues = items);

    
  }

  accionGuardar(id:number)
  {
    
    this.regionalizacionService.savePersonalTransferencia(this.transferirForm.value).subscribe(
      response => {
        this.sharedService.showSnackBar("Se ha guardado el registro", null, 3000);
        this.dialogRef.close(true);
      },
      responsError =>{
        this.sharedService.showSnackBar('Error al intentar recuperar datos de', null, 4000);
      }
    );
  }

}
