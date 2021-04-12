import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/services/auth.guard';
import { CentreComponent } from './components/centre/centre.component';
import { AreaComponent } from './components/area/area.component';
import { SuperblockComponent } from './components/superblock/superblock.component';
import { ZeeschipTypeComponent } from './components/zeeschip-type/zeeschip-type.component';
import { EnumeratiesComponent } from './components/enumeraties/enumeraties.component';
import { PrioritySourcesComponent } from './components/priority-sources/priority-sources.component';
import { TimerComponent } from './components/timer/timer.component';
import { BinnenvaartschipTypeComponent } from './components/binnenvaartschip-type/binnenvaartschip-type.component';
import { SuperblockBlockComponent } from './components/superblock-block/superblock-block.component';
import { CBSPartnerComponent } from './components/cbs-partner/cbs-partner.component';
import { CbsBerichtComponent } from './components/cbs-bericht/cbs-bericht.component';
import { ErinotBerichtComponent } from './components/erinot-bericht/erinot-bericht.component';
import { DataElementComponent } from './components/data-element/data-element.component';
import { ObjectComponent } from './components/object/object.component';
const routes: Routes = [
  { path: 'centrale/:language', component: CentreComponent, canActivate: [AuthGuard] },
  { path: 'area/:language', component: AreaComponent, canActivate: [AuthGuard] },
  { path: 'superblok/:language', component: SuperblockComponent, canActivate: [AuthGuard] },
  { path: 'zeeschiptype/:language', component: ZeeschipTypeComponent, canActivate: [AuthGuard] },
  { path: 'enumeraties/:language', component: EnumeratiesComponent, canActivate: [AuthGuard] },
  { path: 'priority-sources/:language', component: PrioritySourcesComponent, canActivate: [AuthGuard] },
  { path: 'timer/:language', component: TimerComponent, canActivate: [AuthGuard] },
  { path: 'binnenvaartschip-type/:language', component: BinnenvaartschipTypeComponent, canActivate: [AuthGuard] },
  { path: 'superblok-blok/:language', component: SuperblockBlockComponent, canActivate: [AuthGuard] },
  { path: 'cbs-partner/:language', component: CBSPartnerComponent, canActivate: [AuthGuard] },
  { path: 'cbs-bericht/:language', component: CbsBerichtComponent, canActivate: [AuthGuard] },
  { path: 'erinot-bericht/:language', component: ErinotBerichtComponent, canActivate: [AuthGuard] },
  { path: 'data-element-prioriteit/:language', component: DataElementComponent, canActivate: [AuthGuard] },
  { path: 'object/:language', component: ObjectComponent, canActivate: [AuthGuard] },
  // {
  //   path: '',
  //   redirectTo: 'centrale/en',
  //   pathMatch: 'full'
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DomainsRoutingModule { }
