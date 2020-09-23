import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { User } from '../user.model';
import { UserService } from '../../shared/user.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  shownUser: User;
  loggedUser: User;

  @ViewChild('skill', { static: false }) skill;
  constructor(private userService : UserService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) =>{
        const id = params['id'];
        this.userService.GetUserById(id).subscribe(user =>{
            this.shownUser = this.userService.ObjectToUser(user);
          });
        })
    this.loggedUser = this.userService.GetCurrentUser();
  }
  onEditUserClicked(){
    this.router.navigate(["edit"], {relativeTo: this.route});
  }
  onDeleteUserClicked(){
    this.userService.DelUser(this.shownUser);
    this.router.navigate(["../"], {relativeTo: this.route}); 
  }

  addSkill(){
    this.shownUser.skills.push(this.skill.nativeElement.value);
    this.userService.UpdateUser(this.shownUser);
    this.skill.nativeElement.value = "";
  }
  removeSkill(loc : number){
    this.shownUser.skills.splice(loc,1);
    this.userService.UpdateUser(this.shownUser);
  }
}
