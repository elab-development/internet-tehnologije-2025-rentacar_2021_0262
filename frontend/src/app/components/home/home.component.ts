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

  showAddCarModal = false;
  newCar = {
    brand: '',
    model: '',
    year: new Date().getFullYear(),
    power: 0,
    seats: 5,
    fuelType: 'petrol' as 'petrol' | 'diesel' | 'hybrid',
    transmission: 'automatic' as 'automatic' | 'manual',
    pricePerDay: 0,
    imageUrl: '',
    categoryId: ''
  };
  addCarError = '';
  addCarLoading = false;

  showEditCarModal = false;
  editingCar: Car | null = null;
  editCarData = {
    brand: '',
    model: '',
    year: 0,
    power: 0,
    pricePerDay: 0,
    imageUrl: '',
    categoryId: ''
  };
  editCarError = '';
  editCarLoading = false;

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

  goToReviews(car: Car, event?: Event) {
    if (event) event.stopPropagation();
    this.router.navigate(['/reviews', car._id]);
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
    this.editingCar = car;
    this.editCarData = {
      brand: car.brand,
      model: car.model,
      year: car.year,
      power: car.power,
      pricePerDay: car.pricePerDay,
      imageUrl: car.imageUrl,
      categoryId: car.categoryId ?? ''
    };
    this.editCarError = '';
    this.showEditCarModal = true;
  }

  closeEditCarModal() {
    this.showEditCarModal = false;
    this.editingCar = null;
    this.editCarError = '';
  }

  submitEditCar() {
    if (!this.editingCar) return;
    if (!this.editCarData.brand || !this.editCarData.model || !this.editCarData.year || !this.editCarData.power || !this.editCarData.pricePerDay) {
      this.editCarError = 'Molimo popunite sva obavezna polja.';
      return;
    }

    this.editCarLoading = true;
    this.editCarError = '';

    const payload: Partial<Car> = {
      brand: this.editCarData.brand,
      model: this.editCarData.model,
      year: this.editCarData.year,
      power: this.editCarData.power,
      pricePerDay: this.editCarData.pricePerDay,
      imageUrl: this.editCarData.imageUrl,
      categoryId: this.editCarData.categoryId || null
    };

    this.carService.updateCar(this.editingCar._id, payload).subscribe({
      next: () => {
        this.editCarLoading = false;
        this.showEditCarModal = false;
        this.editingCar = null;
        this.loadCars();
      },
      error: (err) => {
        this.editCarError = err.error?.message ?? 'Greška pri izmeni automobila.';
        this.editCarLoading = false;
      }
    });
  }

  addNewCar() {
    this.newCar = {
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      power: 0,
      seats: 5,
      fuelType: 'petrol',
      transmission: 'automatic',
      pricePerDay: 0,
      imageUrl: '',
      categoryId: this.categories.length > 0 ? this.categories[0]._id : ''
    };
    this.addCarError = '';
    this.showAddCarModal = true;
  }

  closeAddCarModal() {
    this.showAddCarModal = false;
    this.addCarError = '';
  }

  submitNewCar() {
    if (!this.newCar.brand || !this.newCar.model || !this.newCar.year || !this.newCar.power || !this.newCar.seats || !this.newCar.pricePerDay) {
      this.addCarError = 'Molimo popunite sva obavezna polja.';
      return;
    }

    this.addCarLoading = true;
    this.addCarError = '';

    const payload: Partial<Car> = {
      brand: this.newCar.brand,
      model: this.newCar.model,
      year: this.newCar.year,
      power: this.newCar.power,
      seats: this.newCar.seats,
      fuelType: this.newCar.fuelType,
      transmission: this.newCar.transmission,
      pricePerDay: this.newCar.pricePerDay,
      imageUrl: this.newCar.imageUrl,
      categoryId: this.newCar.categoryId || null,
      isActive: true
    };

    this.carService.createCar(payload).subscribe({
      next: () => {
        this.addCarLoading = false;
        this.showAddCarModal = false;
        this.loadCars();
      },
      error: (err) => {
        this.addCarError = err.error?.message ?? 'Greška pri dodavanju automobila.';
        this.addCarLoading = false;
      }
    });
  }

  get todayDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}
