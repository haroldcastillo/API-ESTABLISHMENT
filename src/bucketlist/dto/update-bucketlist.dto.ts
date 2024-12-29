import { PartialType } from '@nestjs/mapped-types';
import { CreateBucketlistDto } from './create-bucketlist.dto';

export class UpdateBucketlistDto extends PartialType(CreateBucketlistDto) {}
