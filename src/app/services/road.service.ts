import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Road } from 'src/models/road';

@Injectable({
  providedIn: 'root'
})
export class RoadService {

  selectedBoundary: any = null;
  selectedRoad: Road = null;

  getRoadsFromToUrl: string = 'http://localhost:3000/get-roads-from-to';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { } 

  setSelectedBoundary(selectedBoundary: any) {
    this.selectedBoundary = selectedBoundary;
    sessionStorage.setItem('selectedBoundary', JSON.stringify(selectedBoundary));
  }

  getSelectedBoundary() {
    if(!this.selectedBoundary)
      this.selectedBoundary = JSON.parse(sessionStorage.getItem('selectedBoundary'));
    return this.selectedBoundary;
  }

  getRoadFromTo(streets) {   
    const jsonObj = { street: streets.street, street_from: streets.street_from, street_to: streets.street_to, wkt: this.selectedBoundary.geotext};    
    return this.http.post<any>(this.getRoadsFromToUrl, jsonObj, this.httpOptions);
  }
}
