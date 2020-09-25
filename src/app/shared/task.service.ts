import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from '../tasks/task.model';
import * as _ from "lodash";
import { v4 as uuidv4 } from 'uuid';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  public TasksChanged = new Subject<Task[]>();
  private REST_API_SERVER = "http://localhost:9000/tasks/";

  constructor(private httpClient: HttpClient) {}
  public NewTask({
    name = "EMPTY_NAME",
    project_id = "",
    status = -1,
    type = -1,
    estimate = "",
    start_date = "",
    end_date = "",
    description = "",
    worker_id = "",
    reporter_id = "",
    id = uuidv4()}) {
    const taskToCreate = new Task({id, name, project_id, status, type, estimate, start_date, end_date, description, worker_id, reporter_id});
    this.tasks.push(taskToCreate);
    this.AddTask(taskToCreate);
    
    /* 
    //#TODO - Add task to user and reporter
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
    this.projectService.UpdateFullProject(project); */
    this.TasksChanged.next(this.tasks.slice()); 
  }

  public ObjectToTask(obj) {
    return new Task(obj);
  }
  private dbAddTask(taskToAdd){
    return this.httpClient.post(this.REST_API_SERVER, taskToAdd);
  }
  private dbGetAllTasks() {
    return this.httpClient
      .get(this.REST_API_SERVER)
      .pipe(
        map((responseData: { [key: string]: Task }) => {
          const tempArray = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              tempArray.push(this.ObjectToTask({ ...responseData[key] }));
            }
          }
          return tempArray;
        }));
  }

  private dbGetTaskById(taskID : string){
    const url = this.REST_API_SERVER + taskID
    return this.httpClient.get(url).pipe(map(data =>{
      return this.ObjectToTask(data);
    }));
  }

  private dbUpdateTask(taskToUpdate: Task) {
    const url: string = this.REST_API_SERVER + taskToUpdate.id;
    return this.httpClient.put(url, taskToUpdate);
  }
  private dbDeleteTask(taskToDelete: Task) {
    const url = this.REST_API_SERVER + taskToDelete.id;
    return this.httpClient.delete(url);
  }
  public AddTask(taskToAdd : Task){
    return this.dbAddTask(taskToAdd).subscribe();
  }
  public GetTasks() {
    return this.dbGetAllTasks();
  }

  public GetTaskById(taskID: string) {
    return this.dbGetTaskById(taskID);
  }
  public UpdateTask(taskToUpdate: Task) {
    return this.dbUpdateTask(taskToUpdate).subscribe();
  }
  public DeleteTask(taskToDelete: Task) {
    return this.dbDeleteTask(taskToDelete).subscribe();
  }

  
}
