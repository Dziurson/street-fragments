import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  searchString: string;
  polygonString: string;
  resultList: any[];

  constructor(private client: HttpClient) { }

  ngOnInit() {
  }

  onClickMe() {   
    this.client.get("https://nominatim.openstreetmap.org/search?q="+ this.searchString +"&format=json&polygon=1").subscribe((result: any[]) => {
      this.resultList = result;
      console.log(this.resultList);
    })
    console.log('searchString: ', this.searchString);
  }

  onPolygonClickMe() {
    console.log('searchString: ', this.polygonString);
  }

}
