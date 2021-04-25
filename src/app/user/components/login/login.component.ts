import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from '../../../core/services/shared.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { translation } from '../../../../constants/toastTranslation';
import { UserService } from '../../services/user.service'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  submitted = false;
  isLoaderShown = false;
  language = 'nl';
  options = { positionClass: 'toast-top-right' };
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    private sharedService: SharedService,
    private userService: UserService,) {
    this.sharedService.getLanguage().subscribe(response => {
      if (Object.keys(response).length > 0) {
        const t: any = response;
        this.translate.use(t);
      }
    });
  }

  ngOnInit(): void {
    this.translate.use(this.activatedRoute.snapshot.params.language);
    // this.language = this.activatedRoute.snapshot.params.language;
    this.langChange(this.language);
    this.loginForm = this.fb.group({
      uname: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  onLogin(): void {
    this.submitted = true;
    this.isLoaderShown = true;
    if (this.loginForm.valid) {
      this.userService.authLogin(this.loginForm.getRawValue()).subscribe(response => {
        console.log("response", response)
        if(response.data) {
          localStorage.setItem('userId', '1234');
          localStorage.setItem('userName', 'John Doe');
          localStorage.setItem('role', 'Functional Admin');
          this.router.navigate(['/app/dashboard', this.language]);
        } else {
          this.toastr.error(response.message, '', this.options);
          this.isLoaderShown = false;

        }
        this.isLoaderShown = false;
        // if ((this.loginForm.getRawValue()[`userName`] === 'admin') && (this.loginForm.getRawValue()[`Password`] === 'admin123')) {
        //   localStorage.setItem('userId', '1234');
        //   localStorage.setItem('userName', 'John Doe');
        //   localStorage.setItem('role', 'Functional Admin');
        //   this.router.navigate(['/app/dashboard', this.language]);
        // } else {
        //   this.toastr.error(translation[this.language].LoginError, '', this.options);
        // }
      }, (e: any) => {
        this.toastr.error(translation[this.language].SomethingWrong, '', this.options);
      });
    }
  }

    // tslint:disable-next-line:typedef
    langChange(lang: any) {
      this.language = lang;
      this.router.navigate([this.router.url.slice(0, -2), lang]);
      this.sharedService.sendLanguage(lang);
    }

  }
