import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/users/user.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Project } from '../project.model';
import { UserService } from 'src/app/shared/user.service';
import { ProjectService } from '../../shared/project.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
  loggedUser: User;
  project: Project;

  showMembers: boolean = false;
  Users: User[] = [];

  constructor(private projectService: ProjectService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    this.route.params.subscribe(
      (params: Params) => {
        const id = params['id'];
        this.project = this.projectService.GetProjectById(id);
        this.showMembers = false;
        this.Users = this.userService.GetUsers();
      })
    this.loggedUser = this.userService.GetCurrentUser();
  }

  onRemoveUserClicked(userToRemove: User) {
    this.project.RemoveTeamMember(userToRemove);
    this.projectService.UpdateFullProject(this.project);
  }

  onShowFreeMemberClicked() {
    this.showMembers = !this.showMembers;
  }
  onAddMemberClicked(userToAdd: User) {
    this.project.AddTeamMember(userToAdd);

    //update the project service
    this.projectService.UpdateFullProject(this.project);

    //update the user service
    this.userService.UpdateFullUser(userToAdd);
  }
  onEditProjectClicked() {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }

  onDeleteProjectClicked() {
    this.projectService.DeleteProj(this.project);
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
