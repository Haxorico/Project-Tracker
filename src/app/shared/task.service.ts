import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from "lodash";
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../tasks/task.model';
import { Project } from '../projects/project.model';
import { ProjectService } from './project.service';
import { User } from '../users/user.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  public TaskChanged = new Subject<{action : string, task : Task}>();
  private REST_API_SERVER = "http://localhost:9000/tasks/";

  constructor(private httpClient: HttpClient,
    private userService: UserService,
    private projectService: ProjectService) {}

  public NewTask(obj) {
    obj.id = uuidv4();
    this.AddTask(new Task(obj));
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
  private dbGetTasksWithProjectId(projectID: string) {
    const url = this.REST_API_SERVER + "?project_id=" + projectID
    return this.httpClient.get(url).pipe(
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
  private dbUpdateTask(taskToUpdate: Task) {
    const url: string = this.REST_API_SERVER + taskToUpdate.id;
    return this.httpClient.put(url, taskToUpdate);
  }
  private dbDeleteTask(taskToDelete: Task) {
    const url = this.REST_API_SERVER + taskToDelete.id;
    return this.httpClient.delete(url);
  }
  public GetTasks() {
    return this.dbGetAllTasks();
  }

  public GetTaskById(taskID: string) {
    return this.dbGetTaskById(taskID);
  }
  
  public GetTasksWithProjectId(projID : string){
    return this.dbGetTasksWithProjectId(projID);
  }
  public AddTask(taskToAdd : Task){
    this.dbAddTask(taskToAdd).subscribe();
    this.TaskChanged.next({action: "Created", task : taskToAdd});
  }
  public UpdateTask(taskToUpdate: Task) {
    this.dbUpdateTask(taskToUpdate).subscribe();
    this.TaskChanged.next({action: "Updated", task : taskToUpdate});
  }
  public DeleteTask(taskToDelete: Task) {
    this.dbDeleteTask(taskToDelete).subscribe();
    this.TaskChanged.next({action: "Deleted", task : taskToDelete});
  }
}
