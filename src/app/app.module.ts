import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';



import { NavbarComponent } from './Components/navbar/navbar.component';
import { HomeComponent } from './Components/home/home.component';
import { AdminComponent } from './Components/admin/admin.component';
import { AddQuestionComponent } from './Components/add-question/add-question.component';




@NgModule({
  declarations: [
    AppComponent,
   HomeComponent,
 
    NavbarComponent,
      AdminComponent,
      AddQuestionComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,

    ReactiveFormsModule,
    AppRoutingModule,
 
    
  ],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
