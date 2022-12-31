import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/Services/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userName:string | undefined;
  password:string | undefined;
  formData:FormGroup ;
  

  constructor(private authService:AuthService,private router : Router) { 

    this.formData = new FormGroup({
      userName: new FormControl(""),
      password: new FormControl(""),
   });
  }

  ngOnInit(): void {
 }

  onClickSubmit(data: any) {
    this.userName = data.userName;
    this.password = data.password;

   /* this.authService.login(this.userName, this.password)
       .subscribe( (data: any)  => { 
        console.log("Is Login Success: " + data); 
  
       if(data) this.router.navigate(['/']); 
  });*/

  if(this.authService.login(this.userName, this.password)=="true"){
    this.router.navigate(['/home'])
  }

 }

}
