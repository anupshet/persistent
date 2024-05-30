import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicRoutingModule } from './public-routing.module';
import { PageNotFoundComponent } from './pages/page-not-found.component';


@NgModule({
  imports: [
    CommonModule,
    PublicRoutingModule
  ],
  declarations: [PageNotFoundComponent]
})
export class PublicModule { }
