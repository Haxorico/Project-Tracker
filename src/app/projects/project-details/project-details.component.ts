import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/users/user.model';
import { LoginService } from 'src/Shared/login.service';
import { ProjectService } from '../../../Shared/project.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Project } from '../project.model';
import { UserService } from 'src/Shared/user.service';

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
      }
    )
    //this.loggedUser = this.loginService.GetLogedUser();
    this.loggedUser = this.userService.GetCurrentUser();
  }

  onRemoveUserClicked(u: User) {
    this.project.RemoveTeamMember(u);
    this.projectService.UpdateFullProject(this.project);
  }

  onShowFreeMemberClicked() {
    this.showMembers = !this.showMembers;
  }
  onAddMemberClicked(u: User) {
    this.project.AddTeamMember(u);

    //update the project service
    this.projectService.UpdateFullProject(this.project);

    //update the user service
    this.userService.UpdateFullUser(u);
  }
  onEditProjectClicked() {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }

  onDeleteProjectClicked() {
    this.projectService.DeleteProj(this.project);
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
