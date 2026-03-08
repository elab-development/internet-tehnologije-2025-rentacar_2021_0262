import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CarService } from '../../services/car.service';
import { ReviewService } from '../../services/review.service';
import { Car } from '../../models/car.model';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-car-reviews',
  templateUrl: './car-reviews.component.html',
  styleUrls: ['./car-reviews.component.css']
})
export class CarReviewsComponent implements OnInit {
  car: Car | null = null;
  reviews: Review[] = [];
  isLoadingCar = false;
  isLoadingReviews = false;
  carError = '';

  newRating = 0;
  newComment = '';
  submitMessage = '';
  submitError = '';
  isSubmitting = false;
  hoverRating = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private carService: CarService,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    const carId = this.route.snapshot.paramMap.get('id');
    if (carId) {
      this.loadCar(carId);
      this.loadReviews(carId);
    }
  }

  loadCar(carId: string) {
    this.isLoadingCar = true;
    this.carService.getCarById(carId).subscribe({
      next: (car) => {
        this.car = car;
        this.isLoadingCar = false;
      },
      error: () => {
        this.carError = 'Automobil nije pronađen.';
        this.isLoadingCar = false;
      }
    });
  }

  loadReviews(carId: string) {
    this.isLoadingReviews = true;
    this.reviewService.getReviewsByCarId(carId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.isLoadingReviews = false;
      },
      error: () => {
        this.isLoadingReviews = false;
      }
    });
  }

  setRating(rating: number) {
    this.newRating = rating;
  }

  getStars(rating: number): string[] {
    return Array.from({ length: 5 }, (_, i) => i < Math.floor(rating) ? 'full' : 'empty');
  }

  getInputStars(): string[] {
    const display = this.hoverRating || this.newRating;
    return Array.from({ length: 5 }, (_, i) => i < display ? 'full' : 'empty');
  }

  submitReview() {
    if (!this.car) return;
    if (this.newRating === 0) {
      this.submitError = 'Molimo izaberite ocenu.';
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';
    this.submitMessage = '';

    this.reviewService.createReview({
      carId: this.car._id,
      rating: this.newRating,
      comment: this.newComment
    }).subscribe({
      next: (response) => {
        this.submitMessage = 'Recenzija je poslata i čeka odobrenje administratora.';
        this.newRating = 0;
        this.newComment = '';
        this.isSubmitting = false;
      },
      error: (err) => {
        this.submitError = err.error?.message ?? 'Greška pri slanju recenzije.';
        this.isSubmitting = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
