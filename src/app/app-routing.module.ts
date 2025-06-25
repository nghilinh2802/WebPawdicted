import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RoleManagementComponent } from './components/role-management/role-management.component';
import { LoginComponent } from './components/login/login.component';
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
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ReportComponent } from './components/report/report.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { AdminGuard } from './guards/admin.guard';
import { FlashsaleManagementComponent } from './components/flashsale/flashsale.component';
import { ChatComponent } from './components/chat/chat.component';

const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'role-management', component: RoleManagementComponent, canActivate: [AdminGuard] },
  { path: 'sidebar', component: SidebarComponent },
  { path: 'order', component: OrderComponent, canActivate: [AdminGuard] },
  { path: 'order/:id', component: OrderViewComponent },
  { path: 'order-update/:id', component: OrderUpdateComponent },
  { path: 'blogs', component: BlogsComponent, canActivate: [AdminGuard] },
  { path: 'voucher-management', component: VoucherComponent, canActivate: [AdminGuard] },
  { path: 'promotion-management', component: PromotionsComponent, canActivate: [AdminGuard] },
  { path: 'product-management', component: ProductManagementComponent, canActivate: [AdminGuard] },
  { path: 'add-product', component: AddProductModalComponent },
  { path: 'edit-product/:id', component: EditProductModalComponent },
  { path: 'product-details/:id', component: ProductDetailsModalComponent },
  { path: 'flashsale', component: FlashsaleManagementComponent, canActivate: [AdminGuard]},
  { path: 'chat', component: ChatComponent, canActivate: [AdminGuard]},
  { path: 'navbar', component: NavbarComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'report', component: ReportComponent, canActivate: [AdminGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
