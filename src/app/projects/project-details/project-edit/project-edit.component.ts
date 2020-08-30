import { Component, OnInit, ViewChild } from '@angular/core';
import { Project } from '../../project.model';
import { NgForm } from '@angular/forms';
import { ProjectService } from '../../../../Shared/project.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css']
})
export class ProjectEditComponent implements OnInit {

  @ViewChild('f', { static: false }) editForm: NgForm;
  project : Project;
  submited : boolean = false;

  constructor(private projectService : ProjectService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    //get the project from the path
    this.route.params.subscribe(
      (params: Params) =>
      {
        const id = params['id'];
        this.project = this.projectService.GetProjectById(id);
      })
  }

  onSubmitButtonClicked()
  {
      const loc = this.projectService.GetProjectLoc(this.project);
      this.projectService.UpdateProject(loc,
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