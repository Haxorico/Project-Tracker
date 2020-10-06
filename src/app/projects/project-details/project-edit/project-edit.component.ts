import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ProjectService } from '../../../shared/project.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import * as _ from "lodash";
import { User } from 'src/app/users/user.model';
import { UserService } from 'src/app/shared/user.service';
import { Project } from '../../project.model';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.css']
})
export class ProjectEditComponent implements OnInit {
  teamUsers : User[] = [];
  freeUsers : User[] = [];

  @ViewChild('f', { static: false }) editForm: NgForm;
  project: Project;
  submited: boolean = false;

  constructor(private projectService: ProjectService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    //get the project from the path
    this.route.params.subscribe(
      (params: Params) => {
        const id = params['id'];
        this.projectService.GetProjectById(id).subscribe(project => {
          this.project = project;
          this.userService.GetUsers().subscribe(data => {
            data.forEach(user => {
              if (_.find(this.project.team_members_ids, team_member => team_member == user.id)){
                this.teamUsers.push(user);
              }
              else{
                this.freeUsers.push(user);
              }
            });
          });
        });
      })
  }

  AddUserToTeam(user : User, index : number){
    this.teamUsers.push(user);
    this.freeUsers.splice(index,1);
  }
  RemoveUserFromTeam(user : User, index : number){
    this.freeUsers.push(user);
    this.teamUsers.splice(index,1);
  }
  onSubmitButtonClicked() {
    const team_ids = [];
    this.teamUsers.forEach(user => {
      team_ids.push(user.id);
    });
    this.project.team_members_ids = team_ids;
    this.project.name = this.editForm.value.name;
    this.project.type = this.editForm.value.type;
    this.project.logo = this.editForm.value.logo;
    this.project.client_name = this.editForm.value.client_name;
    this.project.start_date = this.editForm.value.start_date;
    this.project.end_date = this.editForm.value.end_date;
    this.project.description = this.editForm.value.description;
    this.projectService.UpdateProject(this.project);
    this.router.navigate(['../../'], { relativeTo: this.route })
  }
}
