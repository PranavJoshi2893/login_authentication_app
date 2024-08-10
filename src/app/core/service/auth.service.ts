import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly _url = "http://127.0.0.1:3000/api/v1/user";
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

}
