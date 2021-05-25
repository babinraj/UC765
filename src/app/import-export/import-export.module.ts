import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportComponent } from './components/import/import.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { I18nModule } from '../i18n/i18n.module';
import { ExportComponent } from './components/export/export.component';
@NgModule({
  declarations: [ImportComponent, ExportComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    FormsModule,
    I18nModule
  ],
  exports: [
    ImportComponent,
    ExportComponent
  ]
})
export class ImportExportModule { }
