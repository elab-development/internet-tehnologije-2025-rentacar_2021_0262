export interface Review {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  carId: {
    _id: string;
    brand: string;
    model: string;
  };
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface CreateReviewDto {
  carId: string;
  rating: number;
  comment: string;
}
