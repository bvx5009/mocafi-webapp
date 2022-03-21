import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  responseMessage: string = '';

  constructor(
      private router: Router,
      private authService: AuthService) {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.email, Validators.required]),
      password: new FormControl(null, Validators.required)
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['']);
    }
  }
  submitLogin() {
    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    if (email === 'Test@Test.com' && password === 'Test123') {
      this.authService.setLocalStorage();
      this.router.navigate(['/']);
    } else {
      this.responseMessage = 'Email or password do not match'
    }


  }

  resetError() {
    this.responseMessage = ''
  }

  get registerFormControl() {
    return this.loginForm.controls;
  }
}
