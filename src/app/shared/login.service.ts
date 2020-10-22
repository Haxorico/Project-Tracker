import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as _ from "lodash";
import { UserService } from './user.service';
import { User } from '../users/user.model';

@Injectable({ providedIn: 'root' })

export class LoginService {
  allUsers: User[];
  constructor(private userService: UserService,
    private httpClient: HttpClient) {
    this.userService.GetUsers().subscribe(users => {
      this.allUsers = users;
    });
  }

  private REST_API_SERVER = "http://localhost:9000/users/";


  private dbLoginUser(username: string, pw: string) {
    const url = this.REST_API_SERVER + "login";
    const obj = { name: username, password: pw };
    return this.httpClient.post(url, obj);
  }



  Login(name: string, password: string) {
    name = name.toLowerCase();
    //#TODO currently it returns the user. Change to token and user?
    return this.dbLoginUser(name, password).subscribe(data => {
      if (data) {
        const user = this.userService.ObjectToUser(data.user);
        const token = data.token;
        console.log(token);
        //save token to local storage
        localStorage.clear();
        localStorage.setItem("token", token);
        this.userService.SetCurrentUser(user);
        return true;
      }
      else {
        
        return false;
      }
    });
  }

  GetGuestUser(): User {
    return this.userService.GetGuestUser();
  }

  Logout() {
    this.userService.SetCurrentUser(this.userService.GetGuestUser());
  }
}
