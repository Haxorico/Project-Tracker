import { Injectable } from '@angular/core';
import { UserService } from '../users/user.service';
import { User } from '../users/user.model';
import { Subscription, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  loggedUser: User = this.GetGuestUser();
  loginChanged = new Subject<User>();
  constructor(private userService: UserService) {

  }

  Login(name: string, password: string): boolean {
    const users = this.userService.GetUsers();
    for (let i = 0; i < users.length; i++) {
      if (users[i].name.toLowerCase() == name && users[i].password == password) {
        this.loggedUser = users[i];
        this.loginChanged.next(this.loggedUser);
        return true;
      }
    }
    return false;
  }

  GetGuestUser() : User
  {
    return this.userService.GetGuestUser();
  }

  Logout() {
    this.loggedUser = this.GetGuestUser();
    this.loginChanged.next(this.loggedUser);
  }

  GetLogedUser() {
    return this.loggedUser;
  }
}
