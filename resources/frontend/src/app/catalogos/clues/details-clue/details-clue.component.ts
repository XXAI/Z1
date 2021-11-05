import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CluesService } from '../../clues.service';
import { SharedService } from '../../../shared/shared.service';
import { Router, ActivatedRoute  } from '@angular/router';


export interface FormDialogData {
  clues: any;
}

@Component({
  selector: 'details-clue',
  templateUrl: './details-clue.component.html',
  styleUrls: ['./details-clue.component.css']
})
export class DetailsComponentClue implements OnInit {
  


  constructor(
    public dialogRef: MatDialogRef<DetailsComponentClue>,
    @Inject(MAT_DIALOG_DATA) public data: FormDialogData,
    private cluesService: CluesService,
    private sharedService: SharedService,
    public router: Router,

  ) {}

  public dialog: MatDialog;
  panelAtencion     = false;
  panelSeguimiento  = false;
  panelEmabarazo    = false;
  panelOpenState    = false;

  IdActual: number;

  dataPaciente: any;

  isLoading:boolean = false;

  ngOnInit() {


    console.log("LOS DATOS", this.data);

    this.cargarDatosClue(this.data.clues);
  }


  cargarDatosClue(id:any){

    let params = {};
    let query = this.sharedService.getDataFromCurrentApp('searchQuery');

    if(query){
      params['query'] = query;
    }

    this.isLoading = true;

    this.cluesService.verInfoClue(id,params).subscribe(
      response =>{
        console.log("en el response del DIALOG",response.data);
        
        this.dataPaciente = response.data;

        console.log(this.dataPaciente);

        this.isLoading = false;
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public abrirPanel(item): void {
    this.IdActual = item.id;
  }

}
