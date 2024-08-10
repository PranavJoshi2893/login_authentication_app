import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({})

  constructor(private readonly _fb: FormBuilder, private readonly _authService: AuthService, private readonly _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.registerForm = this._fb.group({
      firstName: ["", [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      lastName: ["", [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]]
    })
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this._authService.register(this.registerForm.value).subscribe({
        next: (response) => {
          this.openSnackBar(response.message, 'Close')
        },
        error: (e) => {
          this.openSnackBar(e.error.message, 'Close')
        }
      })
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

}
