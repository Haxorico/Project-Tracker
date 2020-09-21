import { Injectable } from '@angular/core';
import { Project } from '../projects/project.model';
import { User } from '../users/user.model';
import { Subject } from 'rxjs';
import { UserService } from './user.service';
import * as _ from "lodash";
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projects: Project[] = [];
  ProjectsChanged = new Subject<Project[]>();
  
  constructor(private userService: UserService) {
    //generate some dummy data to work with 
    this.GenerateStubs();
  }

  GenerateStubs() {
    //dummy data to work with
    
    const users = this.userService.GetUsers();
    this.AddNewProject({name : "OpenQ", type : "Maintenece", client_name : "Anju Software", start_date : "1/1/2020", end_date : "1/1/2021", description : "Check memory leaks", team_members : [users[0], users[5], users[12]]});
    this.AddNewProject({name : "Artnet", type : "Routine Check", client_name : "Artnet (Coroporation)", start_date : "5/6/2020", end_date : "5/12/2020", description : "Fix crash after 12minutes", team_members :  [users[1], users[4], users[5]]});
    this.AddNewProject({name : "EventNut", type : "Bug Fix", client_name : "Guy Darvish", start_date : "2/5/2020", end_date :  "10/5/2020", description : "Fix timer issue",  team_members : [users[2], users[6], users[17]]});
  }

  GetProjects() {
    return this.projects.slice();
  }

  GetProjectByIndex(index: number) {
    return this.projects[index];
  }

  GetProjectById(id: string) {
    return _.find(this.projects, project => project.id == id)
  }

  GetProjectIndex(project: Project){
    return _.findIndex(this.projects, {id: project.id});
  }

  GetProjectIndexById(id: string) {
    return _.findIndex(this.projects, {id: id});
  }

  AddNewProject({name = "NO_NAME",
    type = "NO_TYPE",
    logo = "NO_LOGO",
    client_name = "NO_CLIENT_NAME",
    start_date = "NO_START_DATE",
    end_date = "NO_END_DATE",
    description = "NO_DESCRIPTION",
    team_members = [],
    flagTickEvent = true}){
    /* const projectToCreate = new Project(name, type, logo, client_name, start_date, end_date, description, team_members);
    projectToCreate.id = uuidv4();
    this.projects.push(projectToCreate);
    //update the team-members
    team_members.forEach(userInTeam => {
      userInTeam.projects.push(projectToCreate);
      this.userService.UpdateUser(userInTeam);
    });

    if (flagTickEvent)
      this.ProjectsChanged.next(this.projects.slice()); */
  }

  DeleteProj(project: Project){
    const index = this.GetProjectIndex(project);
    this.projects.splice(index, 1);
    this.ProjectsChanged.next(this.projects.slice());
  }
  DeleteProjByIndex(index: number) {
    this.projects.splice(index, 1);
    this.ProjectsChanged.next(this.projects.slice());
  }

  DeleteProjById(id: string) {
    const index = this.GetProjectIndexById(id);
    this.projects.splice(index, 1);
    this.ProjectsChanged.next(this.projects.slice());
  }

  UpdateProject(index: number,
    name: string,
    type: string,
    logo: string,
    client_name: string,
    start_date: string,
    end_date: string,
    description: string,
    team_members: User[])  {
    this.projects[index].name = name;
    this.projects[index].type = type;
    this.projects[index].logo = logo;
    this.projects[index].client_name = client_name;
    this.projects[index].start_date = start_date;
    this.projects[index].end_date = end_date;
    this.projects[index].description = description;
    this.projects[index].team_members = team_members;
    this.ProjectsChanged.next(this.projects.slice());
  }

  UpdateFullProject(projectToUpdate: Project) {
    const index = this.GetProjectIndex(projectToUpdate);
    this.projects[index] = projectToUpdate;
    this.ProjectsChanged.next(this.projects.slice());
  }

  LoadProjects(projectsToLoad: Project[], flagCleanAll: boolean = true) {
    
    if (flagCleanAll) {
      this.projects = [];
    }
    if (projectsToLoad==null)
      return false;
    projectsToLoad.forEach(projectToLoad => {

      this.AddNewProject({
        name : projectToLoad.name,
        type : projectToLoad.type,
        logo : projectToLoad.logo,
        client_name : projectToLoad.client_name,
        start_date : projectToLoad.start_date,
        end_date : projectToLoad.end_date,
        description : projectToLoad.description,
        team_members : projectToLoad.team_members,
        flagTickEvent : false})
    });
    this.ProjectsChanged.next(this.projects.slice());
    return true;
  }

}
