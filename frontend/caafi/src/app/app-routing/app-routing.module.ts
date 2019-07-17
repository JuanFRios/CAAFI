import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { routes } from './routes';

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      {
        enableTracing: false // <-- debugging purposes only
      }
    )
  ],
  exports: [
    RouterModule
  ],
  providers: []
})
export class AppRoutingModule { }
