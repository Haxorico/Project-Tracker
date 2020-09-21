import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { User } from '../users/user.model';
import { v4 as uuidv4 } from 'uuid';
import * as _ from "lodash";
import { Md5 } from 'ts-md5/dist/md5';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private users: User[] = [];
  guest: User = new User("Guest", "", 0, "", "", "", "", "", "");
  private user: User = this.guest;
  usersChanged = new Subject<User[]>();
  userLogedChanged = new Subject<void>();

  private REST_API_SERVER = "http://localhost:9000/users/";

  constructor(private httpClient: HttpClient) {
    //#ASK_ALEX -- Not sure how to use the DB as it always returns an observable and not the array.
    //so I think I just initilize the db and I assume it auto updates? and thus the users array is updated at all time
    this.dbGetUsers().subscribe(users =>{
      this.users = users;
    });
  }

  private addUserToDB(userToAdd: User) {
    this.httpClient.post(this.REST_API_SERVER, userToAdd).subscribe(responseData => {
    });
  }

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
    const userToCreate = new User(name, password, rank, photo, date_of_birth, location, address, skype, phone_number);
    userToCreate.id = uuidv4();
    userToCreate.skills = skills;
    if (flagTickEvent)
      this.usersChanged.next(this.users.slice());
    this.addUserToDB(userToCreate);
  }
  DelUser(user: User) {
    const index = this.GetUserIndex(user);
    this.users.splice(index, 1);
    this.usersChanged.next(this.users.slice());
  }
  DelUserByIndex(index: number) {
    this.users.splice(index, 1);
    this.usersChanged.next(this.users.slice());
  }
  DelUserById(id: string) {
    const index = this.GetUserIndexById(id);
    this.users.splice(index, 1);
    this.usersChanged.next(this.users.slice());
  }

  GetDBUserById(userID: string) {
    return this.httpClient.get(this.REST_API_SERVER + userID);
  }

  private dbGetUsers(){
    return this.httpClient
    .get(this.REST_API_SERVER)
    .pipe(
      map((responseData: { [key: string]: User }) => {
        const tempArray = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            tempArray.push({ ...responseData[key], id: key });
          }
        }
        return tempArray;
      }));
  }
  public GetUsers() : User[] {
    return this.users.slice();
  }

  GetCurrentUser() {
    return this.user;
  }
  GetUserByIndex(index: number) {
    return this.users[index];
  }
  GetUserById(id: string) {
    return _.find(this.users, user => user.id == id)
  }
  GetUserIndexById(id: string) {
    return _.findIndex(this.users, { id: id });
  }
  GetUserIndex(user: User) {
    return _.findIndex(this.users, { id: user.id });
  }

  SetCurrentUser(user: User) {
    this.user = user;
    this.userLogedChanged.next();
  }
  UpdateUser(newUser: User) {
    const index: number = this.GetUserIndex(newUser);
    this.users[index] = newUser;
    this.usersChanged.next(this.users.slice());
  }

  GetGuestUser(): User {
    return this.guest;
  }

  LoadUsers(usersToLoad: User[], flagCleanAll: boolean = true) {
    if (flagCleanAll) {
      this.users = [];
    }
    if (usersToLoad == null)
      return false;
    usersToLoad.forEach(userToLoad => {
      this.NewUser({
        name: userToLoad.name,
        password: userToLoad.password,
        rank: userToLoad.rank,
        photo: userToLoad.photo,
        date_of_birth: userToLoad.date_of_birth,
        location: userToLoad.location,
        address: userToLoad.address,
        skype: userToLoad.skype,
        phone_number: userToLoad.phone_number,
        skills: userToLoad.skills,
        flagTickEvent: false
      })
    });
    this.usersChanged.next(this.users.slice());
    return true;
  }
}
