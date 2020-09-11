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
    this.AddNewProject("OpenQ", "Maintenece", "", "Anju Software", "1/1/2020", "1/1/2021", "Check memory leaks", [users[0], users[5], users[12]]);
    this.AddNewProject("Artnet", "Routine Check", "", "Artnet (Coroporation)", "5/6/2020", "5/12/2020", "Fix crash after 12minutes", [users[1], users[4], users[5]]);
    this.AddNewProject("EventNut", "Bug Fix", "", "Guy Darvish", "2/5/2020", "10/5/2020", "Fix timer issue", [users[2], users[6], users[17]]);

  }
  GetProjects() {
    return this.projects.slice();
  }

  GetProjectByLoc(loc: number) {
    return this.projects[loc];
  }

  GetProjectById(id: string) {
    return _.find(this.projects, project => project.id == id)
  }
  GetProjectLoc(project: Project){
    return _.findIndex(this.projects, {id: project.id});
  }
  GetProjectLocById(id: string) {
    return _.findIndex(this.projects, {id: id});
  }
  AddNewProject(
    name: string = "NO_NAME",
    type: string = "NO_TYPE",
    logo: string = "NO_LOGO",
    client_name: string = "NO_CLIENT_NAME",
    start_date: string = "NO_START_DATE",
    end_date: string = "NO_END_DATE",
    description: string = "NO_DESCRIPTION",
    team_members: User[] = [],
    flagTickEvent: boolean = true) {
    const p = new Project(name, type, logo, client_name, start_date, end_date, description, team_members);
    p.id = uuidv4();
    this.projects.push(p);
    //update the team-members
    team_members.forEach(u => {
      u.projects.push(p);
      this.userService.UpdateFullUser(u);
    });


    if (flagTickEvent)
      this.ProjectsChanged.next(this.projects.slice());

  }

  DeleteProj(project: Project){
    const loc = this.GetProjectLoc(project);
    this.projects.splice(loc, 1);
  }
  DeleteProjByLoc(loc: number) {
    this.projects.splice(loc, 1);
    this.ProjectsChanged.next(this.projects.slice());
  }

  DeleteProjById(id: string) {
    const loc = this.GetProjectLocById(id);
    this.projects.splice(loc, 1);
  }

  UpdateProject(loc: number,
    name: string,
    type: string,
    logo: string,
    client_name: string,
    start_date: string,
    end_date: string,
    description: string,
    team_members: User[]) {
    this.projects[loc].name = name;
    this.projects[loc].type = type;
    this.projects[loc].logo = logo;
    this.projects[loc].client_name = client_name;
    this.projects[loc].start_date = start_date;
    this.projects[loc].end_date = end_date;
    this.projects[loc].description = description;
    this.projects[loc].team_members = team_members;
    this.ProjectsChanged.next(this.projects.slice());
  }

  UpdateFullProject(p: Project) {
    const loc = this.GetProjectLoc(p);
    this.projects[loc] = p;
    this.ProjectsChanged.next(this.projects.slice());
  }

  LoadProjects(p: Project[], flagCleanAll: boolean = true) {
    
    if (flagCleanAll) {
      this.projects = [];
    }
    if (p==null)
      return false;
    p.forEach(val => {

      this.AddNewProject(val.name,
        val.type,
        val.logo,
        val.client_name,
        val.start_date,
        val.end_date,
        val.description,
        val.team_members,
        false)
    });
    this.ProjectsChanged.next(this.projects.slice());
    return true;
  }

}
