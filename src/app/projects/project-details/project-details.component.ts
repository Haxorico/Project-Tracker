import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/users/user.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Project } from '../project.model';
import { UserService } from 'src/app/shared/user.service';
import { ProjectService } from '../../shared/project.service';
import { Task } from 'src/app/tasks/task.model';
import { TaskService } from 'src/app/shared/task.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css']
})
export class ProjectDetailsComponent implements OnInit {
  loggedUser: User;
  project: Project;
  tasks: Task[];

  showMembers: boolean = false;
  Users: User[] = [];

  constructor(private projectService: ProjectService,
    private taskService: TaskService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    this.route.params.subscribe(
      (params: Params) => {
        const id = params['id'];
        this.projectService.GetProjectById(id).subscribe(project => {
          this.project = project;
          this.taskService.GetTasksWithProjectId(project.id).subscribe(data => {
              this.tasks = data;
          });
          /* project.tasks_ids.forEach(task_id => {
            this.taskService.GetTaskById(task_id).subscribe(task => {
                this.tasks.push(task);
            });
          }); */
        })
        this.showMembers = false;
        /* this.userService.GetUsers().subscribe(users => {
          this.Users = users;
        }); */
      });
    this.loggedUser = this.userService.GetCurrentUser();
  }

  onRemoveUserClicked(userToRemove: User) {
    /* #TODO Use new formula
    this.project.RemoveTeamMember(userToRemove.id);
    this.projectService.UpdateProject(this.project); 
    */
  }

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
