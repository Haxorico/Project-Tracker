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
  private projects: Project[] = [];
  ProjectsChanged = new Subject<Project[]>();
  private REST_API_SERVER = "http://localhost:9000/projects/";

  constructor(private httpClient: HttpClient) { }

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

  public AddProject(projectTOAdd) {
    this.dbAddProject(projectTOAdd).subscribe();
  }
  public UpdateProject(projectToUpdate: Project) {
    this.dbUpdateProject(projectToUpdate).subscribe();
  }
  public DeleteProject(projectToDelete: Project) {
    this.dbDeleteProject(projectToDelete).subscribe();
  }

  AddNewProject({
    name = "NO_NAME",
    type = "NO_TYPE",
    logo = "NO_LOGO",
    client_name = "NO_CLIENT_NAME",
    start_date = "NO_START_DATE",
    end_date = "NO_END_DATE",
    description = "NO_DESCRIPTION",
    team_members_ids = []
  }) {
    const projectToCreate = new Project({ id: uuidv4(), name, type, logo, client_name, start_date, end_date, description, team_members_ids });
    this.AddProject(projectToCreate);
    this.projects.push(projectToCreate);
    //#FIX WITH IDs
    /* //update the team-members
    team_members.forEach(userInTeam => {
      userInTeam.projects.push(projectToCreate);
      this.userService.UpdateUser(userInTeam);
    }); */
  }
}
