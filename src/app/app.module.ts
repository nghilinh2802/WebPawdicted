import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environment';
import { LoginComponent } from './components/login/login.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoleManagementComponent } from './components/role-management/role-management.component';
import { AdminGuard } from './guards/admin.guard';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { OrderComponent } from './components/order/order.component';
import { OrderViewComponent } from './components/order-view/order-view.component';
import { OrderUpdateComponent } from './components/order-update/order-update.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    OrderComponent,
    OrderViewComponent,
    OrderUpdateComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    LoginComponent,
    RoleManagementComponent,
    RouterModule.forRoot(
      [
        { path: 'login', component: LoginComponent },
        { path: '', redirectTo: '/login', pathMatch: 'full' },
        { path: 'role-management', component: RoleManagementComponent, canActivate: [AdminGuard] },
        { path: 'order', component: OrderComponent },
        { path: 'order/:id', component: OrderViewComponent },
        { path: 'order-update/:id', component: OrderUpdateComponent },
      ]
    )
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}