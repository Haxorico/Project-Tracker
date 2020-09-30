import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { User } from '../users/user.model';
import * as _ from "lodash";
import {Md5} from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  allUsers : User[];
  constructor(private userService: UserService) {
    this.userService.GetUsers().subscribe(users =>{
      this.allUsers = users;
    })
  }

  Login(name: string, password: string) {
    password = Md5.hashStr(password).toString();
    name = name.toLowerCase();
    console.log(password);
    //#TODO move this logic to node.js. Have it been handle server sided.
    const userToFind = _.find(this.allUsers, user => user.name.toLowerCase() == name)
    if (userToFind==undefined || userToFind.password != password)
      return false;
    this.userService.SetCurrentUser(userToFind); 
    return true; 
  }

  GetGuestUser() : User{
    return this.userService.GetGuestUser();
  }

  Logout() {
    this.userService.SetCurrentUser(this.userService.GetGuestUser());
  }
}
