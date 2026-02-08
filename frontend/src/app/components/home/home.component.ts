import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Car } from '../../models/car.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  cars: Car[] = [];
  
  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.loadCars();
  }

  loadCars() {
    this.cars = [
      {
        id: '1',
        brand: 'BMW',
        model: '3 Series',
        year: 2023,
        pricePerDay: 80,
        fuelType: 'Dizel',
        transmission: 'Automatik',
        seats: 5,
        imageUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&h=300&fit=crop',
        available: true
      },
      {
        id: '2',
        brand: 'Mercedes-Benz',
        model: 'C-Class',
        year: 2023,
        pricePerDay: 90,
        fuelType: 'Dizel',
        transmission: 'Automatik',
        seats: 5,
        imageUrl: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&h=300&fit=crop',
        available: true
      },
      {
        id: '3',
        brand: 'Audi',
        model: 'A4',
        year: 2022,
        pricePerDay: 75,
        fuelType: 'Benzin',
        transmission: 'Automatik',
        seats: 5,
        imageUrl: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&h=300&fit=crop',
        available: true
      },
      {
        id: '4',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2023,
        pricePerDay: 45,
        fuelType: 'Hibrid',
        transmission: 'Automatik',
        seats: 5,
        imageUrl: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=500&h=300&fit=crop',
        available: true
      },
      {
        id: '5',
        brand: 'Škoda',
        model: 'Octavia',
        year: 2022,
        pricePerDay: 55,
        fuelType: 'Dizel',
        transmission: 'Manuelni',
        seats: 5,
        imageUrl: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=500&h=300&fit=crop',
        available: true
      },
      {
        id: '6',
        brand: 'Ford',
        model: 'Focus',
        year: 2023,
        pricePerDay: 48,
        fuelType: 'Benzin',
        transmission: 'Automatik',
        seats: 5,
        imageUrl: 'https://images.unsplash.com/photo-1612825173281-9a193378527e?w=500&h=300&fit=crop',
        available: false
      },
      {
        id: '7',
        brand: 'Opel',
        model: 'Astra',
        year: 2022,
        pricePerDay: 42,
        fuelType: 'Benzin',
        transmission: 'Manuelni',
        seats: 5,
        imageUrl: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=300&fit=crop',
        available: true
      }
    ];
  }

  rentCar(car: Car) {
    if (!this.authService.isLoggedIn()) {
      alert('Morate biti ulogovani da biste iznajmili automobil!');
      return;
    }
    
    if (!car.available) {
      alert('Ovaj automobil nije dostupan za iznajmljivanje.');
      return;
    }

    alert(`Uspešno ste rezervisali: ${car.brand} ${car.model}`);
  }

  editCar(car: Car) {
    alert(`Izmena automobila: ${car.brand} ${car.model}`);
  }

  addNewCar() {
    const newCar: Car = {
      id: (this.cars.length + 1).toString(),
      brand: 'Nova marka',
      model: 'Novi model',
      year: 2024,
      pricePerDay: 60,
      fuelType: 'Benzin',
      transmission: 'Automatik',
      seats: 5,
      imageUrl: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=500&h=300&fit=crop',
      available: true
    };
    
    this.cars.unshift(newCar);
    alert('Novi automobil je dodat u listu!');
  }
}
