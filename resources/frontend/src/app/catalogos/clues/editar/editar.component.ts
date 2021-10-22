import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { CluesService } from '../../clues.service';
import { ActivatedRoute } from '@angular/router';
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

  clues:any;
  estatus_clues:boolean = false;
  datos_clues:any;

  puedeGuardar: boolean = true;
  puedeValidar: boolean = true;
  puedeTransferir: boolean = true;
  necesitaActivarse: boolean = false;
  statusLabel: string;
  statusIcon: string;

  responsableIsLoading: boolean = false;
  filteredResponsable: Observable<any[]>;
  
  constructor(
    private sharedService: SharedService, 
    private cluesService: CluesService,
    private authService: AuthService, 
    private route: ActivatedRoute, 
    private fb: FormBuilder,
    public dialog: MatDialog
  ) { }

  isLoading:boolean = false;
  
  cluesForm = this.fb.group({
    'clues': ['',Validators.required],
    'nombre_unidad': ['',Validators.required],
    'nivel_atencion': ['',Validators.required],
    'estatus': ['',Validators.required],
    'responsable': ['',Validators.required],
    'responsable_id': [''],
    'cargo_responsable': ['',Validators.required],
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.clues = params.get('id');

      if(this.clues){
        this.loadCluesData(this.clues);
      }

      this.cluesForm.get('responsable').valueChanges
        .pipe(
          debounceTime(300),
          tap( () => {
            this.responsableIsLoading = true;
          } ),
          switchMap(value => {
              if(!(typeof value === 'object')){
                return this.cluesService.buscarResponsable({busqueda_empleado:value}).pipe(
                  finalize(() => this.responsableIsLoading = false )
                );
              }else{
                this.responsableIsLoading = false;
                return [];
              }
            }
          ),
        ).subscribe(items => this.filteredResponsable = items);
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
    if(formData.responsable)
    {
      formData.responsable_id = formData.responsable.id;
    }

    delete formData.responsable;

    this.cluesService.actualizarClues(this.clues, formData).subscribe(
      respuesta => {
        this.isLoading = false;
        this.sharedService.showSnackBar("Se ha guardado correctamente", "Correcto", 3000);
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
