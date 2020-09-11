import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProjectService } from '../../shared/project.service';


@Component({
  selector: 'app-project-new',
  templateUrl: './project-new.component.html',
  styleUrls: ['./project-new.component.css']
})
export class ProjectNewComponent implements OnInit {

  @ViewChild('f', {static: false}) newProjectForm: NgForm;
  constructor(private projectService : ProjectService) { }

  ngOnInit(): void {
  }
  onSubmitButtonClicked(){
    this.projectService.AddNewProject({
    name : this.newProjectForm.value.name,
    type : this.newProjectForm.value.type,
    logo : this.newProjectForm.value.logo,
    client_name : this.newProjectForm.value.client_name,
    start_date : this.newProjectForm.value.start_date,
    end_date: this.newProjectForm.value.end_date,
    description: this.newProjectForm.value.description,
    team_members: this.newProjectForm.value.team_members});
  }
}
