import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../../user.model';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../shared/user.service';
import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  @ViewChild('f', { static: false }) editForm: NgForm;

  editingUser: User;
  submited: boolean = false;
  loggedUser: User;
  constructor(private userService: UserService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    //get the user from the path
    this.route.params.subscribe(
      (params: Params) => {
        const id = params['id'];
        this.editingUser = this.userService.GetUserById(id);
      })
      this.loggedUser = this.userService.GetCurrentUser();
  }
  onSubmitButtonClicked() {
    let rank = this.editForm.value.rank;
    // do not allow users edit those who are a higher rank
    if (this.editingUser.rank > this.loggedUser.rank) {
      this.router.navigate(['../../'], { relativeTo: this.route })
      return;
    } 
    // make sure you cant give someone a higher rank than you posses
    if (rank > this.loggedUser.rank)
      rank = this.editingUser.rank;
      
    this.editingUser.name = this.editForm.value.name;
    this.editingUser.password = Md5.hashStr(this.editForm.value.password).toString();
    this.editingUser.photo = this.editForm.value.photo;
    this.editingUser.date_of_birth = this.editForm.value.date_of_birth;
    this.editingUser.location = this.editForm.value.location;
    this.editingUser.address = this.editForm.value.address;
    this.editingUser.skype = this.editForm.value.skype;
    this.editingUser.phone_number = this.editForm.value.phone_number;
    this.editingUser.rank = rank;
    this.userService.UpdateUser(this.editingUser);
    this.router.navigate(['../../'], { relativeTo: this.route })
  }
}
