import { Component, OnInit } from '@angular/core';
import { Road } from 'src/models/road';
import { RoadService } from 'src/app/services/road.service';
import * as Leaflet from "leaflet";

@Component({
  selector: 'app-road',
  templateUrl: './road.component.html',
  styleUrls: ['./road.component.css']
})
export class RoadComponent implements OnInit {

  road: Road = null;
  map: Leaflet.Map = null;
  roadStyle: any = {
    color: "#ff7800",
    weight: 5,
    opacity: 0.65
  }

  constructor(private roadService: RoadService) { }

  ngOnInit() {
    this.road = this.roadService.selectedRoad;
    this.map = Leaflet.map('map', {
      center: [51.295278, 18.151944],
      zoom: 5
    });
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 17,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(this.map);

    var geoJson = Leaflet.geoJSON(JSON.parse(this.road.object), this.roadStyle);
    geoJson.addTo(this.map);
    this.map.fitBounds(geoJson.getBounds());
  }

}
