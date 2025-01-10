export class CreateReviewDto {
  userId: string;
  establishmentId: string;
  rating: number;
  comment: string;
  photo: string[];
}
