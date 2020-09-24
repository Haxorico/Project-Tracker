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
  constructor(private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) {  }

  ngOnInit(): void {
    //#ASK_ALEX: Currently it shows the user but also shows an error message.
    //seems like angular is trying to show the "shownUser" before it can get a value from the function.
    //so for now just set it to a guest and then it gets the data from the subscribe.
    //need a refresher again on how to use await / promise
    this.shownUser = this.userService.GetGuestUser();
    this.loggedUser = this.userService.GetCurrentUser();
    this.route.params.subscribe(
      (params: Params) => {
        const id = params['id'];
        this.userService.GetUserById(id).subscribe(user => {
          this.shownUser = user;
        });
      })
  }
  onEditUserClicked() {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }
  onDeleteUserClicked() {
    this.userService.DeleteUser(this.shownUser).subscribe();
    this.router.navigate(["../"], { relativeTo: this.route });
  }

  addSkill() {
    this.shownUser.skills.push(this.skill.nativeElement.value);
    this.userService.UpdateUser(this.shownUser).subscribe();
    this.skill.nativeElement.value = "";
  }
  removeSkill(index: number) {
    this.shownUser.skills.splice(index, 1);
    this.userService.UpdateUser(this.shownUser).subscribe();
  }
}
