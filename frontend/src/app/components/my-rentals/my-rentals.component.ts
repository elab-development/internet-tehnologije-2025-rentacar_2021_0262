import { Component, OnInit } from '@angular/core';
import { RentalService, Rental } from '../../services/rental.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-my-rentals',
  templateUrl: './my-rentals.component.html',
  styleUrls: ['./my-rentals.component.css']
})
export class MyRentalsComponent implements OnInit {
  rentals: Rental[] = [];
  isLoading = false;
  errorMessage = '';

  readonly statusLabels: Record<string, string> = {
    reserved: 'Rezervisano',
    active: 'Aktivno',
    returned: 'Vraćeno'
  };

  constructor(
    private rentalService: RentalService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadRentals();
  }

  get pageTitle(): string {
    return this.authService.isAdmin() ? 'Rezervacije' : 'Moje rezervacije';
  }

  loadRentals() {
    this.isLoading = true;
    this.errorMessage = '';

    const request$ = this.authService.isAdmin()
      ? this.rentalService.getAllRentals()
      : this.rentalService.getMyRentals();

    request$.subscribe({
      next: (rentals) => {
        this.rentals = rentals;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Greška pri učitavanju rezervacija. Pokušajte ponovo.';
        this.isLoading = false;
      }
    });
  }

  getStatusLabel(status: string): string {
    return this.statusLabels[status] ?? status;
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
}
