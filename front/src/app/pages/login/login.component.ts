import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { backendurl } from '../../../env';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, HttpClientModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm = this.fb.group({
    password: [''],
    email: [''],
  })
  url = backendurl
  constructor(private fb: FormBuilder, private http: HttpClient,private router:Router) { }
  login() {
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      this.http.post(`${this.url}login`, this.loginForm.value,{withCredentials:true}).subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigateByUrl("/home");
        },
        error: (err) => {
          console.log(err);

        }
      })
    }
  }
}
