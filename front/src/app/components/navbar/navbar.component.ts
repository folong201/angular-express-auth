import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Emitters } from '../../emiters/emitters';
import { NgIf } from '@angular/common';
import { backendurl } from '../../../env';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, HttpClientModule, RouterModule,NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  url  = backendurl
  constructor(private http: HttpClient, private router: Router) { }
  isAuth = false
  ngOnInit(): void {
    Emitters.authEmitter.subscribe((auth: boolean) => {
      this.isAuth = auth;
    }
    )
  }

  logout() {
    this.http.post(`${this.url}logout`, {}, { withCredentials: true }).subscribe({
      next: (res) => {
        console.log(res);
        this.isAuth = false;
        window.location.href = "/login";
      },
      error: (err) => {
        console.log(err);

      }
    })
  }
}
