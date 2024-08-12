import { HttpClient, HttpContext, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { BYPASS_REFRESH } from '../interceptor/auth.interceptor';

interface IResponse {
  message: string;
  access_token: string;
  refresh_token: string;
}


interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IUserList {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  verified: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _url = "http://192.168.31.123/api/v1/user";
  constructor(private readonly _http: HttpClient) { }

  storeToken(response: { access_token: string, refresh_token: string }): void {
    sessionStorage.setItem("access_token", response.access_token);
    sessionStorage.setItem("refresh_token", response.refresh_token);
  }

  logout(): void {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
  }

  getAccessToken(): string | null {
    return sessionStorage.getItem("access_token");
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem("refresh_token");
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  login(user: IUser): Observable<IResponse> {
    return this._http.post<IResponse>(`${this._url}/login`, user)
  }

  register(user: IUser): Observable<IResponse> {
    return this._http.post<IResponse>(`${this._url}/register`, user)
  }

  userList(): Observable<IUserList[]> {
    return this._http.get<IUserList[]>(`${this._url}/list`);
  }

  refresh(): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.getRefreshToken()}`
    );

    const context = new HttpContext().set(BYPASS_REFRESH, true);


    return this._http.post<any>(`${this._url}/refresh`, {}, { headers, context })
      .pipe(
        tap((response) => {
          sessionStorage.setItem('access_token', response.access_token)
        }),
        catchError((err) => {
          return throwError(() => err)
        })
      )
  }

}
