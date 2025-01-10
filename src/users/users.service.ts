import {
  Injectable,
  HttpException,
  HttpStatus,
  OnModuleInit,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/User.schema';
import { Model } from 'mongoose';
import { hashPassword, comparePassword } from 'src/utils/bcrypt';
import { first } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async onModuleInit() {
    // Function to create super admin on startup
    const superAdmin = await this.userModel.findOne({ role: 'admin' });
    if (!superAdmin) {
      await this.createAdmin({
        email: process.env.SUPER_ADMIN_EMAIL,
        first_name: 'Super',
        middle_name: '',
        last_name: 'Admin',
        password: process.env.SUPER_ADMIN_PASSWORD,
        contactNumber: '09156626321',
        role: 'admin',
        image: '',
        isVerified: true,
      });
      // console.log('Super Admin created');
    } else {
      console.log('Super Admin already exists');
    }
  }

  create(createUserDto: CreateUserDto) {
    return new Promise((resolve, reject) => {
      this.findOne(createUserDto.email, 'email').then((user) => {
        if (user) {
          reject(new Error('User already exists'));
        } else {
          const password = hashPassword(createUserDto.password);
          const newUser = new this.userModel({
            ...createUserDto,
            createdAt: Date.now(),
            password: password,
          });
          resolve(newUser.save());
        }
      });
    });
  }

  createAdmin(createAdminDto: CreateUserDto) {
    return new Promise((resolve, reject) => {
      this.findOne(createAdminDto.email, 'email').then((user) => {
        if (user) {
          reject(new Error('User already exists'));
        } else {
          const password = hashPassword(createAdminDto.password);
          const newUser = new this.userModel({
            ...createAdminDto,
            createdAt: Date.now(),
            password: password,
            role: 'admin',
          });
          resolve(newUser.save());
        }
      });
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    console.log('updateUserDto', updateUserDto);
    return await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
  }
  async updatePreferences(id: string, value: any) {
    const result = await this.userModel.findByIdAndUpdate(id, {
      preferences: value.preferences,
    });
    return {
      _id: result._id,
      email: result.email,
      first_name: result.first_name,
      last_name: result.last_name,
      contactNumber: result.contactNumber,
      middle_name: result.middle_name,
      createdAt: result.createdAt,
      role: result.role,
      image: result.image,
      preferences: value.preferences,
    };
  }

  async updatePassword(id: string, password: string, newPassword: string) {
    console.log(newPassword);
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException(
        'Current password is incorrect',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Check that newPassword is a valid string
    if (!newPassword) {
      throw new HttpException(
        'New password is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const brandNewPassword = hashPassword(newPassword);
    await this.userModel.findByIdAndUpdate(
      id,
      {
        password: brandNewPassword,
      },
      { new: true },
    );
    // Update the user's password in the DB
    return {
      message: 'Password updated successfully',
    }; // Return the updated user
  }

  async changePassword(id: string, newPassword: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const brandNewPassword = hashPassword(newPassword);
    await this.userModel.findByIdAndUpdate(id, {
      password: brandNewPassword,
    });
    return {
      message: 'Password updated successfully',
    };
  }

  findAll() {
    const users = this.userModel.find(
      { role: { $ne: 'admin' } },
      { password: 0 },
    );
    return users;
  }

  findOne(payload: string, type: string) {
    switch (type) {
      case 'email': // find user by email
        return this.userModel.findOne({ email: payload });
      case 'username': // find user by username
        return this.userModel.findOne({ username: payload });
      default: // find user by id
        return this.userModel.findById(payload);
    }
  }

  remove(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
  verifyUser(id: string) {
    return this.userModel.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true },
    );
  }

  async addLastViewed(id: string, establishmentId: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    console.log('User found');

    // Ensure `lastViewed` is always an array
    const lastViewed: { establishmentId: string; date: any }[] =
      user.lastViewed || [];

    const existingIndex = lastViewed.findIndex(
      (item) => item.establishmentId === establishmentId,
    );

    if (existingIndex !== -1) {
      // Update the date as a timestamp
      lastViewed[existingIndex].date = Date.now();
    } else {
      // Add new establishmentId and date
      if (lastViewed.length >= 10) {
        lastViewed.shift(); // Remove the oldest entry
      }
      lastViewed.push({ establishmentId, date: Date.now() });
    }

    await this.userModel.findByIdAndUpdate(id, { lastViewed });

    return {
      message: 'Last viewed establishment added successfully',
      lastViewed,
    };
  }
}
