import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Task } from './task.model';
import { TaskService } from '../shared_temp/task.service';
import { Subscription } from 'rxjs';
import { User } from '../users/user.model';
import { newArray } from '@angular/compiler/src/util';
import { UserService } from '../shared_temp/user.service';

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
    this.tasks = this.taskService.GetTasks();
    this.sortTasksIntoGroups()
    this.taskSub = this.taskService.TasksChanged.subscribe((t: Task[]) => {
      this.tasks = t;
      this.sortTasksIntoGroups()
    })
    //this.loggedUser = this.loginService.GetLogedUser();
    this.user = this.userService.GetCurrentUser(); 
  }

  ngOnDestroy() {
    this.taskSub.unsubscribe();
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
    const temp = this.taskService.GetTasks();
    this.tasks = temp.filter(task => (
      //currently filtering by name and description. Can add any otehr type of filter if needed...
      task.name.toLowerCase().includes(val) ||
      task.description.toLowerCase().includes(val)));
  }
}
