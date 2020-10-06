import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as _ from "lodash";
import { User } from 'src/app/users/user.model';
import { Task } from 'src/app/tasks/task.model';
import { Project } from '../project.model';
import { UserService } from 'src/app/shared/user.service';
import { TaskService } from 'src/app/shared/task.service';
import { ProjectService } from '../../shared/project.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
  loggedUser: User;
  project: Project;
  tasks: Task[];
  teamUsers: User[];
  freeUsers: User[];

  showMembers: boolean = false;

  constructor(private projectService: ProjectService,
    private taskService: TaskService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    this.route.params.subscribe(
      (params: Params) => {
        this.userService.GetUsers().subscribe(users => {
          this.freeUsers = users;
        });
        this.teamUsers = [];

        const id = params['id'];
        this.projectService.GetProjectById(id).subscribe(project => {
          this.project = project;
          this.taskService.GetTasksWithProjectId(project.id).subscribe(data => {
            this.tasks = data;
          });
          project.team_members_ids.forEach(id => {
            this.userService.GetUserById(id).subscribe(member => {
              this.teamUsers.push(member);
            });
            const index = _.findIndex(this.freeUsers, user => user.id == id);
            this.freeUsers.splice(index,1);
          });
        })
        this.showMembers = false;

      });
    this.loggedUser = this.userService.GetCurrentUser();
  }

  onAddUserToTeam(user: User, index: number) {
    this.teamUsers.push(user);
    this.freeUsers.splice(index, 1);
  }
  onRemoveUserFromTeam(user: User, index: number) {
    this.freeUsers.push(user);
    this.teamUsers.splice(index, 1);
  }

  /* onRemoveUserClicked(userToRemove: User, index: number) {
    this.members.splice(index,1);
    this.project.team_members_ids.splice(index,1);
    this.projectService.UpdateProject(this.project); 
  } */

  onShowFreeMemberClicked() {
    this.showMembers = !this.showMembers;
  }
  onAddMemberClicked(userToAdd: User) {
    //#TODO Use new formula
    /* this.project.AddTeamMember(userToAdd.id);

    //update the project service
    this.projectService.UpdateProject(this.project);

    //update the user service
    this.userService.UpdateUser(userToAdd); */
  }
  onEditProjectClicked() {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }

  onDeleteProjectClicked() {
    this.projectService.DeleteProject(this.project);
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
