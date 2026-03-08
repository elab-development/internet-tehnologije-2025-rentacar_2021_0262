import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review, CreateReviewDto } from '../models/review.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:3000/api/reviews';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getReviewsByCarId(carId: string): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}?carId=${carId}`);
  }

  createReview(data: CreateReviewDto): Observable<{ message: string; review: Review }> {
    return this.http.post<{ message: string; review: Review }>(this.apiUrl, data, {
      headers: this.getAuthHeaders()
    });
  }

  getPendingReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/pending`, {
      headers: this.getAuthHeaders()
    });
  }

  approveReview(id: string): Observable<{ message: string; review: Review }> {
    return this.http.put<{ message: string; review: Review }>(`${this.apiUrl}/${id}/approve`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  rejectReview(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}/reject`, {
      headers: this.getAuthHeaders()
    });
  }
}
