import { Controller, Post, Body, Param, UseGuards, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UploadPhotoDto } from './dto/upload-photo.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/auth/current-user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;
    return this.userService.create(name, email, password);
  }

  @Post(':id/photo')
  async uploadPhoto(
    @Param('id') id: string,
    @Body() uploadPhotoDto: UploadPhotoDto
  ) {
    await this.userService.uploadPhoto(id, uploadPhotoDto.photo);
    return { message: 'Foto enviada com sucesso!' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me/photo')
  async getMyPhoto(@CurrentUser() user: { userId: string }) {
    const photo = await this.userService.getPhotoById(user.userId);
    return { photo };
  }
}
