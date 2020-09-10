import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NgForm } from '@angular/forms';

import { ProjectService } from '../../../shared/project.service';


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
  onSubmitButtonClicked()
  {
    this.projectService.AddNewProject(
    this.newProjectForm.value.name,
    this.newProjectForm.value.type,
    this.newProjectForm.value.logo,
    this.newProjectForm.value.client_name,
    this.newProjectForm.value.start_date,
    this.newProjectForm.value.end_date,
    this.newProjectForm.value.description,
    this.newProjectForm.value.team_members);
  }
}
