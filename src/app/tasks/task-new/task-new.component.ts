import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/projects/project.model';
import { ProjectService } from 'src/app/shared/project.service';
import { UserService } from 'src/app/shared/user.service';
import { User } from 'src/app/users/user.model';
import { TaskService } from '../../shared/task.service';

@Component({
  selector: 'app-task-new',
  templateUrl: './task-new.component.html',
  styleUrls: ['./task-new.component.css']
})
export class TaskNewComponent implements OnInit {
  public Projects: Project[];
  public Members: User[];

  @ViewChild('f', { static: false }) newTaskForm: NgForm;
  constructor(private taskService: TaskService,
    private projectService: ProjectService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    this.projectService.GetProjects().subscribe(projects => {
      this.Projects = projects;
    });
  }

  onProjectChanged(index : number){
    const selected_project = this.Projects[index];
    //load team members
    this.Members = [];
    selected_project.team_members_ids.forEach(member => {
      this.userService.GetUserById(member).subscribe(data =>{
        this.Members.push(data);
      });
    });
  }

  onSubmitButtonClicked() {
    const index = this.newTaskForm.value.project;
    const projID = this.Projects[index].id;
    this.taskService.NewTask({
      name: this.newTaskForm.value.name,
      project_id: projID,
      status: this.newTaskForm.value.status,
      type: this.newTaskForm.value.type,
      estimate: this.newTaskForm.value.estimate,
      worker_id : this.newTaskForm.value.worker,
      reporter_id : this.newTaskForm.value.reporter,
      start_date: this.newTaskForm.value.start_date,
      end_date: this.newTaskForm.value.end_date,
      description: this.newTaskForm.value.description
    });
    this.router.navigate(['../'], { relativeTo: this.route })
  }
}
