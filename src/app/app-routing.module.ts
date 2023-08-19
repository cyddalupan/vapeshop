import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { PosComponent } from './pages/pos/pos.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { ItemComponent } from './pages/pos/receipt/item/item.component';
import { InventoryAddComponent } from './pages/inventory/inventory-add/inventory-add.component';
import { InventoryEditComponent } from './pages/inventory/inventory-edit/inventory-edit.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
	
	// Inventory
  { path: 'inventory', component: InventoryComponent },
  { path: 'inventory-add', component: InventoryAddComponent },
  { path: 'inventory-edit/:id', component: InventoryEditComponent },

  // POS
  { path: 'pos', component: PosComponent },
  { path: 'item', component: ItemComponent },

  { path: 'reports', component: ReportsComponent },

	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{ path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
