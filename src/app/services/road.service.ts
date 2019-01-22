import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RoadService {

  selectedBoundary: any = null;
  wktBoundary: string = null;

  constructor() { }
}
