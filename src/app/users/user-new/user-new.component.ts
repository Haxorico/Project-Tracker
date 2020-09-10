import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../shared/user.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-new',
  templateUrl: './user-new.component.html',
  styleUrls: ['./user-new.component.css']
})
export class UserNewComponent implements OnInit {
  
  @ViewChild('f', { static: false }) newUserForm: NgForm;
  
 

  constructor(private userService : UserService,
    private route : ActivatedRoute,
    private router : Router) {}

  ngOnInit(): void {
    
    
    
  }
  onSubmitButtonClicked() {
    this.userService.NewUser(
    this.newUserForm.value.name,
    this.newUserForm.value.password,
    this.newUserForm.value.rank,
    this.newUserForm.value.photo,
    this.newUserForm.value.date_of_birth,
    this.newUserForm.value.location,
    this.newUserForm.value.address,
    this.newUserForm.value.skype,
    this.newUserForm.value.phone_number);
    
    this.router.navigate(['../'], {relativeTo : this.route})
  }

}
