import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../tasks/task.model';
import { WebService } from './webService';

@Injectable({ providedIn: 'root' })

export class TaskService {
  public TaskChanged = new Subject<{ action: string, task: Task }>();
  private ENT_NAME = "tasks/";

  constructor(private webService: WebService) { }

  public NewTask(obj) {
    obj.id = uuidv4();
    this.AddTask(new Task(obj));
  }

  public ObjectToTask(obj) {
    return new Task(obj);
  }

  public GetTasks() {
    return this.webService.GetDataArray(this.ENT_NAME).pipe(map((rawData: any) => {
      const data = rawData.map(taskRawData => this.ObjectToTask(taskRawData));
      return data;
    }));
  }

  public GetTaskById(taskID: string) {
    return this.webService.GetData(this.ENT_NAME, "", "", taskID).pipe(map((rawData: any) => {
      const taskData = this.ObjectToTask(rawData);
      return taskData;
    }));
  }

  public GetTasksWithProjectId(projID: string) {
    return this.webService.GetDataArray(this.ENT_NAME, "project_id", projID).pipe(map((rawData: any) => {
      const data = rawData.map(taskRawData => this.ObjectToTask(taskRawData));
      return data;
    }));
  }


  public AddTask(taskToAdd) {
    this.webService.AddData(this.ENT_NAME, taskToAdd).subscribe(data => {
      this.TaskChanged.next({ action: "Created", task: taskToAdd });
    });
  }

  public UpdateTask(taskToUpdate: Task) {
    this.webService.UpdateData(this.ENT_NAME, taskToUpdate).subscribe(data => {
      this.TaskChanged.next({ action: "Updated", task: taskToUpdate });
    });
  }

  public DeleteTask(taskToDelete: Task) {
    this.webService.DeleteData(this.ENT_NAME, "", "", taskToDelete.id).subscribe(data => {
      this.TaskChanged.next({ action: "Deleted", task: taskToDelete });
    });
  }
}
