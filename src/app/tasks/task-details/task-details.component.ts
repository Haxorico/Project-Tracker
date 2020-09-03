import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/app/users/user.model';
import { Task } from '../task.model';
import { LoginService } from 'src/Shared/login.service';
import { TaskService } from '../../../Shared/task.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserService } from 'src/Shared/user.service';
import { ProjectService } from 'src/Shared/project.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {

  loggedUser: User;
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
      const id = params['id'];
      this.task = this.taskService.GetTaskById(id);
      this.isShowingAllUsers = false;
      this.isShowingAllManagers = false;
    })
    this.loggedUser = this.userService.GetCurrentUser();
    this.users = this.userService.GetUsers();
  }
  onTaskReportedClicked() {
    const id = this.task.reporter.id;
    this.router.navigate(["/users/" + id]);
  }
  onTaskUserClicked() {
    const id = this.task.user.id;
    this.router.navigate(["/users/" + id]);
  }

  onProjectClicked() {
    let id = this.task.project.id;
    this.router.navigate(["/projects/" + id]);
  }

  onDeleteTaskClicked() {
    this.taskService.DelTask(this.task);
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
    if (!newUser.IsUserInProject(this.task.project)){
      newUser.projects.push(this.task.project);
      this.task.project.AddTeamMember(newUser);
    }
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
    if (!newReporter.IsUserInProject(this.task.project)){
      newReporter.projects.push(this.task.project);
      this.task.project.AddTeamMember(newReporter);
    }
    //add the task to the user
    newReporter.tasks.push(this.task);
    //update the services
    this.taskService.UpdateFullTask(this.task);
    this.userService.UpdateFullUser(newReporter);
    //remove the users list
    this.isShowingAllUsers = false;
  }
}

