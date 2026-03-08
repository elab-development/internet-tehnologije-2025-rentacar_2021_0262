import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

export interface CreateRentalDto {
  carId: string;
  startDate: string;
  endDate: string;
}

export interface Rental {
  _id: string;
  userId: any;
  carId: any;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'reserved' | 'active' | 'returned';
  createdAt: string;
}

export interface RentalResponse {
  message: string;
  rental: Rental;
}

@Injectable({
  providedIn: 'root'
})
export class RentalService {
  private apiUrl = 'http://localhost:3000/api/rentals';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  createRental(data: CreateRentalDto): Observable<RentalResponse> {
    return this.http.post<RentalResponse>(this.apiUrl, data, {
      headers: this.getAuthHeaders()
    });
  }

  getMyRentals(): Observable<Rental[]> {
    return this.http.get<Rental[]>(`${this.apiUrl}/my`, {
      headers: this.getAuthHeaders()
    });
  }
}
