import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { AdminComponent } from './components/admin/admin.component';
import { AddQuestionComponent } from './components/add-question/add-question.component';
import { StartTestComponent } from './components/start-test/start-test.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { GameComponent } from './components/game/game.component';
import { WebSocketService } from './services/web-socket-service/web-socket.service';
import { StartGameComponent } from './components/game/start-game/start-game.component';
import { CountdownComponent } from './countdown/countdown.component';
import { ListPlayersComponent } from './components/game/list-players/list-players.component';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    AdminComponent,
    AddQuestionComponent,
    StartTestComponent,
    RegisterComponent,
    LoginComponent,
    GameComponent,
    StartGameComponent,
    CountdownComponent,
    ListPlayersComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [WebSocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
