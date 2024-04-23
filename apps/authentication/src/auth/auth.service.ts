import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
  UseGuards,
} from '@nestjs/common';
import { CreateAccountWithEmailDto } from './dto/create-auth.dto';
import { UpdateAccountDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './entities/auth.entity';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { Public } from './decorators/public.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { AuthGuard } from './guards/local.auth-guard';
import { Role } from './enum/role.enum';

@UseGuards(AuthGuard)
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
    const payload = isExpired ? { sub: account.uid, email: account.email } : {};
    const token = await this.jwtService.signAsync(payload);

    const passwordIsValid = await bcryptjs.compare(password, account.password);

    if (!account || !passwordIsValid) {
      throw new UnauthorizedException('Invalid email or password');
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
      role: account.role,
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

  findAll(): Promise<Account[]> {
    return this.accountRepository.find();
  }

  async findMyAccount(uid: string) {
    const user: User = await this.userRepository.findOne({
      where: {
        uid: +uid,
      },
    });
    const account: Account = await this.accountRepository.findOne({
      where: {
        uid: +uid,
      },
    });
    return {
      ...user,
      email: account.email,
    };
  }

  findById(account_id: number): Promise<Account | null> {
    return this.accountRepository.findOneBy({ account_id });
  }

  findByEmail(email: string): Promise<Account | null> {
    return this.accountRepository.findOneBy({ email });
  }

  findByUid(uid: string): Promise<Account | null> {
    return this.accountRepository.findOneBy({ uid: +uid });
  }

  @Public()
  async create(
    newAccount: CreateAccountWithEmailDto,
  ): Promise<
    | { statusCode: number; id: number; email: string; access_token: string }
    | { statusCode: number; message: string }
  > {
    const existingUser = await this.findByEmail(newAccount.email);

    if (existingUser) {
      return {
        statusCode: 400,
        message: 'Email already exists.',
      };
    }

    try {
      const salt = await bcryptjs.genSalt();
      const hashPassword = await bcryptjs.hash(newAccount.password, salt);

      const account: Account = new Account();
      account.email = newAccount.email;
      account.password = hashPassword;
      account.uid = newAccount.uid;
      account.logged_id_history = [];
      account.last_logged_in = new Date();
      account.role = Role.User;

      const payload = { sub: account.uid, email: account.email };
      account.access_token = await this.jwtService.signAsync(payload);

      await this.accountRepository.save(account);

      return {
        statusCode: 201,
        id: account.account_id,
        email: account.email,
        access_token: account.access_token,
      };
    } catch (err) {
      return {
        statusCode: 500,
        message: err,
      };
    }
  }

  async updatePassword(updatePassword: UpdatePasswordDto, uid: string) {
    const account = await this.findByUid(uid);
    console.log(account);
    if (updatePassword.password !== updatePassword.confirm_password) {
      const error = {
        status: 400,
        message: 'fail',
        result: 'Password is not match.',
      };
      throw new BadRequestException(error);
    }
    const salt = await bcryptjs.genSalt();
    const hashPassword = await bcryptjs.hash(updatePassword.password, salt);
    account.password = hashPassword;
    const payload = { sub: account.uid, email: account.email };

    account.access_token = await this.jwtService.signAsync(payload);

    await this.accountRepository.save(account);

    return {
      statusCode: 200,
      id: account.account_id,
      email: account.email,
      access_token: account.access_token,
    };
  }

  async update(
    account_id: number,
    updateAccount: UpdateAccountDto,
  ): Promise<Account | JSON> {
    try {
      const salt = await bcryptjs.genSalt();
      const hashPassword = await bcryptjs.hash(updateAccount.password, salt);

      const account: Account = new Account();
      account.account_id = account_id;
      account.email =
        updateAccount.email ||
        (await this.accountRepository.findOneBy({ account_id }))!.email;
      account.password =
        hashPassword ||
        (await this.accountRepository.findOneBy({ account_id }))!.password;
      return this.accountRepository.save(account);
    } catch (error) {
      return <JSON>(<unknown>{
        statusCode: 500,
        message: 'Internal server error. Failed to create user profile.',
      });
    }
  }

  remove(account_id: number) {
    return this.accountRepository.delete(account_id);
  }
}
