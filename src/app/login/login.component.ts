import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from '../../Shared/login.service';
import { User } from '../users/user.model';
import { Router } from '@angular/router';
import { UserService } from '../../Shared/user.service';

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
    if (this.userService.GetCurrentUser() != this.loginService.GetGuestUser())
    {
      this.loginService.Logout();
      this.router.navigate(['/']);
    }
  }
  onSubmitButtonClicked() {
    const name = this.loginForm.value.name;
    const pw = this.loginForm.value.password;
    console.log(pw);
    if (this.loginService.Login(name,pw)){
      this.router.navigate(['/']);
    }

  }
}
