import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, take, tap } from 'rxjs/operators';


@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.auth.user.pipe(
      take(1),
      map(user => !!user),
      tap((loggedIn: boolean) => {
        if (!loggedIn) {
          this.router.navigate(['login']);
        }
      })
    );
  }
}
