import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { Guard1Guard } from './guards/guard-1.guard';
import { AppComponent } from './app.component';
import { AdminComponent } from './components/admin/admin.component';
import { StartTestComponent } from './components/start-test/start-test.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { GameComponent } from './components/game/game.component';
import { StartGameComponent } from './components/game/start-game/start-game.component';

const routes: Routes = [
  {
    path: 'home',
    redirectTo: "",
    component: HomeComponent,
    //canActivate:[Guard1Guard]
  },
  {
    path: 'app',
    component: AppComponent
  },
  {
    path: 'Admin',
    component: AdminComponent,
    canActivate: [Guard1Guard]
  },
  {
    path: "",
    component: HomeComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: "start-test/:subject",
    component: StartTestComponent
  },
  {
    path: "game/:gameId",
    component: StartGameComponent
  },
  {
    path: "game",
    component: GameComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
