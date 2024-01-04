import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Emitters } from '../../emiters/emitters';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(private http: HttpClient) { }
  user!: any
  message = "You are not loged in"
  ngOnInit() {
    this.getAllUsers();
    this.getUser();
  }
  getUser() {
    this.http.get("http://localhost:8000/api/user", { withCredentials: true }).subscribe({
      next: (res:any) => {
        console.log(res);
        this.message = `Welcome ${res.name}`
        Emitters.authEmitter.emit(true);
        this.user = res;
      },
      error: (err) => {
        console.log(err);
        Emitters.authEmitter.emit(false);

      }
    })
  }
  getAllUsers() {
    this.http.get("http://localhost:8000/api/users", { withCredentials: true }).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);

      }
    })
  }
}
