import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from './user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../shared/user.service';

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
    this.userService.GetUsers().subscribe(users =>{
      this.usersToShow = users;
    });
  }

  onNewUserClicked(){
      this.router.navigate(['new'],{relativeTo:this.route});
  }
  onFilterChanged(val){
    val = val.toLowerCase();
    this.userService.GetUsers().subscribe(users => {
      const tempArray = users;
      this.usersToShow = tempArray.filter( user => (
        user.name.toLowerCase().includes(val) || 
        user.skype.toLowerCase().includes(val)
      ));
    });
  }

}
