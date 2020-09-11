import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Project } from '../projects/project.model';
import { User } from '../users/user.model';
import { Task } from '../tasks/task.model';
import { ProjectService } from '../shared/project.service';
import { TaskService } from '../shared/task.service';
import { UserService } from '../shared/user.service';
import * as _ from "lodash";

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
  @ViewChild('f', {static: false}) newTaskForm: NgForm;
  constructor(private projectService: ProjectService,
    private taskService: TaskService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.projects = this.projectService.GetProjects();
    this.loggedUser = this.userService.GetCurrentUser();

    this.projectSub = this.projectService.ProjectsChanged.subscribe((p: Project[]) => {
      this.projects = p;
    })

    this.tasks = this.taskService.GetTasks();
    this.taskSub = this.taskService.TasksChanged.subscribe((t: Task[]) => {
      this.tasks = t;
    })
    this.loggedUser = this.userService.GetCurrentUser();
  }

  AddWorkTime(taskToEdit: Task) {
    const d = this.newTaskForm.value;
    taskToEdit.AddWorkTime(d.date,d.hh,d.mm, d.comment);
    this.taskService.UpdateTask(taskToEdit); 
  }
}
