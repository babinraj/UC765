import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { NgModule } from '@angular/core';
import { CoreModule } from './core/core.module';
import { ImportExportModule } from './import-export/import-export.module'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiInterceptorService } from './core/services/api-interceptor.service';
import { I18nModule } from './i18n/i18n.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    I18nModule,
    ImportExportModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ApiInterceptorService, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
