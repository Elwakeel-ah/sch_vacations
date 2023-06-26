import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VacationTypeComponent } from './vacation-type/vacation-type.component';
import { CreateRequestComponent } from './create-request/create-request.component';
import { VacationBalanceComponent } from './vacation-balance/vacation-balance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    VacationTypeComponent,
    CreateRequestComponent,
    VacationBalanceComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
