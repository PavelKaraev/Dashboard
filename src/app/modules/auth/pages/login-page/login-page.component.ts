import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Admin } from '../../../shared/interfaces/admin';
import { AuthService } from '../../../shared/services/auth.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['../../../dashboard/dashboard.component.scss', './login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  loginForm: FormGroup
  submited: boolean = false

  constructor(
    private authService: AuthService,
    private router: Router
  ) { 
    
  }

  ngOnInit(): void {

    this.loginForm = new FormGroup({
      emailControl: new FormControl('', [
        Validators.email,
        Validators.required
      ]),
      passwordControl: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ])
    })
  }

  login() {
    if(this.loginForm.invalid) {
      return;
    }

    this.submited = true;

    const admin: Admin = {
      email: this.loginForm.value.emailControl,
      password: this.loginForm.value.passwordControl,
      returnSecureToken: true
    }

    this.authService.login(admin).subscribe( () => {
      this.loginForm.reset();
      this.router.navigate(['/dashboard']);
      this.submited = false;
    }, () => {
      this.submited = false;
    })
  }

  get email() {
    return this.loginForm.get('emailControl');
  }

  get password() {
    return this.loginForm.get('passwordControl');
  }

}
