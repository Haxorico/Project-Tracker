import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TaskService } from '../../shared_temp/task.service';

@Component({
  selector: 'app-task-new',
  templateUrl: './task-new.component.html',
  styleUrls: ['./task-new.component.css']
})
export class TaskNewComponent implements OnInit {

  @ViewChild('f', {static: false}) newTaskForm: NgForm;
  constructor(private taskService : TaskService) { }

  ngOnInit(): void {
  }
  onSubmitButtonClicked(){
    this.taskService.NewTask(
    this.newTaskForm.value.name,
    null,
    this.newTaskForm.value.status,
    this.newTaskForm.value.type,
    this.newTaskForm.value.estimate,
    this.newTaskForm.value.start_date,
    this.newTaskForm.value.end_date,
    this.newTaskForm.value.description,
    null,null);
  }
}
