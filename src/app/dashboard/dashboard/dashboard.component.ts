import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  links: any[] = [
    { name: "User", isActive: false, link: "/dashboard/user/list" }
  ]

  constructor(private readonly _authService: AuthService, private readonly _router: Router) { }

  onLogout() {
    this._authService.logout();
    this._router.navigate(["login"])
  }
}
