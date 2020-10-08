import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Md5 } from 'ts-md5/dist/md5';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import * as _ from "lodash";

import { User } from '../users/user.model';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  //private users: User[] = [];
  guest: User = new User({ name: "Guest", rank: 0 });
  private user: User = this.guest;
  UsersChanged = new Subject<{action: string, user : User}>();
  userLogedChanged = new Subject<void>();

  private REST_API_SERVER = "I AM ERROR";//"http://localhost:9000/users/";

  constructor(private httpClient: HttpClient) { }

  NewUser(obj) {
    obj.password = Md5.hashStr(obj.password).toString();
    obj.id = uuidv4()
    this.AddUser(new User(obj));
  }

  public ObjectToUser(obj) {
    return new User(obj);
  }

  private getDBUserById(userID: string) {
    const url = this.REST_API_SERVER + userID
    return this.httpClient.get(url).pipe(map(userData => {
      return this.ObjectToUser(userData);
    }));
  }

  private getDBUsers() {
    return this.httpClient
      .get(this.REST_API_SERVER)
      .pipe(
        map((responseData: { [key: string]: User }) => {
          const tempArray = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              tempArray.push(this.ObjectToUser({ ...responseData[key] }));
            }
          }
          return tempArray;
        }));
  }
  private delDBUser(user: User) {
    const url = this.REST_API_SERVER + user.id;
    return this.httpClient.delete(url);
  }
  private addDBUser(userToAdd: User) {
    return this.httpClient.post(this.REST_API_SERVER, userToAdd);
  }

  private updateDBUser(userToUpdate: User) {

    const url: string = this.REST_API_SERVER + userToUpdate.id;
    return this.httpClient.put(url, userToUpdate);
  }

  public GetUsers() {
    return this.getDBUsers();
  }

  public GetUserById(userID: string) {
    return this.getDBUserById(userID);
  }

  public AddUser(userToAdd: User){
    this.addDBUser(userToAdd).subscribe();
    this.UsersChanged.next({action : "Created", user : userToAdd});
  }
  public UpdateUser(userToUpdate: User) {
    this.updateDBUser(userToUpdate).subscribe();
    this.UsersChanged.next({action : "Updated", user : userToUpdate});
  }

  public DeleteUser(userToDelete: User) {
    this.delDBUser(userToDelete).subscribe();
    this.UsersChanged.next({action : "Deleted", user : userToDelete});
  }

  

  public GetCurrentUser() {
    return this.user;
  }

  public SetCurrentUser(user: User) {
    this.user = user;
    this.userLogedChanged.next();
  }

  public GetGuestUser(): User {
    return this.guest;
  }
}
