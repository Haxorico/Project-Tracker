import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from './user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/user.service';
import { Subscription } from 'rxjs';
import * as _ from "lodash";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  currentUser: User;
  usersToShow: User[];
  userSub: Subscription;
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.currentUser = this.userService.GetCurrentUser();

        this.userService.GetUsers().subscribe(users => {
      this.usersToShow = users;
    }); 
    
    this.userSub = this.userService.UsersChanged.subscribe(({ action, user }) => {
      //check if user was created.
      if (action == "Created") {
        this.usersToShow.push(user);
      }
      //check if user was updated.
      else if (action == "Updated") {
        const index = _.findIndex(this.usersToShow, arrUser => arrUser.id == user.id);
        if (index) {
          this.usersToShow[index] = user;
        }
      }
      //check if user was Deleted.
      else if (action == "Deleted") {
        const index = _.findIndex(this.usersToShow, arrUser => arrUser.id == user.id);
        if (index) {
          this.usersToShow.splice(index,1)
        }
      }
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onNewUserClicked() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
  onFilterChanged(val) {
    val = val.toLowerCase();
    this.userService.GetUsers().subscribe(users => {
      const tempArray = users;
      this.usersToShow = tempArray.filter(user => (
        user.name.toLowerCase().includes(val) ||
        user.skype.toLowerCase().includes(val)
      ));
    }); 
  }
}
