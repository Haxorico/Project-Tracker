import { Injectable } from '@angular/core';
import { Project } from '../projects/project.model';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _ from "lodash";
import { v4 as uuidv4 } from 'uuid';
import { WebService } from './webService';

@Injectable({
  providedIn: 'root'
})

export class ProjectService {
  ProjectChanged = new Subject<{ action: string, project: Project }>();

  private ENT_NAME = "projects/";

  constructor(private webService: WebService) { }

  AddNewProject(obj) {
    obj.id = uuidv4();
    this.AddProject(new Project(obj));
  }

  public ObjectToProject(obj) {
    return new Project(obj);
  }

  public GetProjects() {
    return this.webService.GetDataArray(this.ENT_NAME).pipe(map((rawData: any) => {
      const data = rawData.map(projectRawData => this.ObjectToProject(projectRawData));
      return data;
    }));
  }

  public GetProjectById(id: string) {
    return this.webService.GetData(this.ENT_NAME, "", "", id).pipe(map((rawData: any) => {
      const projectData = this.ObjectToProject(rawData);
      return projectData;
    }));
  }

  public GetProjectsWithUserId(userID: string) {
    return this.webService.GetDataArray(this.ENT_NAME, "team_members_ids", userID).pipe(map((rawData: any) => {
      const projectData = this.ObjectToProject(rawData);
      return projectData;
    }));
  }

  public AddProject(projectToAdd) {
    this.webService.AddData(this.ENT_NAME, projectToAdd).subscribe(data => {
      this.ProjectChanged.next({ action: "Created", project: projectToAdd });
    });
  }

  public UpdateProject(projectToUpdate: Project) {
    this.webService.UpdateData(this.ENT_NAME, projectToUpdate).subscribe(data => {
      this.ProjectChanged.next({ action: "Updated", project: projectToUpdate });
    });
  }

  public DeleteProject(projectToDelete: Project) {
    this.webService.DeleteData(this.ENT_NAME, "", "", projectToDelete.id).subscribe(data => {
      this.ProjectChanged.next({ action: "Deleted", project: projectToDelete });
    });
  }

}
