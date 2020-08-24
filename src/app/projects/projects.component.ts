import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectService } from './project.service';

import { Project } from './project.model';
import { User } from '../users/user.model';
import { LoginService } from '../login/login.service';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../users/user.service';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})

export class ProjectsComponent implements OnInit, OnDestroy {
  projects: Project[];
  projectSub: Subscription;
  loggedUser: User; 
  constructor(
    private projectService: ProjectService,
    /* private loginService: LoginService, */
    private userService: UserService,
    private router : Router,
    private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.projects = this.projectService.GetProjects();
    //this.loggedUser = this.loginService.GetLogedUser();
    this.loggedUser = this.userService.GetCurrentUser();
    this.projectSub = this.projectService.ProjectsChanged.subscribe((p : Project[]) => {
      this.projects = p;
    })
  }

  ngOnDestroy(){
    this.projectSub.unsubscribe();
  }
  onNewProjectClicked() {
    this.router.navigate(['new'],{relativeTo: this.route});
  }
  onFilterChanged(val){
    val = val.toLowerCase();
    const temp = this.projectService.GetProjects();
    this.projects = temp.filter(p => (
      //currently filtering by name and client name. Can add any otehr type of filter if needed...
      p.name.toLowerCase().includes(val) || 
      p.client_name.toLowerCase().includes(val)
      ));
  }
}
