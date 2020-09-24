import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Task } from '../tasks/task.model';
import { User } from '../users/user.model';
import { Project } from '../projects/project.model';
import { ProjectService } from './project.service';
import { UserService } from './user.service';
import * as _ from "lodash";
import { v4 as uuidv4 } from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  public TasksChanged = new Subject<Task[]>();

  constructor(private projectService: ProjectService,
    private userService: UserService) {
  }

 

  NewTask({
    name = "EMPTY_NAME",
    project = null,
    status = -1,
    type = -1,
    estimate = "NO_ESTIMATION",
    start_date = "NO_START_DATE",
    end_date = "NO_END_DATE",
    description = "NO_DESCRIPTION_NUMBER",
    user = null,
    task_reporter = null,
    flagTickEvent = true}) {
    /* const taskToCreate = new Task(name, project, status, type, estimate, start_date, end_date, description, user, task_reporter);
    taskToCreate.id = uuidv4();
    this.tasks.push(taskToCreate);
    //update the users
    if (user != undefined) {
      //if the user in not a team member, add him to the team.
      if (!user.IsUserInProject(project)) {
        user.projects.push(project);
        project.team_members.push(user);
      }
      user.tasks.push(taskToCreate);
      this.userService.UpdateUser(user);
    }
    //update the task reporter
    if (task_reporter != undefined) {
      task_reporter.tasks.push(taskToCreate);
      //if the task_reporter in not a team member, add him to the team.
      if (!task_reporter.IsUserInProject(project)) {
        task_reporter.projects.push(project);
        project.team_members.push(task_reporter);
      }
    }
    this.projectService.UpdateFullProject(project);
    if (flagTickEvent)
      this.TasksChanged.next(this.tasks.slice()); */
  }

  GetTasks() {
    return this.tasks.slice();
  }
  GetTaskIndex(taskToFind: Task){
    return _.findIndex(this.tasks, {id: taskToFind.id});
  }
  GetTaskIndexById(id: string){
    return _.findIndex(this.tasks, {id: id});
  }

  GetTaskByIndex(index: number) {
    return this.tasks[index];
  }
  GetTaskById(id: string) {
    return _.find(this.tasks, tasks => tasks.id == id)
  }
  DelTask(taskToDelete: Task) {
    this.tasks.splice(this.GetTaskIndex(taskToDelete), 1);
    this.TasksChanged.next(this.tasks.slice());
  }
  DelTaskByIndex(index: number) {
    this.tasks.splice(index, 1);
    this.TasksChanged.next(this.tasks.slice());
  }
  DelTaskById(id: string) {
    this.tasks.splice(this.GetTaskIndexById(id), 1);
    this.TasksChanged.next(this.tasks.slice());
  }

  UpdateTask(taskToUpdate: Task) {
    const index = this.GetTaskIndex(taskToUpdate);
    this.tasks[index] = taskToUpdate;
    this.TasksChanged.next(this.tasks.slice());
  }
  GetStatusString(status: number) {
    if (status == 0)
      return "Open";
    if (status == 1)
      return "Development";
    if (status == 2)
      return "Ready for QA";
    if (status == 3)
      return "Closed";
    if (status == -1)
      return "No status given";
    return "Error - Wrong status number.";
  }
  GetTypeString(type: number) {
    if (type == 0)
      return "Technical Task";
    if (type == 1)
      return "Bug";
    if (type == 2)
      return "Improvement";
    if (type == 3)
      return "Feature";
    if (type == 4)
      return "Task";
    if (type == -1)
      return "No type given";
    return "Error - Wrong type number.";
  }

  LoadTasks(tasksToLoad: Task[], flagCleanAll: boolean = true) {
    if (flagCleanAll) {
      this.tasks = [];
    }
    if (tasksToLoad==null)
      return false;
      tasksToLoad.forEach(taskToLoad => {
      this.NewTask({
        name : taskToLoad.name,
        project : taskToLoad.project,
        status : taskToLoad.status,
        type : taskToLoad.type,
        estimate : taskToLoad.estimate,
        start_date : taskToLoad.start_date,
        end_date : taskToLoad.end_date,
        description : taskToLoad.description,
        user : taskToLoad.user,
        task_reporter : taskToLoad.reporter,
        flagTickEvent : false})
    });
    this.TasksChanged.next(this.tasks.slice());
    return true;
  }
}
