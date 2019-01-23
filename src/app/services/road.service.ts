import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoadService {

  selectedBoundary: any = null;
  wktBoundary: string = null;

  endpoint = 'http://localhost:3000/get-roads';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  private extractData(res: Response) {
    let body = res;
    return body || {};
  }

  getRoads(filters, data) {
    const [name, lanes, surface, maxspeed, oneway, page] = filters;
    
    const jsonObj = {name: name, lanes: lanes, surface: surface, maxspeed: maxspeed, oneway: oneway, page: page, wkt: data};
    
    return this.http.post<any>(this.endpoint, jsonObj, this.httpOptions);
  }
}
