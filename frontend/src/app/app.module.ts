import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { CarReviewsComponent } from './components/car-reviews/car-reviews.component';
import { AdminReviewsComponent } from './components/admin-reviews/admin-reviews.component';
import { FuelTypePipe } from './pipes/fuel-type.pipe';
import { HighlightDirective } from './directives/highlight.directive';
import { CarCardComponent } from './components/car-card/car-card.component';
import { MyRentalsComponent } from './components/my-rentals/my-rentals.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    CarReviewsComponent,
    AdminReviewsComponent,
    FuelTypePipe,
    HighlightDirective,
    CarCardComponent,
    MyRentalsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
