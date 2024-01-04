import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { backendurl } from '../env';
@Injectable({
  providedIn: 'root'
})
export class AuthinterceptorService implements HttpInterceptor {
  url = backendurl
  constructor(private http: HttpClient, private router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError(error => {
        if (error.status === 401) {
          // Envoyer la requête pour rafraîchir le token ici
          console.log('Erreur 401');
          this.http.get(`${this.url}refresh`).subscribe({
            next: (res: any) => {
              localStorage.setItem('token', res.token);
              localStorage.setItem('refreshjwt', res.refreshToken);
              console.log("token refreshed");

            },
            error: (err: any) => {
              console.log("token refresh failed");

              this.http.get(`${this.url}/logout`).subscribe();
              this.router.navigate(['/login']);
              localStorage.clear();
            }
          }
          )
        }
        return throwError(error);
      })
    );
  }
}
