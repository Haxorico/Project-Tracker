import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../users/user.model';
import { UserService } from '../shared/user.service';
import { LoginService } from '../shared/login.service';
//#DEL ME LATER
import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  loggedUser: User = this.loginService.GetGuestUser();
  constructor(private loginService: LoginService,
    private userService: UserService)
     { }

  ngOnInit(): void {
    this.userSub = this.userService.userLogedChanged.subscribe(() => {
      this.loggedUser = this.userService.GetCurrentUser();
    });

    const pw = Md5.hashStr("a").toString();
    this.userService.LoginUser("a",pw).subscribe(data => {
      console.log("DATA RETURNED!!!:",data);
    });
   }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
