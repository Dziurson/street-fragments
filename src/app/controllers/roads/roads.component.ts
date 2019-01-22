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

  constructor(
    private client: HttpClient,
    private roadService: RoadService) { }

  ngOnInit() {
    this.boundary = this.roadService.selectedBoundary;
  }

  fetchData() {
    this.client.get('http://localhost:3000/test').subscribe((result: string) => {
      this.noderesult = JSON.parse(result);
    })
  }

}
