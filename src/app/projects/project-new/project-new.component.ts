import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/shared/user.service';
import { User } from 'src/app/users/user.model';
import { ProjectService } from '../../shared/project.service';


@Component({
  selector: 'app-project-new',
  templateUrl: './project-new.component.html',
  styleUrls: ['./project-new.component.css']
})
export class ProjectNewComponent implements OnInit {

  freeUsers : User[];
  teamUsers : User[] = [];

  @ViewChild('f', {static: false}) newProjectForm: NgForm;
  constructor(private projectService : ProjectService,
    private userService : UserService,
    private route : ActivatedRoute,
    private router : Router) { }

  ngOnInit(): void {
    this.userService.GetUsers().subscribe(data => {
      this.freeUsers = data;
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
  onSubmitButtonClicked(){
    const team_ids = [];
    this.teamUsers.forEach(user => {
      team_ids.push(user.id);
    });
    this.projectService.AddNewProject({
    name : this.newProjectForm.value.name,
    type : this.newProjectForm.value.type,
    logo : this.newProjectForm.value.logo,
    client_name : this.newProjectForm.value.client_name,
    start_date : this.newProjectForm.value.start_date,
    end_date: this.newProjectForm.value.end_date,
    description: this.newProjectForm.value.description,
    team_members_ids: team_ids});
    this.router.navigate(['../'], {relativeTo : this.route});
  }
}
