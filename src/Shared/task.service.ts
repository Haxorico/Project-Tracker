import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Task } from '../app/tasks/task.model';
import { User } from '../app/users/user.model';
import { Project } from '../app/projects/project.model';
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
    this.NewTask("Task 1A name", this.projectService.GetProjectByLoc(0), 0, 0, "1/1/2021", "1/1/2020", "1/1/2021", "Task1 descrition", this.userService.GetUserByLoc(18), this.userService.GetUserByLoc(0));
    this.NewTask("Task 2A name", this.projectService.GetProjectByLoc(0), 0, 0, "1/1/2021", "1/2/2020", "1/1/2021", "Task2 descrition", this.userService.GetUserByLoc(18), this.userService.GetUserByLoc(0));
    this.NewTask("Task 3A name", this.projectService.GetProjectByLoc(0), 3, 0, "1/1/2021", "1/1/2020", "31/12/2020", "Task3 descrition", this.userService.GetUserByLoc(18), this.userService.GetUserByLoc(0));
    this.NewTask("Task 4A name", this.projectService.GetProjectByLoc(0), 2, 0, "1/1/2021", "1/1/2020", "31/12/2020", "Task4 descrition", this.userService.GetUserByLoc(19), this.userService.GetUserByLoc(0));
    this.NewTask("Making Sure", this.projectService.GetProjectByLoc(0), 0, 0, "1/1/2021", "1/1/2020", "31/12/2020", "Make sure tasks 1-4 are completed", this.userService.GetUserByLoc(19), this.userService.GetUserByLoc(1));

    this.NewTask("Task 1B name", this.projectService.GetProjectByLoc(1), 0, 0, "1/1/2021", "1/1/2020", "31/12/2020", "Task 1b descrition", this.userService.GetUserByLoc(20), this.userService.GetUserByLoc(2));
    this.NewTask("Task 2B name", this.projectService.GetProjectByLoc(1), 2, 0, "1/1/2021", "1/1/2020", "31/12/2020", "Task 2b descrition", this.userService.GetUserByLoc(20), this.userService.GetUserByLoc(2));
    this.NewTask("Task 3B name", this.projectService.GetProjectByLoc(1), 1, 0, "1/1/2021", "1/1/2020", "31/12/2020", "Task 3b descrition", this.userService.GetUserByLoc(16), this.userService.GetUserByLoc(3));

    this.NewTask("Task 1C name", this.projectService.GetProjectByLoc(2), 0, 0, "1/1/2021", "1/1/2020", "31/12/2020", "Task 1c descrition", this.userService.GetUserByLoc(15), this.userService.GetUserByLoc(4));
    this.NewTask("Task 2C name", this.projectService.GetProjectByLoc(2), 2, 0, "1/1/2021", "1/1/2020", "31/12/2020", "Task 2c descrition", this.userService.GetUserByLoc(10), this.userService.GetUserByLoc(4));
    this.tasks[0].AddWorkTime("01/01/2020", 8, 30, "First day");
    this.tasks[0].AddWorkTime("02/01/2020", 6, 0, "Still learning");
    this.tasks[0].AddWorkTime("03/01/2020", 9, 30, "Gettin better");
    this.tasks[0].AddWorkTime("04/01/2020", 7, 30, "Long marathon");
    this.tasks[0].AddWorkTime("05/01/2020", 1, 35, "Just checking");
  }

  NewTask(
    name: string = "EMPTY_NAME",
    project: Project,
    status: number = -1,
    type: number = -1,
    estimate: string = "NO_ESTIMATION",
    start_date: string = "NO_START_DATE",
    end_date: string = "NO_END_DATE",
    description: string = "NO_DESCRIPTION_NUMBER",
    user: User,
    task_reporter: User,
    flagTickEvent: boolean = true) {
    const t = new Task(name, project, status, type, estimate, start_date, end_date, description, user, task_reporter);
    t.id = uuidv4();
    this.tasks.push(t);

    //update the users
    if (user != undefined) {
      //if the user in not a team member, add him to the team.
      if (!user.IsUserInProject(project)) {
        user.projects.push(project);
        project.team_members.push(user);
      }
      user.tasks.push(t);
      this.userService.UpdateFullUser(user);
    }
    //update the task reporter
    if (task_reporter != undefined) {
      task_reporter.tasks.push(t);
      //if the task_reporter in not a team member, add him to the team.
      if (!task_reporter.IsUserInProject(project)) {
        task_reporter.projects.push(project);
        project.team_members.push(task_reporter);
      }
    }
    this.projectService.UpdateFullProject(project);
    if (flagTickEvent)
      this.TasksChanged.next(this.tasks.slice());
  }

  GetTasks() {
    return this.tasks.slice();
  }
  GetTaskLoc(t: Task)
  {
    return _.findIndex(this.tasks, {id: t.id});
  }
  GetTaskLocById(id: string)
  {
    return _.findIndex(this.tasks, {id: id});
  }

  GetTaskByLoc(loc: number) {
    return this.tasks[loc];
  }
  GetTaskById(id: string) {
    return _.find(this.tasks, tasks => tasks.id == id)
  }
  DelTask(t: Task) {
    this.tasks.splice(this.GetTaskLoc(t), 1);
    this.TasksChanged.next(this.tasks.slice());
  }
  DelTaskByLoc(loc: number) {
    this.tasks.splice(loc, 1);
    this.TasksChanged.next(this.tasks.slice());
  }
  DelTaskById(id: string) {
    this.tasks.splice(this.GetTaskLocById(id), 1);
    this.TasksChanged.next(this.tasks.slice());
  }

  UpdateTask(loc: number,
    name: string = "EMPTY_NAME",
    project: Project,
    status: number = -1,
    type: number = -1,
    estimate: string = "NO_ESTIMATION",
    start_date: string = "NO_START_DATE",
    end_date: string = "NO_END_DATE",
    description: string = "NO_DESCRIPTION_NUMBER",
    user: User,
    task_reporter: User) {

    this.tasks[loc].name = name;
    this.tasks[loc].project = project;
    this.tasks[loc].status = status;
    this.tasks[loc].type = type;
    this.tasks[loc].estimate = estimate;
    this.tasks[loc].start_date = start_date;
    this.tasks[loc].end_date = end_date;
    this.tasks[loc].description = description;
    this.tasks[loc].user = user;
    this.tasks[loc].reporter = task_reporter;

    this.TasksChanged.next(this.tasks.slice());
  }

  UpdateFullTask(t: Task) {
    const loc = this.GetTaskLoc(t);
    this.tasks[loc] = t;
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

  LoadTasks(t: Task[], flagCleanAll: boolean = true) {
    if (flagCleanAll) {
      this.tasks = [];
    }
    if (t==null)
      return false;
    t.forEach(val => {
      this.NewTask(val.name,
        val.project,
        val.status,
        val.type,
        val.estimate,
        val.start_date,
        val.end_date,
        val.description,
        val.user,
        val.reporter,
        false)
    });
    this.TasksChanged.next(this.tasks.slice());
    return true;
  }
}