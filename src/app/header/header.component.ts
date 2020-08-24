import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoginService } from '../login/login.service';
import { User } from '../users/user.model';
import { UserService } from '../users/user.service';
import { TaskService } from '../tasks/task.service';
import { ProjectService } from '../projects/project.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  loggedUser: User = this.loginService.GetGuestUser();
  /* loginName: string = "(" + this.user.name + ") - Login"; */
  constructor(private loginService: LoginService,
    private userService: UserService,
    private taskService: TaskService,
    private projectService: ProjectService) { }

  ngOnInit(): void {
    this.userSub = this.userService.userLogedChanged.subscribe(() => {
      this.loggedUser = this.userService.GetCurrentUser();
    });
      
    /* this.loginSub = this.loginService.loginChanged.subscribe((user: User) => { 
      this.loginSub = this.loginService.loginChanged.subscribe(() => {
      if (user == null) {
        this.user = this.loginService.GetGuestUser();
      }
      else if (user == this.loginService.GetGuestUser()) {
        this.loginName = "(Guest) - Login";
        this.user = this.loginService.GetLogedUser();
      }
      else {
        this.loginName = user.name + " (Logout)";
        this.user = this.loginService.GetLogedUser();
      } 
    });*/
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
  onSaveDataClicked() {
    localStorage.clear();
    localStorage.setItem('users', JSON.stringify(this.userService.GetUsers()));
    localStorage.setItem('tasks', JSON.stringify(this.taskService.GetTasks()));
    localStorage.setItem('projects', JSON.stringify(this.projectService.GetProjects()));
  }
  onLoadDataClicked() {
    this.userService.LoadUsers(JSON.parse(localStorage.getItem('users'))); 
    this.taskService.LoadTasks(JSON.parse(localStorage.getItem('tasks'))); 
    this.projectService.LoadProjects(JSON.parse(localStorage.getItem('projects'))); 
  }
  GetUserLoc()
  {
    return this.userService.GetLocById(this.loggedUser.id);
  }
}
