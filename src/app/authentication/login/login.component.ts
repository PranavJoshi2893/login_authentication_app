import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({})

  constructor(private readonly _fb: FormBuilder, private readonly _authService: AuthService, private _router: Router, private readonly _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]]
    })
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this._authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this._authService.storeToken(response);
          this._router.navigate(["dashboard"]);
          this.openSnackBar(response.message, 'Close')
        },
        error: (e) => {
          this.openSnackBar(e.error.message, 'Close');
        }
      })
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

}
