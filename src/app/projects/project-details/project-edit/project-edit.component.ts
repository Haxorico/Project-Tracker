import { Component, OnInit, ViewChild } from '@angular/core';
import { Project } from '../../project.model';
import { NgForm } from '@angular/forms';
import { ProjectService } from '../../project.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css']
})
export class ProjectEditComponent implements OnInit {

  @ViewChild('f', { static: false }) editForm: NgForm;
  project : Project;
  projectLoc : number;
  submited : boolean = false;

  constructor(private projectService : ProjectService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    //get the project from the path
    this.route.params.subscribe(
      (params: Params) =>
      {
        this.projectLoc = params['id'];
        this.project = this.projectService.GetProjectByLoc(this.projectLoc);
      })
  }

  onSubmitButtonClicked()
  {
      this.projectService.UpdateProject(this.projectLoc,
      this.editForm.value.name,
      this.editForm.value.type,
      this.editForm.value.logo,
      this.editForm.value.client_name,
      this.editForm.value.start_date,
      this.editForm.value.end_date,
      this.editForm.value.description,
      this.editForm.value.team_members);
      
      this.router.navigate(['../../'], {relativeTo : this.route})
  }
}