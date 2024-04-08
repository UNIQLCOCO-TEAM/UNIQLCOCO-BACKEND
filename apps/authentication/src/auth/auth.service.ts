import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/auth.entity';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async isAccessTokenExpired(access_token: string): Promise<boolean> {
    try {
      await this.jwtService.verifyAsync(access_token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      console.log(`${access_token} is expired.`);
      return true;
    }
    return false;
  }

  async validateCreateUserDto(email: string) {
    try {
      await this.accountRepository.findOne({
        where: {
          email: email,
        },
      });
    } catch (error) {
      return;
    }
    throw new UnprocessableEntityException('Email already exists');
  }

  async verifyUser(email: string, password: string) {
    const account = await this.accountRepository.findOne({
      where: {
        email: email,
      },
    });
    const isExpired = await this.isAccessTokenExpired(account.access_token);
    const payload = isExpired
      ? { sub: account.uid, username: account.email }
      : {};
    const token = await this.jwtService.signAsync(payload);

    const passwordIsValid = await bcryptjs.compare(password, account.password);

    if (!account || !passwordIsValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    if (isExpired) {
      await this.updateAccessToken(account.uid, token);
    }

    await this.updateLastLogin(account.account_id, new Date());

    const user: User = await this.userRepository.findOne({
      where: {
        uid: account.uid,
      },
    });

    return {
      email: account.email,
      access_token: isExpired ? token : account.access_token,
      last_logged_in: account.last_logged_in,
      uid: user.uid,
    };
  }

  async updateAccessToken(account_id: number, access_token: string) {
    const account: Account | null = await this.accountRepository.findOneBy({
      account_id,
    });
    account!.access_token = access_token;
    this.accountRepository.save(account!);
  }

  async updateLastLogin(account_id: number, time: Date) {
    const account: Account | null = await this.accountRepository.findOneBy({
      account_id,
    });
    account!.last_logged_in = time;
    account.logged_id_history.push(account.last_logged_in);
    this.accountRepository.save(account!);
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
