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
    const index = this.taskService.GetTaskIndex(this.task);
    this.task.name = this.editForm.value.name;
    this.task.status = this.editForm.value.status
    this.task.type = this.editForm.value.type;
    this.task.estimate = this.editForm.value.estimate;
    this.task.start_date = this.editForm.value.start_date;
    this.task.end_date = this.editForm.value.end_date;
    this.task.description = this.editForm.value.description;
    this.task.user = this.task.user;
    this.task.reporter = this.task.reporter;
    this.taskService.UpdateTask(this.task);
    this.router.navigate(['../../'], {relativeTo : this.route})
  }
}