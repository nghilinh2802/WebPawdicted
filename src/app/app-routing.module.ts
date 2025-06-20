import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoleManagementComponent } from './components/role-management/role-management.component';
import { LoginComponent } from './components/login/login.component';
import { DataComponent } from './components/data/data.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { OrderComponent } from './components/order/order.component';
import { OrderViewComponent } from './components/order-view/order-view.component';
import { OrderUpdateComponent } from './components/order-update/order-update.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { VoucherComponent } from './components/voucher/voucher.component';
import { PromotionsComponent } from './components/promotions/promotions.component';

import { ProductManagementComponent } from './components/product-management/product-management.component'; 
import { AddProductModalComponent } from './components/add-product-modal/add-product-modal.component';
import { EditProductModalComponent } from './components/edit-product-modal/edit-product-modal.component';
import { ProductDetailsModalComponent } from './components/product-details-modal/product-details-modal.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: 'data', component: DataComponent },
  { path: 'login', component: LoginComponent },
  { path: 'role-management', component: RoleManagementComponent, canActivate: [AdminGuard] },
  { path: 'sidebar', component: SidebarComponent },
  { path: 'order', component: OrderComponent },
  { path: 'order/:id', component: OrderViewComponent },
  { path: 'order-update/:id', component: OrderUpdateComponent },
  { path: 'blogs', component: BlogsComponent },
  { path: 'voucher-management', component: VoucherComponent },
  { path: 'promotion-management', component: PromotionsComponent },
  { path: 'product-management', component: ProductManagementComponent },
  { path: 'add-product', component: AddProductModalComponent },
  { path: 'edit-product/:id', component: EditProductModalComponent },
  { path: 'product-details/:id', component: ProductDetailsModalComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
