import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './pages/page-not-found.component';
import { LoginComponent } from '../shared/login/login.component';

const routes: Routes = [
  { path: 'not-found', component: PageNotFoundComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule { }
