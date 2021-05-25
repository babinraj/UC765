import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GeoElementComponent } from './components/geo-element/geo-element.component';
import { RouteSegmentComponent } from './components/route-segment/route-segment.component';
import { RouteDeviateComponent } from './components/route-deviate/route-deviate.component';
import { PilotTrajectComponent } from './components/pilot-traject/pilot-traject.component';
import { HydroMeteoComponent } from './components/hydro-meteo/hydro-meteo.component';
import { CbsLocationComponent } from './components/cbs-location/cbs-location.component';
import { ExportLayerComponent } from './components/export-layer/export-layer.component';

const routes: Routes = [
  { path: 'geoelement/:language', component: GeoElementComponent },
  { path: 'routesegment/:language', component: RouteSegmentComponent },
  { path: 'routedeviate/:language', component: RouteDeviateComponent },
  { path: 'pilottraject/:language', component: PilotTrajectComponent },
  { path: 'hydrometeo/:language', component: HydroMeteoComponent },
  { path: 'cbslocation/:language', component: CbsLocationComponent },
  { path: 'export-layer/:language', component: ExportLayerComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RouteModelRoutingModule { }
