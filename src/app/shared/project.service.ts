import { Injectable } from '@angular/core';
import { Project } from '../projects/project.model';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _ from "lodash";
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})

export class ProjectService {
  ProjectChanged = new Subject<{ action: string, project: Project }>();
  private REST_API_SERVER = "http://localhost:9000/projects/";

  constructor(private httpClient: HttpClient) { }

  AddNewProject(obj) {
    obj.id = uuidv4();
    this.AddProject(new Project(obj));
  }

  public ObjectToProject(obj) {
    return new Project(obj);
  }

  private dbGetAllProjects() {
    return this.httpClient
      .get(this.REST_API_SERVER)
      .pipe(
        map((responseData: { [key: string]: Project }) => {
          const tempArray = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              tempArray.push(this.ObjectToProject({ ...responseData[key] }));
            }
          }
          return tempArray;
        }));
  }

  private dbGetPorjectById(projectID: string) {
    const url = this.REST_API_SERVER + projectID
    return this.httpClient.get(url).pipe(map(data => {
      return this.ObjectToProject(data);
    }));
  }

  private dbGetProjectsWithUserId(userID: string) {
    const url = this.REST_API_SERVER + "?team_members_ids=" + userID
    return this.httpClient.get(url).pipe(
      map((responseData: { [key: string]: Project }) => {
        const tempArray = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            tempArray.push(this.ObjectToProject({ ...responseData[key] }));
          }
        }
        return tempArray;
      }));
  }

  private dbAddProject(projectToAdd) {
    return this.httpClient.post(this.REST_API_SERVER, projectToAdd);
  }

  private dbUpdateProject(projectToUpdate: Project) {
    const url: string = this.REST_API_SERVER + projectToUpdate.id;
    return this.httpClient.put(url, projectToUpdate);
  }

  private dbDeleteProject(projectToDelete: Project) {
    const url = this.REST_API_SERVER + projectToDelete.id;
    return this.httpClient.delete(url);
  }

  public GetProjects() {
    return this.dbGetAllProjects();
  }

  public GetProjectById(id: string) {
    return this.dbGetPorjectById(id);
  }

  public GetProjectsWithUserId(userID: string) {
    return this.dbGetProjectsWithUserId(userID);
  }

  public AddProject(projectToAdd) {
    this.dbAddProject(projectToAdd).subscribe();
    this.ProjectChanged.next({ action: "Created", project: projectToAdd });
  }

  public UpdateProject(projectToUpdate: Project) {
    this.dbUpdateProject(projectToUpdate).subscribe();
    this.ProjectChanged.next({ action: "Updated", project: projectToUpdate });
  }

  public DeleteProject(projectToDelete: Project) {
    this.dbDeleteProject(projectToDelete).subscribe();
    this.ProjectChanged.next({ action: "Deleted", project: projectToDelete });
  }

}
