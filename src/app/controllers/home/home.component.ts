import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RoadService } from 'src/app/services/road.service';
import { Router } from '@angular/router';
import * as Terraformer from 'terraformer-wkt-parser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  searchString: string;
  polygonString: string;
  resultList: any[];
  wktParseError: boolean = false;

  constructor(
    private client: HttpClient,
    private roadService: RoadService,
    private router: Router) { }

  ngOnInit() {
  }

  askForBoundaries() {
    this.client.get("https://nominatim.openstreetmap.org/search?q=" + this.searchString + "&format=json&polygon_text=1").subscribe((result: any[]) => {
      this.resultList = result.filter(r => r.class == 'boundary');
    })
  }

  findByBoundary() {
    try {
      Terraformer.parse(this.polygonString);
      this.wktParseError = false;
      this.roadService.setSelectedBoundary({ geotext: this.polygonString, display_name: "Ręcznie wprowadzone dane" });
      this.router.navigate(['/roads']);
    }
    catch {
      this.wktParseError = true;
    }
  }

  selectBoundary(boundary: any) {
    this.roadService.setSelectedBoundary(boundary);
    this.router.navigate(['/roads']);
  }

}
