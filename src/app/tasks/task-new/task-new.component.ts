import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/projects/project.model';
import { ProjectService } from 'src/app/shared/project.service';
import { TaskService } from '../../shared/task.service';

@Component({
  selector: 'app-task-new',
  templateUrl: './task-new.component.html',
  styleUrls: ['./task-new.component.css']
})
export class TaskNewComponent implements OnInit {
  public Projects: Project[];
  @ViewChild('f', { static: false }) newTaskForm: NgForm;
  constructor(private taskService: TaskService,
    private projectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    this.projectService.GetProjects().subscribe(projects => {
      this.Projects = projects;
      console.log(this.Projects);
    });
  }

  onSubmitButtonClicked() {
    this.taskService.NewTask({
      name: this.newTaskForm.value.name,
      project_id: this.newTaskForm.value.project,
      status: this.newTaskForm.value.status,
      type: this.newTaskForm.value.type,
      estimate: this.newTaskForm.value.estimate,
      start_date: this.newTaskForm.value.start_date,
      end_date: this.newTaskForm.value.end_date,
      description: this.newTaskForm.value.description
    });
    this.router.navigate(['../'], { relativeTo: this.route })
  }
}
