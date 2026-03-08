import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { HomeComponent } from './components/home/home.component';
import { CarReviewsComponent } from './components/car-reviews/car-reviews.component';
import { AdminReviewsComponent } from './components/admin-reviews/admin-reviews.component';
import { MyRentalsComponent } from './components/my-rentals/my-rentals.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'reviews/:id', component: CarReviewsComponent },
  { path: 'admin/reviews', component: AdminReviewsComponent },
  { path: 'my-rentals', component: MyRentalsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
