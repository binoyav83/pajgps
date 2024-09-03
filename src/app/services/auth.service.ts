import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<boolean> {
    const url = 'https://connect.paj-gps.de/api/v1/login';
    return this.http.post<{ success: { token: string; }; }>(url, { email, password }).pipe(
      map(response => {
        if (response.success && response.success.token) {
          this.tokenSubject.next(response.success.token);
          localStorage.setItem('auth_token', response.success.token);
          return true;
        } else {
          console.error('Token not found in response:', response);
          return false;
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return [false];
      })
    );
  }

  getToken() {
    return this.tokenSubject.value || localStorage.getItem('auth_token');
  }

  logout() {
    this.tokenSubject.next(null);
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  }
}