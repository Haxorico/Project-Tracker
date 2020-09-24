import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from '../users/user.model';
import { v4 as uuidv4 } from 'uuid';
import * as _ from "lodash";
import { Md5 } from 'ts-md5/dist/md5';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { result } from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private users: User[] = [];
  guest: User = new User({name : "Guest", rank : 0});
  private user: User = this.guest;
  usersChanged = new Subject<User[]>();
  userLogedChanged = new Subject<void>();

  private REST_API_SERVER = "http://localhost:9000/users/";

  constructor(private httpClient: HttpClient) {}

  NewUser({
    name = "EMPTY_NAME",
    password,
    rank,
    photo = "NO_PHOTO",
    date_of_birth = "NO_DATE_OF_BIRTH",
    location = "NO_LOCATION",
    address = "NO_ADDRESS",
    skype = "NO_SKYPE",
    phone_number = "NO_PHONE_NUMBER",
    skills = [],
    flagTickEvent = true }) {
    password = Md5.hashStr(password).toString();
    const id = uuidv4()
    const userToCreate = new User({name, password, rank, photo, date_of_birth, location, address, skype, phone_number,id, skills});
    if (flagTickEvent)
      this.usersChanged.next(this.users.slice());
    this.addDBUser(userToCreate).subscribe();
  }

  public ObjectToUser(obj) {
    return new User(obj);
  }

  private getDBUserById(userID: string) {
    const url = this.REST_API_SERVER + userID
    return this.httpClient.get(url).pipe(map(userData =>{
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

  public DeleteUser(userToDelete: User){
    return this.delDBUser(userToDelete);
  }

  public UpdateUser(userToUpdate: User) {
    return this.updateDBUser(userToUpdate);
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
