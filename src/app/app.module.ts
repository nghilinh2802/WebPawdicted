import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { provideHttpClient } from '@angular/common/http';
import { QuillModule } from 'ngx-quill';

import { environment } from '../environment';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './components/login/login.component';
import { RoleManagementComponent } from './components/role-management/role-management.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { AddProductModalComponent } from './components/add-product-modal/add-product-modal.component';
import { EditProductModalComponent } from './components/edit-product-modal/edit-product-modal.component';
import { ProductDetailsModalComponent } from './components/product-details-modal/product-details-modal.component';
import { OrderComponent } from './components/order/order.component';
import { OrderViewComponent } from './components/order-view/order-view.component';
import { OrderUpdateComponent } from './components/order-update/order-update.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { VoucherComponent } from './components/voucher/voucher.component';
import { PromotionsComponent } from './components/promotions/promotions.component';
import { FlashsaleManagementComponent } from './components/flashsale/flashsale.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReportComponent } from './components/report/report.component';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    NavbarComponent,
    LoginComponent,
    RoleManagementComponent,
    OrderComponent,
    OrderViewComponent,
    OrderUpdateComponent,
    BlogsComponent,
    VoucherComponent,
    PromotionsComponent,
    FlashsaleManagementComponent,
    DashboardComponent,
    ReportComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    ProductManagementComponent,
    AddProductModalComponent,
    EditProductModalComponent,
    ProductDetailsModalComponent,
    QuillModule.forRoot()
  ],
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    provideStorage(() => getStorage()),
    provideDatabase(() => getDatabase()),
    provideHttpClient(),
    { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
