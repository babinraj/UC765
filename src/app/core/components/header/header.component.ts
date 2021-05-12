import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '../../services/shared.service';
import { UserService } from '../../services/user.service'

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
  buildVersion: string = '';
  constructor(
    private router: Router,
    public translate: TranslateService,
    private sharedService: SharedService,
	private userService: UserService,
  ) {
  }

  ngOnInit(): void {
    this.langSelected = window.location.pathname.slice(-2);
    this.translate.use(this.langSelected);
	this.getBuildVersion();
  }


  changeLanguage(lang: any): void {
    this.langSelected = lang;
    this.router.navigate([this.router.url.slice(0, -3), lang]);
    //this.router.navigate(['', this.langSelected]);
	this.translate.use(lang);
    this.langChange.emit(lang);
    this.sharedService.sendLanguage(lang);
  }
  
  getBuildVersion() {
    this.userService.getBuildVersion().subscribe(response => {
      if(response) {
        if(response.data) {
          this.buildVersion = response.data;
        }
      }
    }, (e: any) => {
      this.buildVersion = "NA";
    });

  }
  // tslint:disable-next-line:typedef
  logout() {
    //this.router.navigate(['../app/login', this.langSelected]);
	this.router.navigate(['', this.langSelected]);
	localStorage.clear();
  }
}
