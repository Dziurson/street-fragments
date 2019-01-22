import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RoadService } from 'src/app/services/road.service';
import { Router } from '@angular/router';

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

  onClickMe() {   
    this.client.get("https://nominatim.openstreetmap.org/search?q="+ this.searchString +"&format=json&polygon_text=1").subscribe((result: any[]) => {            
      this.resultList = result;
      console.log(this.resultList);
    })
    console.log('searchString: ', this.searchString);
  }

  onPolygonClickMe() {
    console.log('searchString: ', this.polygonString);
  }

  selectBoundary(boundary: any) {
    this.roadService.selectedBoundary = boundary;
    this.router.navigate(['/roads']);
  }

}
