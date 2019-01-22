import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RoadService } from 'src/app/services/road.service';
import { Router } from '@angular/router';
import WKT from 'ol/format/WKT';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  searchString: string;
  polygonString: string;
  resultList: any[];

  constructor(
    private client: HttpClient,
    private roadService: RoadService,
    private router: Router
    ) { }

  ngOnInit() {
  }

  askForBoundaries() {   
    this.client.get("https://nominatim.openstreetmap.org/search?q="+ this.searchString +"&format=json&polygon_text=1").subscribe((result: any[]) => {            
      this.resultList = result.filter(r => r.class == 'boundary');
    })
  }

  findByBoundary() {
    this.roadService.selectedBoundary = null;
    this.roadService.wktBoundary = this.polygonString;
    this.router.navigate(['/roads']);
  }

  selectBoundary(boundary: any) {    
    this.roadService.selectedBoundary = boundary;
    this.roadService.wktBoundary = null;
    this.router.navigate(['/roads']);
  }

}
