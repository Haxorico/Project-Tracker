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
    //generate some dummy data
    this.GenerteStubs();
  }

  GenerteStubs() {
    //some test tasks to work with.
    this.NewTask({name : "Task 1A name", project : this.projectService.GetProjectByIndex(0), status : 0, type : 0, estimate : "1/1/2021", start_date : "1/1/2020", end_date : "1/1/2021", description : "Task1 descrition", user : this.userService.GetUserByIndex(18), task_reporter: this.userService.GetUserByIndex(0)});
    this.NewTask({name : "Task 2A name", project : this.projectService.GetProjectByIndex(0), status : 0, type : 0, estimate : "1/1/2021", start_date : "1/2/2020", end_date : "1/1/2021", description : "Task2 descrition", user : this.userService.GetUserByIndex(18), task_reporter: this.userService.GetUserByIndex(0)});
    this.NewTask({name : "Task 3A name", project : this.projectService.GetProjectByIndex(0), status : 3, type : 0, estimate : "1/1/2021", start_date : "1/1/2020", end_date : "31/12/2020", description : "Task3 descrition", user : this.userService.GetUserByIndex(18), task_reporter: this.userService.GetUserByIndex(0)});
    this.NewTask({name : "Task 4A name", project : this.projectService.GetProjectByIndex(0), status : 2, type : 0, estimate : "1/1/2021", start_date : "1/1/2020", end_date : "31/12/2020", description : "Task4 descrition", user : this.userService.GetUserByIndex(19), task_reporter: this.userService.GetUserByIndex(0)});
    this.NewTask({name : "Making Sure", project : this.projectService.GetProjectByIndex(0), status : 0, type : 0, estimate : "1/1/2021", start_date : "1/1/2020", end_date : "31/12/2020", description : "Make sure tasks 1-4 are completed", user : this.userService.GetUserByIndex(19), task_reporter: this.userService.GetUserByIndex(1)});

    this.NewTask({name : "Task 1B name", project : this.projectService.GetProjectByIndex(1), status : 0, type : 0, estimate : "1/1/2021", start_date : "1/1/2020", end_date : "31/12/2020", description : "Task 1b descrition", user : this.userService.GetUserByIndex(20), task_reporter: this.userService.GetUserByIndex(2)});
    this.NewTask({name : "Task 2B name", project : this.projectService.GetProjectByIndex(1), status : 2, type : 0, estimate : "1/1/2021", start_date : "1/1/2020", end_date : "31/12/2020", description : "Task 2b descrition", user : this.userService.GetUserByIndex(20), task_reporter: this.userService.GetUserByIndex(2)});
    this.NewTask({name : "Task 3B name", project : this.projectService.GetProjectByIndex(1), status : 1, type : 0, estimate : "1/1/2021", start_date : "1/1/2020", end_date : "31/12/2020", description : "Task 3b descrition", user : this.userService.GetUserByIndex(16), task_reporter: this.userService.GetUserByIndex(3)});

    this.NewTask({name : "Task 1C name", project : this.projectService.GetProjectByIndex(2), status : 0, type : 0, estimate : "1/1/2021", start_date : "1/1/2020", end_date : "31/12/2020", description : "Task 1c descrition", user : this.userService.GetUserByIndex(15), task_reporter: this.userService.GetUserByIndex(4)});
    this.NewTask({name : "Task 2C name", project : this.projectService.GetProjectByIndex(2), status : 2, type : 0, estimate : "1/1/2021", start_date : "1/1/2020", end_date : "31/12/2020", description : "Task 2c descrition", user : this.userService.GetUserByIndex(10), task_reporter: this.userService.GetUserByIndex(4)});
    
    /* this.tasks[0].AddWorkTime("01/01/2020", 8, 30, "First day");
    this.tasks[0].AddWorkTime("02/01/2020", 6, 0, "Still learning");
    this.tasks[0].AddWorkTime("03/01/2020", 9, 30, "Gettin better");
    this.tasks[0].AddWorkTime("04/01/2020", 7, 30, "Long marathon");
    this.tasks[0].AddWorkTime("05/01/2020", 1, 35, "Just checking"); */
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
