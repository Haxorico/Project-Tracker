import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../users/user.model';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';
import { LoginService } from '../shared/login.service';
import { AlertService } from '../_alert';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  @ViewChild('f', { static: false }) loginForm: NgForm;
  
  loginUser : User;
  loginMessage : string;
  constructor(private loginService : LoginService,
    private userService: UserService,
    private router: Router,
    protected alertService: AlertService) { }

  ngOnInit(): void {
    if (this.userService.GetCurrentUser() != this.loginService.GetGuestUser()){
      this.loginService.Logout();
      this.router.navigate(['/']);
    }
  }
  onSubmitButtonClicked() {
    const options = {
      autoClose: true,
    keepAfterRouteChange: false
  };
    const name = this.loginForm.value.name;
    const pw = this.loginForm.value.password;
    if (this.loginService.Login(name,pw)){
      this.router.navigate(['/']);  
      this.alertService.success("Login Success",options);
    }
    else 
      this.alertService.error('Wrong username or password',options);

  }
}
