import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { User } from '../user.model';
import { UserService } from '../../../Shared/user.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { LoginService } from 'src/Shared/login.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  user: User;
  
  loggedUser: User;
  @ViewChild('skill', { static: false }) skill;
  constructor(private userService : UserService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) =>
      {
        const id = params['id'];
        this.user = this.userService.GetUserById(id);
      }
    )
    this.loggedUser = this.userService.GetCurrentUser();
  }
  onEditUserClicked()
  {
    this.router.navigate(["edit"], {relativeTo: this.route});
  }
  onDeleteUserClicked()
  {
    this.userService.DelUser(this.user);
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
