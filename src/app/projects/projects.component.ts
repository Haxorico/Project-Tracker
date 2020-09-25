import { Component, OnInit } from '@angular/core';
import { Project } from './project.model';
import { User } from '../users/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../shared/project.service';
import { UserService } from '../shared/user.service';
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})

export class ProjectsComponent implements OnInit {
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
