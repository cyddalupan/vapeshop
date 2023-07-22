import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { PosComponent } from './pages/pos/pos.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { ItemComponent } from './pages/pos/item/item.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'inventory', component: InventoryComponent },

  // POS
  { path: 'pos', component: PosComponent },
  { path: 'item/:code', component: ItemComponent },

  { path: 'reports', component: ReportsComponent },

	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{ path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
