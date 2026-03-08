import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ReviewService } from '../../services/review.service';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-admin-reviews',
  templateUrl: './admin-reviews.component.html',
  styleUrls: ['./admin-reviews.component.css']
})
export class AdminReviewsComponent implements OnInit {
  reviews: Review[] = [];
  isLoading = false;
  actionMessage = '';
  actionError = '';

  constructor(
    public authService: AuthService,
    private reviewService: ReviewService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/home']);
      return;
    }
    this.loadPending();
  }

  loadPending() {
    this.isLoading = true;
    this.reviewService.getPendingReviews().subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  approve(review: Review) {
    this.actionMessage = '';
    this.actionError = '';
    this.reviewService.approveReview(review._id).subscribe({
      next: (res) => {
        this.actionMessage = `Recenzija od ${review.userId.firstName} odobrena.`;
        this.reviews = this.reviews.filter(r => r._id !== review._id);
      },
      error: (err) => {
        this.actionError = err.error?.message ?? 'Greška pri odobravanju.';
      }
    });
  }

  reject(review: Review) {
    this.actionMessage = '';
    this.actionError = '';
    this.reviewService.rejectReview(review._id).subscribe({
      next: () => {
        this.actionMessage = `Recenzija od ${review.userId.firstName} odbijena.`;
        this.reviews = this.reviews.filter(r => r._id !== review._id);
      },
      error: (err) => {
        this.actionError = err.error?.message ?? 'Greška pri odbijanju.';
      }
    });
  }

  getStars(rating: number): string[] {
    return Array.from({ length: 5 }, (_, i) => i < rating ? 'full' : 'empty');
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
