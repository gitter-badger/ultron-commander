import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  // canActivate(
  //   next: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
  //   return true;
  // }

  constructor(public router: Router) { }

  canActivate(): boolean {
    if ( ! localStorage.getItem('session')) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
