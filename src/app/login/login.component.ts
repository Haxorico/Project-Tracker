import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from './login.service';
import { User } from '../users/user.model';
import { Router } from '@angular/router';
import { UserService } from '../users/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  @ViewChild('f', { static: false }) loginForm: NgForm;
  
  loginUser : User;
  submited : boolean = false;
  loginMessage : string;
  constructor(private loginService : LoginService,
    private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
    /* if (this.loginService.loggedUser != this.loginService.GetGuestUser()) */
    if (this.userService.GetCurrentUser() != this.loginService.GetGuestUser())
    {
      this.loginService.Logout();
      this.router.navigate(['/']);
    }
  }
  onSubmitButtonClicked()
  {
    this.submited=true;
    //name is not case-sensitive but password is.
    const name = this.loginForm.value.name.toLowerCase();
    const pw = this.loginForm.value.password;
    if (this.loginService.Login(name,pw))
    {
      this.router.navigate(['/']);
    } 
    
  }
}
