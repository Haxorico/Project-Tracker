import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { newArray } from '@angular/compiler/src/util';
import { Subscription } from 'rxjs';

import * as _ from "lodash";

import { Task } from './task.model';
import { User } from '../users/user.model';
import { UserService } from '../shared/user.service';
import { TaskService } from '../shared/task.service';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit, OnDestroy {
  taskSub: Subscription;
  //loggedUser: User;
  user: User;
  tasks: Task[] = [];
  openTasks: Task[] = [];
  devTasks: Task[] = [];
  qaTasks: Task[] = [];
  closedTasks: Task[] = [];
  tableSize = [];
  constructor(private taskService: TaskService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,) { }

  ngOnInit(): void {
    this.taskService.GetTasks().subscribe(tasks => {
      this.tasks = tasks;
      this.sortTasksIntoGroups();
      this.user = this.userService.GetCurrentUser();
    });
    this.taskSub = this.taskService.TaskChanged.subscribe(({ action, task }) => {
      //check if task was created.
      if (action == "Created") {
        this.tasks.push(task);
        this.addTaskToStatusList(task);
      }
      //check if task was updated.
      else if (action == "Updated") {
        const index = _.findIndex(this.tasks, arrTask => arrTask.id == task.id);
        if (index) {
          //check if status was changed and if it needs visual update.
          if (this.tasks[index].status != task.status) {
            this.removeTaskFromStatusList(task);
            this.addTaskToStatusList(task);
          }
          this.tasks[index] = task;
        }
      }
      //check if task was Deleted.
      else if (action == "Deleted") {
        const index = _.findIndex(this.tasks, arrTask => arrTask.id == task.id);
        if (index) {
          this.tasks.splice(index)
        }
      }
    });

  }

  ngOnDestroy() {
    this.taskSub.unsubscribe();
  }

  removeTaskFromStatusList(task: Task) {
    if (task.status == 0) {
      const index = _.findIndex(this.openTasks, arrTask => arrTask.id == task.id);
      this.openTasks.splice(index);
    }
    else if (task.status == 1) {
      const index = _.findIndex(this.devTasks, arrTask => arrTask.id == task.id);
      this.devTasks.splice(index);
    }
    else if (task.status == 2) {
      const index = _.findIndex(this.qaTasks, arrTask => arrTask.id == task.id);
      this.qaTasks.splice(index);
    }
    else if (task.status == 3) {
      const index = _.findIndex(this.closedTasks, arrTask => arrTask.id == task.id);
      this.closedTasks.splice(index);
    }
  }

  addTaskToStatusList(task: Task) {
    if (task.status == 0)
      this.openTasks.push(task);
    else if (task.status == 1)
      this.devTasks.push(task);
    else if (task.status == 2)
      this.qaTasks.push(task);
    else if (task.status == 3)
      this.closedTasks.push(task);
  }

  sortTasksIntoGroups() {

    //empty the arrays
    this.openTasks = [];
    this.devTasks = [];
    this.qaTasks = [];
    this.closedTasks = [];
    //sort the task array into 4 groups - by status
    this.tasks.forEach(task => {
      if (task.status == 0)
        this.openTasks.push(task);
      else if (task.status == 1)
        this.devTasks.push(task);
      else if (task.status == 2)
        this.qaTasks.push(task);
      else if (task.status == 3)
        this.closedTasks.push(task);
    });

    //get the biggest array size.
    let biggest = this.openTasks.length;
    if (this.devTasks.length > biggest)
      biggest = this.devTasks.length;
    if (this.qaTasks.length > biggest)
      biggest = this.qaTasks.length;
    if (this.closedTasks.length > biggest)
      biggest = this.closedTasks.length;
    this.tableSize = newArray(biggest);
  }

  onNewTaskClicked() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }

  onFilterChanged(val) {
    val = val.toLowerCase();
    this.taskService.GetTasks().subscribe(tasks => {
      this.tasks = tasks.filter(task => (
        task.name.toLowerCase().includes(val) ||
        task.description.toLowerCase().includes(val)
      ))
    });
  }
}
