import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnityNextPercentPipe } from './pipes/unity-next-percent.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    UnityNextPercentPipe
  ],
  declarations: [
    UnityNextPercentPipe
  ]
})
export class UnityNextPercentModule { }
