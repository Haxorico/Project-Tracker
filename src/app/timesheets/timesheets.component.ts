import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  tasks: Task[] = [];
  loggedUser: User;
  @ViewChild('f', {static: false}) newTaskForm: NgForm;
  constructor(private projectService: ProjectService,
    private taskService: TaskService,
    private userService: UserService) { }

  ngOnInit(): void {
  
    this.projectService.GetProjects().subscribe(projects => {
      this.projects = projects;
    })
    this.loggedUser = this.userService.GetCurrentUser();
    this.taskService.GetTasks().subscribe(tasks =>{
      this.tasks = tasks;
    });
    this.loggedUser = this.userService.GetCurrentUser();
  }

  AddWorkTime(taskToEdit: Task) {
    const d = this.newTaskForm.value;
    taskToEdit.AddWorkTime(d.date,d.hh,d.mm, d.comment);
    this.taskService.UpdateTask(taskToEdit); 
  }
}
