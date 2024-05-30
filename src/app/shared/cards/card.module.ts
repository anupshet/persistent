import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { StoreModule } from '@ngrx/store';

import { CardComponent } from './card.component';

@NgModule({
  declarations: [CardComponent],
  imports: [
    CommonModule,
    MatExpansionModule,
    StoreModule.forRoot({})
  ],
  exports: [CardComponent]
})
export class BrCard { }
