import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import * as _ from "lodash";

import { Project } from './project.model';
import { User } from '../users/user.model';
import { ProjectService } from '../shared/project.service';
import { UserService } from '../shared/user.service';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})

export class ProjectsComponent implements OnInit {
  projectSub: Subscription;
  projects: Project[];
  loggedUser: User; 
  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private router : Router,
    private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.projectService.GetProjects().subscribe(projects => {
      this.projects = projects;
    });
    this.loggedUser = this.userService.GetCurrentUser();

    this.projectSub = this.projectService.ProjectChanged.subscribe(({ action, project }) => {
      //check if user was created.
      if (action == "Created") {
        this.projects.push(project);
      }
      //check if user was updated.
      else if (action == "Updated") {
        const index = _.findIndex(this.projects, arrProject => arrProject.id == project.id);
        if (index) {
          this.projects[index] = project;
        }
      }
      //check if user was Deleted.
      else if (action == "Deleted") {
        const index = _.findIndex(this.projects, arrProject => arrProject.id == project.id);
        if (index) 
          this.projects.splice(index)
      }
    });
  }

  onNewProjectClicked() {
    this.router.navigate(['new'],{relativeTo: this.route});
  }
  onFilterChanged(val){
    val = val.toLowerCase();
    this.projectService.GetProjects().subscribe(projects => {
      this.projects = projects.filter(filetredProjects => (
        //currently filtering by name and client name. Can add any otehr type of filter if needed...
        filetredProjects.name.toLowerCase().includes(val) || 
        filetredProjects.client_name.toLowerCase().includes(val)
        ));
    });
    
  }
}
