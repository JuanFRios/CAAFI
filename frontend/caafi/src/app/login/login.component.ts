import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthService } from '../service/auth.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public error: string;
  public returnUrl: string;
  public hidePassword: boolean;
  public loginButtonDisabled: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    // redirect to home if already logged in
    if (this.authService.isUserLogged) {
      this.router.navigate(['/']);
    }
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });
    this.hidePassword = true;
    this.loginButtonDisabled = false;
  }

  get f() { return this.loginForm.controls; }

  ngOnInit(): void {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';
  }

  public btnLoginClick(): void {
    if (this.loginForm.valid) {
      this.loginButtonDisabled = true;
      this.authService.signin(this.f.username.value, this.f.password.value)
        .pipe(first())
        .subscribe(() => {
          this.router.navigate([this.returnUrl]);
        }, () => {
          this.loginForm.reset();
          this.error = 'Nombre de usuario o contraseña incorrectos';
          this.loginButtonDisabled = false;
        });
    }
  }

}
