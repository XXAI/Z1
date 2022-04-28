import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { SharedService } from '../../../shared/shared.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';

export interface VerLocalidadData {
  titulo: string;
  localidad?:string;
  listado?:any[];
  clues?:any[];
  tipoUnidad?:number;
}

@Component({
  selector: 'app-regionalizacion',
  templateUrl: './regionalizacion.component.html',
  styleUrls: ['./regionalizacion.component.css']
})
export class RegionalizacionComponent implements OnInit {

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<RegionalizacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: VerLocalidadData,
    private fb: FormBuilder,
    private sharedService: SharedService,
    public dialog: MatDialog, 
  ) { }

  @ViewChild(MatTable) usersTable: MatTable<any>;

  dataTrabajador: any;
  mediaSize: string;
  titulo:string;
  localidad:string;

  dataSource = [];
  
  isLoadingCredential:boolean = false;
  isLoadingPDF:boolean = false;
  isLoading:boolean = false;

  ngOnInit(): void {
      this.titulo = this.data.titulo;
      this.localidad = this.data.localidad;
      this.dataSource = [];
      if(this.data.tipoUnidad == 1)
      {
        this.dataSource = this.data.clues;
      }else
      {
        this.dataSource = this.data.listado;
      }
      //console.log(this.dataSource);
      //console.log(this.data.tipoUnidad);
      //console.log(this.data.listado);
  }

}
