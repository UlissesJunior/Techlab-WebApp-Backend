import { Controller, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UploadPhotoDto } from './dto/upload-photo.dto';

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
}
