import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AmazingSearchModule } from 'projects/amazing-search-core/src/lib/amazing-search.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, AmazingSearchModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
