import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpContextToken
} from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

export const BYPASS_REFRESH = new HttpContextToken(() => false);

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private readonly _authService: AuthService, private readonly _router: Router) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.context.get(BYPASS_REFRESH) === true) {
      return next.handle(request);
    }

    const clonedRequest = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this._authService.getAccessToken()}`
      }
    })

    return next.handle(clonedRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this._authService.refresh().pipe(
            switchMap((response: any) => {
              const newReq = request.clone({
                setHeaders: {
                  Authorization: `Bearer ${this._authService.getAccessToken()}`
                }
              });
              return next.handle(newReq)
            }),
            catchError((error) => {
              this._authService.logout();
              this._router.navigate(["login"])
              return throwError(() => error)
            })
          )
        } else {
          return throwError(() => error)
        }
      })
    );
  }
}
