import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomainsRoutingModule } from './domains-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { SortDirective } from '../../directives/sort.directive';
// import { FilterPipe } from '../../utils/filter';
import { I18nModule } from '../i18n/i18n.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
@NgModule({
  declarations: [
    CentreComponent,
    SortDirective,
    // FilterPipe,
    AreaComponent,
    SuperblockComponent,
    ZeeschipTypeComponent,
    EnumeratiesComponent,
    PrioritySourcesComponent,
    TimerComponent,
    BinnenvaartschipTypeComponent,
    SuperblockBlockComponent,
    CBSPartnerComponent,
    CbsBerichtComponent,
    ErinotBerichtComponent,
    DataElementComponent,
    ObjectComponent],
  imports: [
    CommonModule,
    DomainsRoutingModule,
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    I18nModule,
    Ng2SearchPipeModule
  ]
})
export class DomainsModule { }
