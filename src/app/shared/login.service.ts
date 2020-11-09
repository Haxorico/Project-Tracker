import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';
import { WebService } from './webService';


@Injectable({ providedIn: 'root' })

export class LoginService {
  constructor(private userService: UserService,
    private webService: WebService) { }

  private ENT_NAME = "login/";

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
    this.userService.SetCurrentUser(this.userService.GetGuestUser());
    localStorage.clear();
  }

  AutoLogin() {
    this.webService.GetData(this.ENT_NAME).subscribe((userRawData: any) => {
      const user = this.userService.ObjectToUser(userRawData.data);
      this.userService.SetCurrentUser(user);
    });
  }
}
