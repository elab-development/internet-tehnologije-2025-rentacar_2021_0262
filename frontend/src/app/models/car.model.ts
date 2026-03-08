export interface Car {
  _id: string;
  categoryId: string | null;
  brand: string;
  model: string;
  year: number;
  power: number;
  pricePerDay: number;
  fuelType: 'diesel' | 'petrol' | 'hybrid';
  transmission: 'manual' | 'automatic';
  seats: number;
  imageUrl: string;
  isActive: boolean;
  available: boolean;
  averageRating: number;
}
