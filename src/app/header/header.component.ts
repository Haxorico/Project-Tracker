import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../users/user.model';
import { UserService } from '../shared/user.service';
import { LoginService } from '../shared/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  loggedUser: User = this.userService.GetGuestUser();
  constructor(private loginService: LoginService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.userSub = this.userService.userLogedChanged.subscribe(() => {
      this.loggedUser = this.userService.GetCurrentUser();
    });
   const token = localStorage.getItem("token");
    if (token) {
      this.loginService.AutoLogin();
    }
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
