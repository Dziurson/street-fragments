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
    const queryParams = [];
    if (page !== 1) { queryParams.push(['page', page]); }
    const jsonObj = {name: name, lanes: lanes, surface: surface, maxspeed: maxspeed, oneway: oneway, wkt: data};
    let query = '';
    if (queryParams.length > 0) {
      const [paramKey, paramValue] = queryParams[0];
      query = '?' + paramKey + '=' + paramValue;
    }
    if (queryParams.length > 1) {
      for (let i = 1; i < queryParams.length; i++) {
        const [paramKey, paramValue] = queryParams[i];
        query = query + '&' + paramKey + '=' + paramValue;
      }
    }
    return this.http.post<any>(this.endpoint, JSON.stringify(jsonObj), this.httpOptions);
  }
}
