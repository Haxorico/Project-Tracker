import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

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

  private REST_API_SERVER = "http://localhost:9000/login/";


  private dbLoginUser(username: string, pw: string) {
    const url = this.REST_API_SERVER;
    const obj = { name: username, password: pw };
    return this.httpClient.post(url, obj);
  }

  private dbFetchUserByToken(token: string) {
    const url = this.REST_API_SERVER + token;
    return this.httpClient.get(url).pipe(map(res => {
      return this.userService.ObjectToUser(res.data);
    }));
  }


  Login(name: string, password: string) {
    return new Promise((resolve, reject) => {
      name = name.toLowerCase();
      //#TODO currently it returns the user. Change to token and user?
      //#ASK_ALEX => Why are errors showing.
      this.dbLoginUser(name, password).subscribe(data => {
        if (data.err) {
          //#ASK_ALEX - why wont reject end the function? tried reject(false) and return afterwards.
          resolve(false);
        }
        else {
          const user = this.userService.ObjectToUser(data.user);
          const token = data.token;
          localStorage.clear();
          localStorage.setItem("token", token);
          this.userService.SetCurrentUser(user);
          resolve(true);
        }
      });
    });
  }

  GetGuestUser(): User {
    return this.userService.GetGuestUser();
  }

  Logout() {
    localStorage.clear();
    this.userService.SetCurrentUser(this.userService.GetGuestUser());
  }

  AutoLogin(token) {
    this.dbFetchUserByToken(token).subscribe(data => {
      this.userService.SetCurrentUser(data);
    });
  }
}
