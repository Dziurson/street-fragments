import { Component, OnInit } from '@angular/core';
import { Road } from 'src/models/road';
import { RoadService } from 'src/app/services/road.service';
import { Router } from '@angular/router';
import * as Leaflet from "leaflet";
import * as Terraformer from 'terraformer-wkt-parser';

const streetPattern = "([a-zA-ZąĄćĆęĘłŁńŃóÓśŚżŻźŹ]+\\s?)*[a-zA-ZąĄćĆęĘłŁńŃóÓśŚżŻźŹ]";
const singleStreetPattern = `^${streetPattern}$`;
const searchFromToPattern = `^${streetPattern}\\s*\\(\\s*${streetPattern}\\s*-\\s*${streetPattern}\\s*\\)$`;

@Component({
  selector: 'app-roads',
  templateUrl: './roads.component.html',
  styleUrls: ['./roads.component.css']
})
export class RoadsComponent implements OnInit {

  streetSections: Road[];
  boundary: any;  
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
    if (this.selectedSection)
      this.selectedSection.removeFrom(this.map);
    this.selectedSection = Leaflet.geoJSON(JSON.parse(selectedSection.object), this.selectedSectionStyle);
    this.selectedSection.addTo(this.map);
    this.map.fitBounds(this.selectedSection.getBounds());
  }

  searchByText() {
    if (this.section) {
      this.section.removeFrom(this.map);
      this.section = null;
    }
    if (this.selectedSection) {
      this.selectedSection.removeFrom(this.map);
      this.selectedSection = null;
    }
    if (this.searchText.match(new RegExp(searchFromToPattern))) {
      var streets = this.searchText.match(new RegExp(streetPattern,'g'));
      this.waiting = true;
      this.roadService.getRoadFromTo({ street: streets[0], street_from: streets[1], street_to: streets[2] }).subscribe((result) => {
        this.handleSerachResult(result);
        this.waiting = false;
      });
    }
    if (this.searchText.match(new RegExp(singleStreetPattern))) {
      var street = this.searchText.match(new RegExp(singleStreetPattern))[0];
      this.waiting = true;
      this.roadService.getRoad(street).subscribe((result) => {
        this.handleSerachResult(result)
        this.waiting = false;
      });
    }
  }

  handleSerachResult(result) {    
    this.streetSections = JSON.parse(result);
    if (this.streetSections.length != 0 && this.map) {
      this.section = Leaflet.featureGroup(this.streetSections.map(road => {
        return Leaflet.geoJSON(JSON.parse(road.object), this.sectionStyle)
      }));
      this.section.addTo(this.map);
      this.map.fitBounds(this.section.getBounds());
    }
  }
}

