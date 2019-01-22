import { Component, OnInit } from '@angular/core';
import { Road } from 'src/models/road';
import { roadList } from 'src/mock/road-mock';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-roads',
  templateUrl: './roads.component.html',
  styleUrls: ['./roads.component.css']
})
export class RoadsComponent implements OnInit {
 
  noderesult: Road[] = roadList;

  constructor(private client: HttpClient) { }

  ngOnInit() {
  }

  fetchData() {
    this.client.get('http://localhost:3000/test').subscribe((result: string) => {      
      console.log(result);
      this.noderesult = JSON.parse(result);
    })
  }

}
