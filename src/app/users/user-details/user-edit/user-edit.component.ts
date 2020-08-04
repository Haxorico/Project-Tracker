import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../../user.model';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../user.service';
import { LoginService } from 'src/app/login/login.service';




@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  @ViewChild('f', { static: false }) editForm: NgForm;

  user: User;
  userId: number;
  submited: boolean = false;
  logedUser: User;

  constructor(private userService: UserService,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {

    //get the user from the path
    this.route.params.subscribe(
      (params: Params) => {
        this.userId = params['id'];
        this.user = this.userService.GetUserById(this.userId);
      }
    )
    this.logedUser = this.loginService.GetLogedUser();

  }
  onSubmitButtonClicked() {
    let rank = this.editForm.value.rank;
    
    // do no allow users edit those who are a higher rank
    if (this.user.rank > this.logedUser.rank)
    {

      this.router.navigate(['../../'], { relativeTo: this.route })
      return;
    } 
    // make sure you cant give someone a higher rank than you posses
    if (rank > this.logedUser.rank)
      rank = this.user.rank;
    let loc = this.userService.GetLocById(this.userId);
    this.userService.UpdateUser(loc,
      this.editForm.value.name,
      this.editForm.value.password,
      rank,
      this.editForm.value.photo,
      this.editForm.value.date_of_birth,
      this.editForm.value.location,
      this.editForm.value.address,
      this.editForm.value.skype,
      this.editForm.value.phone_number);

    this.router.navigate(['../../'], { relativeTo: this.route })
  }
}
