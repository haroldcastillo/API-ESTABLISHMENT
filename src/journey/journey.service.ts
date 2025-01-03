import { Injectable } from '@nestjs/common';
import { CreateJourneyDto } from './dto/create-journey.dto';
import { UpdateJourneyDto } from './dto/update-journey.dto';
import { Model } from 'mongoose';
import { Journey } from './entities/journey.entity';
import { InjectModel } from '@nestjs/mongoose';
import { EstablishmentsService } from 'src/establishments/establishments.service';

@Injectable()
export class JourneyService {
  constructor(
    @InjectModel(Journey.name) private journeyModel: Model<Journey>,
    private establishmentsService: EstablishmentsService,
  ) {}

  async create(createJourneyDto: CreateJourneyDto): Promise<any> {
    const { userId, establishmentId } = createJourneyDto;

    // Check if a document with both userId and establishmentId exists
    const existingJourney = await this.journeyModel.findOne({
      userId,
      establishmentId,
    });

    // If both fields exist in a single document, throw an exception
    if (existingJourney) {
      return false;
    }

    // Proceed to create the journey if validation passes
    return await this.journeyModel.create(createJourneyDto);
  }

  findAll() {
    return this.journeyModel.find();
  }

  async findAllUserJourneysWithEstablishment(userId: string) {
    const userJourneys = await this.journeyModel.find({ userId: userId });

    if (userJourneys.length === 0) {
      return [];
    }

    const userJourneysWithEstablishment = await Promise.all(
      userJourneys.map(async (journey: any) => {
        const establishmentResponse = await this.establishmentsService.findOne(
          journey.establishmentId,
        );

        if (establishmentResponse) {
          return {
            ...journey.toObject(),
            establishment: establishmentResponse,
          };
        }

        return null;
      }),
    );

    return userJourneysWithEstablishment.filter((item) => item !== null);
  }

  findOne(id: number) {
    return `This action returns a #${id} journey`;
  }

  update(id: string, updateJourneyDto: UpdateJourneyDto) {
    return this.journeyModel.findByIdAndUpdate(id, updateJourneyDto, {
      new: true,
    });
  }

  remove(id: string) {
    return this.journeyModel.findByIdAndDelete(id);
  }
}
