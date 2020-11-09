import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Md5 } from 'ts-md5/dist/md5';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../users/user.model';
import { WebService } from './webService';

@Injectable({ providedIn: 'root' })

export class UserService {
  guest: User = new User({ name: "Guest", rank: 0 });
  private user: User = this.guest;
  UsersChanged = new Subject<{ action: string, user: User }>();
  userLogedChanged = new Subject<void>();

  private ENT_NAME = "users/";

  constructor(private webService: WebService) { }

  NewUser(obj) {
    obj.password = Md5.hashStr(obj.password).toString();
    obj.id = uuidv4()
    this.AddUser(new User(obj));
  }

  public ObjectToUser(obj): User {
    return new User(obj);
  }

  public GetUsers() {
    return this.webService.GetDataArray(this.ENT_NAME).pipe(map((rawData: any) => {
      const data = rawData.map(userRawData => this.ObjectToUser(userRawData));
      return data;
    }));
  }

  public GetUserById(userID: string) {
    return this.webService.GetData(this.ENT_NAME, {}, userID).pipe(map((rawData: any) => {
      const userData = this.ObjectToUser(rawData);
      return userData;
    }));
  }

  public AddUser(userToAdd: User) {
    this.webService.AddData(this.ENT_NAME, userToAdd).subscribe(data => {
      this.UsersChanged.next({ action: "Created", user: userToAdd });
    });
  }

  public UpdateUser(userToUpdate: User) {
    this.webService.UpdateData(this.ENT_NAME, userToUpdate).subscribe(data => {
      this.UsersChanged.next({ action: "Updated", user: userToUpdate });
    });
  }

  public DeleteUser(userToDelete: User) {
    this.webService.DeleteData(this.ENT_NAME, {}, userToDelete.id).subscribe(data => {
      this.UsersChanged.next({ action: "Deleted", user: userToDelete });
    });
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
