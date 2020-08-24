import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/users/user.model';
import { Task } from '../task.model';
import { LoginService } from 'src/app/login/login.service';
import { TaskService } from '../task.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserService } from 'src/app/users/user.service';
import { ProjectService } from 'src/app/projects/project.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {

  loggedUser: User;
  taskId: number;
  task: Task;
  users: User[];
  constructor(private loginService: LoginService,
    private taskService: TaskService,
    private userService: UserService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router) { }
  isShowingAllUsers: Boolean = false;
  isShowingAllManagers: Boolean = false;
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.taskId = params['id'];
      this.task = this.taskService.GetTaskById(this.taskId);
      this.isShowingAllUsers = false;
      this.isShowingAllManagers = false;
    })
    //this.loggedUser = this.loginService.GetLogedUser();
    this.loggedUser = this.userService.GetCurrentUser();
    this.users = this.userService.GetUsers();
  }
  onTaskReportedClicked() {
    let loc = this.task.reporter.id;
    loc = this.userService.GetLocById(loc);
    this.router.navigate(["/users/" + loc]);
  }
  onTaskUserClicked() {
    let loc = this.task.user.id;
    loc = this.userService.GetLocById(loc);
    this.router.navigate(["/users/" + loc]);
  }

  onProjectClicked() {
    let loc = this.task.project.id;
    loc = this.projectService.GetProjectLocById(loc);
    this.router.navigate(["/projects/" + loc]);
  }

  onDeleteTaskClicked() {
    this.taskService.DelTaskById(this.taskId);
    this.router.navigate(["../"], { relativeTo: this.route });
  }
  onEditTaskClicked() {
    this.router.navigate(["edit"], { relativeTo: this.route });
  }

  ShowAllUsers() {
    this.isShowingAllUsers = true;
  }

  SetAsUser(newUser: User) {
    //remove the task from the old user
    const pastUser = this.task.user;
    const tloc = this.taskService.GetTaskLocById(this.task.id);
    pastUser.tasks.splice(tloc, 1);
    this.userService.UpdateFullUser(pastUser);
    //set the task to the new user
    this.task.user = newUser;
    //add the task to the user
    newUser.tasks.push(this.task);
    //if the user in not a team member, add him to the team.
    let foundProject = false;
    newUser.projects.forEach(p => {
      if (p.id == this.task.project.id)
        foundProject = true;
    });
    if (!foundProject)
      newUser.projects.push(this.task.project);
    //update the services
    this.taskService.UpdateFullTask(this.task);
    this.userService.UpdateFullUser(newUser);
    //remove the users list
    this.isShowingAllUsers = false;
  }

  ShowAllManagers() {
    this.isShowingAllManagers = true;
  }

  SetAsReporter(newReporter: User) {

    //remove the task from the old user
    const pastUser = this.task.reporter;
    const tloc = this.taskService.GetTaskLocById(this.task.id);
    pastUser.tasks.splice(tloc, 1);
    this.userService.UpdateFullUser(pastUser);
    //set the task to the new user
    this.task.reporter = newReporter;
    //if the user in not a team member, add him to the team.
    let foundProject = false;
    newReporter.projects.forEach(p => {
      if (p.id == this.task.project.id)
        foundProject = true;
    });
    if (!foundProject)
      newReporter.projects.push(this.task.project);
    //add the task to the user
    newReporter.tasks.push(this.task);
    //update the services
    this.taskService.UpdateFullTask(this.task);
    this.userService.UpdateFullUser(newReporter);
    //remove the users list
    this.isShowingAllUsers = false;
  }
}

