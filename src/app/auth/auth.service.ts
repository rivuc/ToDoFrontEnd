import { HttpClient, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, of, tap, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<any | null>(null);
  //private expirationDate: number = 0;
  constructor(private http: HttpClient) {}

  /*  getAuthToken(): Observable<any> {
    return this.http.get<any>(`${environment.apiToken}`, {
      //responseType: 'text' as 'json',
    });
  }*/

  getAuthToken(): Observable<any> {
    const currentToken = this.tokenSubject.getValue();

    if (currentToken && this.isTokenValid(currentToken)) {
      //return this.tokenSubject.pipe(take(1)); //.asObservable();
      return of(currentToken);
    } else {
      return this.refreshToken();
    }
  }

  private isTokenValid(token: any): boolean {
    const isValid = token.expirationDate > new Date();
    console.log('Is token valid: ' + isValid);
    return isValid;
  }

  private refreshToken(): Observable<any> {
    return this.http.get<any>(`${environment.apiToken}`).pipe(
      tap((response) => {
        response.expirationDate = Date.now() + response.expires_in * 1000;
        this.setToken(response);
      })
    );
  }

  private setToken(token: any): void {
    this.tokenSubject.next(token);
  }
}
