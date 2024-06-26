import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAccountWithEmailDto } from './dto/create-auth.dto';
import { UpdateAccountDto } from './dto/update-auth.dto';
import { Public } from './decorators/public.decorator';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dto/create-signin-dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { Account } from './entities/auth.entity';
import { AuthGuard } from './guards/local.auth-guard';

@UseGuards(AuthGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiResponse({
    status: 201,
    description: 'Login success.',
  })
  @ApiBody({
    type: SignInDto,
  })
  @ApiTags('auth')
  @Post('login')
  async signInWithEmail(@Body() signInDto: SignInDto) {
    return {
      status: 201,
      message: 'success',
      result: await this.authService.verifyUser(
        signInDto.email,
        signInDto.password,
      ),
    };
  }

  @Public()
  @ApiResponse({
    status: 201,
    description: 'This account has been successfully created.',
  })
  @ApiBody({
    type: CreateAccountWithEmailDto,
  })
  @ApiTags('auth')
  @Post('sign-up')
  async signUpWithEmail(@Body() account: CreateAccountWithEmailDto) {
    return {
      status: 201,
      message: 'success',
      result: await this.authService.create(account),
    };
  }

  @Public()
  @ApiResponse({
    status: 201,
    description: 'This account has been successfully created.',
  })
  @ApiBody({
    type: CreateAccountWithEmailDto,
  })
  @ApiTags('auth')
  @Post('/admin/sign-up')
  async signUpAdmin(@Body() account: CreateAccountWithEmailDto) {
    return {
      status: 201,
      message: 'success',
      result: await this.authService.createAdmin(account),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Success.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiBearerAuth()
  @Get()
  async findAllAccount() {
    const res: JSON = <JSON>(<unknown>{
      status: 200,
      message: 'success',
      result: await this.authService.findAll(),
    });
    return res;
  }

  @ApiResponse({
    status: 200,
    description: 'Success.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @ApiTags('profile')
  @Get('/myAccount/:uid')
  async findMyAccount(@Param('uid') uid: string) {
    return {
      status: 200,
      message: 'success',
      result: await this.authService.findMyAccount(uid),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Success.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiBearerAuth()
  @ApiTags('profile')
  @Get('/id/:id')
  async findByAccountId(@Param('id') id: string) {
    const account: Account | null = await this.authService.findById(+id);
    const res: JSON = <JSON>(<unknown>{
      status: 200,
      message: 'success',
      findBy: 'id',
      result: account != null ? account : [],
    });
    return res;
  }

  @Public()
  @ApiResponse({
    status: 200,
    description: 'Success.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiTags('profile')
  @Get('/email/:email')
  async findByEmail(@Param('email') email: string) {
    const account: Account | null = await this.authService.findByEmail(email);
    const res: JSON = <JSON>(<unknown>{
      status: 200,
      message: 'success',
      findBy: 'email',
      result:
        account === null ? 'Email is ready for use.' : 'Email already exists.',
    });
    return res;
  }

  @ApiResponse({
    status: 200,
    description: 'Success.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiBearerAuth()
  @ApiTags('profile')
  @Get('/uid/:id')
  async findByUid(@Param('id') id: string) {
    const account: Account | null = await this.authService.findByUid(id);
    const res: JSON = <JSON>(<unknown>{
      status: 200,
      message: 'success',
      findBy: 'id',
      result: account != null ? account : [],
    });
    return res;
  }

  @Public()
  @ApiResponse({
    status: 201,
    description: 'This account has been successfully created.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiBody({
    type: CreateAccountWithEmailDto,
  })
  @Post('/create')
  async createProfile(@Body() account: CreateAccountWithEmailDto) {
    const res: JSON = <JSON>(<unknown>{
      status: 201,
      message: 'success',
      result: await this.authService.create(account),
    });
    return res;
  }

  @ApiResponse({
    status: 204,
    description: 'This account has been successfully updated.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiBody({
    type: UpdateAccountDto,
  })
  @ApiBearerAuth()
  @Patch('/update/:id')
  async update(@Param('id') id: string, @Body() account: UpdateAccountDto) {
    const res: JSON = <JSON>(<unknown>{
      status: 204,
      message: 'success',
      findBy: 'id',
      result: await this.authService.update(+id, account),
    });
    return res;
  }

  @ApiResponse({
    status: 200,
    description: 'This account has been successfully deleted.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiBearerAuth()
  @Delete('/delete/:id')
  async removeProfile(@Param('id') id: string) {
    const res: JSON = <JSON>(<unknown>{
      status: 200,
      message: 'success',
      findBy: 'id',
      result: await this.authService.remove(+id),
    });
    return res;
  }

  @ApiResponse({
    status: 200,
    description: 'This account has been successfully deleted.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiBearerAuth()
  @ApiTags('auth')
  @Patch('/update/password/:uid')
  async updatePassword(
    @Body() updatePassword: UpdatePasswordDto,
    @Param('uid') uid: string,
  ) {
    return await this.authService.updatePassword(updatePassword, uid);
  }

  @Public()
  @ApiResponse({
    status: 200,
    description: 'Access Token is expired.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiTags('isExpired')
  @Get('/isExpired/:accessToken')
  async isAccessTokenExpired(@Param('accessToken') accessToken: string) {
    return {
      result: await this.authService.isAccessTokenExpired(accessToken),
    };
  }
}
