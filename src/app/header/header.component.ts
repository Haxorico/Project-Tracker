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
  Test: User[] = [];
  loggedUser: User = this.loginService.GetGuestUser();
  constructor(private loginService: LoginService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.userSub = this.userService.userLogedChanged.subscribe(() => {
      this.loggedUser = this.userService.GetCurrentUser();
    });

    this.userService.GetUsers().subscribe(users => {
      const tempArray : User[] = [];
      users.forEach(user => {
        tempArray.push(this.userService.ObjectToUser(user));
      });
      console.log(tempArray[2].name);
      tempArray[2].name += "t";
      this.userService.UpdateUser(tempArray[2]);
      console.log(tempArray[22]);
      this.userService.DelUser(tempArray[22]);
      console.log(tempArray[22]);
    })
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
