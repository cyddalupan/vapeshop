import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { InventoryComponent } from './pages/inventory/inventory.component';
import { PosComponent } from './pages/pos/pos.component';
import { ReportsComponent } from './pages/reports/reports.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InventoryComponent,
    PosComponent,
    ReportsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
