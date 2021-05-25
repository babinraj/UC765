import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'mdm';
  showHead = false;
  showSideBar = false;
  lang = 'en';
  constructor(
    private router: Router,
    public translate: TranslateService
  ) {
    // on route change to '/login', set the variable showHead to false
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // tslint:disable-next-line:no-string-literal
        if ((event['url'].indexOf('/login') > -1) || (event['url'].length <= 1)) {
          this.showHead = false;
        }
        else if ((event.url.indexOf('/pagenotfound') > -1)) {
          this.showHead = false;
          this.showSideBar = false;
        }
        // tslint:disable-next-line:no-string-literal
        else if (event['url'].indexOf('/dashboard') > -1) {
          this.showHead = true;
          this.showSideBar = false;

        } else {
          this.showHead = true;
          this.showSideBar = true;
          // tslint:disable-next-line:no-string-literal
          this.translate.use(event['url'].slice(-2));
          this.lang = event.url.slice(-2);
        }
      }
    });
  }
  ngOnInit(): void {
    // tslint:disable-next-line: no-string-literal
    if (window.location.href.indexOf('/login') > -1 && localStorage.getItem('userName')) {
      this.router.navigate(['/app/dashboard', window.location.href.slice(-2)]);

    }
  }

  // tslint:disable-next-line:typedef
  langUpdate(item: string) {
    this.lang = item;
  }
}
