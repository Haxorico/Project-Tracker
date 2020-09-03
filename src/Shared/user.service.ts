import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../app/users/user.model';
import { v4 as uuidv4 } from 'uuid';
import * as _ from "lodash";
import {Md5} from 'ts-md5/dist/md5';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  private users: User[] = [];
  guest: User = new User("Guest", "", 0, "", "", "", "", "", "");
  private user: User = this.guest;
  usersChanged = new Subject<User[]>();
  userLogedChanged = new Subject<void>();


  constructor() {

    //Generatae some dummy data to work with
    this.GenerateStubs();
  }

  GenerateStubs() {
    //just some dummy data to work with
    this.NewUser("a", "a", 100, "", "1/1/90", "Grand Master Office", "Floor 4", "the_admin_1337", "050-1333337");
    this.NewUser("Admin", "aAbBtEst-1237", 99, "", "1/1/91", "Master Office", "Floor 3", "my_name", "050-248741");
    this.NewUser("Abba", "aAbBtEst-1537", 99, "", "1/1/92", "Master Office", "Floor 3", "love_is_life", "050-248741");
    this.NewUser("Imma", "adeTEst-12537", 80, "", "1/3/90", "Master Office", "Floor 3", "girl_power", "050-245551");

    this.NewUser("John", "abcd1234", 30, "", "10/5/91", "Small Office", "Villa", "humble_mod", "050-0500505");
    this.NewUser("Daniel", "abcd1234", 25, "", "10/5/91", "Small Office", "Villa", "humble_mod", "050-0500505");
    this.NewUser("Shay", "abcd1234", 24, "", "10/5/91", "Small Office", "Villa", "humble_mod", "050-0500505");
    this.NewUser("May", "abcd1234", 23, "", "10/5/91", "Small Office", "Villa", "humble_mod", "050-0500505");
    this.NewUser("Sami", "abcd1234", 20, "", "10/5/91", "Small Office", "Villa", "humble_mod", "050-0500505");

    this.NewUser("Refael", "123456", 1, "", "20/10/95", "Cubical", "House", "work_work", "050-6666666");
    this.NewUser("Dave", "123456", 2, "", "20/10/95", "Cubical - 1A", "House", "work_work", "050-6666666");
    this.NewUser("Steve", "123456", 3, "", "20/10/95", "Cubical - 2A", "House", "work_work", "050-6666666");
    this.NewUser("Homer", "123456", 1, "", "20/10/95", "Cubical - 3A", "House", "work_work", "050-6666666");
    this.NewUser("Katya", "123456", 1, "", "20/10/95", "Cubical - 1B", "House", "work_work", "050-6666666");
    this.NewUser("Anna", "123456", 5, "", "20/10/95", "Cubical - 2B", "House", "work_work", "050-6666666");
    this.NewUser("Mark", "123456", 6, "", "20/10/95", "Cubical - 2C", "House", "work_work", "050-6666666");
    this.NewUser("Yaniv", "123456", 1, "", "20/10/95", "Cubical - 3A", "House", "work_work", "050-6666666");
    this.NewUser("Jay", "123456", 8, "", "20/10/95", "Cubical - 3B", "House", "work_work", "050-6666666");
    this.NewUser("Ben", "123456", 1, "", "20/10/95", "Cubical - 3C", "House", "work_work", "050-6666666");
    this.NewUser("Derek", "123456", 2, "", "20/10/95", "Cubical - 4A", "House", "work_work", "050-6666666");
    this.NewUser("Ali", "123456", 1, "", "20/10/95", "Cubical - 4B", "House", "work_work", "050-6666666");

  }
  NewUser(name: string = "EMPTY_NAME",
    password: string,
    rank: number,
    photo: string = "NO_PHOTO",
    date_of_birth: string = "NO_DATE_OF_BIRTH",
    location: string = "NO_LOCATION",
    address: string = "NO_ADDRESS",
    skype: string = "NO_SKYPE",
    phone_number: string = "NO_PHONE_NUMBER",
    skills: string[] = [],
    flagTickEvent: boolean = true) {
      password = Md5.hashStr(password).toString();
    const u = new User(name, password, rank, photo, date_of_birth, location, address, skype, phone_number);
    u.id = uuidv4();
    u.skills = skills;
    this.users.push(u);
    if (flagTickEvent)
      this.usersChanged.next(this.users.slice());
  }
  DelUser(user: User){
    const loc = this.GetUserLoc(user);
    this.users.splice(loc, 1);
    this.usersChanged.next(this.users.slice());
  }
  DelUserByLoc(loc: number) {
    this.users.splice(loc, 1);
    this.usersChanged.next(this.users.slice());
  }
  DelUserById(id: string) {
    const loc = this.GetUserLocById(id);
    this.users.splice(loc, 1);
    this.usersChanged.next(this.users.slice());
  }

  GetUsers() {
    return this.users.slice();
  }
  GetCurrentUser() {
    return this.user;
  }
  GetUserByLoc(loc: number) {
    return this.users[loc];
  }
  GetUserById(id: string) {
    return _.find(this.users, user => user.id == id)
  }
  GetUserLocById(id: string){
    return _.findIndex(this.users, {id: id});
  }
  GetUserLoc(user: User){
    return _.findIndex(this.users, {id: user.id});
  }


  SetCurrentUser(u: User) {
    this.user = u;
    this.userLogedChanged.next();
  }
  UpdateFullUser(newUser: User) {
    const loc: number = this.GetUserLoc(newUser);
    this.users[loc] = newUser;
    this.usersChanged.next(this.users.slice());
  }

  UpdateUser(loc: number,
    name: string,
    password: string,
    rank: number,
    photo: string,
    date_of_birth: string,
    location: string,
    address: string,
    skype: string,
    phone_number: string) {
    this.users[loc].name = name;
    this.users[loc].password = password;
    this.users[loc].rank = rank;
    this.users[loc].photo = photo;
    this.users[loc].date_of_birth = date_of_birth;
    this.users[loc].location = location;
    this.users[loc].address = address;
    this.users[loc].skype = skype;
    this.users[loc].phone_number = phone_number;


    this.usersChanged.next(this.users.slice());
  }

  GetGuestUser(): User {
    return this.guest;
  }

  LoadUsers(u: User[], flagCleanAll: boolean = true) {
    if (flagCleanAll) {
      this.users = [];
    }
    if (u==null)
      return false;
    u.forEach(val => {
      this.NewUser(val.name,
        val.password,
        val.rank,
        val.photo,
        val.date_of_birth,
        val.location,
        val.address,
        val.skype,
        val.phone_number,
        val.skills,
        false)
    });
    this.usersChanged.next(this.users.slice());
    return true;
  }
}
