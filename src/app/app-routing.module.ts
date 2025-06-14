import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CheckFirebaseComponent } from './check-firebase/check-firebase.component'; 

const routes: Routes = [

    { path: '', component: CheckFirebaseComponent }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
