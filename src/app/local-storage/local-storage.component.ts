import { Component, OnInit } from '@angular/core';
import { UserService } from '../../Shared/user.service';
import { TaskService } from '../../Shared/task.service';
import { ProjectService } from '../../Shared/project.service';

@Component({
  selector: 'app-local-storage',
  templateUrl: './local-storage.component.html',
  styleUrls: ['./local-storage.component.css']
})
export class LocalStorageComponent implements OnInit {

  constructor(private userService: UserService,
    private taskService: TaskService,
    private projectService: ProjectService) { }

  ngOnInit(): void {
  }
  onSaveDataClicked() {
    localStorage.clear();
    localStorage.setItem('users', JSON.stringify(this.userService.GetUsers()));
    localStorage.setItem('tasks', JSON.stringify(this.taskService.GetTasks()));
    localStorage.setItem('projects', JSON.stringify(this.projectService.GetProjects()));
  }
  onLoadDataClicked() {
    //#TODO - Show the error message on the page and not on console..
    if (!this.userService.LoadUsers(JSON.parse(localStorage.getItem('users')))){
        console.log("No users data found.");
      }
    if (!this.taskService.LoadTasks(JSON.parse(localStorage.getItem('tasks')))){
      console.log("No tasks data found.");
    }
    if (!this.projectService.LoadProjects(JSON.parse(localStorage.getItem('projects')))){
      console.log("No projects data found.");
    }
  }

}
