import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../users/user.model';
import { UserService } from '../shared/user.service';
import { LoginService } from '../shared/login.service';
import { Md5 } from 'ts-md5';

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

   //this.userService.NewUser({name: "a", password : Md5.hashStr("a").toString() , rank : 100, date_of_birth : "1/1/90", location : "Grand Master Office", address : "Floor 4", skype : "the_admin_1337", phone_number : "050-1333337"});
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
