import { Component, OnInit } from '@angular/core';
import { Road } from 'src/models/road';
import { RoadService } from 'src/app/services/road.service';
import { Router } from '@angular/router';
import * as Leaflet from "leaflet";
import * as Terraformer from 'terraformer-wkt-parser';

@Component({
  selector: 'app-roads',
  templateUrl: './roads.component.html',
  styleUrls: ['./roads.component.css']
})
export class RoadsComponent implements OnInit {

  streetSections: Road[];
  boundary: any;
  searchString: string;
  searchText: string;
  oneway;
  surface;
  lanes;
  maxspeed;
  page: number = 1;
  firstPage: number = 1;
  secondPage: number = 2;
  thirdPage: number = 3;
  waiting: boolean;

  map: Leaflet.Map = null;
  section: Leaflet.FeatureGroup = null;
  selectedSection: Leaflet.GeoJSON = null;


  boundStyle: any = {
    color: "#ff0000",
    fillOpacity: 0,
    weight: 2,
    opacity: 1,
  }
  sectionStyle: any = {
    color: "#ff7800",
    weight: 5,
    opacity: 0.65
  }
  selectedSectionStyle: any = {
    color: "#0000ff",
    weight: 5,
    opacity: 1
  }

  constructor(
    private router: Router,
    private roadService: RoadService) { }

  ngOnInit() {
    this.boundary = this.roadService.getSelectedBoundary();

    if (this.boundary)
      this.initMap(this.boundary.geotext);
    else
      this.router.navigate(['/']);
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
    this.waiting = true;
    var data = null;

    if (this.boundary)
      data = this.boundary.geotext;
    if (this.searchString === '') {
      this.searchString = null;
    }
    if (this.lanes === '') {
      this.lanes = null;
    }
    if (this.surface === '') {
      this.surface = null;
    }
    if (this.maxspeed === '') {
      this.maxspeed = null;
    }
    if (this.oneway === '') {
      this.oneway = null;
    }
    // this.roadService.getRoads([this.searchString, this.lanes, this.surface, this.maxspeed, this.oneway, this.page], data)
    // .subscribe((resp: string) => {
    //   this.noderesult = JSON.parse(resp);
    //   this.waiting = false;
    // });
  }

  setPage(page: number) {
    this.page = page;
    this.fetchData();
    if (this.page == 1)
      return;
    this.firstPage = this.page - 1;
    this.secondPage = this.page;
    this.thirdPage = this.page + 1;
  }

  showSelectedSection(selectedSection: Road) {
    if(this.selectedSection)
      this.selectedSection.removeFrom(this.map);
    this.selectedSection = Leaflet.geoJSON(JSON.parse(selectedSection.object), this.selectedSectionStyle);
    this.selectedSection.addTo(this.map);
    this.map.fitBounds(this.selectedSection.getBounds());
  }

  searchByText() {
    if (this.searchText.match(/^[a-zA-ZąĄćĆęĘłŁńŃóÓśŚżŻźŹ]+\s*\(\s*[a-zA-ZąĄćĆęĘłŁńŃóÓśŚżŻźŹ]+\s*-\s*[a-zA-ZąĄćĆęĘłŁńŃóÓśŚżŻźŹ]+\s*\)/)) {
      var streets = this.searchText.match(/[a-zA-ZąĄćĆęĘłŁńŃóÓśŚżŻźŹ]+/g);
      this.waiting = true;
      this.roadService.getRoadFromTo({ street: streets[0], street_from: streets[1], street_to: streets[2] }).subscribe((result) => {
        console.log(result);
        if (this.section) {
          this.section.removeFrom(this.map);
          this.section = null;
        }
        this.streetSections = JSON.parse(result);
        if (this.streetSections.length != 0)
          this.showOnMap();
        this.waiting = false;
      });
    }
  }

  showOnMap() {
    if (this.map) {      
      this.section = Leaflet.featureGroup(this.streetSections.map(road => {
        return Leaflet.geoJSON(JSON.parse(road.object), this.sectionStyle)
      }));
      this.section.addTo(this.map);
      this.map.fitBounds(this.section.getBounds());
    }
  }
}

