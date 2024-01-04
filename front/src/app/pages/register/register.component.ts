import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { backendurl } from '../../../env';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,HttpClientModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm = this.fb.group({
    name:[''],
    password:[''],
    email:['',Validators.email]
  })
  constructor(private fb:FormBuilder,private http:HttpClient,private router:Router) { }
  url = backendurl
  register():void{
    console.log("register form submited");
    console.log(this.registerForm.value);
    if (this.registerForm.valid) {
      this.http.post(`${this.url}register`, this.registerForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.router.navigateByUrl("/login");
        },
        error: (err) => {
          console.log(err);
        }
      })
    }
  }
}
