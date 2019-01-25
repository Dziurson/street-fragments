import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './controllers/home/home.component';
import { RoadsComponent } from './controllers/roads/roads.component';
import { RoadComponent } from './controllers/road/road.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'roads', component: RoadsComponent },
  { path: 'roads/details', component: RoadComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
