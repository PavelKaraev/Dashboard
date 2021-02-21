import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from "src/environments/environment";
import { Admin } from '../interfaces/admin';
import { AuthToken } from "../interfaces/auth-token";

@Injectable()
export class AuthService {

  public error$: Subject<string> = new Subject<string>();

  constructor(private http: HttpClient) {}

  get token() : string {
    const expDate = new Date(localStorage.getItem('token-exp'));
    if(new Date() > expDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem('token');
  }

  login(admin: Admin) : Observable<any> {
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, admin)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      )
  }

  logout() : void {
    this.setToken(null);
  }

  isAuthenticated() : boolean {
    return !!this.token;
  }

  private handleError(error: HttpErrorResponse) {
    const message = error.error.message;

    switch (message) {
      case 'INVALID_EMAIL':
        this.error$.next('Неверный Email');
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('Неверный пароль');
        break;
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Данный Email не существует!')
        break;
    }

    return throwError(error);
  }

  private setToken(response: AuthToken | null) {
    if(response) {
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
      localStorage.setItem('token', response.idToken);
      localStorage.setItem('token-exp', expDate.toString());
    } else {
      localStorage.clear();
    }
  }
}
