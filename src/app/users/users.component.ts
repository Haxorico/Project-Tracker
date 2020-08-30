import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from './user.model';
import { UserService } from '../../Shared/user.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../../Shared/login.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, OnDestroy {
  userSub : Subscription;
  users: User[];
  user: User;
  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private loginService : LoginService) {  }

  ngOnInit(): void {
    this.users = this.userService.GetUsers();
    this.userSub = this.userService.usersChanged.subscribe((u : User[]) => 
    {
      this.users = u;
    })
    this.user = this.userService.GetCurrentUser();
    
  }

  ngOnDestroy(){
    this.userSub.unsubscribe();
  }

  onNewUserClicked()
  {
      this.router.navigate(['new'],{relativeTo:this.route});
  }
  onFilterChanged(val)
  {
    val = val.toLowerCase();
    const temp = this.userService.GetUsers();
    this.users = temp.filter(user => (
      //currently filtering by name and skype. Can add any otehr type of filter if needed...
      user.name.toLowerCase().includes(val) || 
      user.skype.toLowerCase().includes(val)
      ));
  }

}
