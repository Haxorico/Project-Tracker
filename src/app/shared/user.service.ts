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
  guest: User = new User("Guest", "", 0, "", "", "", "", "", "");
  private user: User = this.guest;
  usersChanged = new Subject<User[]>();
  userLogedChanged = new Subject<void>();

  private REST_API_SERVER = "http://localhost:9000/users/";

  constructor(private httpClient: HttpClient) {
    
  }

  

  //#ASK_ALEX Is there a way to convert an object into a class (User) without a use of this kind of function?
  //using <User> or "as User" did not work.
  /*    var test1 : User = <User>user;
        var test2 : User = user as User; 
        console.log(typeof(test2));
        console.log(typeof(test1));*/
    public ObjectToUser(obj){
    //console.log(obj);
      const retUser = new User(obj.name, obj.password, obj.rank, obj.photo, obj.date_of_birth, obj.location, obj.address, obj.skype, obj.phone_number);  
      retUser.id = obj.id;
      retUser.task_ids = obj.task_ids;
      retUser.project_ids = obj.project_ids;
      retUser.skills = obj.skills;
      return retUser;
    }
  
    private getDBUserById(userID: string) {
      const url = this.REST_API_SERVER + userID
      return this.httpClient.get(url);
    }
  
    private getDBUsers(){
      return this.httpClient
      .get(this.REST_API_SERVER)
      .pipe(
        map((responseData: { [key: string]: User }) => {
          const tempArray = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              tempArray.push({ ...responseData[key] });
            }
          }
          return tempArray;
        }));
    }
    private delDBUser(user : User){
      const url = this.REST_API_SERVER + user.id;
      console.log("deleting user id: "+ user.id);
      this.httpClient.delete(url);
    }
    private addDBUser(userToAdd: User) {
      this.httpClient.post(this.REST_API_SERVER, userToAdd).subscribe();
    }
    private updateDBUser(userToUpdate: User){
      const url : string = this.REST_API_SERVER + userToUpdate.id;
      this.httpClient.put(url, userToUpdate).subscribe();
    
    }
    public GetUsers()  {
      return this.getDBUsers();
      //return this.users.slice();
    }
    public GetUserById(id: string) {
      return this.getDBUserById(id);
      //return _.find(this.users, user => user.id == id)
    }

    public UpdateUser(newUser: User) {
      /* const index: number = this.GetUserIndex(newUser);
      this.users[index] = newUser;
      this.usersChanged.next(this.users.slice()); */
      this.updateDBUser(newUser);
    }
    DelUser(user: User) {
      this.delDBUser(user);
      /* 
      const index = this.GetUserIndex(user);
      this.users.splice(index, 1);
      this.usersChanged.next(this.users.slice()); */
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
    this.addDBUser(userToCreate);
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

  

  GetCurrentUser() {
    return this.user;
  }
  GetUserByIndex(index: number) {
    return this.users[index];
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
