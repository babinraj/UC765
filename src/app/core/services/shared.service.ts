import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private sharedSubject = new BehaviorSubject({});
  constructor(private http: HttpClient) { }

  // tslint:disable-next-line:typedef
  sendLanguage(language: any) {
    this.sharedSubject.next(language);
  }
  // tslint:disable-next-line:typedef
  getLanguage() {
    return this.sharedSubject.asObservable();
  }
}
