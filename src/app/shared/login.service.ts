import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as _ from "lodash";
import { UserService } from './user.service';
import { WebService } from './webService';


@Injectable({ providedIn: 'root' })

export class LoginService {
  constructor(private userService: UserService,
    private webService: WebService) { }

  private ENT_NAME = "login/";


  private dbFetchUserByToken(token: string) {
    const url = this.REST_API_SERVER + token;
    return this.httpClient.get(url).pipe(map(res => {
      return this.userService.ObjectToUser(res.data);
    }));
  }


  Login(name: string, password: string) {
    name = name.toLowerCase();
    const body = { name: name, password: password };
    return this.webService.AddData(this.ENT_NAME,body).pipe(map((data: any) => {
      if (data.err) {
        data.ret = false;
        return data.ret;
      }
      const user = this.userService.ObjectToUser(data.user);
      const token = data.token;
      localStorage.clear();
      localStorage.setItem("token", token);
      this.userService.SetCurrentUser(user);
      data.ret = true;
      return data.ret;
    }));

  }

  Logout() {
    localStorage.clear();
    this.userService.SetCurrentUser(this.userService.GetGuestUser());
    localStorage.clear();
  }

  AutoLogin() {
    this.webService.GetData(this.ENT_NAME).subscribe((userRawData: any) => {
      const user = this.userService.ObjectToUser(userRawData.data);
      this.userService.SetCurrentUser(user);
    });
  }

  AutoLogin(token) {
    this.dbFetchUserByToken(token).subscribe(data => {
      this.userService.SetCurrentUser(data);
    });
  }
}
