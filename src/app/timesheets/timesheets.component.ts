import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectService } from '../projects/project.service';
import { Project } from '../projects/project.model';
import { User } from '../users/user.model';
import { LoginService } from '../login/login.service';
import { Subscription } from 'rxjs';
import { TaskService } from '../tasks/task.service';
import { Task } from '../tasks/task.model';
import { UserService } from '../users/user.service';

@Component({
  selector: 'app-timesheets',
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.css']
})
export class TimesheetsComponent implements OnInit {


  projects: Project[] = [];
  projectSub: Subscription;
  tasks: Task[] = [];
  taskSub: Subscription;
  loggedUser: User;

  constructor(private projectService: ProjectService,
    /* private loginService: LoginService, */
    private taskService: TaskService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.projects = this.projectService.GetProjects();
    this.loggedUser = this.userService.GetCurrentUser();
    /* this.loggedUser = this.loginService.GetLogedUser(); */

    this.projectSub = this.projectService.ProjectsChanged.subscribe((p: Project[]) => {
      this.projects = p;
    })

    this.tasks = this.taskService.GetTasks();
    this.taskSub = this.taskService.TasksChanged.subscribe((t: Task[]) => {
      this.tasks = t;
    })
    this.loggedUser = this.userService.GetCurrentUser();
    /* this.loggedUser = this.loginService.GetLogedUser(); */


  }
  IsMemberInTeam(p: Project, u: User) {
    let ret: boolean = false;
    p.team_members.forEach(tm => {
      if (tm == u)
        ret = true;
    });
    return ret;
  }

  AddWorkTime(t: Task) {
    let hh, mm, date, comment;
    for (const elementId of this.tasks) {
      if (t != elementId)
        continue;
      let element = <HTMLInputElement>document.getElementById("hh_" + elementId.id.toString());
      hh = element.value;
      element = <HTMLInputElement>document.getElementById("mm_" + elementId.id.toString());
      mm = element.value;
      element = <HTMLInputElement>document.getElementById("date_" + elementId.id.toString());
      date = element.value;
      element = <HTMLInputElement>document.getElementById("comment_" + elementId.id.toString());
      comment = element.value;
    }
    t.AddWorkTime(date,hh,mm, comment);
    this.taskService.UpdateFullTask(t);
  }
}
