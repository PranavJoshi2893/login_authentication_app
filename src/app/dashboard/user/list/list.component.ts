import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, IUserList } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {


  displayedColumns: string[] = ['position', 'firstName', 'lastName', 'email', 'verification_status'];
  dataSource: IUserList[] = [];

  constructor(private readonly _authService: AuthService, private readonly _router: Router) { }

  ngOnInit(): void {
    this._authService.userList().subscribe({
      next: (response) => {
        this.dataSource = response;
      },
      error: (e) => {
        console.log(e.error.message)
      }
    })
  }

  redirectTo() {
    this._router.navigate(["dashboard", "user", "create"])
  }

}
