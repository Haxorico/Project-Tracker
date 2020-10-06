import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { User } from 'src/app/users/user.model';
import { Task } from '../task.model';
import { Project } from 'src/app/projects/project.model';
import { TaskService } from '../../shared/task.service';
import { UserService } from 'src/app/shared/user.service';
import { ProjectService } from 'src/app/shared/project.service';
import * as _ from "lodash";

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {

  loggedUser: User;
  task: Task;
  worker: User;
  reporter: User;
  project: Project;


  constructor(private taskService: TaskService,
    private userService: UserService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router) { }
  isShowingAllUsers: Boolean = false;
  isShowingAllManagers: Boolean = false;
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      this.taskService.GetTaskById(id).subscribe(task => {
        this.task = task;
        this.projectService.GetProjectById(this.task.project_id).subscribe(project => {
          this.project = project;
        });
        this.userService.GetUserById(task.worker_id).subscribe(user => {
            this.worker = user;
          });
          
        this.userService.GetUserById(task.reporter_id).subscribe(user => {
          this.reporter = user;
        });
      });
    });
    this.loggedUser = this.userService.GetCurrentUser();
  }

  onProjectClicked() {
    const id = this.task.project_id;
    this.router.navigate(["/projects/" + id]);
  }
  onWorkerClicked() {
    const id = this.task.worker_id;
    this.router.navigate(["/users/" + id]);
  }
  onReportedClicked() {
    const id = this.task.reporter_id;
    this.router.navigate(["/users/" + id]);
  }
  onDeleteTaskClicked() {
    this.taskService.DeleteTask(this.task);
    this.router.navigate(["../"], { relativeTo: this.route });
  }

  onEditTaskClicked() {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }
}
