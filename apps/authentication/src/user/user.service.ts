import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/local.auth-guard';
import { Public } from '../auth/decorators/public.decorator';

@UseGuards(AuthGuard)
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  findAllUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  findByUID(uid: number) {
    return this.userRepository.findOneBy({ uid });
  }

  findByPhoneNumber(phone_number: string) {
    return this.userRepository.findOneBy({ phone_number });
  }

  @Public()
  async createUserProfile(newUser: CreateUserDto) {
    try {
      const user: User = new User();
      user.name = newUser.name;
      user.surname = newUser.surname;
      user.birth_date = new Date(newUser.birth_date);
      user.phone_number = newUser.phone_number;
      user.address = newUser.address;
      return {
        status: 201,
        message: 'success',
        result: await this.userRepository.save(user),
      };
    } catch (err) {
      console.log(err);
    }
  }

  async updateUserProfile(
    uid: number,
    updateUser: UpdateUserDto,
  ): Promise<User> {
    const user: User = new User();
    user.uid = uid;
    user.name =
      updateUser.name !== ''
        ? updateUser.name
        : (await this.userRepository.findOneBy({ uid }))!.name;
    user.surname =
      updateUser.surname !== ''
        ? updateUser.surname
        : (await this.userRepository.findOneBy({ uid }))!.surname;
    user.birth_date =
      updateUser.birth_date !==
      (await (
        await this.userRepository.findOneBy({ uid })!
      ).birth_date)
        ? updateUser.birth_date
        : (await this.userRepository.findOneBy({ uid }))!.birth_date;
    user.address =
      updateUser.address !== ''
        ? updateUser.address
        : (await this.userRepository.findOneBy({ uid }))!.address;
    return this.userRepository.save(user);
  }

  deleteUser(uid: number) {
    return this.userRepository.delete(uid);
  }
}
