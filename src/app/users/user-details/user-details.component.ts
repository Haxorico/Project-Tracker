import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { User } from '../user.model';
import { Project } from 'src/app/projects/project.model';
import { UserService } from '../../shared/user.service';
import { ProjectService } from '../../shared/project.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {
  shownUser: User;
  loggedUser: User;
  shownUserProjects: Project[];

  @ViewChild('skill', { static: false }) skill;
  constructor(private userService: UserService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    this.shownUser = this.userService.GetGuestUser();
    this.loggedUser = this.userService.GetCurrentUser();
    this.route.params.subscribe(
      (params: Params) => {
        const id = params['id'];
        this.userService.GetUserById(id).subscribe(user => {
          this.shownUser = user;
          this.projectService.GetProjectsWithUserId(user.id).subscribe((projects: any) => {
            this.shownUserProjects = projects;
          });
        });
      })
  }
  onEditUserClicked() {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }
  onDeleteUserClicked() {
    this.userService.DeleteUser(this.shownUser);
    this.router.navigate(["../"], { relativeTo: this.route });
  }

  addSkill() {
    this.shownUser.skills.push(this.skill.nativeElement.value);
    this.userService.UpdateUser(this.shownUser);
    this.skill.nativeElement.value = "";
  }
  removeSkill(index: number) {
    this.shownUser.skills.splice(index, 1);
    this.userService.UpdateUser(this.shownUser);
  }
}
