import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from './user.model';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../shared/login.service';
import { UserService } from '../shared/user.service';
import { forEach } from 'lodash';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  currentUser: User;
  usersToShow: User[];
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute) {  }

  ngOnInit(): void {
    this.currentUser = this.userService.GetCurrentUser();
    this.userService.GetUsers().subscribe(users => {
      this.usersToShow = [];
      users.forEach(user => {
        this.usersToShow.push(this.userService.ObjectToUser(user));
      });
      //#ASK_ALEX - Seems like it doesnt recognize the functions. As in the users are objects but not the model User.
      //console.log(this.usersToShow[2].GetTitle());
    })
  }

  onNewUserClicked(){
      this.router.navigate(['new'],{relativeTo:this.route});
  }
  onFilterChanged(val){
    val = val.toLowerCase();
    this.userService.GetUsers().subscribe(users => {
      const tempArray = [];
      users.forEach(user => {
        tempArray.push(this.userService.ObjectToUser(user));
      })
      this.usersToShow = tempArray.filter( user => (
        //currently filtering by name and skype. Can add any otehr type of filter if needed...
        user.name.toLowerCase().includes(val) || 
        user.skype.toLowerCase().includes(val)
      ));
    });
  }

}
