import { NgModule } from '@angular/core';
import { AmazingSearchComponent } from './amazing-search.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TrackFocusDirective } from './track-focus.directive';

@NgModule({
  imports: [FormsModule, CommonModule],
  declarations: [AmazingSearchComponent, TrackFocusDirective],
  exports: [AmazingSearchComponent]
})
export class AmazingSearchModule {}
