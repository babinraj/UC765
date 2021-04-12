import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { FooterComponent } from './components/footer/footer.component';
import { Routes, RouterModule } from '@angular/router';
import { I18nModule } from '../i18n/i18n.module';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
const routes: Routes = [];

@NgModule({
  declarations: [HeaderComponent, SidebarComponent, FooterComponent, PageNotFoundComponent],
  imports: [
    CommonModule ,
    AccordionModule.forRoot(),
    BsDropdownModule.forRoot(),
    RouterModule.forChild(routes),
    I18nModule
  ],
  exports: [
    RouterModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ]
})
export class CoreModule { }
