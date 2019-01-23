import { Component, OnInit } from '@angular/core';
import { Road } from 'src/models/road';
import { roadList } from 'src/mock/road-mock';
import { HttpClient } from '@angular/common/http';
import { RoadService } from 'src/app/services/road.service';

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

  constructor(
    private client: HttpClient,
    private roadService: RoadService) { }

  ngOnInit() {
    this.boundary = this.roadService.selectedBoundary;
    this.wktBoundary = this.roadService.wktBoundary;
    var data = null;

    if(this.boundary)
      data = this.boundary.geotext;
    else
      data = this.wktBoundary;

    if(data)
      this.client.post('http://localhost:3000/get-roads', {wkt: data}).subscribe((result: string) => {
        this.noderesult = JSON.parse(result);
    })
  }

  fetchData() {
    console.log(this.searchString);
    console.log(this.surface);
    console.log(this.lanes);
    console.log(this.oneway);
    console.log(this.maxspeed);
    this.client.get('http://localhost:3000/test').subscribe((result: string) => {
      this.noderesult = JSON.parse(result);
    })
  }

}
