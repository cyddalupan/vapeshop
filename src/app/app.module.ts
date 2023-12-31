import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { PosComponent } from './pages/pos/pos.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { inventoryReducer } from './pages/inventory/store/inventory.reducer';
import { ItemComponent } from './pages/pos/receipt/item/item.component';
import { InventoryAddComponent } from './pages/inventory/inventory-add/inventory-add.component';
import { InventoryEditComponent } from './pages/inventory/inventory-edit/inventory-edit.component';
import { ReceiptComponent } from './pages/pos/receipt/receipt.component';
import { DatePipe } from '@angular/common';

import { appReducer } from './store/app.reducer';
import { receiptReducer } from './pages/pos/store/receipt.reducer';
import { orderReducer } from './pages/pos/store/order.reducer';
import { TableViewComponent } from './pages/reports/table-view/table-view.component';
import { ExtraComponent } from './pages/extra/extra.component';
import { EffectsModule } from '@ngrx/effects';
import { InventoryEffects } from './pages/inventory/store/inventory.effects';
import { ReceiptEffects } from './pages/pos/store/receipt.effects';
import { OrderEffects } from './pages/pos/store/order.effects';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InventoryComponent,
    PosComponent,
    ReportsComponent,
    ItemComponent,
    InventoryAddComponent,
    InventoryEditComponent,
    ReceiptComponent,
    TableViewComponent,
    ExtraComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({
			app: appReducer,
      inventory: inventoryReducer,
      receipts: receiptReducer,
      orders: orderReducer
    }),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    EffectsModule.forRoot(InventoryEffects, ReceiptEffects, OrderEffects),
    HttpClientModule,
		ReactiveFormsModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
