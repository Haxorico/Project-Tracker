import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TaskService } from '../../shared/task.service';

@Component({
  selector: 'app-task-new',
  templateUrl: './task-new.component.html',
  styleUrls: ['./task-new.component.css']
})
export class TaskNewComponent implements OnInit {

  @ViewChild('f', {static: false}) newTaskForm: NgForm;
  constructor(private taskService : TaskService) { }

  ngOnInit(): void {}
  
  onSubmitButtonClicked(){
    this.taskService.NewTask({
    name : this.newTaskForm.value.name,
    status : this.newTaskForm.value.status,
    type : this.newTaskForm.value.type,
    estimate : this.newTaskForm.value.estimate,
    start_date : this.newTaskForm.value.start_date,
    end_date : this.newTaskForm.value.end_date,
    description : this.newTaskForm.value.description
  });
  }
}
