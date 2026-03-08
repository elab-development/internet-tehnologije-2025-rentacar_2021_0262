import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CarService } from '../../services/car.service';
import { RentalService } from '../../services/rental.service';
import { CategoryService } from '../../services/category.service';
import { Car } from '../../models/car.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  allCars: Car[] = [];
  cars: Car[] = [];
  categories: Category[] = [];
  selectedCategoryId: string | null = null;
  isLoading = false;
  errorMessage = '';

  selectedCar: Car | null = null;
  rentalStartDate = '';
  rentalEndDate = '';
  rentalMessage = '';
  rentalError = '';
  isRenting = false;

  readonly fuelTypeLabels: Record<string, string> = {
    diesel: 'Dizel',
    petrol: 'Benzin',
    hybrid: 'Hibrid'
  };

  readonly transmissionLabels: Record<string, string> = {
    manual: 'Manuelni',
    automatic: 'Automatik'
  };

  constructor(
    public authService: AuthService,
    private carService: CarService,
    private rentalService: RentalService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.loadCars();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe({
      next: (cats) => { this.categories = cats; },
      error: () => {}
    });
  }

  loadCars() {
    this.isLoading = true;
    this.errorMessage = '';
    this.carService.getCars().subscribe({
      next: (cars) => {
        this.allCars = cars;
        this.applyFilter();
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Greška pri učitavanju automobila. Pokušajte ponovo.';
        this.isLoading = false;
      }
    });
  }

  filterByCategory(categoryId: string | null) {
    this.selectedCategoryId = categoryId;
    this.applyFilter();
  }

  applyFilter() {
    if (!this.selectedCategoryId) {
      this.cars = this.allCars;
    } else {
      this.cars = this.allCars.filter(c => c.categoryId === this.selectedCategoryId);
    }
  }

  getStars(rating: number): string[] {
    const full = Math.floor(rating);
    const stars: string[] = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < full ? 'full' : 'empty');
    }
    return stars;
  }

  goToReviews(car: Car, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/reviews', car._id]);
  }

  getFuelLabel(fuelType: string): string {
    return this.fuelTypeLabels[fuelType] ?? fuelType;
  }

  getTransmissionLabel(transmission: string): string {
    return this.transmissionLabels[transmission] ?? transmission;
  }

  openRentModal(car: Car) {
    if (!this.authService.isLoggedIn()) {
      alert('Morate biti ulogovani da biste iznajmili automobil!');
      return;
    }
    if (!car.available) {
      alert('Ovaj automobil nije dostupan za iznajmljivanje.');
      return;
    }
    this.selectedCar = car;
    this.rentalStartDate = '';
    this.rentalEndDate = '';
    this.rentalMessage = '';
    this.rentalError = '';
  }

  closeRentModal() {
    this.selectedCar = null;
  }

  confirmRent() {
    if (!this.selectedCar || !this.rentalStartDate || !this.rentalEndDate) {
      this.rentalError = 'Molimo izaberite datume iznajmljivanja.';
      return;
    }

    this.isRenting = true;
    this.rentalError = '';
    this.rentalMessage = '';

    this.rentalService.createRental({
      carId: this.selectedCar._id,
      startDate: this.rentalStartDate,
      endDate: this.rentalEndDate
    }).subscribe({
      next: (response) => {
        this.rentalMessage = `Uspešno rezervisano: ${this.selectedCar!.brand} ${this.selectedCar!.model}`;
        this.isRenting = false;
        this.loadCars();
        setTimeout(() => this.closeRentModal(), 1500);
      },
      error: (err) => {
        this.rentalError = err.error?.message ?? 'Greška pri rezervaciji. Pokušajte ponovo.';
        this.isRenting = false;
      }
    });
  }

  editCar(car: Car) {
    alert(`Izmena automobila: ${car.brand} ${car.model}`);
  }

  addNewCar() {
    alert('Funkcionalnost dodavanja automobila je u pripremi.');
  }

  get todayDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}
