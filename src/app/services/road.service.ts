import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoadService {

  selectedBoundary: any;

  endpoint = 'http://localhost:3000/test';
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

  getProducts(filters) {
    const [searchInput, categories, page] = filters;
    const queryParams = [];
    if (page !== 1) { queryParams.push(['page', page]); }
    if (categories && categories.length > 0) {
      categories.forEach(c => queryParams.push(['category', c]));
    }
    if (searchInput) {
      queryParams.push(['name', searchInput]);
    }
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
    return this.http.get(this.endpoint + 'products' + query).pipe(
      map(res => {
        return this.extractData(res as Response);
      })
    );
  }
}
