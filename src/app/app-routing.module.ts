import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {  HomeComponent } from './Components/home/home.component';

//import {HomeComponent} from './Components/navbarBefore/home.component';


import { Guard1Guard } from './Guards/guard-1.guard';
import { AppComponent } from './app.component';
import { AddQuestionComponent } from './Components/add-question/add-question.component';
import { AdminComponent } from './Components/admin/admin.component';

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
    component:AdminComponent
  },
  {
    path:"",
    component:HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
