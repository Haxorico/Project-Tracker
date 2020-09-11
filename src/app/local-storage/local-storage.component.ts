import { Component, OnInit } from '@angular/core';
import { AlertService } from '../_alert';
import { UserService } from '../shared/user.service';
import { TaskService } from '../shared/task.service';
import { ProjectService } from '../shared/project.service';


@Component({
  selector: 'app-local-storage',
  templateUrl: './local-storage.component.html',
  styleUrls: ['./local-storage.component.css']
})
export class LocalStorageComponent implements OnInit {

  constructor(private userService: UserService,
    private taskService: TaskService,
    private projectService: ProjectService,
    protected alertService: AlertService) { }
  
  ngOnInit(): void {
  }
  onSaveDataClicked() {
    localStorage.clear();
    localStorage.setItem('users', JSON.stringify(this.userService.GetUsers()));
    localStorage.setItem('tasks', JSON.stringify(this.taskService.GetTasks()));
    localStorage.setItem('projects', JSON.stringify(this.projectService.GetProjects()));
  }
  onLoadDataClicked() {
    const options = {
      autoClose: true,
    keepAfterRouteChange: false
  };
    if (!this.userService.LoadUsers(JSON.parse(localStorage.getItem('users')))){
        this.alertService.error('Error: No users data found.',options);
      }
    if (!this.taskService.LoadTasks(JSON.parse(localStorage.getItem('tasks')))){
      this.alertService.error('No tasks data found.',options);
    }
    if (!this.projectService.LoadProjects(JSON.parse(localStorage.getItem('projects')))){
      this.alertService.error('No projects data found.',options);
    }
  }
}
