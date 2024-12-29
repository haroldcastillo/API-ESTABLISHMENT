import { Injectable } from '@nestjs/common';
import { CreateBucketlistDto } from './dto/create-bucketlist.dto';
import { UpdateBucketlistDto } from './dto/update-bucketlist.dto';
import { Bucketlist } from './entities/Bucketlist.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { EstablishmentsService } from 'src/establishments/establishments.service';

@Injectable()
export class BucketlistService {
  constructor(
    @InjectModel(Bucketlist.name) private bucketlistModel: Model<Bucketlist>,
    private establishmentsService: EstablishmentsService,
  ) {}
  create(createBucketlistDto: CreateBucketlistDto) {
    const newBucketlist = new this.bucketlistModel({
      ...createBucketlistDto,
      createdAt: Date.now(),
    });
    return newBucketlist.save();
  }

  async findAllBucketlistWithEstablishment(type: string) {
    const bucketlistResponse = await this.bucketlistModel.find({
      type: type,
    });

    if (bucketlistResponse.length === 0) {
      return [];
    }

    const BucketlistWithEstablishment = await Promise.all(
      bucketlistResponse.map(async (bucketlist) => {
        const establishmentResponse = await this.establishmentsService.findOne(
          bucketlist.establishmentId,
        );

        if (establishmentResponse) {
          return {
            ...bucketlist.toObject(), // Ensure bucketlist is converted to a plain object
            establishment: establishmentResponse, // Attach the establishment to the bucketlist
          };
        }

        return null; // Return null if no establishment is found
      }),
    );

    // Filter out any null results
    return BucketlistWithEstablishment.filter((item) => item !== null);
  }

  async checkIfBucketlistExists(establishmentId: string, type: string) {
    const response = await this.bucketlistModel.findOne({
      establishmentId: establishmentId,
      type: type,
    });

    if (response) {
      return {
        status: true,
        data: response._id,
      };
    }

    return {
      status: false,
      data: null,
    };
  }

  findAll() {
    return `This action returns all bucketlist`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bucketlist`;
  }

  update(id: number, updateBucketlistDto: UpdateBucketlistDto) {
    return `This action updates a #${id} bucketlist`;
  }

  async remove(id) {
    const response = await this.bucketlistModel.deleteOne({ _id: id });

    if (response.deletedCount > 0) {
      return true;
    }

    return false;
  }
}
