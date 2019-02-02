import { Component, OnInit } from '@angular/core';
import { Road } from 'src/models/road';
import { roadList } from 'src/mock/road-mock';
import { HttpClient } from '@angular/common/http';
import { RoadService } from 'src/app/services/road.service';
import { Router } from '@angular/router';
import * as Leaflet from "leaflet";
import { format } from 'util';
import * as Terraformer from 'terraformer-wkt-parser';

@Component({
  selector: 'app-roads',
  templateUrl: './roads.component.html',
  styleUrls: ['./roads.component.css']
})
export class RoadsComponent implements OnInit {

  noderesult: Road[] = roadList;
  boundary: any;
  wktBoundary: string;
  searchString: string;
  oneway;
  surface;
  lanes;
  maxspeed;
  page: number =  1;
  firstPage: number = 1;
  secondPage: number = 2;
  thirdPage: number = 3;
  waiting: boolean;
  map: Leaflet.Map = null;
  boundStyle: any = {
    color: "#ff0000",   
    fillOpacity: 0,
    weight: 3,
    opacity: 1,
  }
  roadStyle: any = {
    color: "#ff7800",
    weight: 5,
    opacity: 0.65
  }

  constructor(
    private router: Router,
    private roadService: RoadService) { }

  ngOnInit() {
    //Offline Work - set false
    this.waiting = true;
    this.boundary = this.roadService.selectedBoundary;
    this.wktBoundary = this.roadService.wktBoundary;    
    var data = null;

    if (this.boundary)
      data = this.boundary.geotext;
    else
      data = this.wktBoundary;

    if (data) {
      this.initMap(data);
      this.fetchData();
    }    
  }

  initMap(data) {
    this.map = Leaflet.map('map-wrapper', {
      center: [51.295278, 18.151944],
      zoom: 5
    });
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);
    var geoJson = Leaflet.geoJSON(Terraformer.parse(data), this.boundStyle);
    geoJson.addTo(this.map);
    this.map.fitBounds(geoJson.getBounds());
  }

  fetchData() {
    //Offline Work - set false
    this.waiting = true;
    var data = null;
  
    if (this.boundary)
      data = this.boundary.geotext;
    else
      data = this.wktBoundary;
    if(this.searchString === '') {
      this.searchString = null;
    }
    if(this.lanes === '') {
      this.lanes = null;
    }
    if(this.surface === '') {
      this.surface = null;
    }
    if(this.maxspeed === '') {
      this.maxspeed = null;
    }
    if(this.oneway === '') {
      this.oneway = null;
    }
    this.roadService.getRoads([this.searchString, this.lanes, this.surface, this.maxspeed, this.oneway, this.page], data)
    .subscribe((resp: string) => {
      this.noderesult = JSON.parse(resp);
      this.waiting = false;
    });
  }

  setPage(page: number) {
    this.page = page;
    this.fetchData();
    if(this.page == 1)
      return;
    this.firstPage = this.page - 1;
    this.secondPage = this.page;
    this.thirdPage = this.page + 1;
  }

  openRoad(road: Road) {
    var geoJson = Leaflet.geoJSON(JSON.parse(road.object), this.roadStyle);
    geoJson.addTo(this.map);
    this.map.fitBounds(geoJson.getBounds());
    //this.roadService.selectedRoad = road;    
    //this.router.navigate(['/roads/details'])  
  }
}

