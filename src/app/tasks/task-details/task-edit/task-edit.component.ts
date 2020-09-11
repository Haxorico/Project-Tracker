import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Task } from '../../task.model';
import { TaskService } from '../../../shared/task.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.css']
})
export class TaskEditComponent implements OnInit {

  @ViewChild('f', { static: false }) editForm: NgForm;
  task : Task;
  submited : boolean = false;

  constructor(
    private taskService : TaskService,
    private route : ActivatedRoute,
    private router : Router
  ) { }

  ngOnInit(): void {
    
    //get the task from the path
    this.route.params.subscribe(
      (params: Params) =>{
        const id = params['id'];
        this.task = this.taskService.GetTaskById(id);
      })
  }
  onSubmitButtonClicked(){
    const loc = this.taskService.GetTaskLoc(this.task);
      this.taskService.UpdateTask(loc,
      this.editForm.value.name,
      this.task.project,
      this.editForm.value.status,
      this.editForm.value.type,
      this.editForm.value.estimate,
      this.editForm.value.start_date,
      this.editForm.value.end_date,
      this.editForm.value.description,
      this.task.user,
      this.task.reporter);
      
      this.router.navigate(['../../'], {relativeTo : this.route})
  }
}