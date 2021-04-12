import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '../../services/shared.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  langSelected: any;
  isLoaderShown = false;
  userName = localStorage.getItem('userName');
  role = localStorage.getItem('role');
  @Output() langChange = new EventEmitter<string>();

  constructor(
    private router: Router,
    public translate: TranslateService,
    private sharedService: SharedService
  ) {
  }

  ngOnInit(): void {
    this.langSelected = window.location.pathname.slice(-2);
    this.translate.use(this.langSelected);
  }


  changeLanguage(lang: any): void {
    this.langSelected = lang;
    this.router.navigate([this.router.url.slice(0, -2), lang]);
    this.translate.use(lang);
    this.langChange.emit(lang);
    this.sharedService.sendLanguage(lang);
  }

  // tslint:disable-next-line:typedef
  logout() {
    this.router.navigate(['/app/login', this.langSelected]);
    localStorage.clear();
  }
}
