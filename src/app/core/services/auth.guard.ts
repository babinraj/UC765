import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }
    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean | UrlTree {
        const uId = localStorage.getItem('userId');
        if (uId) {
            return true;
        }
        else {
            console.log(window.location.href)
            return this.router.parseUrl(`/app/login/${window.location.href.slice(-2)}`);
        }

    }
}
