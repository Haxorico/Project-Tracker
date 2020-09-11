import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from '../shared_temp/login.service';
import { User } from '../users/user.model';
import { UserService } from '../shared_temp/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  loggedUser: User = this.loginService.GetGuestUser();
  constructor(private loginService: LoginService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.userSub = this.userService.userLogedChanged.subscribe(() => {
      this.loggedUser = this.userService.GetCurrentUser();
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
