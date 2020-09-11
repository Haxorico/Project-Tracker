import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from '../users/user.model';
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
    //NewUser({name = "EMPTY_NAME",password,rank,photo = "NO_PHOTO",date_of_birth = "NO_DATE_OF_BIRTH",location = "NO_LOCATION",address = "NO_ADDRESS",skype = "NO_SKYPE",phone_number = "NO_PHONE_NUMBER",skills,flagTickEvent = true}) {
    this.NewUser({name : "a", password : "a", rank : 100, date_of_birth : "1/1/90", location : "Grand Master Office", address : "Floor 4", skype: "the_admin_1337", phone_number : "050-1333337"});
    this.NewUser({name : "Admin", password : "aAbBtEst-1237", rank : 99, date_of_birth : "1/1/91",  location : "Master Office",  address : "Floor 3", skype: "my_name",  phone_number : "050-248741"});
    this.NewUser({name : "Abba", password : "aAbBtEst-1537", rank : 99,  date_of_birth : "1/1/92",  location : "Master Office",  address : "Floor 3", skype: "love_is_life",  phone_number : "050-248741"});
    this.NewUser({name : "Imma", password : "adeTEst-12537", rank : 80,  date_of_birth : "1/3/90",  location : "Master Office",  address : "Floor 3", skype: "girl_power",  phone_number : "050-245551"});

    this.NewUser({name : "John", password : "abcd1234", rank : 30,  date_of_birth : "10/5/91",  location : "Small Office",  address : "Villa", skype: "humble_mod",  phone_number : "050-0500505"});
    this.NewUser({name : "Daniel", password : "abcd1234", rank : 25,  date_of_birth : "10/5/91",  location : "Small Office",  address : "Villa", skype: "humble_mod",  phone_number : "050-0500505"});
    this.NewUser({name : "Shay", password : "abcd1234", rank : 24,  date_of_birth : "10/5/91",  location : "Small Office",  address : "Villa", skype: "humble_mod",  phone_number : "050-0500505"});
    this.NewUser({name : "May", password : "abcd1234", rank : 23,  date_of_birth : "10/5/91",  location : "Small Office",  address : "Villa", skype: "humble_mod",  phone_number : "050-0500505"});
    this.NewUser({name : "Sami", password : "abcd1234", rank : 20,  date_of_birth : "10/5/91",  location : "Small Office",  address : "Villa", skype: "humble_mod",  phone_number : "050-0500505"});

    this.NewUser({name : "Refael",password :  "123456", rank : 1, date_of_birth : "20/10/95",  location : "Cubical",  address : "House", skype: "work_work",  phone_number : "050-6666666"});
    this.NewUser({name : "Dave", password : "123456", rank : 2, date_of_birth : "20/10/95",  location : "Cubical - 1A",  address : "House", skype: "work_work",  phone_number : "050-6666666"});
    this.NewUser({name : "Steve", password : "123456", rank : 3, date_of_birth : "20/10/95",  location : "Cubical - 2A",  address : "House", skype: "work_work", phone_number :  "050-6666666"});
    this.NewUser({name : "Homer", password : "123456", rank : 1, date_of_birth : "20/10/95",  location : "Cubical - 3A",  address : "House", skype: "work_work", phone_number :  "050-6666666"});
    this.NewUser({name : "Katya", password : "123456", rank : 1, date_of_birth : "20/10/95",  location : "Cubical - 1B", address :  "House", skype: "work_work", phone_number :  "050-6666666"});
    this.NewUser({name : "Anna", password : "123456",rank :  5, date_of_birth : "20/10/95",  location : "Cubical - 2B", address :  "House", skype: "work_work", phone_number :  "050-6666666"});
    this.NewUser({name : "Mark", password : "123456", rank : 6, date_of_birth : "20/10/95",  location : "Cubical - 2C", address :  "House", skype: "work_work",  phone_number : "050-6666666"});
    this.NewUser({name : "Yaniv", password : "123456", rank : 1, date_of_birth : "20/10/95",  location : "Cubical - 3A",  address : "House", skype: "work_work", phone_number :  "050-6666666"});
    this.NewUser({name : "Jay", password : "123456", rank : 8, date_of_birth : "20/10/95",  location : "Cubical - 3B", address :  "House",skype:  "work_work", phone_number :  "050-6666666"});
    this.NewUser({name : "Ben", password : "123456", rank : 1, date_of_birth : "20/10/95",  location : "Cubical - 3C",  address : "House", skype: "work_work",  phone_number : "050-6666666"});
    this.NewUser({name : "Derek", password : "123456",rank :  2, date_of_birth : "20/10/95",  location : "Cubical - 4A",  address : "House", skype: "work_work",  phone_number : "050-6666666"});
    this.NewUser({name : "Ali",password :  "123456",rank :  1, date_of_birth : "20/10/95",  location : "Cubical - 4B",  address : "House", skype: "work_work",  phone_number : "050-6666666"});

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
    flagTickEvent = true}) {
    password = Md5.hashStr(password).toString();
    const userToCreate = new User(name, password, rank, photo, date_of_birth, location, address, skype, phone_number);
    userToCreate.id = uuidv4();
    userToCreate.skills = skills;
    this.users.push(userToCreate);

    if (flagTickEvent)
      this.usersChanged.next(this.users.slice());
  }
  DelUser(user: User){
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

  GetUsers() {
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
  GetUserIndexById(id: string){
    return _.findIndex(this.users, {id: id});
  }
  GetUserIndex(user: User){
    return _.findIndex(this.users, {id: user.id});
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

  /* UpdateUser(loc: number,
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
  } */

  GetGuestUser(): User {
    return this.guest;
  }

  LoadUsers(usersToLoad: User[], flagCleanAll: boolean = true) {
    if (flagCleanAll) {
      this.users = [];
    }
    if (usersToLoad==null)
      return false;
      usersToLoad.forEach(userToLoad => {
      this.NewUser({
        name : userToLoad.name,
        password : userToLoad.password,
        rank : userToLoad.rank,
        photo : userToLoad.photo,
        date_of_birth : userToLoad.date_of_birth,
        location : userToLoad.location,
        address : userToLoad.address,
        skype : userToLoad.skype,
        phone_number : userToLoad.phone_number,
        skills : userToLoad.skills,
        flagTickEvent : false})
    });
    this.usersChanged.next(this.users.slice());
    return true;
  }
}
