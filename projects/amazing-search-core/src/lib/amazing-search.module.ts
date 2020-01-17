import { NgModule } from '@angular/core';
import { AmazingSearchComponent } from './amazing-search.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [FormsModule, CommonModule, NoopAnimationsModule],
  declarations: [AmazingSearchComponent],
  exports: [AmazingSearchComponent]
})
export class AmazingSearchModule {}
