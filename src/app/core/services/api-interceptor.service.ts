import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { from, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ApiInterceptorService implements HttpInterceptor {

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.indexOf('i18n') > -1){
      const apiReq = req.clone({ url: req.url });
      return next.handle(apiReq);

    }else{
      const apiReq = req.clone({ url: environment.baseUrl + req.url });
      return next.handle(apiReq);
    }
  }
}
