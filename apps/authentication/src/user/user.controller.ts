import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/local.auth-guard';
import { Public } from '../auth/decorators/public.decorator';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiResponse({
    status: 200,
    description: 'Success.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Get()
  async findAllUser() {
    const res: JSON = <JSON>(<unknown>{
      status: 200,
      message: 'success',
      result: await this.userService.findAllUser(),
    });
    return res;
  }

  @Public()
  @ApiResponse({
    status: 200,
    description: 'Success.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @ApiTags('phone')
  @Get('/phone/:phone')
  async findByPhone(@Param('phone') phone: string) {
    const user: User | null = await this.userService.findByPhoneNumber(phone);
    const res: JSON = <JSON>(<unknown>{
      status: 200,
      message: 'success',
      findBy: 'email',
      result:
        user === null ? 'Phone is ready for use.' : 'Phone already exists.',
    });
    return res;
  }

  @ApiResponse({
    status: 200,
    description: 'Success.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Get('/id/:uid')
  async findByUID(@Param('uid') uid: string) {
    const user: User | null = await this.userService.findByUID(+uid);
    const res: JSON = <JSON>(<unknown>{
      status: 200,
      message: 'success',
      findBy: 'uid',
      result:
        user != null
          ? {
              uid: user.uid,
              name: user.name,
              surname: user.surname,
              birth_date: user.birth_date,
              phone_number: user.phone_number,
              address: user.address,
            }
          : [],
    });
    return res;
  }

  @Public()
  @ApiResponse({
    status: 200,
    description: 'The profile has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    type: CreateUserDto,
  })
  @Post('/profile/create')
  async createProfile(@Body() createUserDto: CreateUserDto) {
    return {
      status: 200,
      message: 'success',
      result: await this.userService.createUserProfile(createUserDto),
    };
  }

  @ApiResponse({
    status: 204,
    description: 'The profile has been successfully updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBody({
    type: UpdateUserDto,
  })
  @ApiBearerAuth()
  @Patch('/profile/update/:uid')
  async updateProfile(
    @Param('uid') uid: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const res: JSON = <JSON>(<unknown>{
      status: 204,
      message: 'success',
      findBy: 'uid',
      result: await this.userService.updateUserProfile(+uid, updateUserDto),
    });
    return res;
  }

  @ApiResponse({
    status: 204,
    description: 'The profile has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Delete('/profile/delete/:uid')
  async removeProfile(@Param('uid') uid: string) {
    const res: JSON = <JSON>(<unknown>{
      status: 200,
      message: 'success',
      findBy: 'uid',
      result: await this.userService.deleteUser(+uid),
    });
    return res;
  }
}
