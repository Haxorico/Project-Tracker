import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../users/user.model';
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
    private router: Router,
    protected alertService: AlertService) { }

  ngOnInit(): void {
    /* if (this.userService.GetCurrentUser() != this.loginService.GetGuestUser()){
      this.loginService.Logout();
      this.router.navigate(['/']);
    } */
  }
  async onSubmitButtonClicked() {
    const options = {
      autoClose: true,
      keepAfterRouteChange: false
    };
    const name = this.loginForm.value.name;
    const pw = this.loginForm.value.password;
    this.loginService.Login(name, pw).subscribe(data => {
      if (data){
        this.router.navigate(['/']);
        this.alertService.success("Login Success", options);
      }
      else{
        this.alertService.error("Login error", options);
      }
    });
    /* this.loginService.Login(name, pw).then(data => {
      if (data) {
        this.router.navigate(['/']);
        this.alertService.success("Login Success", options);
      }
      else
        this.alertService.error("Login error", options);
    }).catch(err => {
      this.alertService.error(err, options);
    }); */
  }
}
