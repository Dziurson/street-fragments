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
  page: number =  1;
  firstPage: number = 1;
  secondPage: number = 2;
  thirdPage: number = 3;

  constructor(
    private client: HttpClient,
    private roadService: RoadService) { }

  ngOnInit() {
    this.boundary = this.roadService.selectedBoundary;
    this.wktBoundary = this.roadService.wktBoundary;
    var data = null;

    if (this.boundary)
      data = this.boundary.geotext;
    else
      data = this.wktBoundary;

    if (data) {
      this.fetchData();
    }
  }

  fetchData() {
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
}

