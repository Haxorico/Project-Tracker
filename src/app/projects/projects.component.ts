import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectService } from '../../shared/project.service';
import { Project } from './project.model';
import { User } from '../users/user.model';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../shared/user.service';
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
    private userService: UserService,
    private router : Router,
    private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.projects = this.projectService.GetProjects();
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
    this.projects = temp.filter(filetredProjects => (
      //currently filtering by name and client name. Can add any otehr type of filter if needed...
      filetredProjects.name.toLowerCase().includes(val) || 
      filetredProjects.client_name.toLowerCase().includes(val)
      ));
  }
}
