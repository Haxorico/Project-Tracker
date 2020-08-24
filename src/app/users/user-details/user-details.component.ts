import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { User } from '../user.model';
import { UserService } from '../user.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { LoginService } from 'src/app/login/login.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  user: User;
  userId: number;
  
  loggedUser: User;
  @ViewChild('skill', { static: false }) skill;
  constructor(private userService : UserService,
              /* private loginService : LoginService, */
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) =>
      {
        this.userId = params['id'];
        this.user = this.userService.GetUserById(this.userId);
      }
    )
    
    /* this.loggedUser = this.loginService.GetLogedUser(); */
    this.loggedUser = this.userService.GetCurrentUser();
  }
  onEditUserClicked()
  {
    this.router.navigate(["edit"], {relativeTo: this.route});
  }
  onDeleteUserClicked()
  {
    this.userService.DelUserById(this.userId);
    this.router.navigate(["../"], {relativeTo: this.route}); 
  }

  addSkill()
  {
    this.user.skills.push(this.skill.nativeElement.value);
    this.userService.UpdateFullUser(this.user);
    this.skill.nativeElement.value = "";
  }
  removeSkill(loc : number)
  {
    this.user.skills.splice(loc,1);
    this.userService.UpdateFullUser(this.user);
  }

}
