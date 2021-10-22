import { Component, OnInit } from '@angular/core';
import { ClockService } from '../../utils/classes/clock.service';
import { Subscription } from 'rxjs';
import { DashboardService } from '../dashboard.service';
import { CHARTS } from '../dashboard-chart-options';
import * as Highcharts from 'highcharts';

declare var require: any;
let Boost = require('highcharts/modules/boost');
let noData = require('highcharts/modules/no-data-to-display');
let More = require('highcharts/highcharts-more');

Boost(Highcharts);
noData(Highcharts);
More(Highcharts);

@Component({
  selector: 'app-visor',
  templateUrl: './visor.component.html',
  styleUrls: ['./visor.component.css']
})
export class VisorComponent implements OnInit {
  private subscription: Subscription = new Subscription();

  today:Date;
  myDashboard: any;
  isLoading: boolean;
  
  constructor(private clock:ClockService, private dashboardService:DashboardService) {
    /*this.subscription.add(
      this.clock.time.subscribe((now:Date) => {
        this.today = now;
      })
    );*/
  }

  ngOnInit() {
    //this.myDashboard = this.dashboardService.obtenerDashboard();
    //this.myDashboard = {};
    this.isLoading = true;
    this.dashboardService.obtenerDashboard().subscribe(
      response => {
        console.log(response);
        for(let i in response.data.items){
          if(response.data.items[i].type == 'data'){
            if(!isNaN(Number(response.data.items[i].data.title))){
              response.data.items[i].data.title_format = true;
            }
            if(!isNaN(Number(response.data.items[i].data.subtitle))){
              response.data.items[i].data.subtitle_format = true;
            }
          }else if (response.data.items[i].type == 'list'){
            for(let j in response.data.items[i].data){
              if(!isNaN(Number(response.data.items[i].data[j].title))){
                response.data.items[i].data[j].title_format = true;
              }
              if(!isNaN(Number(response.data.items[i].data[j].subtitle))){
                response.data.items[i].data[j].subtitle_format = true;
              }
            }
          }
        }
        this.myDashboard = response.data;
      }
    );
  }

  ngAfterViewInit(){
    if(this.myDashboard){
      this.myDashboard.items.forEach(element => {
      
        if(element.type == 'chart'){
            let options = CHARTS['column-options'];
            
            if(element.chart.height){
              options.chart.height = element.chart.height;
            }

            if(element.chart.width){
              options.chart.width = element.chart.width;
            }
            
            options.title.text = element.chart.title;
            options.yAxis.title.text = element.chart.lefttitle;
            options.xAxis.categories = element.chart.categories;
            options.series = element.chart.series;
  
            Highcharts.chart(element.chart.id, options);
        }        
      });
    }
  }

  ngOnDestroy(){
    //this.subscription.unsubscribe();
  }
}
