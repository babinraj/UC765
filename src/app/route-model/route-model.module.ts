import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { I18nModule } from '../i18n/i18n.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SortRouteModelDirective } from '../../directives/sortroutemodel.directive';
import { RouteModelRoutingModule } from './route-model-routing.module';
import { GeoElementComponent } from './components/geo-element/geo-element.component';
import { RouteSegmentComponent } from './components/route-segment/route-segment.component';
import { RouteDeviateComponent } from './components/route-deviate/route-deviate.component';
import { PilotTrajectComponent } from './components/pilot-traject/pilot-traject.component';
import { HydroMeteoComponent } from './components/hydro-meteo/hydro-meteo.component';
import { CbsLocationComponent } from './components/cbs-location/cbs-location.component';
import { ExportLayerComponent } from './components/export-layer/export-layer.component';


@NgModule({
  declarations: [GeoElementComponent, RouteSegmentComponent, RouteDeviateComponent, PilotTrajectComponent, HydroMeteoComponent, CbsLocationComponent, SortRouteModelDirective, ExportLayerComponent],
  imports: [
    CommonModule,
    RouteModelRoutingModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    PaginationModule.forRoot(),
    FormsModule,
    I18nModule,
    Ng2SearchPipeModule
  ]
})
export class RouteModelModule { }
