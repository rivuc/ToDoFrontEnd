import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { AuthService } from './auth.service';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (req.url.endsWith('/api/token')) {
      return next.handle(req);
    }
    console.log('getAuthToken');

    return this.authService.getAuthToken().pipe(
      switchMap((token) => {
        if (token) {
          const authReq = req.clone({
            headers: req.headers.set(
              'Authorization',
              `Bearer ${token.access_token}`
            ),
          });
          return next.handle(authReq);
        } else {
          return next.handle(req);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        //Handle error
        console.log('Error de autenticación');
        return throwError(() => error);
      })
    );
  }
}
