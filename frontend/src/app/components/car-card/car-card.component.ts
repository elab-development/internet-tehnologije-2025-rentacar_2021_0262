import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Car } from '../../models/car.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-car-card',
  templateUrl: './car-card.component.html',
  styleUrls: ['./car-card.component.css']
})
export class CarCardComponent {
  @Input() car!: Car;
  @Output() rentClicked = new EventEmitter<Car>();
  @Output() reviewsClicked = new EventEmitter<Car>();
  @Output() editClicked = new EventEmitter<Car>();

  constructor(public authService: AuthService) {}

  getStars(rating: number): string[] {
    const full = Math.floor(rating);
    const stars: string[] = [];
    for (let i = 0; i < 5; i++) {
      stars.push(i < full ? 'full' : 'empty');
    }
    return stars;
  }

  onRentClick() {
    this.rentClicked.emit(this.car);
  }

  onReviewsClick(event: Event) {
    event.stopPropagation();
    this.reviewsClicked.emit(this.car);
  }

  onEditClick(event: Event) {
    event.stopPropagation();
    this.editClicked.emit(this.car);
  }
}
