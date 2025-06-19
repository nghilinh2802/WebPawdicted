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
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { AddProductModalComponent } from './components/add-product-modal/add-product-modal.component';
import { EditProductModalComponent } from './components/edit-product-modal/edit-product-modal.component';
import { EditVariantModalComponent } from './components/edit-variant-modal/edit-variant-modal.component';
import { ProductDetailsModalComponent } from './components/product-details-modal/product-details-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
   
    
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    LoginComponent,
    RoleManagementComponent,
    ProductManagementComponent,
     AddProductModalComponent,
    EditProductModalComponent,
    EditVariantModalComponent,
    ProductDetailsModalComponent,
    
    RouterModule.forRoot(
      [
        { path: 'login', component: LoginComponent },
        { path: '', redirectTo: '/login', pathMatch: 'full' },
        { path: 'role-management', component: RoleManagementComponent, canActivate: [AdminGuard] },
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