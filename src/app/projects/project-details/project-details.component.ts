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
        this.projectService.GetProjectById(id).subscribe(project => {
          this.project = project;
        })
        this.showMembers = false;
        this.userService.GetUsers().subscribe(users => {
          this.Users = users;
        });
      })
    this.loggedUser = this.userService.GetCurrentUser();
  }

  onRemoveUserClicked(userToRemove: User) {
    this.project.RemoveTeamMember(userToRemove.id);
    this.projectService.UpdateProject(this.project);
  }

  onShowFreeMemberClicked() {
    this.showMembers = !this.showMembers;
  }
  onAddMemberClicked(userToAdd: User) {
    this.project.AddTeamMember(userToAdd.id);

    //update the project service
    this.projectService.UpdateProject(this.project);

    //update the user service
    this.userService.UpdateUser(userToAdd).subscribe();
  }
  onEditProjectClicked() {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }

  onDeleteProjectClicked() {
    this.projectService.DeleteProject(this.project);
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
