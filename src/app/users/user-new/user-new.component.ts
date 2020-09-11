import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../shared/user.service';
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
    this.userService.NewUser({
    name : this.newUserForm.value.name,
    password : this.newUserForm.value.password,
    rank : this.newUserForm.value.rank,
    photo : this.newUserForm.value.photo,
    date_of_birth : this.newUserForm.value.date_of_birth,
    location : this.newUserForm.value.location,
    address : this.newUserForm.value.address,
    skype : this.newUserForm.value.skype,
    phone_number : this.newUserForm.value.phone_number});
    
    this.router.navigate(['../'], {relativeTo : this.route})
  }

}
