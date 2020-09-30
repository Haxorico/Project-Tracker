import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/users/user.model';
import { Task } from '../task.model';
import { ActivatedRoute, Router, Params } from '@angular/router';
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
  users: User[];
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
      this.taskService.GetTaskById(id).subscribe(task =>{
        this.task = task;
      })
      this.isShowingAllUsers = false;
      this.isShowingAllManagers = false;
    })
    this.loggedUser = this.userService.GetCurrentUser();
    this.userService.GetUsers().subscribe(users => {
      this.users = users;
    });
  }
  
  getProjectName(id : string = this.task.project_id){
    this.projectService.GetProjectById(id).subscribe(project =>{
        return project.name;
    });
  } 

  onProjectClicked() {
    const id = this.task.project_id;
    this.router.navigate(["/projects/" + id]);
  }
  
  onTaskReportedClicked() {
    const id = this.task.reporter_id;
    this.router.navigate(["/users/" + id]);
  }
  onTaskUserClicked() {
    const id = this.task.worker_id;
    this.router.navigate(["/users/" + id]);
  }

  onDeleteTaskClicked() {
    
    this.taskService.DeleteTask(this.task);
    this.router.navigate(["../"], { relativeTo: this.route });
  }
  onEditTaskClicked() {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }

  ShowAllUsers() {
    this.isShowingAllUsers = true;
  }

  SetAsUser(newUser: User) {
    /* #TODO edit with new formula
     this.userService.RemoveTaskFromUser(this.task.worker_id,this.task.id,newUser.id);
    this.task.worker_id = newUser.id;
    this.taskService.UpdateTask(this.task);
    this.isShowingAllUsers = false; 
    */
  }

  ShowAllManagers() {
    this.isShowingAllManagers = true;
  }

  SetAsReporter(newReporter: User) {
/* #TODO edit with new forumla
    this.userService.RemoveTaskFromUser(this.task.reporter_id,this.task.id,newReporter.id);
    this.task.reporter_id = newReporter.id;
    this.taskService.UpdateTask(this.task);
    this.isShowingAllUsers = false;
     */
  }
}
