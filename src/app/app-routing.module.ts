import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {RegisterComponent} from "./pages/register/register.component";
import {HomeComponent} from "./pages/home/home.component";
import {AuthGuard} from "@angular/fire/auth-guard";

const routes: Routes = [
  {
    path : 'login',
    component : LoginComponent
  },
  {
    path:'register',
    component : RegisterComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: '',redirectTo: 'login', pathMatch: 'full'
  },
  {
    path: '', component: HomeComponent, canActivate: [AuthGuard]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
