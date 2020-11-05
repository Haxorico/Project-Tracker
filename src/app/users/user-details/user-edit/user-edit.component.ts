import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { User } from '../../user.model';
import { Project } from 'src/app/projects/project.model';
import { UserService } from '../../../shared/user.service';
import { ProjectService } from '../../../shared/project.service';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  @ViewChild('f', { static: false }) editForm: NgForm;

  userBeingEdited: User;
  loggedUser: User;
  userProjects: Project[];
  submited: boolean = false;
  constructor(private userService: UserService,
    private ProjectService: ProjectService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    //get the user from the path
    this.route.params.subscribe(
      (params: Params) => {
        const id = params['id'];
        this.userService.GetUserById(id).subscribe(user => {
          this.userBeingEdited = user;
          this.ProjectService.GetProjectsWithUserId(user.id).subscribe((projects: any) => {
            this.userProjects = projects;
          });
        });
      })
    this.loggedUser = this.userService.GetCurrentUser();
  }
  onSubmitButtonClicked() {
    let rank = this.editForm.value.rank;
    // do not allow users edit those who are a higher rank
    if (this.userBeingEdited.rank > this.loggedUser.rank) {
      this.router.navigate(['../../'], { relativeTo: this.route })
      return;
    }
    // make sure you cant give someone a higher rank than you posses
    if (rank > this.loggedUser.rank)
      rank = this.userBeingEdited.rank;

    this.userBeingEdited.name = this.editForm.value.name;
    this.userBeingEdited.password = Md5.hashStr(this.editForm.value.password).toString();
    this.userBeingEdited.photo = this.editForm.value.photo;
    this.userBeingEdited.date_of_birth = this.editForm.value.date_of_birth;
    this.userBeingEdited.location = this.editForm.value.location;
    this.userBeingEdited.address = this.editForm.value.address;
    this.userBeingEdited.skype = this.editForm.value.skype;
    this.userBeingEdited.phone_number = this.editForm.value.phone_number;
    this.userBeingEdited.rank = rank;
    this.userService.UpdateUser(this.userBeingEdited);
    this.router.navigate(['../../'], { relativeTo: this.route })
  }
}
