import { Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reviews } from './entities/reviews.entity';
import { EstablishmentsService } from 'src/establishments/establishments.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Reviews.name) private reviewsModel: Model<Reviews>,
    private establishmentsService: EstablishmentsService,
    private usersService: UsersService,
  ) {}
  create(createReviewDto: CreateReviewDto) {
    const newReview = new this.reviewsModel({
      ...createReviewDto,
      createdAt: Date.now(),
    });
    return newReview.save();
  }

  async findEstablishmentReviews(Id: string, type: string) {
    const establishmentResponse = await this.establishmentsService.findOne(Id);

    if (!establishmentResponse) {
      return { message: 'Establishment not found' };
    }

    // Fetch reviews
    const reviewsEstablishmentResponse = await this.reviewsModel.find({
      [type]: Id,
    });

    // Use Promise.all to handle async operations inside map
    const Reviews = await Promise.all(
      reviewsEstablishmentResponse.map(async (review) => {
        const user = await this.usersService.findOne(review.userId, 'id');
        return {
          ...review.toObject(), // Convert review to plain object if it's a Mongoose document
          user, // Add user details to the review
        };
      }),
    );

    return {
      establishment: establishmentResponse,
      reviews: Reviews,
      rating: this.computeRating(Reviews),
    };
  }

  computeRating(reviews: any) {
    let totalRating = 0;
    reviews.forEach((review) => {
      totalRating += review.rating;
    });
    return totalRating / reviews.length;
  }

  findAll() {
    return `This action returns all reviews`;
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto) {
    return `This action updates a #${id} review`;
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
