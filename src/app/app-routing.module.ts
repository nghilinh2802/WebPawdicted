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
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
