import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {  HomeComponent } from './Components/home/home.component';

//import {HomeComponent} from './Components/navbarBefore/home.component';


import { Guard1Guard } from './Guards/guard-1.guard';
import { AppComponent } from './app.component';
import { AddQuestionComponent } from './Components/add-question/add-question.component';
import { AdminComponent } from './Components/admin/admin.component';
import { StartTestComponent } from './Components/start-test/start-test.component';
import { RegisterComponent } from './Components/register/register.component';
import { LoginComponent } from './Components/login/login.component';

const routes: Routes = [
  {
    path:'home',
    redirectTo:"",
    component:HomeComponent,
    //canActivate:[Guard1Guard]
  },
  {
    path:'app',
    component:AppComponent
  },
  {
    path:'Admin',
    component:AdminComponent,
    canActivate:[Guard1Guard]
  },
  {
    path:"",
    component:HomeComponent
  },
  {
    path:'register',
    component:RegisterComponent
  },
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:"start-test/:subject",
    component:StartTestComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
